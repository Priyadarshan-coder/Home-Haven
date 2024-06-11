import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
import nodemailer from 'nodemailer';
dotenv.config();
export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

 export const addLike = async(req, res, next)=>{
  const {user_ref, listing_ref} = req.body;

  try{
    const listing = await Listing.findById(listing_ref);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.likes.includes(user_ref)) {
      return res.status(400).json({ success: false, message: 'Already liked' });
    }

    listing.likes.push(user_ref);
    await listing.save();
    res.json({ success: true, likes: listing.likes });
  }
  catch(error){
    next(error);
  }
 };

 console.log('Email User:', process.env.EMAIL_USER);
 console.log('Email Pass:', process.env.EMAIL_PASS);  

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  
  },
  logger: true,  
  debug: true,  
});

export const sendEmail = async (req, res, next) => {
 
  const { buyer, seller } = req.body;

  try {
    const seller_details = await User.findById(seller);
    if (!seller_details) return next(errorHandler(404, 'User not found!'));

    const buyer_details = await User.findById(buyer);
    if (!buyer_details) return next(errorHandler(404, 'User not found!'));
console.log(buyer_details.email);
console.log(seller_details.email);
    const mailOptions1 = {
      from: process.env.EMAIL_USER,
      to: seller_details.email,
      subject: "Interested buyer details",
      text: `Hey ${seller_details.firstName} ${seller_details.lastname} is interested in buying or renting your property. Their contact details are: Email - ${buyer_details.email}, Phone No - ${buyer_details.phoneNumber}`,
    };
    const mailOptions2 = {
      from: process.env.EMAIL_USER,
      to: buyer_details.email,
      subject: "Seller details",
      text: `Hey ${buyer_details.firstName} ${buyer_details.lastname} is the owner of the property you are looking for here are his contact details: Email - ${seller_details.email}, Phone No - ${seller_details.phoneNumber}`,
    };
     // Send both emails simultaneously
     await Promise.all([
      transporter.sendMail(mailOptions1),
      transporter.sendMail(mailOptions2)
    ]);

    res.status(200).json({ success: true, message: "Emails sent successfully" });
     } catch (error) {
    console.error(error);
    next(error);
  }
};