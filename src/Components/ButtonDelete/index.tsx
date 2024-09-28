import React from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

interface ButtonDeleteProps {
  onRemoveKey: () => void;
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ onRemoveKey }) => {
  return (
    <IconButton
      color="error"
      onClick={onRemoveKey}
    >
      <DeleteIcon />
    </IconButton>
  );
};

export default ButtonDelete;