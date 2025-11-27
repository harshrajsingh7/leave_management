import React, { useContext, useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Dialog, DialogContent, DialogActions, Avatar, Badge, Box, Button, Grid, Icon, IconButton, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext, AxiosPost } from '../../context/AuthContext';
import toast from 'react-hot-toast';

import { ClipLoader } from 'react-spinners';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  
}))

// Sample data


const getRowId = (row) => {
    return row.id;
}

// CustomersTable Component
const WardenApplications = () => {
  const columns = [
    {
        flex: 0.2,
        minWidth: 230,
        field: 'name',
        headerName: 'Name',
        renderCell: ({ row }) => {
            // console.log(row);
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Badge overlap='circular'>
                        <Avatar alt='John Doe' src={'https://ui-avatars.com/api/?name=' + row.name + '&background=random'} sx={{ width: '2.5rem', height: '2.5rem', mr: 2 }} />
                    </Badge>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <LinkStyled href="#">{row.name}</LinkStyled>
                        {/* <Typography noWrap variant='caption'>
                            {`${row.site_location}`}
                        </Typography> */}
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.2,
        minWidth: 150,
        field: 'reg_no',
        headerName: 'Reg No',
        renderCell: ({ row }) => {
            return (
                <Typography noWrap variant='body2'>
                    {row.reg_no}
                </Typography>
            )
        }
    },
    {
        flex: 0.15,
        field: 'date',
        minWidth: 150,
        headerName: 'Date',
        renderCell: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
                    {/* <Icon icon={siteTypeObj[row.site_type].icon} fontSize={20} /> */}
                    <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                        {row.date}
                    </Typography>
                </Box>
            )
        }
    },
    {
        flex: 0.1,
        minWidth: 110,
        field: 'time_slot',
        headerName: 'Time Slot',
        renderCell: ({ row }) => {
            return (
                <Typography noWrap variant='body2'>
                    {row.time_slot}
                </Typography>
            )
        }
    },
    {
        flex: 0.1,
        minWidth: 150,
        field: 'status',
        headerName: 'Status',
        renderCell: ({ row }) => {
            if(row.status === 'MApproved') {
                return (
                    <Typography noWrap variant='body2'>
                        Approved by Mentor
                    </Typography>
                )
            }
            
        }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (row) => (
        <Grid container spacing={1}>
          <Grid item>
            <IconButton
              color="success"
              onClick={() => handleAction('right', row)}
            >
              <CheckIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color="error"
              onClick={() => handleAction('wrong', row)}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      )
    }
  ]
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [secondDialogOpen, setSecondDialogOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [selectedRecord, setSelectedRecord] = useState();

    const [weekendApplicationsWarden, setWeekendApplicationsWarden] = useState();
    const { user } = useContext(AuthContext);

    const fetchWeekendApplicationsWarden = async () => {
      setIsLoading(true);
      try {
          const data = await AxiosPost('fetchWeekendApplicationsWarden.php', { warden_id : user.reg_no })
          // console.log(data)
          if (data.success) {
              setWeekendApplicationsWarden(data.weekend_applications)
          }
          else toast.error(data.error)
      } catch (err) {
          toast.error("Server Error!");
          console.log(err)
      }
      finally {
          setIsLoading(false);
      }
  }

  // console.log(selectedRecord)

    const handleOutingAccepted = async () => {
      try {
        const data = await AxiosPost('acceptedByWarden.php', { id: selectedRecord.id })
        // console.log(data)
        if (data.success) {
          await fetchWeekendApplicationsWarden();
          toast.success("Weekend Outing Accepted");
        }
        else toast.error(data.error)
      } catch (err) {
        toast.error("Server Error!");
        console.log(err)
      }
      finally {
        setIsLoading(false);
      }
    }

    // Action handler
    const handleAction = (actionType, row) => {
      if (actionType === 'right') {
        // console.log(row.row.reg_no)
        setSelectedRecord(row.row); // Set reg_no based on row data
        setDialogOpen(true);
      } else {
        // Handle the 'wrong' action
      }
    };

    const handleClose = () => {
      setDialogOpen(false);
    };
  
    const handleConfirmation = (action) => {
      if (action === 'cancel') {
        // setSecondDialogOpen(true);
        // setUserInput('no');
        
      setDialogOpen(false);
      } else if (action === 'accept') {
        // Call your suspendUser or other function here
        // setSecondDialogOpen(true);
        // setUserInput('yes');
        handleOutingAccepted();
      }
      setDialogOpen(false);
    };
  
    const handleSecondDialogClose = () => {
      setSecondDialogOpen(false);
    };

    
  useEffect(() => { 
    // console.log("useEffect is running")
    fetchWeekendApplicationsWarden() 
  }, [])
  

  if(!weekendApplicationsWarden) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
        <ClipLoader
          color={'#36D7B7'}
          loading={true}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
  } else {
    return (
      <>
      <DataGrid
        rows={weekendApplicationsWarden}
        autoHeight
        columns={columns}
        loading={isLoading}
        getRowId={getRowId}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slots={{ toolbar: GridToolbar }}
        sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0, width: '100%' } }}
      />

<Dialog
        fullWidth
        open={dialogOpen}
        onClose={handleClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(13)} !important`],
            pt: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 8, color: 'warning.main' }
            }}
          >
            <Icon icon='mdi:alert-circle-outline' fontSize='3.5rem' />
            <Typography variant='h5' sx={{ mb: 5, color: 'text.secondary' }}>
              Do you want to accept the outing for: {selectedRecord && selectedRecord.reg_no}?
            </Typography> 
            <Box sx={{ mb: 3 }}>              
              <Typography variant='h6'>Details</Typography>
              <Typography>Date: {selectedRecord && selectedRecord.date}</Typography>
              <Typography>Location: {selectedRecord && selectedRecord.place_of_visit}</Typography>              
              <Typography>Time Slot: {selectedRecord && selectedRecord.time_slot}</Typography>
            </Box>
            <Typography sx={{ color: 'red' }}>You won't be able to revert this action!</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('accept')}>
            Accept
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Second Dialog */}
      <Dialog
        fullWidth
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon
              fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput === 'yes' ? 'Accepted!' : 'Cancelled'}
            </Typography>
            <Typography>{userInput === 'yes' ? 'Outing has been accepted.' : 'Cancelled Outing :)'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      </>
  );
  }
  
};

export default WardenApplications;
