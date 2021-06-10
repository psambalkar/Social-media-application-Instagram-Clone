import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import Navbar from './components/Navbar'
import {BrowserRouter,Route, Switch ,useHistory} from 'react-router-dom'
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import {userReducer,initialState} from './reducer/userReducer'
import UserProfile from './components/screens/UserProfile';
import SuscribedUserPost from './components/screens/suscribesUserPosts';
export const userContext = createContext()
const Routing =()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(userContext)
  useEffect(()=>{
    const user =JSON.parse(localStorage.getItem("user"))
    if(user){
       dispatch({type:"USER",payload:user})     //if the user closes the website without signout in then he still should have access to state /user
      // history.push('/')
    }
    else{
      history.push('/signin')
    }
  },[])
  return(
    <Switch>
     <Route exact path='/' >
        <Home/>
      </Route>
      <Route  path='/signin' >
        <Signin/>
      </Route>
      <Route exact path='/profile' >
        <Profile/>
      </Route>
      <Route  path='/signup' >
        <Signup/>
      </Route>
      <Route  path='/create' >
        <CreatePost/>
      </Route>
      <Route path='/profile/:userid' >
        <UserProfile/>
      </Route>
      <Route path='/myfollowingpost' >
        <SuscribedUserPost/>
      </Route>
    </Switch>
  )
}
function App() {
  const [state,dispatch] = useReducer(userReducer,initialState)     //dispatch to update central state
  return (
    <userContext.Provider value ={{state,dispatch}}>
    <BrowserRouter>
      <Navbar/>
      <Routing/>
      </BrowserRouter>
      </userContext.Provider>
     
  );
}

export default App;
