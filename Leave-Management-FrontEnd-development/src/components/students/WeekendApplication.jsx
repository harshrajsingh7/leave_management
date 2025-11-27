import React, { useContext, useEffect, useState, useCallback } from 'react';
import './StudentDashboard';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { Card, CardHeader, Grid, TextField, CardContent } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import { AuthContext, AxiosPost } from '../../context/AuthContext';
import LeftNav from '../LeftNav';


// const getNearestValidDates = () => {
//     const today = new Date();
//     let nextSunday = new Date(today);
//     let nextMonday = new Date(today);

//     // Calculate next Sunday
//     const dayOfWeek = today.getDay();
//     const daysUntilSunday = (7 - dayOfWeek) % 7;
//     nextSunday.setDate(today.getDate() + daysUntilSunday);

//     // Calculate next Monday
//     const daysUntilMonday = (1 - dayOfWeek + 7) % 7;
//     nextMonday.setDate(today.getDate() + daysUntilMonday);

//     return {
//         sunday: nextSunday.toISOString().split('T')[0],
//         monday: nextMonday.toISOString().split('T')[0]
//     };
// };

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

const MentorDashboard = () => {

    const { user } = useContext(AuthContext)

    const [isLoading, setIsLoading] = useState(false);

    const [slots, setslots] = useState('');

    const handleslotsChange = (event) => {
        setslots(event.target.value);
    };

    const initialFormData = {
        placeOfVisit: '',
        purposeOfVisit: ''
      };

      const [student, setStudent] = useState();

      const fetchStudent = useCallback(async () => {
        setIsLoading(true);
        try {
          const data = await AxiosPost('fetchStudent.php', { reg_no: user.reg_no })
          if (data.success) {
            setStudent(data.data)
          }
          else toast.error(data.error)
        } catch (err) {
          toast.error("Server Error!");
          console.log(err)
        }
        finally {
          setIsLoading(false);
        }
      }, [user && user.reg_no]); // Add any dependencies that fetchStudent uses

    useEffect(() => {
        if (user !== null) {
          fetchStudent()
        }
      }, [user, fetchStudent])

    const [selectedDate, setSelectedDate] = useState(null);
    const [formValues, setFormValues] = useState(initialFormData);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({
          ...prevValues,
          [name]: value
        }));
      };
    const isDateSelectable = (date) => {
        const day = date.day();
        return day === 0 || day === 1; // 0 is Sunday, 1 is Monday
    };

    const handleDateChange = (newDate) => {
        if (newDate && isDateSelectable(newDate)) {
            setSelectedDate(newDate);
        }
    };

    const maxDate = dayjs().add(4, 'week');

    const addWeekendOutingRequest = async (e) => {
        if(selectedDate === null) {
            toast.error("Date Required");
            return;
        } 
        if(slots === '') {
            toast.error("Time Slot Required");
            return;
        }
        if(formValues.placeOfVisit === '') {
            toast.error("Place of Visit Required");
            return;
        }
        if(formValues.purposeOfVisit === '') {
            toast.error("Purpose of Visit Required")
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await AxiosPost('addWeekendOutingRequest.php', { ...formValues, reg_no: user.reg_no, selectedDate: selectedDate.format('YYYY-MM-DD'), slots: slots });
            console.log(data);
            if (data.success) {
                toast.success("Request added successfully");
                setFormValues(initialFormData);
                setSelectedDate(null);
                setslots('');
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error("Server Error!");
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    console.log(selectedDate)
    
    return (
        <React.Fragment>
            <div className="dashboard-section">
                    <div className='left-sidebar'>
                        <LeftNav />
                    </div>
                <div className="main-content">

                    {student && (
                                            <Grid container fullWidth sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Card sx={{ m: 4, p: 5 }}>
                                                <CardHeader title='Weekend Outing Form' sx={{ '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
                                                />
                                                <CardContent>
                                                    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: '3rem' }} >
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                    
                                                                <TextField required id="registration-number" name="registrationNumber" label="Registration Number" variant="standard" value={student.reg_no} aria-readonly />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                    
                                                                <TextField required id="name" name="name" label="Name" variant="standard" value={student.name} aria-readonly />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                    
                                                                <TextField required id="application-number" name="applicationNumber" label="Application Number" variant="standard" value={student.application_number} aria-readonly />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                    
                                                                <TextField required id="gender" name="gender" label="Gender" variant="standard" value={student.gender} aria-readonly />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                    
                                                                <TextField required id="hostel-block" name="hostelBlock" label="Hostel Block" variant="standard" value={student.hostel_block} />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth required>
                    
                                                                <TextField required id="room-number" name="roomNumber" label="Room Number" variant="standard" value={student.room_number} aria-readonly />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                                                                {/* <InputLabel htmlFor="contact-number">Contact Number</InputLabel> */}
                                                                <TextField required id="contact-number" name="contactNumber" label="Contact Number" variant="standard" value={student.contact} aria-readonly />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>                    
                                                                <TextField required id="parent-contact-number" name="parentContactNumber" label="Parent Contact Number" variant="standard" value={student.parent_contact} aria-readonly/>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker
                                                                        label="Date of Visit"
                                                                        name="dateOfVisit"
                                                                        value={selectedDate}
                                                                        onChange={handleDateChange}
                                                                        shouldDisableDate={(date) => !isDateSelectable(date)}
                                                                        renderInput={(params) => <TextField {...params} variant="standard" fullWidth />}
                                                                        disablePast
                                                                        maxDate={maxDate}
                                                                        helperText="Only Sundays and Mondays are selectable"
                                                                    />
                                                                </LocalizationProvider>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                    
                                                        <FormControl fullWidth variant="standard">
                                                                <InputLabel id="slot-select-label">Time Slots</InputLabel>
                                                                <Select
                                                                    labelId="slot-select-label"
                                                                    id="slot-select"
                                                                    value={slots}
                                                                    onChange={handleslotsChange}
                                                                    label="Time Slots"
                                                                >
                                                                    
                                                                    <MenuItem value="slot1">09:30AM - 03:30PM</MenuItem>
                                                                    <MenuItem value="slot2">10:30AM - 04:30PM</MenuItem>
                                                                    <MenuItem value="slot3">11:30AM - 05:30PM</MenuItem>
                                                                    <MenuItem value="slot4">12:30PM - 06:30PM</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>                    
                                                                <TextField required id="place-of-visit" name="placeOfVisit" label="Place Of Visit" variant="standard" value={formValues.placeOfVisit}
                                                                    onChange={handleChange} />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                    
                                                                <TextField required id="purpose-of-visit" name="purposeOfVisit" label="Purpose Of Visit" variant="standard" value={formValues.purposeOfVisit}
                                                                    onChange={handleChange} />
                                                            </FormControl>
                                                        </Grid>
                                                                                                                
                                                    </Grid>
                                                    <div>
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                                                            <Button
                                                                variant="contained"
                                                                onClick={addWeekendOutingRequest}
                                                                sx={{ width: '50%', backgroundColor: '#000', pointerevents: 'none' }}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </Box>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                    )}

                </div>


            </div>
        </React.Fragment>
    );
};

export default MentorDashboard;
