import { Request, Response, NextFunction } from "express";
import * as msal from "@azure/msal-node";
import axios from "axios";
import {
    msalConfig,
    TENANT_SUBDOMAIN,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
} from "../authConfig";

// ---- FIX SESSION TYPINGS ----
declare module "express-session" {
    interface SessionData {
        csrfToken?: string;
        authCodeRequest?: any;
        authCodeUrlRequest?: any;
        pkceCodes?: {
            verifier: string;
            challenge: string;
            challengeMethod: string;
        };
        tokenCache?: any;
        idToken?: string;
        account?: any;
        isAuthenticated?: boolean;
    }
}

class AuthProvider {
    config: any;
    cryptoProvider: any;

    constructor(config: any) {
        this.config = config;
        this.cryptoProvider = new msal.CryptoProvider();
    }

    getMsalInstance(msalConfig: any) {
        return new msal.ConfidentialClientApplication(msalConfig);
    }

    async login(req: Request, res: Response, next: NextFunction) {
        req.session.csrfToken = this.cryptoProvider.createNewGuid();

        const state = this.cryptoProvider.base64Encode(
            JSON.stringify({
                csrfToken: req.session.csrfToken,
                redirectTo: "/",
            })
        );

        const authCodeUrlRequestParams = {
            state,
            scopes: [],
        };

        const authCodeRequestParams = {
            state,
            scopes: [],
        };

        if (!this.config.msalConfig.auth.authorityMetadata) {
            const authorityMetadata = await this.getAuthorityMetadata();
            this.config.msalConfig.auth.authorityMetadata = JSON.stringify(authorityMetadata);
        }

        const msalInstance = this.getMsalInstance(this.config.msalConfig);

        return this.redirectToAuthCodeUrl(
            req,
            res,
            next,
            authCodeUrlRequestParams,
            authCodeRequestParams,
            msalInstance
        );
    }

    async handleRedirect(req: Request, res: Response, next: NextFunction) {
        const authCodeRequest = {
            ...req.session.authCodeRequest,
            code: req.body.code,
            codeVerifier: req.session.pkceCodes?.verifier,
        };

        try {
            const msalInstance = this.getMsalInstance(this.config.msalConfig);
            msalInstance.getTokenCache().deserialize(req.session.tokenCache || "");

            const tokenResponse = await msalInstance.acquireTokenByCode(
                authCodeRequest,
                req.body
            );

            req.session.tokenCache = msalInstance.getTokenCache().serialize();
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;
            req.session.isAuthenticated = true;

            const state = JSON.parse(this.cryptoProvider.base64Decode(req.body.state));
            res.redirect(state.redirectTo);
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        const logoutUri = `${this.config.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${this.config.postLogoutRedirectUri}`;

        req.session.destroy(() => {
            res.redirect(logoutUri);
        });
    }

    async redirectToAuthCodeUrl(
        req: Request,
        res: Response,
        next: NextFunction,
        authCodeUrlRequestParams: any,
        authCodeRequestParams: any,
        msalInstance: any
    ) {
        const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();

        req.session.pkceCodes = {
            verifier,
            challenge,
            challengeMethod: "S256",
        };

        req.session.authCodeUrlRequest = {
            ...authCodeUrlRequestParams,
            redirectUri: this.config.redirectUri,
            responseMode: "form_post",
            codeChallenge: challenge,
            codeChallengeMethod: "S256",
        };

        req.session.authCodeRequest = {
            ...authCodeRequestParams,
            redirectUri: this.config.redirectUri,
            code: "",
        };

        try {
            const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(
                req.session.authCodeUrlRequest
            );
            res.redirect(authCodeUrlResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAuthorityMetadata() {
        const endpoint = `${this.config.msalConfig.auth.authority}/v2.0/.well-known/openid-configuration`;

        try {
            const response = await axios.get(endpoint);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}

const authProvider = new AuthProvider({
    msalConfig,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
});

export = authProvider;
