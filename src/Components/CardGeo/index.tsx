import React, { useEffect } from 'react';
import ButtonDelete from '../ButtonDelete';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

interface CardGeoProps {
  data: {
    lat: number;
    lng: number;
  };
  onRemoveKey: () => void;
}

const CardGeo: React.FC<CardGeoProps> = ({ data, onRemoveKey }) => {
  useEffect(() => {
    console.log(data);
  }, [data]);

  const openLink = (lat: number, lng: number) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', variant: 'outlined' }}>
      <CardContent>
        <Typography variant="h6">Latitude: {data.lat}</Typography>
        <Typography variant="h6">Longitude: {data.lng}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="large"
          color="primary"
          variant="contained"
          onClick={() => openLink(data.lat, data.lng)}
        >
          Open Link
        </Button>
        <ButtonDelete onRemoveKey={onRemoveKey} />
      </CardActions>
    </Card>
  );
};

export default CardGeo;