import React from 'react';
import ButtonDelete from '../ButtonDelete'

interface CardTextProps {
  atext: string;
  onRemoveKey: () => void;
}

const CardText: React.FC<CardTextProps> = ({ atext, onRemoveKey }) => {
  return (
    <div className="v-card mx-auto" style={{ maxWidth: '600px', variant: 'flat' }}>
      <div className="v-card-item">
        <div>{atext}</div>
      </div>
      <div className="v-card-actions">
        <div className="v-spacer" />
        <ButtonDelete onRemoveKey={onRemoveKey} />
      </div>
    </div>
  );
};

export default CardText;