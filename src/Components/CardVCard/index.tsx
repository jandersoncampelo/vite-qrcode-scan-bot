import React from 'react';
import ButtonDelete from '../ButtonDelete';

interface CardVCardProps {
  data: { [key: string]: string };
  onRemoveKey: () => void;
}

const CardVCard: React.FC<CardVCardProps> = ({ data, onRemoveKey }) => {
  return (
    <div className="v-card mx-auto" style={{ maxWidth: '600px', variant: 'flat' }}>
      <div className="v-card-item">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))}
      </div>
      <div className="v-card-actions">
        <div className="v-spacer" />
        <ButtonDelete onRemoveKey={onRemoveKey} />
      </div>
    </div>
  );
};

export default CardVCard;