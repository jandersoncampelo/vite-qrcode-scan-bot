import React from 'react';
import ButtonDelete from '../ButtonDelete';
import { Card, CardContent, CardActions, Box, Typography } from '@mui/material';

interface CardVCardProps {
  data: { [key: string]: string };
  onRemoveKey: () => void;
}

const CardVCard: React.FC<CardVCardProps> = ({ data, onRemoveKey }) => {
  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', variant: 'outlined' }}>
      <CardContent>
        {Object.entries(data).map(([key, value]) => (
          <Typography key={key} variant="body1">
            {key}: {value}
          </Typography>
        ))}
      </CardContent>
      <CardActions>
        <Box sx={{ flexGrow: 1 }} />
        <ButtonDelete onRemoveKey={onRemoveKey} />
      </CardActions>
    </Card>
  );
};

export default CardVCard;