import React, { useState, useContext } from 'react'
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
        case "instagram":
            heardAboutusFrom = "Instagram";
            break;
        case "facebook":
            heardAboutusFrom = "Facebook";
            break;
        case "freind":
            heardAboutusFrom = "Freind or Family";
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
    <div className='pagewraper1'>
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
                    style={{backgroundColor: selected === "google"? "rgb(250, 129, 49)": "rgba(250, 235, 225, 0.58)"}}
                    onClick={() => {
                        setSelected("google")
                    }
                    }
                >
                    <div>
                        <SearchIcon className='icon'/>
                        <h4>google search</h4>
                    </div>
                    <Checkbox  className="checkbox" checked={selected === "google"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "instagram"? "rgb(250, 129, 49)": "rgba(250, 235, 225, 0.58)"}}
                    onClick={() => {
                        setSelected("instagram")
                    }
                    }
                >
                    <div>
                        <InstagramIcon className='icon'/>
                        <h4>Instagram</h4>
                    </div>
                    <Checkbox className="checkbox" checked={selected === "instagram"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "facebook"? "rgb(250, 129, 49)": "rgba(250, 235, 225, 0.58)"}}
                    onClick={() => {
                        setSelected("facebook")
                    }
                    }
                >
                    <div>
                        <FacebookIcon className='icon'/>
                        <h4>Facebook</h4>
                    </div>
                    <Checkbox className="checkbox" checked={selected === "facebook"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "freind"? "rgb(250, 129, 49)": "rgba(250, 235, 225, 0.58)"}}
                    onClick={() => {
                        setSelected("freind")
                    }
                    }
                >
                    <div>
                        <Diversity3Icon className='icon'/>
                        <h4>Freind or family</h4>
                    </div>
                    <Checkbox className="checkbox" checked={selected === "freind"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "tv"? "rgb(250, 129, 49)": "rgba(250, 235, 225, 0.58)"}}
                    onClick={() => {
                        setSelected("tv")
                    }
                    }
                >
                    <div>
                        <LiveTvIcon className='icon'/>
                        <h4>TV/Radio Ad</h4>
                    </div>
                    <Checkbox className="checkbox" checked={selected === "tv"}/>
                </Stack>
                <Stack className='card' direction="row" spacing={2}
                    style={{backgroundColor: selected === "other"? "rgb(250, 129, 49)": "rgba(250, 235, 225, 0.58)"}}
                    onClick={() => {
                        setSelected("other")
                    }
                    }
                >
                    <div>
                        <DoNotDisturbIcon className='icon'/>
                        <h4>Other</h4>
                    </div>
                    <Checkbox className="checkbox" checked={selected === "other"}/>
                </Stack>
                <Stack>
                    <Button
                    sx={{
                        border: '2px solid orange',
                        color: 'white',
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        backgroundColor: selected !== "" ? 'rgba(240, 115, 32, 0.58)' : 'rgba(250, 235, 225, 0.58)',
                        boxShadow: selected !== "" ? '0 0 10px rgba(43, 35, 31, 0.62)' : 'none',
                        '&:hover': {
                        borderColor: 'white',
                        backgroundColor: selected !== "" ? 'rgba(240, 115, 32, 0.75)' : 'rgba(250, 235, 225, 0.7)',
                        },
                    }}
                    variant="outlined"
                    disabled={selected === ""}
                    size="large"
                    onClick={handleNextClick}
                    >
                    Next
                    </Button>

                </Stack>

            </Container>
        </Container>
    </div>
    </div>
  )
}

export default HeardAbout