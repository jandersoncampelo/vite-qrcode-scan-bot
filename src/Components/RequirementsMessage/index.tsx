import React from 'react';
import { Box, Typography } from '@mui/material';

interface RequirementsMessageProps {
  isTelegramClient: boolean;
  isTelegramApiUpdated: boolean;
  telegramApiVersion: string;
}

const RequirementsMessage: React.FC<RequirementsMessageProps> = ({
  isTelegramClient,
  isTelegramApiUpdated,
  telegramApiVersion,
}) => {
  return (
    <Box textAlign="center">
      {!isTelegramClient && (
        <Typography variant="body1" color="error">
          Please open the app from a Telegram client!
        </Typography>
      )}
      {isTelegramClient && !isTelegramApiUpdated && (
        <Typography variant="body1" color="error">
          Please update Telegram to use the app!<br />
          Telegram API version needed 6.9 or greater.<br />
          Your Telegram API version: {telegramApiVersion}
        </Typography>
      )}
    </Box>
  );
};

export default RequirementsMessage;