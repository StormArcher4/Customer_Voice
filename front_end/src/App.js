import { Route, Routes, Link } from 'react-router-dom';
import './App.css';
import FeedbackSummary from './components/FeedbackSummary';
import UserInfo from './components/UserInfo';
import { UserInformationContext } from './contexts/userInfoInfo';
import { useState } from 'react';
import HeardAbout from './components/HeardAbout';
import EmojiRatingPage from './components/emojirating';



const informations = {
  satisfaction: "",
  heardAbout: "",
  name: "",
  email: "",
  phone: ""
}


function App() {
  const [userInformations, setUserInformations] = useState(informations)

  return (
    <UserInformationContext.Provider value={{userInformations, setUserInformations}}>
    <div className="App">
      {/* <HeardAbout/> */}
      <Routes>
        <Route path='/' element={
          <div>
          <h1>Welcome!</h1>
          <Link to="/rating">Lets learn about you opinion</Link>
          </div>
          }
        /> 
        <Route path='/heard-about' element={<HeardAbout/>}/>
        <Route path='/form-contact' element={<UserInfo/>}/>
        <Route path='/thankyou' element={<FeedbackSummary/>}/>
       <Route path='/rating' element={<EmojiRatingPage/>}/>
      </Routes>
    </div>
    </UserInformationContext.Provider>
  );
}

export default App;
