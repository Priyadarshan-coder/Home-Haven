import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const routes = express.Router();

routes.post('/create', verifyToken, createListing);
routes.delete('/delete/:id', verifyToken, deleteListing);
routes.post('/update/:id', verifyToken, updateListing);
routes.get('/get/:id', getListing);
routes.get('/get', getListings);

export default routes;
