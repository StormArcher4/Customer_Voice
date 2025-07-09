import React from 'react'
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import '../styleComponents/homeStyle.css'
import Stack from '@mui/material/Stack';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';

function Home() {
  const navigate = useNavigate()
  const [showLoginAdin, setShowLoginAdmin] = useState(false)

  function handleFeedbackClick() {
    navigate("/rating")
  }
  return (
  <>
  {showLoginAdin && <AdminLogin/>}
  <Container maxWidth="sm">
    <Button variant="contained" className='admin'
    style={{
      position: "absolute",
      top: "20px",
      right: "20px",
      backgroundColor: "white",
      color: "black",
      border: "1px solid rgb(74 144 226)",
      transition: "all 0.3s",
      zIndex: 3,
    }}
    onClick={() => {
      setShowLoginAdmin(!showLoginAdin)
    }}
    >Admin Login</Button>
    <Stack spacing={2} className='stack' style={{display: showLoginAdin? "none": null}}>
        <div>
            <h1>Give Us Your 
                <TypingSpan text={"Feedback!"}/>
            </h1>
            <p>We value your opinion and want to hear from you.</p>
        </div>
        <Button variant="outlined"
        onClick={() => {
          handleFeedbackClick()
        }}
        >
            <span>
            <ChatBubbleOutlineIcon className='icon'/>
            Give Feedback
            </span>
        </Button>
    </Stack>
  </Container>
  </>
  )
}

const TypingSpan = ({ text }) => {
    const [displayedCount, setDisplayedCount] = useState(0);
  
    useEffect(() => {
      let timeout;
      if (displayedCount < text.length) {
        timeout = setTimeout(() => setDisplayedCount(displayedCount + 1), 150);
      } else {
        // Restart after full text shown with a pause
        timeout = setTimeout(() => setDisplayedCount(0), 1500);
      }
      return () => clearTimeout(timeout);
    }, [displayedCount, text.length]);
  
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ display: "inline-block", whiteSpace: "pre" }}
      >
        {text.slice(0, displayedCount)}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          style={{ display: "inline-block" }}
        >
          |
        </motion.span>
      </motion.span>
    );
};

export default Home