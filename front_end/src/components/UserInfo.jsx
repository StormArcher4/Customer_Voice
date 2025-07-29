import React, { useState, useContext, useEffect } from 'react'
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import '../styleComponents/UserInfoStyle.css';
import Button from '@mui/material/Button';
import { motion } from "framer-motion";
import { UserInformationContext } from '../contexts/userInfoInfo';
import { useNavigate } from 'react-router-dom';


function UserInfo() {
  const { userInformations, setUserInformations } = useContext(UserInformationContext)

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [formValidation, setFormValidation] = useState({
    isNameValid: true,
    isEmailValid: true,
    isPhoneValid: true,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add this at the top in your component state
  const [backgroundImage, setBackgroundImage] = useState("/6.jpg"); // Default background image

// Load background image for this page
useEffect(() => {
  async function fetchBackground() {
    try {
      const res = await fetch('http://localhost:5000/api/page-backgrounds/form-contact');
      const data = await res.json();

      if (data?.image_id?.path) {
        const img = new Image();
        img.src = `http://localhost:5000${data.image_id.path}`;
        img.onload = () => {
          setBackgroundImage(img.src);
        };
      }
    } catch (err) {
      console.error('Failed to load background image:', err);
    }
  }

  fetchBackground();
}, []);


  // ✅ Validate inputs when component first mounts
  useEffect(() => {
    const phoneRegex = /^(?:\+212|0)([5-7]\d{8})$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isNameValid = userInformations.name.trim() !== "";
    const isEmailValid = emailRegex.test(userInformations.email.trim());
    const isPhoneValid = phoneRegex.test(userInformations.phone.trim());

    setFormValidation({
      isNameValid,
      isEmailValid,
      isPhoneValid,
    });
  }, [userInformations]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (loading) return; // Prevent double submission
    setHasSubmitted(true);
    setLoading(true);
    //console.log("handling btn click");

    // ✅ Replace weak check with proper regex-based checks
    const phoneRegex = /^(?:\+212|0)([5-7]\d{8})$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isNameValid = userInformations.name.trim() !== "";
    const isEmailValid = emailRegex.test(userInformations.email.trim());
    const isPhoneValid = phoneRegex.test(userInformations.phone.trim());

    setFormValidation({
      isNameValid,
      isEmailValid,
      isPhoneValid,
    });

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      setShakeKey((prev) => prev + 1);
      setLoading(false); // reset loading on validation fail
      return;
    }

    try {
      const payload = {
        _id: userInformations._id,
        name: userInformations.name,
        email: userInformations.email,
        phone: userInformations.phone,
      };

      const response = await fetch('http://localhost:5000/api/feedbacks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save feedback to server');
      }

      const updatedDoc = await response.json();

      // Update context and localStorage with the final, complete document
      setUserInformations(updatedDoc);
      localStorage.setItem('userData', JSON.stringify(updatedDoc));

      navigate('/thankyou');
    } catch (error) {
      console.error(error);
      alert('Error saving feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleNameChange(e) {
    setFormValidation({
      ...formValidation, isNameValid: e.target.value !== ""
    })
    setUserInformations({ ...userInformations, name: e.target.value })
  }

  function handleEmailChange(e) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(e.target.value)
    //console.log("email valid: ", isValid)
    setFormValidation({
      ...formValidation, isEmailValid: isValid
    })
    setUserInformations({ ...userInformations, email: e.target.value })
  }

  function handlePhoneChange(e) {
    const phoneRegex = /^(?:\+212|0)([5-7]\d{8})$/;
    const isValid = phoneRegex.test(e.target.value)
    setFormValidation({
      ...formValidation, isPhoneValid: isValid
    })
    setUserInformations({ ...userInformations, phone: e.target.value })
  }

  return (
    <div className='pagewraper2'    style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 0.5s ease-in-out',
  }}>
      <div className='formHolder'>
     <Container className='formContainer'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut"  }}
        >

            <h1>Formulaire d’identification client</h1>
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
                    error={ hasSubmitted && !formValidation.isNameValid}
                    fullWidth
                    id="outlined-error"
                    label="Nom et prénom"
                    autoComplete="off"
                    value={userInformations.name === 'xxxxxxxxx' ? '' : userInformations.name}
                    onChange={(e) => {
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
                    error={ hasSubmitted && !formValidation.isEmailValid}
                    fullWidth
                    id="outlined-error"
                    label="email"
                    type='email'
                    autoComplete="off"
                    value={userInformations.email === 'xxxxxxxxx' ? '' : userInformations.email}
                    onChange={(e) => {
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
                    error={ hasSubmitted && !formValidation.isPhoneValid}
                    fullWidth
                    id="outlined-error"
                    label="Numéro de téléphone"
                    autoComplete="off"
                    value={userInformations.phone === 'xxxxxxxxx' ? '' : userInformations.phone}
                    // i have to check if the phone number is a valid one
                    onChange={(e) => {
                      handlePhoneChange(e)
                    }}
                  />
                </motion.div>
                <motion.div
                  key={shakeKey}
                  animate={{
                    x: [0, -6, 6, -6, 0],
                    scale: [1, 0.97, 1],
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={
                      loading ||
                      !formValidation.isNameValid ||
                      !formValidation.isEmailValid ||
                      !formValidation.isPhoneValid
                    }
                    style={
                      loading ||
                      !formValidation.isNameValid ||
                      !formValidation.isEmailValid ||
                      !formValidation.isPhoneValid
                        ? {
                          backgroundColor: "rgba(241, 183, 134, 0.7)",
                          color: "#ffffffff",
                          boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.7)",
                          cursor: "not-allowed",
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
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </motion.div>
              </form>
            </Container>
          
        </motion.div>
        </Container>
      </div>
    </div>
  )
}

export default UserInfo;
