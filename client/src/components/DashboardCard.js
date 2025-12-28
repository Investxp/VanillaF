import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function DashboardCard({ title, value, icon }) {
  return (
    <Card sx={{ minWidth: 180, m: 1, display: 'flex', alignItems: 'center', p: 2 }}>
      {icon && <span style={{ fontSize: 32, marginRight: 16 }}>{icon}</span>}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </Card>
  );
}
