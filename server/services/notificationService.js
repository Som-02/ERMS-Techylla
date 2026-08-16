const axios = require("axios");

const {
    getGraphAccessToken,
} = require("./microsoftGraphService");

const {
    getCurrentAdministrators,
} = require("./microsoftAdminService");


/*
==================================================
ESCAPE HTML
==================================================
*/

const escapeHtml = (value) => {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

};


/*
==================================================
SEND EMAIL
==================================================
*/

const sendEmail = async ({
    senderEmail,
    recipientEmails,
    subject,
    html,
}) => {

    if (!senderEmail) {

        throw new Error(
            "Sender email is required"
        );

    }


    if (
        !recipientEmails ||
        recipientEmails.length === 0
    ) {

        console.log(
            "No notification recipients."
        );

        return;

    }


    const token =
        await getGraphAccessToken();


    const toRecipients =
        recipientEmails.map(
            email => ({

                emailAddress: {

                    address: email,

                },

            })
        );


    await axios.post(

        `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`,

        {

            message: {

                subject,

                body: {

                    contentType: "HTML",

                    content: html,

                },

                toRecipients,

            },

            saveToSentItems: true,

        },

        {

            headers: {

                Authorization:
                    `Bearer ${token}`,

                "Content-Type":
                    "application/json",

            },

        }

    );

};


/*
==================================================
NOTIFY OTHER ADMINISTRATORS
==================================================
*/

const notifyAdministrators = async ({

    senderEmail,

    subject,

    html,

}) => {

    try {

        if (!senderEmail) {

            console.error(
                "Cannot send notification: sender email missing"
            );

            return;

        }


        const administrators =
            await getCurrentAdministrators();


        const normalizedSender =
            senderEmail
                .trim()
                .toLowerCase();


        /*
        Don't send the email back
        to the person who performed
        the action.
        */

        const recipients =
            administrators

                .map(
                    admin =>
                        admin.email
                            .trim()
                            .toLowerCase()
                )

                .filter(
                    email =>
                        email !==
                        normalizedSender
                );


        if (recipients.length === 0) {

            console.log(
                "No other administrators to notify."
            );

            return;

        }


        await sendEmail({

            senderEmail:
                normalizedSender,

            recipientEmails:
                recipients,

            subject,

            html,

        });


        console.log(

            `Skill notification sent from ${normalizedSender} to:`,

            recipients

        );

    }

    catch (error) {

        /*
        IMPORTANT:

        Email failure must NOT make
        the HRMS operation fail.

        */

        console.error(

            "Notification email failed:",

            error.response?.data ||
            error.message

        );

    }

};


module.exports = {

    sendEmail,

    notifyAdministrators,

    escapeHtml,

};