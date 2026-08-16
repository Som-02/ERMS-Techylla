const axios = require("axios");

const {
    getGraphAccessToken,
} = require("./microsoftGraphService");


const GRAPH_BASE =
    "https://graph.microsoft.com/v1.0";


/*
==================================================
HELPER: GET ALL PAGINATED RESULTS
==================================================
*/

const getAllPages = async (
    url,
    token
) => {

    const results = [];

    let nextUrl = url;


    while (nextUrl) {

        const response =
            await axios.get(
                nextUrl,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


        results.push(
            ...(response.data.value || [])
        );


        nextUrl =
            response.data["@odata.nextLink"]
            || null;

    }


    return results;

};


/*
==================================================
GET E-HRMS SERVICE PRINCIPAL
==================================================
*/

const getEhrmsServicePrincipal = async () => {

    const token =
        await getGraphAccessToken();


    const response =
        await axios.get(

            `${GRAPH_BASE}/servicePrincipals`,

            {

                headers: {

                    Authorization:
                        `Bearer ${token}`,

                },

                params: {

                    $filter:
                        `appId eq '${process.env.MICROSOFT_CLIENT_ID}'`,

                    $select:
                        "id,appId,displayName,appRoles",

                },

            }

        );


    if (
        !response.data.value ||
        response.data.value.length === 0
    ) {

        throw new Error(
            "e-HRMS service principal was not found"
        );

    }


    return response.data.value[0];

};


/*
==================================================
GET CURRENT ADMINISTRATORS
==================================================
*/

const getCurrentAdministrators = async () => {

    const token =
        await getGraphAccessToken();


    const servicePrincipal =
        await getEhrmsServicePrincipal();


    /*
    Find the actual Administrator
    app role.
    */

    const administratorRole =
        (servicePrincipal.appRoles || [])
            .find(
                role =>
                    role.value ===
                    "Administrator" &&
                    role.isEnabled === true
            );


    if (!administratorRole) {

        throw new Error(
            "Administrator app role was not found in e-HRMS"
        );

    }


    /*
    Get everyone assigned to
    the e-HRMS application.
    */

    const assignments =
        await getAllPages(

            `${GRAPH_BASE}/servicePrincipals/${servicePrincipal.id}/appRoleAssignedTo`,

            token

        );


    /*
    Only users assigned specifically
    to the Administrator role.
    */

    const administratorAssignments =
        assignments.filter(

            assignment =>

                assignment.principalType ===
                    "User"

                &&

                assignment.appRoleId ===
                    administratorRole.id

        );


    const administrators = [];


    /*
    Get each administrator's
    Microsoft account information.
    */

    for (
        const assignment
        of administratorAssignments
    ) {

        try {

            const response =
                await axios.get(

                    `${GRAPH_BASE}/users/${assignment.principalId}`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                        },

                        params: {

                            $select:
                                "id,displayName,mail,userPrincipalName",

                        },

                    }

                );


            const user =
                response.data;


            const email =
                (
                    user.mail ||
                    user.userPrincipalName ||
                    ""
                ).trim().toLowerCase();


            if (!email) {
                continue;
            }


            administrators.push({

                id:
                    user.id,

                name:
                    user.displayName,

                email,

            });

        }

        catch (error) {

            console.error(

                `Failed to load administrator ${assignment.principalId}:`,

                error.response?.data ||
                error.message

            );

        }

    }


    /*
    Remove duplicate emails.
    */

    return administrators.filter(

        (admin, index, array) =>

            array.findIndex(

                item =>
                    item.email ===
                    admin.email

            ) === index

    );

};


module.exports = {

    getCurrentAdministrators,

};