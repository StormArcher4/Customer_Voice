import React from 'react'
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../styleComponents/adminLoginStyle.css'
import { motion } from "framer-motion";  // For animations
import Alert from '@mui/material/Alert'; // Alert message component

function AdminLogin() {

  const [email, setEmail] = useState('');                           // Stores email input
  const [password, setPassword] = useState('');                    // Stores password input
  const [isEmailFalse, setIsEmailfalse] = useState(false);        // Toggles red error style for email
  const [isPasswordFalse, setIsPasswrodFalse] = useState(false); // Toggles red error style for password
  const [showAlert, setShowAlert] = useState({
    isOn: false,
    content: ""
  });  // Shows alert box with error message if login fails
  const navigate = useNavigate();


  const handleLogin = (e) => {
    e.preventDefault();          // It prevents the browser's default behavior of reloading the page when a form is submitted.
                                // Vérifie les identifiants (très basique pour commencer)
    setIsEmailfalse(email !== "admin@example.com")
    setIsPasswrodFalse(password !== "123456")
    if (email === "admin@example.com" && password === "123456") {
      setShowAlert({content: "", isOn: false})  // Hide alert
      localStorage.setItem("isAdmin", "true"); // Save session flag in browser
      navigate('/admin-dashboard');
    } 
    else if (email !== "admin@example.com") {
      setShowAlert({content: "email incorrect", isOn: true})
    }
    else if (password !== "123456") {
      setShowAlert({content: "password incorrect", isOn: true})
    }
  };

  //Framer Motion Animation
    const backdrop = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
    };

    const modal = {
      hidden: { opacity: 0, y: 50, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 },
      },
      exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
    };


  return (
    <motion.div                // Overlay background with motion fade-in
    className="login-overlay"
    variants={backdrop}
    initial="hidden"
    animate="visible"
    exit="hidden"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >

      {/* Animated login box with spring pop effect */}
    <motion.div
      variants={modal}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ width: '100%', maxWidth: 500 }}
    >
  <Container maxWidth={false}
  className='login-form'
  >   
  
  {/* Header fades in from top */}
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
      >
      
        <h2>Welcome Back</h2>
        <p>Sign in to continue your journey</p>
      </motion.div>
    {/* Form slides in from bottom */}
      <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
      >

      {/* Email input with error styling if wrong */}
          <TextField 
              error={isEmailFalse}
              className='input'
              fullWidth
              label="Admin Email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
          />

        {/* Password input with error styling if wrong */}
          <TextField
              error={isPasswordFalse}
              className='input'
              fullWidth
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              value={password} 
              onChange={e => setPassword(e.target.value)}
          />

          {/* Animated button on hover / click */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button fullWidth variant="contained" type="submit">
              Connexion
            </Button>
          </motion.div>        
        </motion.form>

        {/* Alert shown if login fails */}
      {showAlert.isOn && <Alert className='alert' severity="error">{showAlert.content}</Alert>}
  </Container>
  </motion.div>
  </motion.div>
  )
}

export default AdminLogin