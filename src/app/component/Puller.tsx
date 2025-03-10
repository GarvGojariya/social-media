import React from 'react';
import { Box } from '@mui/material';

export const Puller = () => {
  return (
    <Box
      sx={{
        width: 30,
        height: 6,
        backgroundColor: '#dadce0',
        borderRadius: 3,
        position: 'absolute',
        top: 8,
        left: 'calc(50% - 15px)',
      }}
    />
  );
};

Puller.displayName = 'Puller';