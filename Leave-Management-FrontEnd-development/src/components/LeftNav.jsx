import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion'; // You'll need to install framer-motion for animations

const NativeSelectDemo = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [outingType, setOutingType] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const handleChange = (event) => {
        setOutingType(event.target.value);
    };

    const onClickApply = () => {
        if(outingType === '') {
            return;
        } else if(outingType === 'general') {
            navigate('/GeneralApplication');
        } else if(outingType === 'urgent') {
            navigate('/UrgentApplication');
        } else {
            navigate('/WeekendApplication');
        }
    }
  
    return (
        <>
        {user && user.privilege === 'student' && (
            <Box sx={{ minWidth: 150, width: '100%' }}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel
                        id="demo-simple-select-standard-label"
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            '&.Mui-focused': {
                                color: '#fff'
                            },
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            letterSpacing: '0.5px'
                        }}
                    >
                      Outing Type
                    </InputLabel>
                    <Select
                        value={outingType}
                        onChange={handleChange}
                        id="demo-simple-select-standard"
                        labelId="demo-simple-select-standard-label"
                        inputProps={{
                          name: 'outingType',
                        }}
                        sx={{ 
                          color: "rgba(255, 255, 255, 0.9)",
                          '&:before': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&:after': {
                            borderColor: 'rgba(255, 255, 255, 0.9)',
                          },
                          '&:hover:not(.Mui-disabled):before': {
                            borderColor: 'rgba(255, 255, 255, 0.7)',
                          },
                          '& .MuiSvgIcon-root': {
                            color: 'rgba(255, 255, 255, 0.9)',
                            transition: 'transform 0.2s ease',
                            transform: isHovered ? 'translateY(2px)' : 'none'
                          },
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <MenuItem value="weekend" sx={{ 
                            color: '#101214',
                            fontWeight: 400,
                            fontSize: '0.9rem',
                            padding: '10px 16px',
                            borderRadius: '4px',
                            margin: '2px 0',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.05)'
                            }
                        }}>Weekend Outing</MenuItem>
                        <MenuItem value="general" sx={{ 
                            color: '#101214',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            padding: '10px 16px',
                            borderRadius: '4px',
                            margin: '2px 0',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.05)'
                            }
                        }}>General Outing</MenuItem>
                        <MenuItem value="urgent" sx={{ 
                            color: '#101214',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            padding: '10px 16px',
                            borderRadius: '4px',
                            margin: '2px 0',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.05)'
                            }
                        }}>Urgent General Outing</MenuItem>
                    </Select>
                  
                    <Grid container justifyContent="center" sx={{ mt: 3 }}>
                        <motion.button 
                          className='nav-buttons'
                            style={{ 
                                width:'85%', 
                                fontSize: '1.2rem',
                                padding: '10px 0',
                                letterSpacing: '0.5px'
                            }} 
                            onClick={onClickApply}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Apply
                        </motion.button>
                    </Grid>
                </FormControl>
            </Box>
        )}
        </>
    );
};

const LeftNav = () => {
    const { logoutUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        
        return () => clearTimeout(timer);
    }, []);
      
    // Skeleton loading UI
    if (loading) {
        return (
            <div className="left-side">
                <div className="skeleton skeleton-logo"></div>
                <div className="skeleton skeleton-menu-item"></div>
                <div className="skeleton skeleton-select"></div>
                <div className="skeleton skeleton-button"></div>
                <div className="menu-item-group">
                    <div className="skeleton skeleton-menu-item"></div>
                    <div className="skeleton skeleton-button"></div>
                </div>
            </div>
        );
    }
    
    return (
        <motion.div 
            className="left-side"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.img 
                src={`${process.env.PUBLIC_URL}/vit_logo.jpeg`} 
                alt='logo' 
                className='logo-img'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            />
            
            <motion.p 
                className="menu-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                DASHBOARD
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ width: '100%' }}
            >
                <NativeSelectDemo />
            </motion.div>
            
            <motion.div 
                className="menu-item-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ width: '100%' }}
            >
                <p className="menu-item1">SETTINGS</p>
                <motion.button 
                    className='nav-buttons'
                    style={{ 
                        width:'75%', 
                        fontSize: '1.2rem', 
                        padding: '10px 16px',
                        letterSpacing: '0.5px'
                    }} 
                    onClick={logoutUser}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    LOGOUT
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default LeftNav;