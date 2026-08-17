const axios = require("axios");

const {
    ConfidentialClientApplication,
} = require("@azure/msal-node");


const msalClient =
    new ConfidentialClientApplication({

        auth: {

            clientId:
                process.env.GRAPH_NOTIFICATION_CLIENT_ID,

            clientSecret:
                process.env.GRAPH_NOTIFICATION_CLIENT_SECRET,

            authority:
                `https://login.microsoftonline.com/${process.env.GRAPH_NOTIFICATION_TENANT_ID}`,

        },

    });


const GRAPH_SCOPE =
    "https://graph.microsoft.com/.default";


const getGraphAccessToken = async () => {

    const result =
        await msalClient.acquireTokenByClientCredential({

            scopes: [
                GRAPH_SCOPE
            ],

        });
    

    if (!result?.accessToken) {

        throw new Error(
            "Failed to acquire Microsoft Graph access token"
        );

    }


    return result.accessToken;

};


module.exports = {
    getGraphAccessToken,
};