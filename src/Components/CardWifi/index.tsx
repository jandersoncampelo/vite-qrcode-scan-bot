import React from 'react';
import ButtonDelete from '../ButtonDelete';
import { Card, CardContent, CardActions, Box, Typography } from '@mui/material';

interface CardWifiProps {
  data: {
    S: string;
    T: string;
    P: string;
  };
  onRemoveKey: () => void;
}

const CardWifi: React.FC<CardWifiProps> = ({ data, onRemoveKey }) => {
  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', variant: 'outlined' }}>
      <CardContent>
        <Typography variant="body1">Network Name: {data.S}</Typography>
        <Typography variant="body1">Type: {data.T}</Typography>
        <Typography variant="body1">Password: {data.P}</Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ flexGrow: 1 }} />
        <ButtonDelete onRemoveKey={onRemoveKey} />
      </CardActions>
    </Card>
  );
};

export default CardWifi;