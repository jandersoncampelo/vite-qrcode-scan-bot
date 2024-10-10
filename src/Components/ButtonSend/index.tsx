import React from 'react';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ButtonSendProps {
    message: string;
  }

const SendToQueue = async (data: string) => {
    await fetch(import.meta.env.VITE_HTTP_TRIGGER, {
        method: 'POST',
        body: JSON.stringify({ name: data }),
        headers: {
        'Content-Type': 'application/json'
        }
    });
    };

const ButtonSend: React.FC<ButtonSendProps> = ({ message }) => {
  return (
    <IconButton
      color="primary"
      onClick={() => SendToQueue(message)}
    >
      <SendIcon />
    </IconButton>
  );
};

export default ButtonSend;