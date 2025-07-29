import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import '../styleComponents/heardAboutStyle.css';
import Container from '@mui/material/Container';

// Icon imports from Material UI for visual options
import SearchIcon from '@mui/icons-material/Search';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate } from 'react-router-dom';
import { UserInformationContext } from '../contexts/userInfoInfo';
import CircularProgress from '@mui/material/CircularProgress'; // Add this import
import { motion } from 'framer-motion';  // <-- import motion


export default function HeardAbout() {
  const navigate = useNavigate();
  // Access the shared user data and update function
  const { userInformations, setUserInformations } = useContext(UserInformationContext);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');     // Tracks which option is selected
  const [loadingCard, setLoadingCard] = useState(''); // Track which card is loading
const [backgroundImage, setBackgroundImage] = useState('/7.jpg'); // default

useEffect(() => {
  async function fetchBackground() {
    try {
      const res = await fetch('http://localhost:5000/api/page-backgrounds/heard-about');
      const data = await res.json();

      if (data?.image_id?.path) {
        setBackgroundImage(`http://localhost:5000${data.image_id.path}`);
      }
    } catch (err) {
      console.error('Failed to load background image:', err);
    }
  }

  fetchBackground();
}, []);


  async function handleNextClick(selectedKey) {
      if (loading) return; // Prevent double click
      setLoading(true); // Set loading state to true
      setLoadingCard(selectedKey); // Set the loading card

    const map = {
      google: 'Google',
      instagram: 'Instagram',
      facebook: 'Facebook/Meta',
      tiktok: 'TikTok',
      affichage_urbaine: 'affichage urbaine',
      friend: 'Friend or Family',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      
    };
    const heardAboutusFrom = map[selectedKey] || 'Other';

  // ✅ Send only updated field and user _id to backend
    const payload = {
      _id: userInformations._id,
      heardAbout: heardAboutusFrom,
    };

    try {
      // Send PATCH request to update feedback
      const res = await fetch('http://localhost:5000/api/feedbacks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Server returned ${res.status}`);
      }

      // Update global state and localStorage with new server data
      const updatedDoc = await res.json();

      setUserInformations(updatedDoc);
      localStorage.setItem('userData', JSON.stringify(updatedDoc));
      
      // Move to next page
      navigate('/form-contact');

    } catch (err) {
      console.error('Failed to PATCH feedback:', err);
      alert('Something went wrong while saving your answer. Please try again.');
    }finally {
      setLoading(false);
      setLoadingCard(''); // Reset loading card after request

    }
  }

  // ✅ Utility to check if a card is selected
  const isSelected = key => selected === key;

  // framer Motion animation config for container entrance
  const aboutVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <div className='pagewraper3'   style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.5s ease',
  }}>
      <motion.div
        variants={aboutVariants}
        initial="hidden"
        animate="visible"
        style={{ margin: 'auto', maxHeight:'1500px' }} // to match Container sizing roughly
        className="about"
      >
        <div className="title">
          <h2>Comment avez-vous découvert notre service ?</h2>
          <p>Votre réponse nous permet de mieux comprendre comment atteindre un public comme vous et d’améliorer nos services.</p>
        </div>

        <Container className="wide-container" maxWidth={false}>
          {[  'google','instagram','facebook','tiktok','affichage_urbaine','youtube','linkedin','friend',].map(key => {
              const Icon = {
                google: SearchIcon,
                instagram: InstagramIcon,
                facebook: FacebookIcon,
                tiktok:  (props) => (
                    <img
                      src="/tiktok.png"
                      alt="TikTok"
                      className="icon"
                      style={{ width: '0.8em', height: '1em', objectFit: 'contain' }}
                      {...props}
                    />),
                  affichage_urbaine: (props) => (
                      <img
                        src="/urbain.png"
                        alt="affichage urbaine"
                        className="icon"
                        style={{ width: '0.8em', height: '1em', objectFit: 'contain' }}
                        {...props}
                      />
                    ),
                youtube: YouTubeIcon,
                linkedin: LinkedInIcon,
                friend: Diversity3Icon,
              }[key];

            return (
              <div
                key={key}
                className="card"
                onClick={() => {
                 if (!loading) {
                  setSelected(key);
                  handleNextClick(key);
                   }
                }
                }
                style={{
                  backgroundColor: isSelected(key)
                    ? 'rgba(250, 210, 184, 0.75)'
                    : 'rgba(255, 255, 255, 0.81)',
                    cursor: loading ? 'not-allowed' : 'pointer'

                }}
              >
                
                 <Icon className="icon" />
                <div className="card-title">

                  {{
                      google: 'Google search',
                      instagram: 'Instagram',
                      facebook: 'Facebook',
                      tiktok: 'TikTok',
                      affichage_urbaine: 'affichage urbaine',
                      youtube: 'YouTube',
                      linkedin: 'LinkedIn',
                      friend: 'Friend or family',
                      tv: 'TV/Radio Ad',
                      other: 'Other',
                    }[key]}
                </div>
                                    {loading && loadingCard === key && (
                     <CircularProgress size={24} style={{ marginTop: 10 }} />
                    )}
              </div>
            );
          })}
        </Container>
      </motion.div>
    </div>
  );
}
