import { Request, Response, NextFunction } from 'express';
const authProvider = require('../auth/AuthProvider');

exports.signIn = async (req: Request, res: Response, next: NextFunction) => {
    return authProvider.login(req, res, next);
};

exports.handleRedirect = async (req: Request, res: Response, next: NextFunction) => {
    return authProvider.handleRedirect(req, res, next);
};

exports.signOut = async (req: Request, res: Response, next: NextFunction) => {
    return authProvider.logout(req, res, next);
};
