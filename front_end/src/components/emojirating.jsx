import React, { useRef, useEffect, useState, useContext } from 'react';
import Zoom from '@mui/material/Zoom';
import { Player } from '@lottiefiles/react-lottie-player';
import '../styleComponents/emoji.css';
import { useNavigate } from 'react-router-dom';
import { UserInformationContext } from '../contexts/userInfoInfo';

function EmojiCard({ text, src, isSelected, onClick }) {
  const playerRef = useRef(null);
  const pauseTimeout = useRef(null);

  useEffect(() => {
    if (isSelected) {
      clearTimeout(pauseTimeout.current);
      playerRef.current?.play();
    } else {
      playerRef.current?.stop();
    }
    return () => clearTimeout(pauseTimeout.current);
  }, [isSelected]);

  const handleMouseEnter = () => {
    clearTimeout(pauseTimeout.current);
    if (!isSelected) playerRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (!isSelected) {
      pauseTimeout.current = setTimeout(() => {
        playerRef.current?.pause();
      }, 2000);
    }
  };

  return (
    <div
      onClick={onClick}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`emoji-card${isSelected ? ' selected' : ''}`}
    >
      <Player
        ref={playerRef}
        autoplay={false}
        loop
        src={src}
        className="lottie-player"
      />
      <p style={{ fontSize: '1.15rem', fontWeight: isSelected ? '900' : '700', margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

function EmojiRating({ selectedIndex, setSelectedIndex }) {
  const cards = [
    { text: 'It was very satisfying', src: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/lottie.json' },
    { text: 'It was Good', src: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fae1/lottie.json' },
    { text: 'Neutral', src: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/lottie.json' },
    { text: 'Not what I expected', src: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f612/lottie.json' },
    { text: 'This is Terrible', src: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f621/lottie.json' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '1rem',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {cards.map(({ text, src }, i) => (
        <Zoom key={i} in={true} style={{ transitionDelay: `${i * 100}ms` }}>
          <div key={i}>
            <EmojiCard
              text={text}
              src={src}
              isSelected={selectedIndex === i}
              onClick={() => setSelectedIndex(i)}
            />
          </div>
        </Zoom>
      ))}
    </div>
  );
}

function EmojiRatingPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { userInformations, setUserInformations } = useContext(UserInformationContext);
  
  useEffect(()=> {
    const storedData = JSON.parse(localStorage.getItem("userData"))
    if(storedData) {
      setUserInformations(storedData)
    }
  }, [])

  const handleClick = () => {
    setLoading(true);

    const satisfactionLevels = [
      'Very Satisfying',
      'Good',
      'Neutral',
      'Not what I expected',
      'Terrible',
    ];

    const updatedInfo = {
      ...userInformations,
      satisfaction: satisfactionLevels[selectedIndex],
    };

    setUserInformations(updatedInfo);
    localStorage.setItem('userData', JSON.stringify(updatedInfo));

    setTimeout(() => {
      navigate('/heard-about');
    }, 700);
  };

  return (
    <div className='pagewraper'>
      <h1 className='titletext'>Provide us with your level of satisfaction from our service</h1>
      <div className='emojicontainer'>
        <EmojiRating selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
        <button
          className='buttonnext'
          onClick={handleClick}
          disabled={loading || selectedIndex === null}
        >
          {loading ? 'Loading...' : 'Share Your Reaction'}
        </button>
      </div>
    </div>
  );
}

export default EmojiRatingPage;
