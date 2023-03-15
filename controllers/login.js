const User=require('../models/user');
const bcrypt=require('bcrypt');
const express = require('express');
const jwt=require('jsonwebtoken');

const addUserInfo = async (req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if(name==undefined||name.length===0||email==null||email.length===0||password==null||password.length===0){
      return res.status(400).json({err:'Something is missing'});
    }
    const saltRounds=10;
    bcrypt.hash(password,saltRounds,async (err,hash)=>{
      //console.log(name,email,password);
      const userData= new User({
        name:name,
        email:email,
        password:hash,
        isPremiumUser:false,
        totalExpenses:0
     })
     await userData.save();
     res.status(201).json({message:"Successfully created a new user"});
 })
} 

function generateAccessToken(id,name,isPremiumUser){
  return jwt.sign({userId:id,name:name,isPremiumUser:isPremiumUser},process.env.TOKEN_SECRET)
}

 const loginUser=async(req,res,next)=>{
  try{
  const email=req.body.email;
  const passWord=req.body.password;
  //console.log(email);
  const user=await User.findOne({email:email}).exec();
  //console.log(user);
    if(user!=null){
      bcrypt.compare(passWord,user.password,(err,response)=>{
        //console.log(response);
        if(err){
          //res.status(500).json({success:false,message:"Something went wrong"});
          throw new Error("Something Went Wrong");
        }
        if(response===true){
          res.status(200).json({success:true, message:"User logged in successfully",token:generateAccessToken(user._id,user.name,user.isPremiumUser)});
        }
        else{
          res.status(401).json({success:false,message:"User not authorized"});
        }
      })
    }
    else{
      res.status(404).json({success:false,message:"User not found"});
    }
  }
  catch(err){
    res.status(500).json({success:false,message:err});
  }
 }
 module.exports={
  addUserInfo,
  loginUser
 }