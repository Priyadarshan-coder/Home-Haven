import express from 'express';
import { google, signOut, signin, signup } from '../controllers/auth.controller.js';

const routes = express.Router();

routes.post("/signup", signup);
routes.post("/signin", signin);
routes.post('/google', google);
routes.get('/signout', signOut)

export default routes;