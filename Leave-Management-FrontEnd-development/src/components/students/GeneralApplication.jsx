import React, { useState, useEffect, useContext, useCallback } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { Card, CardHeader, Grid, TextField, CardContent } from "@mui/material";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import { AuthContext, AxiosPost } from "../../context/AuthContext";
import LeftNav from "../LeftNav";

import dayjs from "dayjs";

import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const NativeSelectDemo = () => {
  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel
          id="demo-simple-select-standard-label"
          sx={{
            color: "#fff", // This sets the default color to white
            "&.Mui-focused": {
              color: "#fff", // This keeps the color white when focused
            },
          }}
        >
          Outing Type
        </InputLabel>
        <Select
          defaultValue=""
          id="demo-simple-select-standard"
          labelId="demo-simple-select-standard-label"
          inputProps={{
            name: "outingType",
          }}
          sx={{
            color: "#fff",
            "&:before": {
              borderColor: "#fff",
            },
            "&:after": {
              borderColor: "#fff",
            },
            "&:hover:not(.Mui-disabled):before": {
              borderColor: "#fff",
            },
            "& .MuiSvgIcon-root": {
              color: "#fff",
            },
          }}
        >
          <MenuItem value="weekend" style={{ color: "#101214" }}>
            Weekend Outing
          </MenuItem>
          <MenuItem value="general" style={{ color: "#101214" }}>
            General Outing
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

const MentorDashboard = () => {
  const initialFormData = {
    registrationNumber: "",
    name: "",
    applicationNumber: "",
    gender: "",
    hostelBlock: "",
    roomNumber: "",
    placeOfVisit: "",
    purposeOfVisit: "",
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: "",
    contactNumber: "",
    parentContactNumber: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [date, setDate] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextDay = tomorrow.toISOString().split("T")[0]; // Keeping original format
  
  const nowPlus24Hours = new Date();
  nowPlus24Hours.setHours(nowPlus24Hours.getHours() + 24);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);

  console.log(fromTime);

  console.log(toTime);

  useEffect(() => {
    setFromDate(nextDay); // Default date is tomorrow
    setFromTime(dayjs(nowPlus24Hours)); 
    setToDate(nextDay);
  }, []);

  const minTime =
    fromDate === new Date().toISOString().split("T")[0]
      ? dayjs(nowPlus24Hours) // If today, enforce 24-hour rule
      : null;

  const handleFromDateChange = (e) => {
    const value = e.target.value;
    setFromDate(value);

    // Ensure toDate is updated if it's before fromDate
    if (toDate && value > toDate) {
      setToDate(value);
    }
  };

  const handleToDateChange = (e) => {
    const value = e.target.value;

    // Only allow toDate to be greater than or equal to fromDate
    if (value >= fromDate) {
      setToDate(value);
    } else {
      alert("To Date must be greater than or equal to From Date");
    }
  };

  const { user } = useContext(AuthContext);

  const [student, setStudent] = useState();

  const fetchStudent = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await AxiosPost("fetchStudent.php", { reg_no: user.reg_no });
      if (data.success) {
        setStudent(data.data);
      } else toast.error(data.error);
    } catch (err) {
      toast.error("Server Error!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [user && user.reg_no]);

  useEffect(() => {
    if (user !== null) {
      fetchStudent();
    }
  }, [user, fetchStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   setDate(today);
  // }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(getCurrentTime());
  }, []);

  const addWeekendOutingRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await AxiosPost("addGeneralOutingRequest.php", {
        ...formData,
        from_date: fromDate,
        from_time: dayjs(fromTime).format("HH:mm:ss"),
        to_date: toDate,
        to_time: dayjs(toTime).format("HH:mm:ss"),
        reg_no: user.reg_no,
      });
      console.log(data);
      if (data.success) {
        toast.success("Request added successfully");
        setFormData(initialFormData);
        setFromTime(null);
        setToTime(null);
        setFromDate(nextDay);
        setToDate(nextDay);
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

  return (
    <React.Fragment>
      <div className="dashboard-section">
        <div className="left-sidebar">
          <LeftNav />
        </div>
        <div className="main-content">
          {student && (
            <Grid
              container
              fullWidth
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card sx={{ m: 4, p: 5 }}>
                <CardHeader
                  title="General Outing Form"
                  sx={{ "& .MuiCardHeader-title": { letterSpacing: ".15px" } }}
                />
                <CardContent>
                  <form>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: "1rem",
                      }}
                    >
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            required
                            id="registration-number"
                            name="registrationNumber"
                            label="Registration Number"
                            variant="standard"
                            value={student.reg_no}
                            aria-readonly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            required
                            id="name"
                            name="name"
                            label="Name"
                            variant="standard"
                            value={student.name}
                            aria-readonly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            required
                            id="application-number"
                            name="applicationNumber"
                            label="Application Number"
                            variant="standard"
                            value={student.application_number}
                            aria-readonly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            required
                            id="gender"
                            name="gender"
                            label="Gender"
                            variant="standard"
                            value={student.gender}
                            aria-readonly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            required
                            id="hostel-block"
                            name="hostelBlock"
                            label="Hostel Block"
                            variant="standard"
                            value={student.hostel_block}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth required>
                          <TextField
                            required
                            id="room-number"
                            name="roomNumber"
                            label="Room Number"
                            variant="standard"
                            value={student.room_number}
                            aria-readonly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          {/* <InputLabel htmlFor="contact-number">Contact Number</InputLabel> */}
                          <TextField
                            required
                            id="contact-number"
                            name="contactNumber"
                            label="Contact Number"
                            variant="standard"
                            value={student.contact}
                            aria-readonly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            required
                            id="parent-contact-number"
                            name="parentContactNumber"
                            label="Parent Contact Number"
                            variant="standard"
                            value={student.parent_contact}
                            aria-readonly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            required
                            id="place-of-visit"
                            name="placeOfVisit"
                            label="Place Of Visit"
                            variant="standard"
                            value={formData.placeOfVisit}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            required
                            id="purpose-of-visit"
                            name="purposeOfVisit"
                            label="Purpose Of Visit"
                            variant="standard"
                            value={formData.purposeOfVisit}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </Grid>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <TextField
                              required
                              id="from-date"
                              name="fromDate"
                              type="date"
                              label="From Date"
                              variant="standard"
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                              InputProps={{
                                inputProps: {
                                  min: nextDay, // Prevent selecting today
                                },
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <TimePicker
                              label="From Time"
                              variant="standard"
                              value={fromTime}
                              onChange={(newTime) => setFromTime(newTime)}
                              minTime={minTime} // Restrict time based on date
                              renderInput={(params) => (
                                <TextField {...params} variant="standard" />
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <TextField
                              required
                              id="to-date"
                              name="toDate"
                              type="date"
                              label="To Date"
                              variant="standard"
                              value={toDate}
                              onChange={handleToDateChange}
                              InputProps={{
                                inputProps: { min: fromDate },
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <TimePicker
                              label="To Time"
                              value={toTime}
                              onChange={(newTime) => setToTime(newTime)}
                              renderInput={(params) => (
                                <TextField {...params} variant="standard" />
                              )}
                            />
                          </FormControl>
                        </Grid>
                      </LocalizationProvider>
                    </Grid>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Button
                        onClick={addWeekendOutingRequest}
                        variant="contained"
                        color="primary"
                        sx={{
                          width: "50%",
                          backgroundColor: "#000",
                          "&:hover": {
                            backgroundColor: "green",
                          },
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? "Submitting..." : "Submit"}
                      </Button>
                    </Box>
                  </form>
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
