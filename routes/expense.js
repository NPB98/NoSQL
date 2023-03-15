const express = require('express');

const router = express.Router();
const userAuthentication = require('../middleware/auth');

const adminController = require('../controllers/admin');

router.get('/getExpenses', userAuthentication.authenticate,adminController.getExpenses);
router.get('/deleteExpense/:expenseId',userAuthentication.authenticate,adminController.deleteExpense);
router.post('/addExpenses',userAuthentication.authenticate,adminController.addExpense);

module.exports = router;    
