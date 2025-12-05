/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as dotenv from "dotenv";
dotenv.config();

export const TENANT_SUBDOMAIN: string =
    process.env.TENANT_SUBDOMAIN || "Enter_the_Tenant_Subdomain_Here";

export const REDIRECT_URI: string =
    process.env.REDIRECT_URI || "http://localhost:3000/auth/redirect";

export const POST_LOGOUT_REDIRECT_URI: string =
    process.env.POST_LOGOUT_REDIRECT_URI || "http://localhost:3000";

/**
 * Configuration object to be passed to MSAL instance on creation.
 */
export const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID || "Enter_the_Application_Id_Here",
        authority:
            process.env.AUTHORITY ||
            `https://${TENANT_SUBDOMAIN}.ciamlogin.com/`,
        clientSecret: process.env.CLIENT_SECRET || "Enter_the_Client_Secret_Here",
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel: any, message: string, containsPii: boolean) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: "Info",
        },
    },
};
