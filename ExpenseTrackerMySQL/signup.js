var na=document.getElementById('name');
  var email=document.getElementById('email');
  var password=document.getElementById('password');
  document.addEventListener("submit",signup);
   
  function signup(e){
      e.preventDefault();
      const signUpDetails = {
          name: na.value,
          email:email.value,
          password:password.value
      }
      axios.post("http://localhost:4000/user/signup",signUpDetails)
      .then((response)=>{
        if(response.status===201){
            alert('User Signed Up');
          }
      })
      .catch((err)=>{
        document.body.innerHTML+=`<div class='container'style='color:red'>${err}</div>`;
    })
}