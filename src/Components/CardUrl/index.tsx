import React from 'react';
import ButtonDelete from '../ButtonDelete';

interface CardUrlProps {
  data: { value: string };
  onRemoveKey: () => void;
}

const CardUrl: React.FC<CardUrlProps> = ({ data, onRemoveKey }) => {
  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="v-card mx-auto" style={{ maxWidth: '600px', variant: 'flat' }}>
      <div className="v-card-item">
        <div>{data.value}</div>
      </div>
      <div className="v-card-actions">
        <div className="v-spacer" />
        <button
          className="v-btn"
          style={{ size: 'large', color: 'primary', variant: 'tonal' }}
          onClick={() => openLink(data.value)}
        >
          Open Link
        </button>
        <div className="v-spacer" />
        <ButtonDelete onRemoveKey={onRemoveKey} />
      </div>
    </div>
  );
};

export default CardUrl;