import React from 'react';
import ButtonDelete from '../ButtonDelete';
import { Card, CardContent, CardActions, Box, Button, Typography } from '@mui/material';
import ButtonSend from '../ButtonSend';

interface CardUrlProps {
  value: string;
  onRemoveKey: () => void;
}

const CardUrl: React.FC<CardUrlProps> = ({ value, onRemoveKey }) => {
  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', variant: 'outlined' }}>
      <CardContent>
        <Typography variant="body1">{value}</Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          size="large"
          color="primary"
          variant="contained"
          onClick={() => openLink(value)}
        >
          Open Link
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <ButtonDelete onRemoveKey={onRemoveKey} />
        <ButtonSend message={value} />
      </CardActions>
    </Card>
  );
};

export default CardUrl;