import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { MenuItem, Card, CardHeader, CardContent } from '@mui/material';
import { Grid, Typography, Container } from '@mui/material';
import StudentApplication from './GeneralAppliedApplications.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import LeftNav from '../LeftNav.jsx';
import WeekendAppliedApplications from './WeekendAppliedApplications.jsx';

const NativeSelectDemo = () => {
  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel
          id="demo-simple-select-standard-label"
          sx={{ color: '#fff' }}
        >
          Outing Type
        </InputLabel>
        <Select
          defaultValue=""
          id= "demo-simple-select-standard"
          labelId="demo-simple-select-standard-label"
          inputProps={{
            name: 'outingType',
          }}
          sx={{ color:"#fff", backgroundColor:'#101214' }}
        >
          <MenuItem value="weekend" style={{ backgroundColor: '#101214', color: 'white' }}>Weekend Outing</MenuItem>
          <MenuItem value="general" style={{ backgroundColor: '#101214', color: 'white' }}>General Outing</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

const StudentDashboard = () => {
  const { logoutUser, user } = useContext(AuthContext);

  if (!user) {
    return <Typography variant="h5" sx={{ color: '#fff', textAlign: 'center', marginTop: '20%' }}>Loading...</Typography>;
  }

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
                WELCOME @{user.Name}!&nbsp;
                <img className="hii-png" src="./goodbye.png" alt="Hi" />
              </Typography>
            </Container>
            <Card sx={{ width: '90%' }}>
              <CardHeader 
                title='General Outing Applications' 
                sx={{ '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} 
              />
              <CardContent>
                <StudentApplication />
              </CardContent>
            </Card>
            <Card sx={{ width: '90%' }}>
              <CardHeader 
                title='Weekend Outing Applications' 
                sx={{ '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} 
              />
              <CardContent>
                <WeekendAppliedApplications />
              </CardContent>
            </Card>
          </Grid>
        </div>
      </section>
    </React.Fragment>
  );
};

export default StudentDashboard;