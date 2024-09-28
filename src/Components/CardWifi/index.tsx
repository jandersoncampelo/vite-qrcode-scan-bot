import React from 'react';
import ButtonDelete from '../ButtonDelete';

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
    <div className="v-card mx-auto" style={{ maxWidth: '600px', variant: 'flat' }}>
      <div className="v-card-item">
        <div>Network Name: {data.S}</div>
        <div>Type: {data.T}</div>
        <div>Password: {data.P}</div>
      </div>
      <div className="v-card-actions">
        <div className="v-spacer" />
        <ButtonDelete onRemoveKey={onRemoveKey} />
      </div>
    </div>
  );
};

export default CardWifi;