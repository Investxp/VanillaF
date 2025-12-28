import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';

export default function DataTable({ columns, rows, actions }) {
  return (
    <TableContainer component={Paper} sx={{ my: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map(col => <TableCell key={col}>{col}</TableCell>)}
            {actions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {columns.map(col => <TableCell key={col}>{row[col]}</TableCell>)}
              {actions && <TableCell>{actions(row)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
