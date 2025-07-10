import { Route, Routes, Link } from 'react-router-dom';
import './App.css';
import FeedbackSummary from './components/FeedbackSummary';
import UserInfo from './components/UserInfo';
import { UserInformationContext } from './contexts/userInfoInfo';
import { useState } from 'react';
import HeardAbout from './components/HeardAbout';
import EmojiRatingPage from './components/emojirating';
import Home from './components/Home';
import Admindashboard from './components/Admindashboard'
import PrivateRoute from './components/PrivateRoute';



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
      <div className='container'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/heard-about' element={<HeardAbout/>}/>
          <Route path='/form-contact' element={<UserInfo/>}/>
          <Route path='/thankyou' element={<FeedbackSummary/>}/>
          <Route path='/rating' element={<EmojiRatingPage/>}/>
          {/* my modification */}
          <Route path='/admin-dashboard' 
          element={
            <PrivateRoute>
              <Admindashboard/>
            </PrivateRoute>
          }
          />
        </Routes>
      </div>
    </div>
    </UserInformationContext.Provider>
  );
}

export default App;
