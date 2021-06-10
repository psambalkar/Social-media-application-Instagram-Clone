import React,{useState,useContext} from 'react';
import { Link,useHistory } from "react-router-dom";
import {userContext} from '../../App'
 import M from 'materialize-css';

const Signin =()=>{
const {state,dispatch} = useContext(userContext);
 const h = useHistory()
 const [password,setPassword] = useState("")
 const [email,setEmail] = useState("")
 const postData = ()=>{
  if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
   M.toast({html:"Invalid email",classes:"#c62828 red darken-3"})
   return
 }
  fetch("/signin",{
   method:"post",
   headers:{
    "Content-Type":"application/json"
   },
   body:JSON.stringify({
    password,
    email 
   })
  }).then(res=>res.json())
  .then(data=>{
   console.log(data)
   if(data.error){
      M.toast({html:data.error,classes:"#c62828 red darken-3"})
   }
   else{
    localStorage.setItem('jwt',data.token)
    localStorage.setItem('user',JSON.stringify(data.user))
    dispatch({type:"USER",payload:data.user})
    M.toast({html:"signed in Successfully",classes:"#43a047 green darken-1"})
    h.push('/')
   }
  }).catch(err=>console.log(err))  
 }
 return (
  <div className="mycard">
   <div className='card auth-card input-field' >
    <h2>Instagram</h2>
    <input type='text'
    placeholder='email'
    value={email} 
    onChange={(e)=>{setEmail(e.target.value)}}>
    </input>
    <input type='password'
    placeholder='password'
    value={password} 
    onChange={(e)=>{setPassword(e.target.value)}}>
    </input>
    <button className='btn waves-effect waves-light blue #64b5f6 darken-1' onClick={()=>postData()}>
     Login
    </button>
    <h5>
     <Link to='/signup'>Don't have an account ?</Link>
    </h5>
   </div>
  </div>
 )
}
export default Signin;
