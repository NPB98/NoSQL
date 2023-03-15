
var amt=document.getElementById('amount');
var desc=document.getElementById('description');
var cate=document.getElementById('category');
var itemlist=document.getElementById('items');
var form=document.getElementById('addForm');
form.addEventListener("submit",addExpense)

function addExpense(e){
    e.preventDefault();
    const obj = {
        amount:amt.value,
        description:desc.value,
        category:cate.value
    }
    const token=localStorage.getItem('token');
    console.log(token);
    axios.post("http://localhost:4000/addExpenses",obj,{headers:{'Authorization':token}})
    .then((response)=>{
        showExpensesOnScreen(obj);
    }).catch((err)=>console.log(err));
}

function showPremiumUser(){
    document.getElementById('rzp-button1').style.visibility='hidden';
    document.getElementById('premium').innerHTML = 'You are premium user' ;
    //const downloadFacility=document.getElementById("downloadFacility");
//     const childNode=`<div class="container">
//     <button onclick="download()" id="downloadOption">Download File</button>
//   </div>`
//   downloadFacility.innerHTML+=childNode;
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
function Helper(e){
    e.preventDefault();
      const rows = document.getElementById('row');
      localStorage.setItem('rows',rows.value);
     console.log(rows.value);
      getExpense(1);
  }

window.addEventListener("DOMContentLoaded",(e)=>{
    const token=localStorage.getItem('token');
    const decodedToken=parseJwt(token);
    console.log(decodedToken);
    const isPremiumUser=decodedToken.isPremiumUser;
    if(isPremiumUser){
        showPremiumUser();
        showLeaderboard();
    }
})
async function getExpense(page){
    const token = localStorage.getItem('token');
    const rows = localStorage.getItem('rows');
    //console.log(rows);
   const Expenses =  await axios.get(`http://localhost:4000/getExpenses?page=${page}&rows=${rows}`,{ headers: {"Authorization": token}});
   console.log("EXPENSES",Expenses);
   const expenses= Expenses.data.expenses;
   console.log(expenses.length);
   const parentNode= document.getElementById('items');
   // console.log(item);
    parentNode.innerHTML="";

   for(let i=0; i<expenses.length; i++){
        showExpensesOnScreen(expenses[i]);
     }
     console.log(Expenses.data);
     showPagination(Expenses.data);
 }

function showPagination(response){
    console.log('Response',response);
    const currentPage = response.currentPage;
    const hasNextPage = response.hasNextPage;
    const nextPage = response.nextPage;
    const hasPreviousPage = response.hasPreviousPage;
    const previousPage = response.previousPage;
    const lastPage = response.lastPage;
    const pagination = document.getElementById("pagination1");
    pagination.innerHTML = "";
    //console.log('PAGINATION',pagination.innerHTML);
    
  if(hasPreviousPage){
    const btn2 = document.createElement('button');
    btn2.innerHTML = previousPage;
    btn2.addEventListener('click', ()=> getExpense(previousPage));
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement('button');
  btn1.innerHTML = `<h3>${currentPage}</h3>`;
  btn1.addEventListener('click', ()=> getExpense(currentPage));
  pagination.appendChild(btn1);
  if(hasNextPage){
    const btn3 = document.createElement('button');
    console.log(btn3.innerHTML);
    btn3.innerHTML = nextPage;
    btn3.addEventListener('click', ()=> getExpense(nextPage));
    //pagination.innerHTML="";
    pagination.appendChild(btn3);
  }
 }
  
function showExpensesOnScreen(item){
    const parentNode= document.getElementById('items');
    console.log(item);
    //parentNode.innerHTML="";
    const childHTML = `<li id=${item._id}> Expense Amount: ${item.amount}, Category: ${item.category}, Description: ${item.description}
                        <button onclick=deleteExpense('${item._id}')>Delete</button>
                        </li>`;
    parentNode.innerHTML = parentNode.innerHTML+childHTML;
}

function deleteExpense(expenseId){
    //console.log(expenseId);
    const token=localStorage.getItem('token');
    axios.get(`http://localhost:4000/deleteExpense/${expenseId}`,{headers:{'Authorization':token}})
    .then((response)=>{
        const parentNode = document.getElementById('items');
        const childNodeToBeDeleted = document.getElementById(expenseId);
        //console.log(parentNode);
        if(childNodeToBeDeleted){
            parentNode.removeChild(childNodeToBeDeleted)
        }
        //showExpensesOnScreen()
    }).catch((err)=>console.log(err));
}

function showLeaderboard(){
    const inputElement = document.createElement('input');
    inputElement.type = "button";
    inputElement.value = "Show Leaderboard";
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token');
       const leaderboardArray = await axios.get("http://localhost:4000/showLeaderboard", { headers: {"Authorization": token}});
        let leaderboardElem = document.getElementById('leaderboard');
        leaderboardElem.innerHTML='';
        leaderboardElem.innerHTML += '<h3> LeaderBoard </h3>'
        let leaderboardElem1 = document.getElementById('leaderboarddetails');
        leaderboardArray.data.forEach((userDetails) => {
            console.log(userDetails);
            var child=`<li>Name-${userDetails.name} Total Expense-${userDetails.totalExpenses}`
            leaderboardElem1.innerHTML += child;           
        })
    }
    document.getElementById('premium').appendChild(inputElement)
 }

document.getElementById('rzp-button1').onclick=async function(e){
    const token=localStorage.getItem('token');
    console.log(token);
    const response=await axios.get('http://localhost:4000/premiumMembership',{headers:{'Authorization':token}});
    var options=
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(res){
            await axios.post('http://localhost:4000/updateTransactionStatus',{
                order_id: options.order_id,
                payment_id: res.razorpay_payment_id,
            },{headers:{'Authorization':token}})
            alert('You are a premium user now')
            document.getElementById('rzp-button1').style.visibility='hidden';
            document.getElementById('premium').innerHTML = 'You are premium user  ' ;
            localStorage.setItem('token',res.data.token);
            showLeaderboard();
        }
    };
    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed',async function(response){
        console.log(response);
        const answer= await axios.post("http://localhost:4000/updateFailedTransactionStatus",{
            order_id: options.order_id
        },{headers: {'Authorization' : token}})
        console.log(answer);
        alert('Something went wrong');
    });
}

