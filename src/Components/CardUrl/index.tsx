import React from 'react';
import ButtonDelete from '../ButtonDelete';
import { Card, CardContent, CardActions, Box, Button, Typography } from '@mui/material';

interface CardUrlProps {
  data: { value: string };
  onRemoveKey: () => void;
}

const CardUrl: React.FC<CardUrlProps> = ({ data, onRemoveKey }) => {
  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', variant: 'outlined' }}>
      <CardContent>
        <Typography variant="body1">{data.value}</Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          size="large"
          color="primary"
          variant="contained"
          onClick={() => openLink(data.value)}
        >
          Open Link
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <ButtonDelete onRemoveKey={onRemoveKey} />
      </CardActions>
    </Card>
  );
};

export default CardUrl;