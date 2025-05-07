import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  DatePicker as MuiDatePicker, 
  DateTimePicker as MuiDateTimePicker,
  TimePicker as MuiTimePicker,
  LocalizationProvider 
} from '@mui/x-date-pickers';
import { TextField, FormHelperText, FormControl } from '@mui/material';

/**
 * Basic wrapper component for date pickers
 * 
 * @param {object} props
 * @param {string} props.label - Label for the date picker
 * @param {Date} props.value - Selected date value
 * @param {function} props.onChange - Function called when date changes
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether the field is required
 * @param {boolean} props.disabled - Whether the field is disabled
 * @param {string} props.helperText - Helper text to display
 * @param {object} props.sx - Additional styles
 * @param {object} props.TextFieldProps - Props for the TextField component
 * @param {object} props.PickerProps - Props for the Picker component
 */
export function DatePicker({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  helperText,
  sx,
  TextFieldProps = {},
  PickerProps = {},
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl fullWidth error={!!error} required={required} sx={sx}>
        <MuiDatePicker
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          slotProps={{
            textField: {
              error: !!error,
              fullWidth: true,
              required: required,
              ...TextFieldProps,
            },
          }}
          {...PickerProps}
        />
        {(error || helperText) && (
          <FormHelperText>{error || helperText}</FormHelperText>
        )}
      </FormControl>
    </LocalizationProvider>
  );
}

/**
 * DateTimePicker component
 */
export function DateTimePicker({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  helperText,
  sx,
  TextFieldProps = {},
  PickerProps = {},
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl fullWidth error={!!error} required={required} sx={sx}>
        <MuiDateTimePicker
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          slotProps={{
            textField: {
              error: !!error,
              fullWidth: true,
              required: required,
              ...TextFieldProps,
            },
          }}
          {...PickerProps}
        />
        {(error || helperText) && (
          <FormHelperText>{error || helperText}</FormHelperText>
        )}
      </FormControl>
    </LocalizationProvider>
  );
}

/**
 * TimePicker component
 */
export function TimePicker({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  helperText,
  sx,
  TextFieldProps = {},
  PickerProps = {},
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl fullWidth error={!!error} required={required} sx={sx}>
        <MuiTimePicker
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          slotProps={{
            textField: {
              error: !!error,
              fullWidth: true,
              required: required,
              ...TextFieldProps,
            },
          }}
          {...PickerProps}
        />
        {(error || helperText) && (
          <FormHelperText>{error || helperText}</FormHelperText>
        )}
      </FormControl>
    </LocalizationProvider>
  );
} 