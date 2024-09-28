import React from 'react';
import ButtonDelete from '../ButtonDelete';
import { Card, CardContent, CardActions, Box, Typography } from '@mui/material';

interface CardTextProps {
  atext: string;
  onRemoveKey: () => void;
}

const CardText: React.FC<CardTextProps> = ({ atext, onRemoveKey }) => {
  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', variant: 'outlined' }}>
      <CardContent>
        <Typography variant="body1">{atext}</Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ flexGrow: 1 }} />
        <ButtonDelete onRemoveKey={onRemoveKey} />
      </CardActions>
    </Card>
  );
};

export default CardText;