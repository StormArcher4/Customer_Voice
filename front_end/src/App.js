import { Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ThankYouPage from './components/ThankYouPage';
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
          <Link to="/heard-about">how did you here about us</Link>
          </div>
          }
        /> 
        <Route path='/heard-about' element={<HeardAbout/>}/>
        <Route path='/form-contact' element={<UserInfo/>}/>
        <Route path='/thank-you' element={<ThankYouPage/>}/>
       <Route path='/rating' element={<EmojiRatingPage/>}/>
      </Routes>
    </div>
    </UserInformationContext.Provider>
  );
}

export default App;
