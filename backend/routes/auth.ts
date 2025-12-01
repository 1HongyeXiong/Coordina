import express from 'express';
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/signin', authController.signIn);
router.get('/signout', authController.signOut);
router.post('/redirect', authController.handleRedirect);

export default router;