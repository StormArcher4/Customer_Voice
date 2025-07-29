import React, { useRef, useEffect, useState, useContext } from 'react';
import Zoom from '@mui/material/Zoom';                            
import { Player } from '@lottiefiles/react-lottie-player';        
import '../styleComponents/emoji.css';                            
import { useNavigate } from 'react-router-dom';
import { UserInformationContext } from '../contexts/userInfoInfo';
const defaultBackground = '/background2.jpg';  // path relative to public folder root
// Single Emoji Card w/ ripple effect
function EmojiCard({ text, src, onClick }) {
  const playerRef = useRef(null);
  const cardRef   = useRef(null);

  // Creates and animates a ripple span, then removes it
  const createRipple = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width  = `${size}px`;
    ripple.style.height = `${size}px`;

    // Position ripple center at click
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;
    ripple.style.left = `${x}px`;
    ripple.style.top  = `${y}px`;

    card.appendChild(ripple);
    // Remove after animation ends (~600ms)
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  const handleClick = (e) => {
    createRipple(e);
    onClick();  // bubble up selection
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      tabIndex={0}
      className="emoji-card"
    >
      <Player
        ref={playerRef}
        autoplay
        loop
        src={src}
        className="lottie-player"
      />
      <p style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

// Grid of 6 emojis
function EmojiRating({ onEmojiClick }) {
  const cards = [
    { text: 'J’ai adoré !', src: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/lottie.json' },
    { text: 'Très satisfaisant',  src: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/lottie.json' },
    { text: 'C’était bien',       src: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fae1/lottie.json' },
    { text: 'Neutre',           src: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/lottie.json' },
    { text: 'Décevant', src:'https://fonts.gstatic.com/s/e/notoemoji/latest/1f612/lottie.json'},
    { text: 'Horrible',    src:'https://fonts.gstatic.com/s/e/notoemoji/latest/1f621/lottie.json'},
  ];

  return (
    <div className="emojicontainer">
      {cards.map(({ text, src }, i) => (
        <Zoom key={i} in style={{ transitionDelay: `${i * 100}ms` }}>
          <div> {/* Plain div wrapper fixes the ref problem */}
            <EmojiCard text={text} src={src} onClick={() => onEmojiClick(i)} />
          </div>
        </Zoom>
      ))}
    </div>
  );
}

// Main Page
export default function EmojiRatingPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserInformations } = useContext(UserInformationContext);
    const [backgroundUrl, setBackgroundUrl] = useState(null); 

  // reset on mount
useEffect(() => {
  // Reset user info
  setUserInformations({
    name: '', email: '', phone: '',
    satisfaction: '', heardAbout: '', comments: '',
  });

  // Fetch background image
  async function fetchBackground() {
    try {
      const res = await fetch('http://localhost:5000/api/page-backgrounds/rating');
      if (!res.ok) throw new Error('No background found');
      const data = await res.json();
      if (data?.image_id?.path) {
        setBackgroundUrl(`http://localhost:5000${data.image_id.path}`);
      }
    } catch {
      setBackgroundUrl(defaultBackground);
    }
  }

  fetchBackground();
}, [setUserInformations]);


  // on emoji select → post + navigate
  const handleSelect = async (idx) => {
    if (loading) return;
    setLoading(true);

const levels = [
  "J’ai adoré !",
  "Très satisfaisant",
  "C’était bien",
  "Neutre",
  "Décevant",
  "Horrible"
];

    const payload = {
      satisfaction: levels[idx],
      name: '', email: '', phone: '',
      heardAbout: '', comments: ''
    };

    try {
      const res = await fetch('http://localhost:5000/api/feedbacks', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      setUserInformations(saved);
      localStorage.setItem('userData', JSON.stringify(saved));
      navigate('/heard-about');
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagewraper"   style={{
                                            backgroundImage: `url(${backgroundUrl ? backgroundUrl : defaultBackground})`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            transition: 'background-image 0.6s ease',
                                          }}>
      <h1 className="titletext">
Merci de nous indiquer votre niveau de satisfaction concernant notre service.</h1>
      <EmojiRating onEmojiClick={handleSelect} />
    </div>
  );
}
