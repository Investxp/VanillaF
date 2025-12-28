import React from 'react';
import { Alert } from '@mui/material';

export default function NotificationBanner({ message, severity = 'info', ...props }) {
  if (!message) return null;
  return <Alert severity={severity} sx={{ my: 2 }} {...props}>{message}</Alert>;
}
