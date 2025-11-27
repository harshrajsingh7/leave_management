import React from 'react';
import { Grid, Typography, Container, Card, CardHeader, CardContent } from '@mui/material';
import LeftNav from '../LeftNav.jsx';
import WardenGeneralApplications from './WardenGeneralApplications.jsx';
import WardenWeekendApplications from './WardenWeekendApplications.jsx';



const WardenDashboard = ({ setSelectedStudent }) => {
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
                WELCOME @Warden!&nbsp;
                <img className="hii-png" src="./goodbye.png" alt="Greeting" />
              </Typography>
            </Container>
 
            {/* Weekend Outing Applications */}
            <Card sx={{ width: '85%', mb: 3 }}>
              <CardHeader
                title="Weekend Outing Applications"
                sx={{ '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
              />
              <CardContent>
                <WardenWeekendApplications setSelectedStudent={setSelectedStudent} />
              </CardContent>
            </Card>
 
            {/* General Outing Applications */}
            <Card sx={{ width: '85%' }}>
              <CardHeader
                title="General Outing Applications"
                sx={{ '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
              />
              <CardContent>
                <WardenGeneralApplications setSelectedStudent={setSelectedStudent} />
              </CardContent>
            </Card>
          </Grid>
        </div>
      </section>
    </React.Fragment>
  );
 };
 
 export default WardenDashboard;
