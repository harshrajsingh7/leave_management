import { Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';


const Navigation = () => {
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
            defaultValue=""
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

      return (
        <div className="left-side">
          <img src={`${process.env.PUBLIC_URL}/vit_logo.jpeg`} alt='logo' className='logo-img'></img>
            <p className="menu-item">DASHBOARD</p>
            <NativeSelectDemo />
            <div className="menu-item-group">
              <p className="menu-item1">SETTING</p>
              <p className="menu-item1">LOGOUT?</p>
            </div>
          </div>
      )
}

export default Navigation;