import React, { useContext, useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AuthContext, AxiosPost } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { Calendar, MapPin, Clock, Badge, FileText } from 'lucide-react'; 
import { Chip, Tooltip, Box, Typography, Avatar, IconButton } from '@mui/material';
import { format } from 'date-fns';
import { CheckCircle, Hourglass, XCircle, RotateCcw } from 'lucide-react';
// Import jsPDF correctly
import jsPDF from 'jspdf';
// Import autotable as a plugin for jsPDF
import 'jspdf-autotable';

const getStatusColor = (status) => {
  const statusMap = {
    'approved': { color: '#4CAF50', bg: '#E8F5E9', icon: <CheckCircle size={16} /> },
    'wapproved': { color: '#4CAF50', bg: '#E8F5E9', icon: <CheckCircle size={16} /> },
    'applied': { color: '#FB8C00', bg: '#FFF3E0', icon: <Hourglass size={16} /> },
    'rejected': { color: '#E53935', bg: '#FFEBEE', icon: <XCircle size={16} /> },
    'in_progress': { color: '#1E88E5', bg: '#E3F2FD', icon: <RotateCcw size={16} /> },
    'leaved': { color: '#4CAF50', bg: '#E8F5E9', icon: <CheckCircle size={16} /> },
  };

  return statusMap[status.toLowerCase()] || { color: '#757575', bg: '#FAFAFA', icon: <CheckCircle size={16} /> }; 
};

// Function to generate and download PDF for weekend leave
const generatePDF = (row) => {
  try {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Add header with logo
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text("Weekend Leave Approval", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("Reference ID: " + row.id, 20, 35);
    
    // Add line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);
    
    // Add content
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    
    const tableData = [
      ["Registration No.", row.reg_no || "N/A"],
      ["Status", row.status.toUpperCase()],
      ["Date", format(new Date(row.date), 'dd MMM yyyy')],
      ["Place of Visit", row.place_of_visit],
      ["Place Details", row.place_details || "N/A"],
      ["Application Date", format(new Date(), 'dd MMM yyyy')],
    ];
    
    // Use the autotable plugin with proper error handling
    if (typeof doc.autoTable !== 'function') {
      console.error("autoTable is not available. Check jsPDF-autotable installation.");
      // Generate basic PDF without table if autoTable isn't available
      let yPos = 50;
      tableData.forEach(row => {
        doc.text(`${row[0]}: ${row[1]}`, 20, yPos);
        yPos += 10;
      });
    } else {
      doc.autoTable({
        startY: 50,
        head: [["Field", "Details"]],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 120 }
        },
      });
    }
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `This document is electronically generated and does not require signature. Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    // Save the PDF
    doc.save(`Weekend_Leave_${row.id}.pdf`);
    toast.success("PDF downloaded successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to download PDF: " + error.message);
  }
};

// WeekendAppliedApplications Component
const WeekendAppliedApplications = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [studentApplications, setStudentApplications] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchStudentApplications = async () => {
    setIsLoading(true);
    try {
      const data = await AxiosPost("fetchStudentWeekendApplications.php", {
        reg_no: user.reg_no,
      });
      if (data.success) {
        setStudentApplications(data.student_applications);
      } else toast.error(data.error);
    } catch (err) {
      toast.error("Server Error!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentApplications();
  }, []);

  const getRowId = (row) => {
    return row.id;
  };

  // Updated columns array with download button
  const columns = [
    {
      flex: 0.15,
      field: "date",
      minWidth: 150,
      headerName: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calendar size={20} />
          <Typography>Date</Typography>
        </Box>
      ),
      renderCell: ({ row }) => {
        return (
          <Tooltip title={format(new Date(row.date), 'PPP')} arrow>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1,
              '&:hover': { '& svg': { color: '#2196F3' } }
            }}>
              <Typography sx={{ 
                color: "text.secondary",
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' }
              }}>
                {format(new Date(row.date), 'dd MMM yyyy')}
              </Typography>
            </Box>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: "status",
      headerName: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>Status</Typography>
        </Box>
      ),
      renderCell: ({ row }) => {
        const statusConfig = getStatusColor(row.status);
        
        return (
          <Chip
            icon={<Badge size={16} />}
            label={row.status}
            sx={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              borderRadius: '16px',
              '& .MuiChip-icon': { color: statusConfig.color },
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }
            }}
          />
        );
      },
    },
    {
      field: "place_of_visit",
      headerName: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>Place of Visit</Typography>
        </Box>
      ),
      width: 200,
      renderCell: ({ row }) => {
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            '&:hover': { '& svg': { color: '#2196F3' } }
          }}>
            <MapPin size={18} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ color: 'text.primary' }}>
                {row.place_of_visit}
              </Typography>
              {row.place_details && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {row.place_details}
                </Typography>
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: ({ row }) => {
        const status = row.status.toLowerCase();
        const canDownload = status === 'wapproved' || status === 'leaved';
        
        return (
          <Tooltip title={canDownload ? "Download PDF" : "Download not available"} arrow>
            <span>
              <IconButton
                color="primary"
                size="small"
                onClick={() => canDownload && generatePDF(row)}
                disabled={!canDownload}
                sx={{
                  opacity: canDownload ? 1 : 0.5,
                  transition: 'all 0.2s',
                  '&:hover': canDownload ? {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)'
                  } : {}
                }}
              >
                <FileText size={20} />
              </IconButton>
            </span>
          </Tooltip>
        );
      }
    }
  ];

  if (!studentApplications) {
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
        <DataGrid
          rows={studentApplications}
          autoHeight
          columns={columns}
          loading={isLoading}
          getRowId={getRowId}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{ toolbar: GridToolbar }}
          sx={{
            "& .MuiDataGrid-columnHeaders": { borderRadius: 0, width: "100%" },
          }}
        />
      </>
    );
  }
};

export default WeekendAppliedApplications;