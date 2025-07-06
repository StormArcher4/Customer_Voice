import React, { useContext, useEffect } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import '../styleComponents/thankyouPageStyle.css';
import { UserInformationContext } from '../contexts/userInfoInfo';


function ThankYouPage() {    
    const {userInformations, setUserInformations} = useContext(UserInformationContext)
    
    useEffect(()=> {
        const storedData = JSON.parse(localStorage.getItem("userData"))
        if(storedData) {
            setUserInformations(storedData)
        }
    }, [])

    return (
    <div className='thanksContainer'>
        <Container maxWidth="lg" className='childContainer'>
            <div>
                <h1>Thank You</h1>
                <p style={{color: "green"}}>We truly appreciate your feedback, it help us grow and serve you better</p>
            </div>
            <Container sx={{
                maxWidth: {
                xs: '100%',    // Extra-small screens
                sm: '600px',   // Small screens
                md: '900px',   // Medium screens
                lg: '900px',  // Large screens
                xl: '1000px',  // Extra-large
                },
            }} className='user-details'>
                <h1>Your Submission</h1>
                <Stack className='stack' spacing={2} direction="row">
                    <div>
                        <h3>satisfaction level</h3>
                        <p>good level</p>
                    </div>
                    <div>
                        <h3>Heard about us from</h3>
                        <p>{userInformations.heardAbout}</p>
                    </div>
                </Stack>
                <Stack className='stack' spacing={2} direction="row">
                    <div>
                        <h3>Name</h3>
                        <p>{userInformations.name}</p>
                    </div>
                    <div>
                        <h3>Email</h3>
                        <p>{userInformations.email}</p>
                    </div>
                </Stack>
                <Stack className='stack' spacing={2} direction="row">
                    <div style={{width: "100%"}}>
                        <h3>Phone Number</h3>
                        <p>{userInformations.phone}</p>
                    </div>
                </Stack>
            </Container>
        </Container>
    </div>
  )
}

export default ThankYouPage