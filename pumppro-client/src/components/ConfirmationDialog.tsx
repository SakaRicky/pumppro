import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from '@mui/material'
import { useStateValue } from 'state';
import { showDialog } from 'state/reducer';

const ConfirmationDialog = () => {
  const [state, dispatch] = useStateValue();

  const theme = useTheme();

  const handleClose = () => {
    dispatch(showDialog(false,"", ""))
  }

  const handleConfirm = () => {
    if(state.confirmationDialog.onConfirm) {
      state.confirmationDialog.onConfirm();
    }
    dispatch(showDialog(false,"", ""))
  }

  return (
    <Dialog
        open={state.confirmationDialog.isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
      >
        <DialogTitle fontSize="2rem">
          {state.confirmationDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText fontSize="1.5rem">
            {state.confirmationDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{
						backgroundColor: theme.palette.secondary[500],
            fontSize: "1rem",
						color: "#fff",
						"&:hover": {
							backgroundColor: theme.palette.secondary[700]
						}
					}}>{state.confirmationDialog.cancelText}</Button>
          <Button
            onClick={handleConfirm}
            autoFocus
            sx={{
              backgroundColor: theme.palette.error.main,
              fontSize: "1rem",
              color: "#fff",
              "&:hover": {
                backgroundColor: theme.palette.error.dark}
            }}
            >
            {state.confirmationDialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default ConfirmationDialog
