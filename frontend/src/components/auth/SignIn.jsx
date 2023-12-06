import React,{useEffect, useState} from 'react';
import Container from '../Container';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import CustomLink from '../CustomLink';
import { commonModelClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { useNotification,useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '../../utils/helper';

const validateUserInfo=({email,password})=>{

  if(!email.trim()) return {ok:false,error:'Email is missing!!'}
  if(!isValidEmail(email)) return {ok:false,error:'Invalid Email!!'}

  if(!password.trim()) return {ok:false,error:'Password is missing!!'}
  if(password.length < 8) return {ok:false,error:'Password must contain at least 8 characters!!'}

  return {ok:true}


}

export default function SignIn() {

  const [userInfo,setUserInfo]=useState({
    email:'',
    password:'',
  })

  const navigate=useNavigate()
  const {updateNotification}=useNotification()
  const {handleLogin,authInfo}=useAuth()
  const {isPending,isLoggedIn}=authInfo



  const handleChange=({target})=>{
    const {value,name}=target
    setUserInfo({...userInfo,[name]:value})

  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const {ok,error} =validateUserInfo(userInfo)
    if(!ok) return updateNotification("error", error)
    handleLogin(userInfo.email,userInfo.password)
  }

  useEffect(()=>{
    //moving user somewhere else if they are already loggen in
    if(isLoggedIn) navigate('/')
  },[isLoggedIn])

  return (
    <FormContainer>
      <Container className="max-w-screen-xl mx-auto">
        <form onSubmit={handleSubmit} className={commonModelClasses+' w-72'}>
          <Title>Sign in</Title>
          <FormInput
           values={userInfo.email} 
           onChange={handleChange}
           label='Email'
           placeholder='john@email.com' 
           name='email' />
          <FormInput 
           values={userInfo.password} 
           onChange={handleChange}
           label='Password' 
           placeholder='********' 
           name='password'
           type='password' />
          <Submit value="Sign in" busy={isPending}/>

          <div className="flex justify-between">
            <CustomLink to='/auth/forget-password'>Forgot Password</CustomLink>
            <CustomLink to='/auth/signup'>Sign up</CustomLink>


          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
 