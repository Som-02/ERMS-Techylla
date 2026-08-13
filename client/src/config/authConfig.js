export const msalConfig = {
    auth: {
        clientId: "35623a7d-d236-4dea-acd7-5c94eb2e069e",
        authority:
            "https://login.microsoftonline.com/990ede14-26f4-4677-89b9-8a849e6f6a86",
        redirectUri: window.location.origin,
    },

    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: [
        "openid",
        "profile",
        "email",
    ],
};