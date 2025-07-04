import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import '../styleComponents/UserInfoStyle.css';
import Button from '@mui/material/Button';
import { motion } from "motion/react"

function UserInfo() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [shakeKey, setShakeKey] = useState(0); 
  const [formValidation, setFormValidation] = useState({
    isNameValid: true,
    isEmailValid: true,
    isPhoneValid: true,
  }); 

  function handleSubmit(e) {
    e.preventDefault()
    console.log("handling btn click")
    const isInvalid =
      userInfo.name.trim() === "" ||
      userInfo.email.trim() === "" ||
      userInfo.phone.trim() === "";
    
    const phoneRegex = /^(?:\+212|0)([5-7]\d{8})$/;

    const isValid = phoneRegex.test(userInfo.phone.trim())

    setFormValidation({
      isNameValid: userInfo.name.trim() !== "",
      isEmailValid: userInfo.email.trim() !== "",
      isPhoneValid: isValid,
    })
    // setFormValidation({
    //   ...formValidation, isPhoneValid: isValid
    // })


    if(isInvalid || !isValid) {
      setShakeKey((prev) => prev+1)
      return;
    } 

    console.log(userInfo)
    alert("form submited succefully")
  }

  function handleNameChange(e) {
    setUserInfo({...userInfo, name: e.target.value})
  }
  function handleEmailChange(e) {
    setUserInfo({...userInfo, email: e.target.value})
  }
  function handlePhoneChange(e) {
    const phoneRegex = /^(?:\+212|0)([5-7]\d{8})$/;
    const isValid = phoneRegex.test(userInfo.phone.trim())
    setFormValidation({
      ...formValidation, isPhoneValid: isValid
    })
    setUserInfo({...userInfo, phone: e.target.value})
  }

  return (
    <div className='formHolder'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="sm" className='formContainer'>
          <h1>Customer Feedback Form</h1>
          <Divider />
          <Container maxWidth="sm">
              <form>
                <motion.div
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <TextField
                  className='textField'
                  required
                  error={!formValidation.isNameValid}
                  fullWidth
                  id="outlined-error"
                  label="name"
                  value={userInfo.name}
                  onChange={(e)=> {
                    handleNameChange(e)
                  }}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <TextField
                  className='textField'
                  required
                  error={!formValidation.isEmailValid}
                  fullWidth
                  id="outlined-error"
                  label="email"
                  type='email'
                  value={userInfo.email}
                  onChange={(e)=> {
                    handleEmailChange(e)
                  }}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <TextField
                  className='textField'
                  required
                  error={!formValidation.isPhoneValid}
                  fullWidth
                  id="outlined-error"
                  label="phone"
                  value={userInfo.phone}
                  // i have to check if the phone number is a valid one
                  onChange={(e)=> {
                    handlePhoneChange(e)
                  }}
                  />
                </motion.div>
                <motion.div
                  key={shakeKey}
                  animate={
                    {
                    x: [0, -6, 6, -6, 0],
                    scale: [1, 0.97, 1],
                    }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <Button variant="contained" type='submit'
                  style={ userInfo.name.trim() === "" ||
                    userInfo.email.trim() === "" ||
                    userInfo.phone.trim() === "" ?
                    {
                     backgroundColor: "#bdbdbd",
                     color: "#e0e0e0"
                    }
                    : {
                      backgroundColor: "#039be5",
                      color: "#eee"
                    }
                  }
                  onClick={(e) => {
                    handleSubmit(e)
                  }}
                  >
                    Submit
                  </Button>
                </motion.div>
              </form>
          </Container>
        </Container>
      </motion.div>
    </div>
  )
}

export default UserInfo