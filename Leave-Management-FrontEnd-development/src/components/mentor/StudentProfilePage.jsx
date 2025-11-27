import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import LeftNav from "../LeftNav";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import toast from "react-hot-toast";

import { Link } from "react-router-dom";
import styled from "styled-components";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext, AxiosPost } from "../../context/AuthContext";
import { ClipLoader } from "react-spinners";
import StudentViewLeft from "./StudentViewLeft";

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  textDecoration: "none",
}));

const getRowId = (row) => {
  return row.id;
};

// const handleAction = (actionType, row) => {
//     if (actionType === 'right') {
//         // console.log(row.row.reg_no)
//         setSelectedRecord(row.row);
//         setDialogOpen(true);
//     } else {
//         // Handle the 'wrong' action
//     }
// };

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: "name",
    headerName: "Name",
    renderCell: ({ row }) => {
      // console.log(row);
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Badge overlap="circular">
            <Avatar
              alt="John Doe"
              src={
                "https://ui-avatars.com/api/?name=" +
                row.name +
                "&background=random"
              }
              sx={{ width: "2.5rem", height: "2.5rem", mr: 2 }}
            />
          </Badge>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            {/* <LinkStyled href="#" onClick={((e) => { setSelectedStudent(row.reg_no); })}>{row.name}</LinkStyled> */}
            {/* <Typography noWrap variant='caption'>
                            {`${row.site_location}`}
                        </Typography> */}
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: "reg_no",
    headerName: "Reg No",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.reg_no}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "date",
    minWidth: 150,
    headerName: "Date",
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center", "& svg": { mr: 3 } }}>
          {/* <Icon icon={siteTypeObj[row.site_type].icon} fontSize={20} /> */}
          <Typography
            noWrap
            sx={{ color: "text.secondary", textTransform: "capitalize" }}
          >
            {row.date}
          </Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "time_slot",
    headerName: "Time Slot",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.time_slot}
        </Typography>
      );
    },
  },
  // {
  //     field: 'actions',
  //     headerName: 'Actions',
  //     width: 150,
  //     renderCell: (row) => (
  //         <Grid container spacing={1}>
  //             <Grid item>
  //                 <IconButton
  //                     color="success"
  //                     onClick={() => handleAction('right', row)}
  //                 >
  //                     <CheckIcon />
  //                 </IconButton>
  //             </Grid>
  //             <Grid item>
  //                 <IconButton
  //                     color="error"
  //                     onClick={() => handleAction('wrong', row)}
  //                 >
  //                     <CloseIcon />
  //                 </IconButton>
  //             </Grid>
  //         </Grid>
  //     )
  // }
];

const StudentProfilePage = ({ selectedStudent, setSelectedStudent }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [weekendApplicationsStudent, setWeekendApplicationsStudent] = useState();
  const [generalApplicationsStudent, setGeneralApplicationsStudent] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeekendOutingStudent = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await AxiosPost("fetchWeekendOutingStudent.php", {
        reg_no: selectedStudent,
      });
      if (data.success) {
        setWeekendApplicationsStudent(data.weekend_applications);
      } else toast.error(data.error);
    } catch (err) {
      toast.error("Server Error!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudent]); // Add any dependencies that fetchStudent uses

  useEffect(() => {
    if (selectedStudent) {
      fetchWeekendOutingStudent();
    }
  }, [fetchWeekendOutingStudent, selectedStudent]);

  
  const fetchGeneralOutingStudent = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await AxiosPost("fetchGeneralOutingStudent.php", {
        reg_no: selectedStudent,
      });
      if (data.success) {
        setGeneralApplicationsStudent(data.general_applications);
      } else toast.error(data.error);
    } catch (err) {
      toast.error("Server Error!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudent]); // Add any dependencies that fetchStudent uses

  useEffect(() => {
    if (selectedStudent) {
      fetchGeneralOutingStudent();
    }
  }, [fetchGeneralOutingStudent, selectedStudent]);

  if (!weekendApplicationsStudent || !generalApplicationsStudent) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <ClipLoader
          color={"#36D7B7"}
          loading={true}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  } else {
    return (
      <>
        <section className="dashboard-section">
          <div className="left-sidebar">
            <LeftNav />
          </div>
          <div className="main-content">
            <Grid container spacing={6}>
              <Grid item xs={12} md={5} lg={4}>
                <StudentViewLeft
                  setSelectedStudent={setSelectedStudent}
                  selectedStudent={selectedStudent}
                />
              </Grid>
              <Grid item xs={12} md={7} lg={8}>
                {!isLoading && (
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "80%",
                    }}
                  >
                    <Container sx={{ mt: 4, mb: 4, ml: 8 }}></Container>
                    <Card sx={{ width: "100%" }}>
                      <CardHeader
                        title="Weekend Outing Applications"
                        sx={{
                          "& .MuiCardHeader-title": { letterSpacing: ".15px" },
                        }}
                      />
                      <CardContent>
                        <DataGrid
                          rows={weekendApplicationsStudent}
                          autoHeight
                          columns={columns}
                          loading={isLoading}
                          getRowId={getRowId}
                          pageSizeOptions={[10, 25, 50]}
                          paginationModel={paginationModel}
                          onPaginationModelChange={setPaginationModel}
                          slots={{ toolbar: GridToolbar }}
                          sx={{
                            "& .MuiDataGrid-columnHeaders": {
                              borderRadius: 0,
                              width: "100%",
                            },
                          }}
                        />
                      </CardContent>
                    </Card>

                    <Card sx={{ width: "100%", mt: "2rem" }}>
                      <CardHeader
                        title="General Outing Applications"
                        sx={{
                          "& .MuiCardHeader-title": { letterSpacing: ".15px" },
                        }}
                      />
                      <CardContent>
                        <DataGrid
                          rows={generalApplicationsStudent}
                          autoHeight
                          columns={columns}
                          loading={isLoading}
                          getRowId={getRowId}
                          pageSizeOptions={[10, 25, 50]}
                          paginationModel={paginationModel}
                          onPaginationModelChange={setPaginationModel}
                          slots={{ toolbar: GridToolbar }}
                          sx={{
                            "& .MuiDataGrid-columnHeaders": {
                              borderRadius: 0,
                              width: "100%",
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </div>
        </section>
      </>
    );
  }
};

export default StudentProfilePage;
