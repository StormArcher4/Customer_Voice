import React, { useState, useContext } from 'react'
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import '../styleComponents/UserInfoStyle.css';
import Button from '@mui/material/Button';
import { motion } from "motion/react";
import { UserInformationContext } from '../contexts/userInfoInfo';
import { useNavigate } from 'react-router-dom';

function UserInfo() {
  const {userInformations, setUserInformations} = useContext(UserInformationContext)
  
  const [shakeKey, setShakeKey] = useState(0); 
  const [formValidation, setFormValidation] = useState({
    isNameValid: true,
    isEmailValid: true,
    isPhoneValid: true,
  }); 

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault()
    console.log("handling btn click")
    const isInvalid =
      userInformations.name.trim() === "" ||
      userInformations.email.trim() === "" ||
      userInformations.phone.trim() === "";
    
    const phoneRegex = /^(?:\+212|0)([5-7]\d{8})$/;

    const isValid = phoneRegex.test(userInformations.phone.trim())

    setFormValidation({
      isNameValid: userInformations.name.trim() !== "",
      isEmailValid: userInformations.email.trim() !== "",
      isPhoneValid: isValid,
    })

    if(isInvalid || !isValid) {
      setShakeKey((prev) => prev+1)
      return;
    } 
    // go to the final page after submission
    localStorage.setItem("userData", JSON.stringify(userInformations))
    navigate("/thankyou");
    console.log(userInformations)
  }

  function handleNameChange(e) {
    setFormValidation({
      ...formValidation, isNameValid: e.target.value !== ""
    })
    setUserInformations({...userInformations, name: e.target.value})
  }

  function handleEmailChange(e) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(e.target.value)
    console.log("email valid: ", isValid)
    setFormValidation({
      ...formValidation, isEmailValid: isValid
    })
    setUserInformations({...userInformations, email: e.target.value})
  }
  
  function handlePhoneChange(e) {
    const phoneRegex = /^(?:\+212|0)([5-7]\d{8})$/;
    const isValid = phoneRegex.test(e.target.value)
    setFormValidation({
      ...formValidation, isPhoneValid: isValid
    })
    setUserInformations({...userInformations, phone: e.target.value})
  }

  return (
    <div className='pagewraper2'>
    <div className='formHolder'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container className='formContainer'
        sx={{
          width: {
            xs: 'calc(100% - 30px)', 
            sm: '600px',
          },
          mx: {
            xs: '15px',
            sm: 'auto',
          },
        }}
        >
          <h1>Customer Feedback Form</h1>
          <Divider sx={{ borderColor: ' rgba(252, 245, 236, 0.7)', borderWidth: 1, marginBottom: 2 }} />
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
                  value={userInformations.name}
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
                  value={userInformations.email}
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
                  value={userInformations.phone}
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
              <Button
                variant="contained"
                type="submit"
                style={
                  userInformations.name.trim() === "" ||
                  userInformations.email.trim() === "" ||
                  userInformations.phone.trim() === ""
                    ? {
                        backgroundColor: " rgba(241, 183, 134, 0.7)",
                        color: "#e0e0e0",
                        boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.7)",
                      }
                    : {
                        backgroundColor: "rgba(240, 115, 32, 0.75)",
                        color: "#eee",
                        boxShadow: "0 0 12px 4px rgba(255, 255, 255, 0.8)",
                      }
                }
                onClick={(e) => {
                  handleSubmit(e);
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
    </div>
  )
}

export default UserInfo