import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import WeekwndOuting2 from './WeekwndOuting2';
import './StudentDashboard.css';

const NativeSelectDemo = () => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel
          variant="standard"
          htmlFor="outing-type-native"
          sx={{ color: 'white' }}
        >
          Outing Type
        </InputLabel>
        <NativeSelect
          defaultValue=""
          inputProps={{
            name: 'outingType',
            id: 'outing-type-native',
          }}
          sx={{
            color: 'white',
            '.MuiNativeSelect-icon': {
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiNativeSelect-select': {
              backgroundColor: '#101214',
            },
          }}
        >
          <option value="" style={{ backgroundColor: '#101214', color: 'white' }}>OUTING TYPE</option>
          <option value="weekend" style={{ backgroundColor: '#101214', color: 'white' }}>Weekend Outing</option>
          <option value="general" style={{ backgroundColor: '#101214', color: 'white' }}>General Outing</option>
        </NativeSelect>
      </FormControl>
    </Box>
  );
};

const StudentDashboard = () => {
  const [showWeekendOuting, setShowWeekendOuting] = useState(false);

  const handleToggleWeekendOuting = () => {
    setShowWeekendOuting((prev) => !prev);
  };

  return (
    <React.Fragment>
      <section className="dashboard-section">
        <div className="container">
          <div className="left-side">
            <img
              src="/vit_logo.jpeg"
              alt="logo"
              className="logo"
            />
            <p className="menu-item">DASHBOARD</p>
            <button className="menu-item" onClick={handleToggleWeekendOuting}>
              WEEKEND OUTING
            </button>
            <NativeSelectDemo />
            <div className="menu-item-group">
              <p className="menu-item1">SETTING</p>
              <p className="menu-item1">LOGOUT?</p>
            </div>
          </div>
          <div className="right-side">
            <p className="greeting">HI, USER XYZ</p>
            <p className="welcome-message">WELCOME BACK, STUDENTS!</p>
            {showWeekendOuting && <WeekwndOuting2 />}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default StudentDashboard;
