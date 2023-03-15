const Razorpay=require('razorpay');
const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const purchasePremium= async(req,res)=>{
    try{
        var rzp= new Razorpay({
            key_id: process .env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;

        rzp.orders.create({amount, currency:"INR"},async(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            console.log(order);
            const orderData=new Order({
                paymentid: null,
                orderid: order.id,
                status: 'pending',
                userid: req.user._id
            })
            await  orderData.save();
            return res.status(201).json({order, key_id : rzp.key_id});
            })
            // req.user.createOrder({ orderid:order.id, status:'PENDING'})
            // .then(()=>{
            //     return res.status(201).json({order,key_id:rzp.key_id});
            // })
        }
    //     catch(err){
    //             throw new Error(err);
    //         })
    //     })
    // }
    catch(err){
        res.status(403).json({message:'Something went wrong',err:err});
    }
}

const updateTransactionStatus=async (req,res)=>{
    try{
        console.log('REQUEST ORDER',req);
        const { payment_id, order_id} = req.body;
        console.log('PAYMENT',order_id);
        const order=await Order.find({orderid:order_id});
        console.log(order);
        const promise1= order[0].updateOne({paymentid:payment_id,status:'SUCCESSFUL'})
        const promise2=User.findById(req.user._id).updateOne({isPremiumUser:true})
        Promise.all([promise1,promise2]).then(()=>{
                return res.status(202).json({success:true,message:'Transcation Successful'});
            }).catch((err)=>{
                throw new Error(err);
            })    
        }
        catch(err){
            res.status(401).json({error:err,message:'Something went wrong'});
        }
}
const updateFailedTransactionStatus= async (req,res)=>{
    try{
        const order_id=req.body.order_id;
        console.log(order_id);
        const order=await Order.findById(order_id)
        await order.updateOne({status:'FAILED'})
        return res.status(202).json({successful:true,message:'DATABASE UPDATED'})
    }
    catch(err){
        res.status(404).json(err);
    }
}
module.exports={
    purchasePremium,
    updateTransactionStatus,
    updateFailedTransactionStatus
};