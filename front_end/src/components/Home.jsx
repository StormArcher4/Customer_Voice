import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import '../styleComponents/homeStyle.css';

function Home() {
  const navigate = useNavigate();
  const [showLoginAdin, setShowLoginAdmin] = useState(false);  // Toggles AdminLogin visibility
  const [fadeOut, setFadeOut] = useState(false);               // Triggers fade-out animation

  // Handle user click anywhere on the page (except admin button)
  const handlePageClick = (e) => {
    if (showLoginAdin) return;  // Ignore if admin popup is open

    const adminBtn = document.querySelector('.admin');
    if (adminBtn && adminBtn.contains(e.target)) return;  // Ignore if admin button clicked

    setFadeOut(true);  // Start fade-out animation
  };

  // After fade animation, navigate to /rating
  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => navigate('/rating'), 500);  // Wait before navigating
      return () => clearTimeout(timer);  // Cleanup timeout
    }
  }, [fadeOut, navigate]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className='pagecontainer'
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}                      // Fade out
          transition={{ duration: 0.5 }}
          onClick={handlePageClick}                  // Trigger transition on page click
        >
          {showLoginAdin && <AdminLogin/>}

          <Container maxWidth="sm">

            {/* Admin login button at top-right corner */}
            <button
              className='admin'
              onClick={(e) => {
                e.stopPropagation();                // Prevent triggering page click
                setShowLoginAdmin(!showLoginAdin);  // Toggle admin login popup
              }}
            >
              Admin Login
            </button>

            <Stack spacing={2} className='stack' style={{display: showLoginAdin ? "none" : null}}>
              <div>
                <h1>Give Us Your 
                  <TypingSpan text={"Feedback!"}/>
                </h1>
                <p style={{fontWeight:'bold' ,marginBottom:'50px',}}>We value your opinion and want to hear from you.</p>
            <div
              className="tap-to-start"
                onClick={() => setFadeOut(true)}
  tabIndex={0}  // make it focusable
  style={{
    cursor: 'pointer',
    userSelect: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  }}
            >
              <FingerprintIcon style={{ fontSize: 64, color: '#ee730e' }} />
              <p style={{ fontWeight: 'bold', color: 'white' }}>Tap anywhere to start</p>
            </div>
              </div>
              {/* Feedback button removed — page click now handles navigation */}
            </Stack>

          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Typing animation for "Feedback!"
const TypingSpan = ({ text }) => {
  const [displayedCount, setDisplayedCount] = useState(0);  // Tracks number of visible characters

  useEffect(() => {
    let timeout;
    if (displayedCount < text.length) {
      timeout = setTimeout(() => setDisplayedCount(displayedCount + 1), 150); // Typing speed
    } else {
      timeout = setTimeout(() => setDisplayedCount(0), 1500); // Restart delay
    }
    return () => clearTimeout(timeout);  // Cleanup
  }, [displayedCount, text.length]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "inherit", // match parent font
        fontSize: "inherit",   // match parent size
        marginLeft: "5px",     // optional space before typing
      }}
    >
      {text.slice(0, displayedCount)}  {/* Only show part of the text */}
      <motion.span
        animate={{ opacity: [0, 1, 0] }} // Cursor blinking
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        style={{ display: "inline-block" }}
      >
        |
      </motion.span>
    </motion.span>
  );
};

export default Home;
