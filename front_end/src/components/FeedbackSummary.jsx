// FeedbackSummary.jsx
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CheckCircle, Star, User, Mail, Phone } from 'lucide-react';
import '../styleComponents/FeedbackSummary.css';
import { UserInformationContext } from '../contexts/userInfoInfo';
import Container from '@mui/material/Container';


const FeedbackSummary = () => {
    
  const navigate = useNavigate();
  // Access user information and updater from context
  const { userInformations, setUserInformations } = useContext(UserInformationContext);

  // On mount, load user data from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData && typeof parsedData === "object") {
          setUserInformations(parsedData);
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, [setUserInformations]);
  
  // This will take the user to /rating
  const handleSubmitAnother = () => {
    navigate('/rating');
  };

  // This will take the user to /
  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    // <Container maxWidth="md">
    <div className="feedback-container">
      <Container maxWidth="md" className="feedback-wrapper">
        {/* Success Icon */}
        <div className="success-container">
          <div className="success-icon-wrapper">
            <div className="success-icon">
              <CheckCircle />
            </div>
            <div className="success-star">
              <Star />
            </div>
          </div>
          <h1 className="success-title">Nous vous remercions chaleureusement !</h1>
          <p className="success-subtitle">Votre avis contribue à améliorer nos services.</p>
        </div>

        {/* Feedback Summary Card */}
        <div className="feedback-card">
          <div className="feedback-header">
            <MessageSquare className="icon icon-orange" />
            <h2 className="section-title">Résumé de votre avis</h2>
          </div>

          {/* Service Experience */}
          <div className="service-row">
            <div className="service-left">
              <CheckCircle className="icon-small icon-green" />
              <span className="service-label">Qualité du service:</span>
            </div>
            <span className="positive-badge">{userInformations.satisfaction || 'Not provided'}</span>
          </div>

          {/* How you found us */}
          <div className="found-row">
            <div className="found-left">
              <Star className="icon-small icon-orange" />
              <span className="service-label">Découverte par: </span>
            </div>
            <span className="found-text">{userInformations.heardAbout || 'Not provided'}</span>
          </div>

          {/* Contact Info Cards */}
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-header">
                <User className="icon-tiny contact-icon" />
                <span className="contact-label">Nom et Prénom</span>
              </div>
              <p className="contact-value">{userInformations.name || 'Not provided'}</p>
            </div>

            <div className="contact-card">
              <div className="contact-header">
                <Mail className="icon-tiny contact-icon" />
                <span className="contact-label">Email</span>
              </div>
              <p className="contact-value">{userInformations.email || 'Not provided'}</p>
            </div>

            <div className="contact-card">
              <div className="contact-header">
                <Phone className="icon-tiny contact-icon" />
                <span className="contact-label">Numéro de téléphone</span>
              </div>
              <p className="contact-value">{userInformations.phone || 'Not provided'}</p>
            </div>
          </div>

          {/* Additional Comments 
          {userInformations.comments && (
            <div className="comments-section">
              <h3 className="comments-title">Additional Comments</h3>
              <p className="comments-text">"{userInformations.comments}"</p>
            </div>
          )}*/}

          {/* Action Buttons */}
          <div className="button-container">
            <button onClick={handleSubmitAnother} className="button-primary">
              Envoyer une autre réponse
            </button>

            <button onClick={handleReturnHome} className="button-secondary">
                  Retour à l’accueil
            </button>
          </div>

          {/* Footer Text */}
          <p className="footer-text">
                Nous vous remercions pour votre temps et vos précieux retours. Votre avis nous aide à améliorer nos services.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default FeedbackSummary;
