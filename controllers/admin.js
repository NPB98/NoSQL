const Expense=require('../models/expenses');
const User=require('../models/user');
const UserServices=require('../services/userServices');
const mongoDb = require('mongodb');
const ObjectId = mongoDb.ObjectId;
const getExpenses=async(req,res,next)=>{
    try{
     //console.log('Request',req.user._id);
      const page = req.query.page || 1;
      const rows=req.query.rows;
      const expensesPerPage = rows;
      const countData = await Expense.count();
      //console.log(countData);
    const expenses = await Expense.find({userId:req.user._id})
    .skip((page-1) * expensesPerPage).limit(Number(expensesPerPage)).exec();
    //console.log(expenses);
      res.status(201).json({
         expenses:expenses,
         currentPage: Number(page),
         hasNextPage:  expensesPerPage*page < countData,
         nextPage:Number(page)+1,
         hasPreviousPage:Number(page)>1,
         previousPage:Number(page)-1,
         lastPage:Math.ceil(countData/expensesPerPage)
      }); 
   }
  catch(err){
      res.status(404).json(err);
  }
 };
 const deleteExpense = async(req,res,next)=>{
   //console.log(req);console.log(id);
    try{
      const id = req.params.expenseId;
      //console.log(new ObjectId(id));
      const result=await Expense.findOneAndDelete({_id:id, userId: req.user._id});
      console.log(result);
      const usedData =  await User.findById(req.user._id);
      const userAmount = Number(usedData.totalExpenses)-Number(result.amount);
      await usedData.updateOne({totalExpenses: userAmount});   
      res.status(202).json({success:true,message:"Successfully Deleted"});
    }
    catch(err){
        console.log(err);
        res.status(404).json(`${err}`);
    }
  };
 const addExpense =async (req,res,next)=>{
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    console.log('USERID',req.user.id);
    try{
      const expense= new Expense({
        amount:amount,
        description:description,
        category:category,
        userId:req.user._id
      })
    console.log(expense);
    const answer=await expense.save();
    const usedData=await User.findById(req.user._id);
    const totalExpense=Number(usedData.totalExpenses)+Number(amount);
    console.log(totalExpense);
    await usedData.updateOne({totalExpenses: totalExpense});
    res.status(201).json(answer);
    }
  catch(err) {
    return res.status(500).json({success:false,error:err})
 }
}
 module.exports={
  getExpenses,
  addExpense,
  deleteExpense,
 }

 


