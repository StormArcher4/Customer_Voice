// FeedbackSummary.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CheckCircle, Star, User, Mail, Phone } from 'lucide-react';
import '../styleComponents/FeedbackSummary.css';
import { UserInformationContext } from '../contexts/userInfoInfo';

const FeedbackSummary = () => {
  const navigate = useNavigate();
  const { userInformations } = useContext(UserInformationContext);

  // ✅ This will take the user to /rating
  const handleSubmitAnother = () => {
    navigate('/rating');
  };

  // ✅ This will take the user to /
  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="feedback-container">
      <div className="feedback-wrapper">
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
          <h1 className="success-title">Thank you for your feedback!</h1>
          <p className="success-subtitle">Your response has been successfully submitted</p>
        </div>

        {/* Feedback Summary Card */}
        <div className="feedback-card">
          <div className="feedback-header">
            <MessageSquare className="icon icon-orange" />
            <h2 className="section-title">Feedback Summary</h2>
          </div>

          {/* Service Experience */}
          <div className="service-row">
            <div className="service-left">
              <CheckCircle className="icon-small icon-green" />
              <span className="service-label">Service Experience</span>
            </div>
            <span className="positive-badge">{userInformations.satisfaction || 'Not provided'}</span>
          </div>

          {/* How you found us */}
          <div className="found-row">
            <div className="found-left">
              <Star className="icon-small icon-orange" />
              <span className="service-label">How you found us</span>
            </div>
            <span className="found-text">{userInformations.heardAbout || 'Not provided'}</span>
          </div>

          {/* Contact Info Cards */}
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-header">
                <User className="icon-tiny contact-icon" />
                <span className="contact-label">Name</span>
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
                <span className="contact-label">Phone</span>
              </div>
              <p className="contact-value">{userInformations.phone || 'Not provided'}</p>
            </div>
          </div>

          {/* Additional Comments */}
          {userInformations.comments && (
            <div className="comments-section">
              <h3 className="comments-title">Additional Comments</h3>
              <p className="comments-text">"{userInformations.comments}"</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="button-container">
            <button onClick={handleSubmitAnother} className="button-primary">
              Submit Another Response
            </button>

            <button onClick={handleReturnHome} className="button-secondary">
              Return to Homepage
            </button>
          </div>

          {/* Footer Text */}
          <p className="footer-text">
            We appreciate your time and valuable insights. Your feedback helps us improve our services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
