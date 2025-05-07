import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LoadingButton,
} from '@mui/material';

/**
 * ConfirmDialog - A dialog for confirming actions
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Function to call when dialog is closed
 * @param {function} onConfirm - Function to call when action is confirmed
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmLabel - Label for the confirm button
 * @param {string} cancelLabel - Label for the cancel button
 * @param {boolean} isLoading - Whether the action is in progress
 * @param {string} confirmColor - Color of the confirm button
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  confirmColor = 'primary',
}) {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={isLoading}
          color="inherit"
        >
          {cancelLabel}
        </Button>
        <LoadingButton
          onClick={onConfirm}
          loading={isLoading}
          color={confirmColor}
          variant="contained"
          autoFocus
        >
          {confirmLabel}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
} 