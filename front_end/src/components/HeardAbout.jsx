import React, { useContext, useState } from 'react'
import '../styleComponents/heardAboutStyle.css'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { UserInformationContext } from '../contexts/userInfoInfo';

function HeardAbout() {
  const navigate = useNavigate()
  const {userInformations, setUserInformations} = useContext(UserInformationContext)

  function  handleNextClick() {
    let heardAboutusFrom = "";
    switch(selected) {
        case "google":
            heardAboutusFrom = "Google";
            break;
        case "instagrame":
            heardAboutusFrom = "Instagrame";
            break;
        case "facebook":
            heardAboutusFrom = "Facebook";
            break;
        case "friend":
            heardAboutusFrom = "Friend or Family";
            break;
        case "tv":
            heardAboutusFrom = "TV/Radio Ad";
            break;
        default:
            heardAboutusFrom = "Other"
            break
    }

    const updateInfos = {
        ...userInformations,
        heardAbout: heardAboutusFrom
    }
    setUserInformations(updateInfos)
    localStorage.setItem("userData", JSON.stringify(updateInfos))
    navigate("/form-contact")
  }
  const [selected, setSelected] = useState('');
  return (
    <div className='conatainer'>
        <Container maxWidth="sm" className='about'
        sx={{
            mx: {
              xs: '15px',
              sm: 'auto',
            },
        }}
        >
            <div className='title'>
                <h2>How did you hear about us?</h2>
                <p>Your feedback helps us understand how to reach more amazing people like you!</p>
            </div>
            <Container maxWidth="sm" className=''>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "google"? "#b2ebf2": "#eee"}}
                    onClick={() => {
                        setSelected("google")
                    }
                    }
                >
                    <div>
                        <SearchIcon className='icon'/>
                        <h4>google search</h4>
                    </div>
                    <Checkbox checked={selected === "google"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "instagrame"? "#b2ebf2": "#eee"}}
                    onClick={() => {
                        setSelected("instagrame")
                    }
                    }
                >
                    <div>
                        <InstagramIcon className='icon'/>
                        <h4>Instagram</h4>
                    </div>
                    <Checkbox checked={selected === "instagrame"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "facebook"? "#b2ebf2": "#eee"}}
                    onClick={() => {
                        setSelected("facebook")
                    }
                    }
                >
                    <div>
                        <FacebookIcon className='icon'/>
                        <h4>Facebook</h4>
                    </div>
                    <Checkbox checked={selected === "facebook"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "friend"? "#b2ebf2": "#eee"}}
                    onClick={() => {
                        setSelected("friend")
                    }
                    }
                >
                    <div>
                        <Diversity3Icon className='icon'/>
                        <h4>Freind or family</h4>
                    </div>
                    <Checkbox checked={selected === "friend"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "tv"? "#b2ebf2": "#eee"}}
                    onClick={() => {
                        setSelected("tv")
                    }
                    }
                >
                    <div>
                        <LiveTvIcon className='icon'/>
                        <h4>TV/Radio Ad</h4>
                    </div>
                    <Checkbox checked={selected === "tv"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "other"? "#b2ebf2": "#eee"}}
                    onClick={() => {
                        setSelected("other")
                    }
                    }
                >
                    <div>
                        <DoNotDisturbIcon className='icon'/>
                        <h4>Other</h4>
                    </div>
                    <Checkbox checked={selected === "other"}/>
                </Stack>
                <Stack>
                    <Button 
                        variant="outlined"
                        disabled={selected === ""}
                        size="large"
                        onClick={()=> {
                            handleNextClick()
                        }}
                    >Next</Button>
                </Stack>

            </Container>
        </Container>
    </div>
  )
}

export default HeardAbout