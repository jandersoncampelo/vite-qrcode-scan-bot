import React from 'react';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ButtonSendProps {
    message: string;
  }



const ButtonSend: React.FC<ButtonSendProps> = () => {
  return (
    <IconButton
      color="primary"
    >
      <SendIcon />
    </IconButton>
  );
};

export default ButtonSend;