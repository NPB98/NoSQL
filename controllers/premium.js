const User=require('../models/user');
const Expense=require('../models/expenses');

 exports.getLeaderboard=async(req,res)=>{
    try{
        const leaderboardDetails = await User.find()
        .select('name totalExpenses -_id').sort({totalExpenses:'descending'});
       res.status(200).json(leaderboardDetails);
    }
    catch(err){
        res.status(500).json(err);
    }
 }
 