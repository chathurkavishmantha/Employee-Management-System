import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Grid,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import Textarea from "@mui/joy/Textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const Employee = () => {
  const [loading, setLoading] = React.useState(false);
  const [employeeList, setEmployeeList] = React.useState(null);
  const [pageState, setPageState] = useState({
    isLoading: false,
    page: 1,
    pageSize: 10,
  });
  const [employeeId, setEmployeeId] = useState(0);
  const [fullName, setFullName] = useState("");
  const [nameWithInitials, setNameWithInitials] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [empType, setEmpType] = React.useState("");
  const [joinedDate, setJoinedDater] = React.useState("");
  const [experiance, setExperiance] = React.useState("");
  const [salary, setSalary] = React.useState("");
  const [personalNote, setPersonalNote] = React.useState("");
  const [empTypeSearch, setEmpTypeSearch] = React.useState("");

  // fetch table data --------------------------------------------
  const fetchData = async (data) => {
    setLoading(true);
    await axios
      .post(`http://localhost:5000/api/employee/employee-list`, data)
      .then((response) => {
        setEmployeeList(response.data);
        setLoading(false);
      });
  };
  // Save People
  const savePeople = async () => {
    const Obj = {
      id: 0,
      fullName: fullName,
      nameWithInitials: nameWithInitials,
      displayName: displayName,
      gender: gender,
      dob: dob,
      email: email,
      mobileNumber: mobileNumber,
      designation: designation,
      empType: empType,
      joinedDate: joinedDate,
      experiance: experiance,
      salary: salary,
      personalNote: personalNote,
    };
    await axios
      .post(`http://localhost:5000/api/employee/employee-save`, Obj)
      .then((response) => {
        fetchData({
          skip: 1,
          take: pageState.pageSize,
          // filter Array .............
          searchFilter: "",
        });
        handleCreateModal();
      });
  };
  //Delete
  const deletePeople = async (employeeId) => {
    await axios
      .delete(
        `http://localhost:5000/api/employee/employee-delete/` + employeeId
      )
      .then((response) => {
        fetchData({
          skip: 1,
          take: pageState.pageSize,
          // filter Array .............
          searchFilter: "",
        });
      });
  };

  // Update People
  const updatePeople = async () => {
    const Obj = {
      id: employeeId,
      fullName: fullName,
      nameWithInitials: nameWithInitials,
      displayName: displayName,
      gender: gender,
      dob: dob,
      email: email,
      mobileNumber: mobileNumber,
      designation: designation,
      empType: empType,
      joinedDate: joinedDate,
      experiance: experiance,
      salary: salary,
      personalNote: personalNote,
    };
    await axios
      .post(`http://localhost:5000/api/employee/employee-update`, Obj)
      .then((response) => {
        fetchData({
          skip: 1,
          take: pageState.pageSize,
          searchFilter: "",
        });
        handleUpdateModal();
      });
  };

  //Initially fetch table data --------------------------------------------
  useEffect(() => {
    fetchData({
      skip: 1,
      take: pageState.pageSize,
      searchFilter: "",
    });
  }, []);

  useEffect(() => {
    if (empTypeSearch !== "") {
      fetchData({
        skip: 1,
        take: pageState.pageSize,
        searchFilter: { employeeType: empTypeSearch },
      });
    }
  }, [empTypeSearch, pageState.pageSize]);

  const columns = [
    {
      field: "displayName",
      headerName: "Display Name",
      flex: 1,
      editable: false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "id",
      headerName: "Emp ID",
      maxWidth: 100,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "employeeType",
      headerName: "Emp. Type",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "experiance",
      headerName: "Experiance",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "id1",
      headerName: "Actions",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const btn = (
          <>
            <Button
              variant="text"
              sx={{ textTransform: "capitalize" }}
              onClick={() => {
                handleUpdateModal();
                setEmployeeId(params.row["id"]);
                setFullName(params.row["fullName"]);
                setNameWithInitials(params.row["nameWithInitials"]);
                setDisplayName(params.row["displayName"]);
                setGender(params.row["gender"]);
                setDob(params.row["dob"]);
                setEmail(params.row["email"]);
                setMobileNumber(params.row["mobileNumber"]);
                setDesignation(params.row["designation"]);
                setEmpType(params.row["employeeType"]);
                setJoinedDater(params.row["joinedDater"]);
                setExperiance(params.row["experiance"]);
              }}
            >
              Edit
            </Button>
            <Button
              variant="text"
              sx={{ textTransform: "capitalize", color: "red" }}
              onClick={() => deletePeople(params.row["id"])}
            >
              Delete
            </Button>
          </>
        );

        return btn;
      },
    },
  ];
  //Asign id for table rows --------------------------------------------
  function getRowId(row) {
    return row.id;
  }

  //Create Model
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const handleCreateModal = () => {
    setEmployeeId(0);
    setFullName("");
    setNameWithInitials("");
    setDisplayName("");
    setGender("");
    setDob("");
    setEmail("");
    setMobileNumber("");
    setDesignation("");
    setEmpType("");
    setJoinedDater("");
    setExperiance("");
    switch (createModalOpen) {
      case true:
        setCreateModalOpen(false);
        break;
      case false:
        setCreateModalOpen(true);
        break;
      default:
        setCreateModalOpen(false);
        break;
    }
  };
  //update Model
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const handleUpdateModal = () => {
    switch (updateModalOpen) {
      case true:
        setEmployeeId(0);
        setFullName("");
        setNameWithInitials("");
        setDisplayName("");
        setGender("");
        setDob("");
        setEmail("");
        setMobileNumber("");
        setDesignation("");
        setEmpType("");
        setJoinedDater("");
        setExperiance("");
        setUpdateModalOpen(false);
        break;
      case false:
        setUpdateModalOpen(true);
        break;
      default:
        setEmployeeId(0);
        setFullName("");
        setNameWithInitials("");
        setDisplayName("");
        setGender("");
        setDob("");
        setEmail("");
        setMobileNumber("");
        setDesignation("");
        setEmpType("");
        setJoinedDater("");
        setExperiance("");
        setUpdateModalOpen(false);
        break;
    }
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container sx={{ paddingTop: 2 }}>
      <Box
        sx={{
          position: "relative",
          width: 1232,
          height: 804,
          padding: 0,
          background: "#ffff",
        }}
      >
        <Box
          sx={{
            background: "#FFFFFF",
            position: "absolute",
            width: 1232,
            height: 72,
            left: 0,
            top: 0,
            borderBottom: 1,
            borderColor: "#E0E0E0",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "28px",
              margin: "22px 32px 668px 22px",
            }}
          >
            People
          </Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            width: "1168px",
            left: "32px",
            top: "92px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "24px",
            }}
          >
            <FormControl size="small" sx={{ minWidth: "174px" }}>
              <InputLabel id="demo-simple-select-label">
                Employee Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={(e) => setEmpTypeSearch(e.target.value)}
                value={empTypeSearch}
                name={"Employee Type"}
                label="Employee Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
              </Select>
            </FormControl>

            <Button
              sx={{
                marginLeft: "16px",
                width: "109px",
                height: "40px",
                textTransform: "capitalize",
              }}
              size="small"
              color="primary"
              variant="contained"
              onClick={() => {
                handleCreateModal();
              }}
            >
              Add People
            </Button>
          </Box>
          {/* Add People */}
          <Box>
            <Dialog
              // fullScreen={fullScreen}
              open={createModalOpen}
              onClose={handleCreateModal}
              aria-labelledby="alert-submit-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                style: { borderRadius: 10, minWidth: "1000px" },
              }}
            >
              <DialogTitle id="responsive-submit-title">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    fontSize={"1.125rem"}
                  >
                    Add People
                  </Typography>
                  <CloseIcon
                    sx={{
                      color: "rgba(0, 0, 0, 0.54);",
                      cursor: "pointer",
                    }}
                    onClick={handleCreateModal}
                  />
                </Stack>
              </DialogTitle>
              <Divider light />
              <DialogContent>
                <Grid container spacing={1.5}>
                  <Grid item padding={2} xs={12}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Full Name*"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Full Name"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Name with initials*"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Name with initials"}
                      value={nameWithInitials}
                      onChange={(e) => setNameWithInitials(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Preffered / Display Name"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Preffered / Display Name"}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Gender"}
                    </InputLabel>
                    <FormControl size="small" sx={{ width: "100%" }}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name={"Gender"}
                        onChange={(e) => setGender(e.target.value)}
                        value={gender}
                        sx={{
                          height: "40px",
                        }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Date of Birth"}
                    </InputLabel>
                    <Box
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px", 
                        },
                        "& .MuiFormControl-root": {
                          width: "100%", 
                        },
                        "& .MuiInputLabel-outlined": {
                          transform: "translate(14px, -10px) scale(0.75)",
                          backgroundColor: "white",
                          pl: 1,
                          pr: 1,
                          color: "rgba(0, 0, 0, 0.6)  !important",
                        },
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          inputFormat="DD-MM-YYYY"
                          value={dob}
                          onChange={(date) => setDob(date)}
                          renderInput={(params) => <TextField {...params} />}
                          error={false}
                          InputProps={{
                            name: "Date of Birth",
                            error: false,
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Email"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Mobile Number"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Mobile Number"}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Designation"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Designation"}
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Employee Type"}
                    </InputLabel>
                    <FormControl size="small" sx={{ width: "100%" }}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name={"Employee Type"}
                        onChange={(e) => setEmpType(e.target.value)}
                        value={empType}
                        sx={{
                          height: "40px",
                        }}
                      >
                        <MenuItem value="Full Time">Full Time</MenuItem>
                        <MenuItem value="Part Time">Part Time</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Joined Date"}
                    </InputLabel>
                    <Box
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px", 
                        },
                        "& .MuiFormControl-root": {
                          width: "100%", 
                        },
                        "& .MuiInputLabel-outlined": {
                          transform: "translate(14px, -10px) scale(0.75)",
                          backgroundColor: "white",
                          pl: 1,
                          pr: 1,
                          color: "rgba(0, 0, 0, 0.6)  !important",
                        },
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          inputFormat="DD-MM-YYYY"
                          value={joinedDate}
                          onChange={(date) => setJoinedDater(date)}
                          renderInput={(params) => <TextField {...params} />}
                          error={false}
                          InputProps={{
                            name: "oined Date",
                            error: false,
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Experience"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Experience"}
                      value={experiance}
                      onChange={(e) => setExperiance(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Salary"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Salary"}
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={12}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Personal Notes"}
                    </InputLabel>
                    <Textarea
                      placeholder=""
                      minRows={3}
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <Divider light />
              <DialogActions sx={{ p: 3 }}>
                <Button
                  variant="text"
                  onClick={handleCreateModal}
                  sx={{
                    fontWeight: 700,
                    color: "#1976d2",
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => savePeople()}
                >
                  Add People
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          {/* Update People */}
          <Box>
            <Dialog
              open={updateModalOpen}
              onClose={handleUpdateModal}
              aria-labelledby="alert-submit-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                style: { borderRadius: 10, minWidth: "1000px" },
              }}
            >
              <DialogTitle id="responsive-submit-title">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    fontSize={"1.125rem"}
                  >
                    Update People
                  </Typography>
                  <CloseIcon
                    sx={{
                      color: "rgba(0, 0, 0, 0.54);",
                      cursor: "pointer",
                    }}
                    onClick={handleUpdateModal}
                  />
                </Stack>
              </DialogTitle>
              <Divider light />
              <DialogContent>
                <Grid container spacing={1.5}>
                  <Grid item padding={2} xs={12}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Full Name*"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Full Name"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Name with initials*"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Name with initials"}
                      value={nameWithInitials}
                      onChange={(e) => setNameWithInitials(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Preffered / Display Name"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Preffered / Display Name"}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Gender"}
                    </InputLabel>
                    <FormControl size="small" sx={{ width: "100%" }}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name={"Gender"}
                        onChange={(e) => setGender(e.target.value)}
                        value={gender}
                        sx={{
                          height: "40px",
                        }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Date of Birth"}
                    </InputLabel>
                    <Box
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px", 
                        },
                        "& .MuiFormControl-root": {
                          width: "100%", 
                        },
                        "& .MuiInputLabel-outlined": {
                          transform: "translate(14px, -10px) scale(0.75)",
                          backgroundColor: "white",
                          pl: 1,
                          pr: 1,
                          color: "rgba(0, 0, 0, 0.6)  !important",
                        },
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          inputFormat="DD-MM-YYYY"
                          value={dob}
                          onChange={(date) => setDob(date)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Email"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Mobile Number"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Mobile Number"}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Designation"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Designation"}
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Employee Type"}
                    </InputLabel>
                    <FormControl size="small" sx={{ width: "100%" }}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name={"Employee Type"}
                        onChange={(e) => setEmpType(e.target.value)}
                        value={empType}
                        sx={{
                          height: "40px",
                        }}
                      >
                        <MenuItem value="Full Time">Full Time</MenuItem>
                        <MenuItem value="Part Time">Part Time</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Joined Date"}
                    </InputLabel>
                    <Box
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px", 
                        },
                        "& .MuiFormControl-root": {
                          width: "100%", 
                        },
                        "& .MuiInputLabel-outlined": {
                          transform: "translate(14px, -10px) scale(0.75)",
                          backgroundColor: "white",
                          pl: 1,
                          pr: 1,
                          color: "rgba(0, 0, 0, 0.6)  !important",
                        },
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          inputFormat="DD-MM-YYYY"
                          value={joinedDate}
                          onChange={(date) => setJoinedDater(date)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Experience"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Experience"}
                      value={experiance}
                      onChange={(e) => setExperiance(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={6}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Salary"}
                    </InputLabel>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      name={"Salary"}
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item padding={2} xs={12}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        pb: 1,
                        color: "#00318C",
                      }}
                    >
                      {"Personal Notes"}
                    </InputLabel>
                    <Textarea
                      placeholder=""
                      minRows={3}
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <Divider light />
              <DialogActions sx={{ p: 3 }}>
                <Button
                  variant="text"
                  onClick={handleUpdateModal}
                  sx={{
                    fontWeight: 700,
                    color: "#1976d2",
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => updatePeople()}
                >
                  Update People
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          <DataGrid
            getRowId={getRowId}
            rows={employeeList ? employeeList.data : {}}
            rowCount={employeeList ? employeeList.total : 0}
            loading={pageState.isLoading}
            rowsPerPageOptions={[10, 30, 50, 70, 100]}
            pagination
            page={pageState.page - 1}
            pageSize={pageState.pageSize}
            paginationMode="server"
            onPageChange={(newPage) => {
              setPageState((old) => ({ ...old, page: newPage + 1 }));
            }}
            onPageSizeChange={(newPageSize) =>
              setPageState((old) => ({ ...old, pageSize: newPageSize }))
            }
            columns={columns}
            disableSelectionOnClick
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Employee;
