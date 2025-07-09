import React from 'react'
import '../styleComponents/adminDashbord.css';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import LanguageIcon from '@mui/icons-material/Language';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import DownloadIcon from '@mui/icons-material/Download';

function createData(name, email, phone, feedback, source, date) {
    return { name, email, phone, feedback, source, date };
}
  
const rows = [
    createData(
      'Youssef Benali',
      'youssef.benali@gmail.com',
      '+212 661-923456',
      'liked',
      'Facebook',
      '2025-07-06'
    ),
    createData(
      'Fatima Zahra El Idrissi',
      'fatima.elidrissi@outlook.com',
      '+212 662-874521',
      'not liked',
      'Instagram',
      '2025-07-07'
    ),
    createData(
      'Omar El Haddad',
      'omar.haddad@domain.ma',
      '+212 663-784512',
      'liked',
      'Google Ads',
      '2025-07-08'
    ),
    createData(
      'Imane Bensalem',
      'imane.bensalem@yahoo.fr',
      '+212 664-897532',
      'not liked',
      'Website',
      '2025-07-09'
    ),
    createData(
      'Anas Amrani',
      'anas.amrani@gmail.com',
      '+212 665-345987',
      'liked',
      'TikTok',
      '2025-07-10'
    )
  ];
  

function Admindashboard() {

  const [type, setType] = React.useState('all');

  const handleChange = (event) => {
    setType(event.target.value);
  };

  return (
    <div className='holder'>
        <Container maxWidth="lg" className='dashboard-header'>
            <h2>Customer Feedback Dashboard</h2>
            <Stack spacing={2} className='stack' direction="row">
                <AccountCircleIcon className='admin-icon'/>
                <h3>Admin</h3>
            </Stack>
        </Container>
        <Container maxWidth="lg" className='cardholder'>
            <div className='welcome'>
                <h1>Welcome back, Admin! 👋</h1>
                <p>Here's what's happening with your customer feedback today.</p>
            </div>
            <div className='cards'>
                {/*  */}
                <div className='card'>
                    <div>
                        <h4>Total Feedback</h4>
                        <span>1,234</span>
                    </div>
                    <ChatBubbleOutlineIcon className='icon'/>
                </div>
                {/*  */}
                <div className='card'>
                    <div>
                        <h4>Positive</h4>
                        <span>1,234</span>
                    </div>
                    <ThumbUpOffAltIcon className='icon'/>
                </div>
                {/*  */}
                <div className='card'>
                    <div>
                        <h4>Negative</h4>
                        <span>1,234</span>
                    </div>
                    <ThumbDownOffAltIcon className='icon'/>
                </div>
                {/*  */}
                <div className='card'>
                    <div>
                        <h4>Sources</h4>
                        <span>1,234</span>
                    </div>
                    <LanguageIcon className='icon'/>
                </div>
            </div>
        </Container>
        <Container maxWidth="lg" className='customers'
        >
            <div>
                <h2>Customer Feedback</h2>
                <div>
                <FormControl className='formControll' sx={{ m: 1, minWidth: 160}}>
                    <InputLabel id="demo-simple-select-label">
                        <FilterAltIcon sx={{ mr: 1 }} />
                    </InputLabel>
                    
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="type"
                        onChange={handleChange}
                    >
                        <MenuItem value="all">all</MenuItem>
                        <MenuItem value="liked">liked</MenuItem>
                        <MenuItem value="not liked">not liked</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                    Export CSV
                </Button>
                </div>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>name</TableCell>
                            <TableCell align="left">email</TableCell>
                            <TableCell align="left">phone</TableCell>
                            <TableCell align="left">feedback</TableCell>
                            <TableCell align="left">source</TableCell>
                            <TableCell align="left">date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        className='table-row'
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">{row.name}</TableCell>
                            <TableCell align="left">{row.email}</TableCell>
                            <TableCell align="left">{row.phone}</TableCell>
                            <TableCell align="left">{row.feedback}</TableCell>
                            <TableCell align="left">{row.source}</TableCell>
                            <TableCell align="left">{row.date}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </div>
  )
}

export default Admindashboard