import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Grid, Typography, Container, Card, CardHeader, CardContent } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import MentorWeekendApplications from './MentorWeekendApplications.jsx';
import MentorGeneralApplications from './MentorGeneralApplications.jsx';
import LeftNav from '../LeftNav.jsx';


const NativeSelectDemo = () => {
  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel
          id="demo-simple-select-standard-label"
          sx={{
            color: '#fff',  // This sets the default color to white
            '&.Mui-focused': {
              color: '#fff'  // This keeps the color white when focused
            }
          }}
        >
          Outing Type
        </InputLabel>
        <Select
          defaultValue=""
          id="demo-simple-select-standard"
          labelId="demo-simple-select-standard-label"
          inputProps={{
            name: 'outingType',
          }}
          sx={{
            color: "#fff",
            // backgroundColor: '#101214',
            '&:before': {
              borderColor: '#fff',
            },
            '&:after': {
              borderColor: '#fff',
            },
            '&:hover:not(.Mui-disabled):before': {
              borderColor: '#fff',
            },
            '& .MuiSvgIcon-root': {
              color: '#fff',
            },
          }}
        >
          <MenuItem value="weekend" style={{ color: '#101214' }}>Weekend Outing</MenuItem>
          <MenuItem value="general" style={{ color: '#101214' }}>General Outing</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

const MentorDashboard = ({ setSelectedStudent }) => {
  return (
    <React.Fragment>
      <section className="dashboard-section">
        <div className="left-sidebar">
          <LeftNav />
        </div>
        <div className="main-content">
          <Grid sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '100%' 
          }}>
            <Container sx={{ mt: 4, mb: 4, ml: 8 }}>
              <Typography 
                variant="h3" 
                component="h4" 
                sx={{ color: '#2148c0' }} 
                className="welcome-message"
              >
                WELCOME @Mentor!&nbsp;
                <img className="hii-png" src="./goodbye.png" />
              </Typography>
            </Container>
            <Card sx={{ width: '80%' }}>
              <CardHeader 
                title='Weekend Outing Applications' 
                sx={{ '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
              />
              <CardContent>
                <MentorWeekendApplications setSelectedStudent={setSelectedStudent} />
              </CardContent>
            </Card>

            <Card sx={{ width: '80%', mt: '2rem' }}>
              <CardHeader 
                title='General Outing Applications' 
                sx={{ '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
              />
              <CardContent>
                <MentorGeneralApplications setSelectedStudent={setSelectedStudent} />
              </CardContent>
            </Card>
          </Grid>
        </div>
      </section>
    </React.Fragment>
  );
};

export default MentorDashboard;
