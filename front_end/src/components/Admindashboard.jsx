import React, { useMemo, useState, useEffect } from 'react'
import '../styleComponents/adminDashbord.css';
import axios from 'axios'; // Make sure axios is installed: npm install axios

// Material UI components
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
// Icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import LanguageIcon from '@mui/icons-material/Language';
// Form & Dropdown
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
// More Icons
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LogoutIcon from '@mui/icons-material/Logout';
// Hook to redirect user to another route
import { useNavigate } from 'react-router-dom';

const pageKeys = ['rating', 'heard-about', 'form-contact'];

// Default images for each page - you can replace these with your actual default image paths
const defaultImages = {
  'rating': '/background2.jpg',
  'heard-about': '/7.jpg',
  'form-contact': '/6.jpg'
};


function Admindashboard() {

  const [type, setType] = useState('all');
  const [isLogOut, setisLogOut] = useState(false);
  const [rows, setRows] = useState([]);                   // State: holds feedback data from backend

  const [backgroundImages, setBackgroundImages] = useState({});
  const [uploadingStatus, setUploadingStatus] = useState({});
  const [uploadError, setUploadError] = useState({});

// Replace your current useEffect hooks with these:

// 1. Fetch feedbacks data (keep this one)
useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch('http://localhost:5000/api/feedbacks');
      const data = await res.json();
    
      const formatted = data.map(f => ({
        name: f.name || '',
        email: f.email ||  '',
        phone: f.phone ||  '',
        feedback: f.satisfaction ||  '',
        source: f.heardAbout ||  '',
        date: f.createdAt ? new Date(f.createdAt) : null
      }));
      setRows(formatted);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
    }
  }
  fetchData();
}, []);

// 2. Fetch existing background images with default fallback
useEffect(() => {
  const fetchExistingBackgrounds = async () => {
    const result = {};

    for (const key of pageKeys) {
      try {
        const response = await axios.get(`http://localhost:5000/api/page-backgrounds/${key}`);
        if (response.data?.image_id?.path) {
          result[key] = {
            url: `http://localhost:5000${response.data.image_id.path}`,
            isDefault: false
          };
        } else {
          // No custom image found, use default
          result[key] = {
            url: defaultImages[key],
            isDefault: true
          };
        }
      } catch (error) {
        console.log(`No background for ${key}, using default:`, error.message);
        // Use default image when no custom image exists
        result[key] = {
          url: defaultImages[key],
          isDefault: true
        };
      }
    }

    setBackgroundImages(result);
  };

  fetchExistingBackgrounds();
}, []);

  const handleChange = (event) => {
    setType(event.target.value);
  };

// Handler for image input change
const handleImageChange = async (e, pageKey) => {
  const file = e.target.files[0];
  if (!file || !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    alert("Veuillez sélectionner une image PNG, JPG ou JPEG.");
    return;
  }

  const previewUrl = URL.createObjectURL(file);
  setBackgroundImages(prev => ({ 
    ...prev, 
    [pageKey]: { url: previewUrl, isDefault: false } 
  }));
  setUploadingStatus(prev => ({ ...prev, [pageKey]: true }));
  setUploadError(prev => ({ ...prev, [pageKey]: null }));

  try {
    // Upload image file to /api/images/upload
    const form = new FormData();
    form.append('image', file);

    const { data: { image } } = await axios.post(
      'http://localhost:5000/api/images/upload',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // Now update the page background association on backend
    await axios.post('http://localhost:5000/api/page-backgrounds', {
      page_name: pageKey,
      image_id: image._id,
    });

    const finalUrl = `http://localhost:5000${image.path}`;
    const updatedImages = { 
      ...backgroundImages, 
      [pageKey]: { url: finalUrl, isDefault: false } 
    };
    setBackgroundImages(updatedImages);

    // Save to localStorage
    localStorage.setItem('pageBackgrounds', JSON.stringify(updatedImages));
  } catch (err) {
    console.error('handleImageChange error:', err);
    setUploadError(prev => ({
      ...prev,
      [pageKey]: err.response?.data?.message || err.message
    }));
    // Revert to previous state or default
    setBackgroundImages(prev => ({ 
      ...prev, 
      [pageKey]: prev[pageKey] || { url: defaultImages[pageKey], isDefault: true }
    }));
  } finally {
    URL.revokeObjectURL(previewUrl);
    setUploadingStatus(prev => ({ ...prev, [pageKey]: false }));
  }
};

// Updated delete handler function
const handleDeleteImage = async (pageKey) => {
  const currentImage = backgroundImages[pageKey];
  
  // Check if trying to delete default image
  if (!currentImage || currentImage.isDefault) {
    alert(`Ceci est l'arrière-plan par défaut. Vous ne pouvez pas supprimer l'arrière-plan par défaut.`);
    return;
  }

  if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'arrière-plan pour ${pageKey}? Cela restaurera l'arrière-plan par défaut.`)) {
    return;
  }

  setUploadingStatus(prev => ({ ...prev, [pageKey]: true }));
  setUploadError(prev => ({ ...prev, [pageKey]: null }));

  try {
    console.log('🗑️ Deleting background for:', pageKey);

    // Delete the page background association (this will also delete the image file)
    await axios.delete(`http://localhost:5000/api/page-backgrounds/${pageKey}`);

    // Set to default image
    setBackgroundImages(prev => ({
      ...prev,
      [pageKey]: { url: defaultImages[pageKey], isDefault: true }
    }));

    // Update localStorage
    const updatedImages = { ...backgroundImages };
    updatedImages[pageKey] = { url: defaultImages[pageKey], isDefault: true };
    localStorage.setItem('pageBackgrounds', JSON.stringify(updatedImages));

    console.log('✅ Background deleted successfully, default image restored');

  } catch (err) {
    console.error('❌ Delete error:', err);
    
    // Handle the case where there's no background to delete (it's already default)
    if (err.response?.status === 404 || err.message.includes('not found')) {
      alert(`Ceci est déjà l'arrière-plan par défaut pour ${pageKey}.`);
      // Update state to reflect it's default
      setBackgroundImages(prev => ({
        ...prev,
        [pageKey]: { url: defaultImages[pageKey], isDefault: true }
      }));
    } else {
      setUploadError(prev => ({
        ...prev,
        [pageKey]: err.response?.data?.message || err.message || 'Failed to delete background'
      }));
    }
  } finally {
    setUploadingStatus(prev => ({ ...prev, [pageKey]: false }));
  }
};

  function handleExportCSV() {             // Called when user clicks "Export CSV"
    const headers = ["Name", "Email", "Phone", "Feedback", "Source", "Date"];
    const csvRows = [
      headers.join(','),  // First row: header
      ...filteredFeedback.map(row =>
        [
          `"${row.name}"`,
          `"${row.email}"`,
          `"${row.phone}"`,
          `"${row.feedback}"`,
          `"${row.source}"`,
          `"${row.date}"`
        ].join(',')
      )
    ];
    
    const csvString = csvRows.join('\n');                // Join rows with newline
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });    // Create a Blob object for CSV file
    const link = document.createElement('a');           // Create a download link
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);           // Generate URL for blob
      link.setAttribute('href', url);                 // Set URL to link
      link.setAttribute('download', 'feedback.csv');         // Name the file
      link.style.visibility = 'hidden';               // Hide the link visually
      document.body.appendChild(link);                // Add link to DOM
      link.click();                                   // Click it to download
      document.body.removeChild(link);                // Remove link after download
    }
  }

const getFeedbackStyle = (feedback) => {
  if (!feedback || typeof feedback !== "string") return {};
  
  const normalized = normalize(feedback);

  switch (normalized) {
    case "j'ai adore !":
    case "tres satisfaisant":
    case "c'etait bien":
      return { backgroundColor: "#e1fceaff", color: "#166534" };
    case "neutre":
      return { backgroundColor: "#f3f4f6", color: "#374151" };
    case "decevant":
    case "horrible":
      return { backgroundColor: "#fee2e2", color: "#a61b1b" };
    default:
      return {};
  }
};
// j'ai adore has ' so we need to normalize it
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[’'"]/g, "'")          // Normalize quotes
    .replace(/[^a-z0-9 '!]/gi, '')   // Clean special characters
    .trim();
}


const filteredFeedback = useMemo(() => {
  if (type === "all") return rows;

  const normalizedType = normalize(type);
  return rows.filter(data => normalize(data.feedback) === normalizedType);
}, [type, rows]);

  const totalFeedback = useMemo(() => rows.length, [rows]);   // Total number of feedback

  const { positive, negative } = useMemo(() => {
    const negativeFeedbacks = ["Neutre", "Décevant", "Horrible"];
    
    let pos = 0;
    let neg = 0;

    rows.forEach(row => {
      
      if (negativeFeedbacks.includes(row.feedback)) {
        neg++;
      } else if (row.feedback) {   
        pos++;
      }
    });

    return { positive: pos, negative: neg };
  }, [rows]);

  const uniqueSources = useMemo(() => {
    const sourceSet = new Set(rows.map(r => r.source).filter(Boolean));
    return sourceSet.size;  // Return number of unique values
  }, [rows]);

  const navigate = useNavigate();

  function handleLogOut() {
    navigate("/")
  }

  return (
    <div className='holder'>
      <Container maxWidth="lg" className='dashboard-header'>
        <h2>Tableau de bord des avis clients</h2>
        <Stack style={{ backgroundColor: isLogOut ? "#e5e7eb" : null }} spacing={2} className='stack-admin' direction="row"
          onClick={() => {
            setisLogOut(!isLogOut)
          }}
        >
          <AccountCircleIcon className='admin-icon' />
          <h3>Admin</h3>
          {/* Arrow icon changes based on dropdown state */}
          {isLogOut ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          {isLogOut &&
            <div className='log-out'>
              <div onClick={handleLogOut}>
                <LogoutIcon /> Log Out
              </div>
            </div>
          }
        </Stack>
      </Container>
      <Container maxWidth="lg" className='cardholder'>
        <div className='welcome'>
          <h1>Bienvenue, Admin! 👋</h1>
          <p>Découvrez les retours de vos clients.</p>
        </div>
        <div className='cards'>
          <div className='card'>
            <div>
              <h4>Total des avis</h4>
              <span>{totalFeedback}</span>
            </div>
            <ChatBubbleOutlineIcon className='icon' />
          </div>
          <div className='card'>
            <div>
              <h4>Positive</h4>
              <span>{positive}</span>
            </div>
            <ThumbUpOffAltIcon className='icon' />
          </div>
          <div className='card'>
            <div>
              <h4>Negative</h4>
              <span>{negative}</span>
            </div>
            <ThumbDownOffAltIcon className='icon' />
          </div>
          <div className='card'>
            <div>
              <h4>Sources</h4>
              <span>{uniqueSources}</span>
            </div>
            <LanguageIcon className='icon' />
          </div>
        </div>
      </Container>
      <Container maxWidth="lg" className='customers'>
        <div>
          <h2>Feedback client</h2>
          <div> {/* Dropdown to filter feedback types */}
            <FormControl className='formControll' sx={{ m: 1, minWidth: 160 }}>
              <InputLabel id="demo-simple-select-label">
                <FilterAltIcon sx={{ mr: 1 }} />
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="type"
                onChange={handleChange} // Updates selected filter
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="J'ai adoré !">J'ai adoré !</MenuItem>
                <MenuItem value="Très satisfaisant">Très satisfaisant</MenuItem>
                <MenuItem value="C'était bien">C'était bien</MenuItem>
                <MenuItem value="Neutre">Neutre</MenuItem>
                <MenuItem value="Décevant">Décevant</MenuItem>
                <MenuItem value="Horrible">Horrible</MenuItem>
              </Select>
            </FormControl>

            {/* Button triggers CSV export */}
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCSV}>
              Export CSV
            </Button>
          </div>
        </div>

        {/* Feedback Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Téléphone</TableCell>
                <TableCell align="left">Avis</TableCell>
                <TableCell align="left">Source</TableCell>
                <TableCell align="left">Date</TableCell>
              </TableRow>

            </TableHead>
            <TableBody>
              {/* Loop through filtered feedback and show each as a row */}
              {filteredFeedback.map((row, i) => (
                <TableRow
                  className='table-row'
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.phone}</TableCell>
                  <TableCell align="left" className='feedback'>
                    <span style={getFeedbackStyle(row.feedback)}> {/* colors for background */}
                      {row.feedback}
                    </span>
                  </TableCell>
                  <TableCell align="left">{row.source}</TableCell> 

                  {/* Show date + time if available */}
                  <TableCell align="left">
                    {row.date ? (
                      <>
                        <div>{row.date.toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {row.date.toLocaleTimeString()}
                        </div>
                      </>
                    ) : ''}
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Container maxWidth="lg" className="background-upload-container">
        <h2>Changement de fond d'écran</h2>
        <p>Importez une image pour chaque page (PNG, JPG, JPEG) :</p>

        <div className="background-upload-grid">
          {pageKeys.map((pageKey) => {
            const currentImage = backgroundImages[pageKey];
            return (
              <div key={pageKey} className="background-upload-item">
                <h4 style={{ textTransform: 'capitalize' }}>{pageKey.replace('-', ' ')}</h4>
                <div className="input-row">
                  <input
                    type="file"
                    id={`file-input-${pageKey}`}
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleImageChange(e, pageKey)}
                    disabled={uploadingStatus[pageKey]} // Disable input during upload
                  />
                  <label htmlFor={`file-input-${pageKey}`} className="file-input-label">
                    {uploadingStatus[pageKey] ? 'Uploading...' : 'Choisir fichier'}
                  </label>

                  {currentImage && (
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteImage(pageKey)}
                      aria-label={`Supprimer l'image de ${pageKey}`}
                      disabled={uploadingStatus[pageKey]}
                      style={{
                        opacity: currentImage.isDefault ? 0.5 : 1,
                        cursor: currentImage.isDefault ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {uploadingStatus[pageKey] ? 'Deleting...' : 'Supprimer'}
                    </button>
                  )}
                </div>

                {uploadError[pageKey] && <p style={{ color: 'red' }}>{uploadError[pageKey]}</p>}

                {currentImage ? (
                  <div className="image-container">
                    <img
                      src={currentImage.url}
                      alt={`Preview pour ${pageKey}`}
                      className="background-preview"
                    />
                    {currentImage.isDefault && (
                      <div className="default-image-label">
                        <span>Ceci est l'image par défaut</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="placeholder">Aucune image sélectionnée</div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  )
}

export default Admindashboard;