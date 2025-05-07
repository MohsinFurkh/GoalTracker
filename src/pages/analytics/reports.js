import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarTodayIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon,
  EditNote as EditNoteIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
  TableChart as TableChartIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import { DatePicker } from '../../components/common/DateTimePicker';
import LoadingState from '../../components/common/LoadingState';
import { useNotification } from '../../components/common/NotificationSystem';
import { formatDate } from '../../utils/dateUtils';

// Report templates definitions
const REPORT_TEMPLATES = [
  {
    id: 'goals-summary',
    title: 'Goals Summary Report',
    description: 'Overview of all goals with status, progress, and completion rates',
    icon: <FlagIcon />,
    type: 'goals',
  },
  {
    id: 'tasks-completion',
    title: 'Task Completion Report',
    description: 'Detailed task completion statistics with time analysis',
    icon: <AssignmentIcon />,
    type: 'tasks',
  },
  {
    id: 'productivity-trends',
    title: 'Productivity Trends Report',
    description: 'Analysis of productivity patterns over time',
    icon: <AssessmentIcon />,
    type: 'productivity',
  },
  {
    id: 'journal-insights',
    title: 'Journal Insights Report',
    description: 'Mood analysis and correlation with goal progress',
    icon: <EditNoteIcon />,
    type: 'journal',
  },
  {
    id: 'weekly-summary',
    title: 'Weekly Summary Report',
    description: 'Comprehensive summary of the past week\'s activities',
    icon: <CalendarTodayIcon />,
    type: 'summary',
  },
];

// Export formats
const EXPORT_FORMATS = [
  {
    id: 'pdf',
    label: 'PDF Document',
    icon: <PictureAsPdfIcon />,
  },
  {
    id: 'csv',
    label: 'CSV Spreadsheet',
    icon: <TableChartIcon />,
  },
  {
    id: 'txt',
    label: 'Text Document',
    icon: <DescriptionIcon />,
  },
];

// Mock function to simulate report generation
const generateReport = (template, dateRange, options, format) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        reportUrl: '#',
        message: `Report "${template.title}" generated successfully in ${format.toUpperCase()} format.`,
      });
    }, 2000);
  });
};

export default function ReportsPage() {
  const router = useRouter();
  const theme = useTheme();
  const notification = useNotification();

  // State for report configuration
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to last 30 days
    endDate: new Date(),
  });
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState({
    includeCompletedItems: true,
    includeInProgressItems: true,
    includeCanceled: false,
    includeCharts: true,
    includeDetails: true,
  });
  
  const [generatedReports, setGeneratedReports] = useState([
    {
      id: 'report-1',
      title: 'Monthly Goals Summary - June 2023',
      type: 'goals',
      date: new Date(2023, 5, 30), // June 30, 2023
      format: 'pdf',
      url: '#',
    },
    {
      id: 'report-2',
      title: 'Weekly Productivity Report - Last Week',
      type: 'productivity',
      date: new Date(2023, 6, 15), // July 15, 2023
      format: 'csv',
      url: '#',
    },
    {
      id: 'report-3',
      title: 'Quarterly Tasks Analysis - Q2 2023',
      type: 'tasks',
      date: new Date(2023, 6, 1), // July 1, 2023
      format: 'pdf',
      url: '#',
    },
  ]);

  const handleStartDateChange = (date) => {
    setDateRange(prev => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setDateRange(prev => ({ ...prev, endDate: date }));
  };

  const handleOptionChange = (event) => {
    const { name, checked } = event.target;
    setOptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleExportFormatChange = (event) => {
    setExportFormat(event.target.value);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      notification.showError('Please select a report template');
      return;
    }

    setIsGenerating(true);

    try {
      const format = exportFormat || 'pdf';
      const result = await generateReport(selectedTemplate, dateRange, options, format);
      
      if (result.success) {
        notification.showSuccess(result.message);
        
        // Add to generated reports
        const newReport = {
          id: `report-${Date.now()}`,
          title: `${selectedTemplate.title} - ${formatDate(dateRange.startDate, 'short')} to ${formatDate(dateRange.endDate, 'short')}`,
          type: selectedTemplate.type,
          date: new Date(),
          format: format,
          url: result.reportUrl,
        };
        
        setGeneratedReports(prev => [newReport, ...prev]);
      } else {
        notification.showError('Failed to generate report. Please try again.');
      }
    } catch (error) {
      notification.showError('An error occurred while generating the report');
    } finally {
      setIsGenerating(false);
    }
  };

  const getFormatIcon = (format) => {
    const formatObj = EXPORT_FORMATS.find(f => f.id === format);
    return formatObj ? formatObj.icon : <DescriptionIcon />;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'goals':
        return <FlagIcon />;
      case 'tasks':
        return <AssignmentIcon />;
      case 'productivity':
        return <AssessmentIcon />;
      case 'journal':
        return <EditNoteIcon />;
      case 'summary':
        return <CalendarTodayIcon />;
      default:
        return <AssessmentIcon />;
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Reports"
        subtitle="Generate detailed reports and insights"
        actionButton={
          <Button
            component={Link}
            href="/analytics"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Back to Analytics
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Report Configuration */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate New Report
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  1. Select Report Template
                </Typography>
                <Grid container spacing={2}>
                  {REPORT_TEMPLATES.map(template => (
                    <Grid item xs={12} sm={6} key={template.id}>
                      <Paper
                        elevation={selectedTemplate?.id === template.id ? 3 : 1}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: selectedTemplate?.id === template.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                          '&:hover': {
                            boxShadow: 3,
                          },
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ color: theme.palette.primary.main, mr: 1 }}>
                            {template.icon}
                          </Box>
                          <Typography variant="subtitle1">{template.title}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {template.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  2. Select Date Range
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={dateRange.startDate}
                      onChange={handleStartDateChange}
                      maxDate={dateRange.endDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date"
                      value={dateRange.endDate}
                      onChange={handleEndDateChange}
                      minDate={dateRange.startDate}
                      maxDate={new Date()}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  3. Configure Report Options
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options.includeCompletedItems}
                          onChange={handleOptionChange}
                          name="includeCompletedItems"
                        />
                      }
                      label="Include Completed Items"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options.includeInProgressItems}
                          onChange={handleOptionChange}
                          name="includeInProgressItems"
                        />
                      }
                      label="Include In-Progress Items"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options.includeCanceled}
                          onChange={handleOptionChange}
                          name="includeCanceled"
                        />
                      }
                      label="Include Canceled/Abandoned Items"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options.includeCharts}
                          onChange={handleOptionChange}
                          name="includeCharts"
                        />
                      }
                      label="Include Charts & Visualizations"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options.includeDetails}
                          onChange={handleOptionChange}
                          name="includeDetails"
                        />
                      }
                      label="Include Detailed Breakdown"
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  4. Select Export Format
                </Typography>
                <FormControl fullWidth sx={{ maxWidth: 300 }}>
                  <InputLabel id="export-format-label">Export Format</InputLabel>
                  <Select
                    labelId="export-format-label"
                    value={exportFormat}
                    label="Export Format"
                    onChange={handleExportFormatChange}
                  >
                    {EXPORT_FORMATS.map(format => (
                      <MenuItem key={format.id} value={format.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 1 }}>{format.icon}</Box>
                          {format.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleGenerateReport}
                  disabled={!selectedTemplate || isGenerating}
                  size="large"
                >
                  Generate Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Reports */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Reports
              </Typography>
              {generatedReports.length > 0 ? (
                <List>
                  {generatedReports.map(report => (
                    <ListItem
                      key={report.id}
                      sx={{
                        mb: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                      }}
                      component={Link}
                      href={report.url}
                      disablePadding
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                            {formatDate(report.date, 'short')}
                          </Typography>
                          {getFormatIcon(report.format)}
                        </Box>
                      }
                    >
                      <ListItemIcon sx={{ pl: 2 }}>
                        {getTypeIcon(report.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={report.title}
                        secondary={
                          <Chip
                            size="small"
                            label={report.format.toUpperCase()}
                            color={report.format === 'pdf' ? 'error' : report.format === 'csv' ? 'success' : 'info'}
                            variant="outlined"
                          />
                        }
                        sx={{ py: 1.5 }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No reports have been generated yet. Use the form to create your first report.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {isGenerating && <LoadingState message="Generating report..." fullPage />}
    </MainLayout>
  );
} 