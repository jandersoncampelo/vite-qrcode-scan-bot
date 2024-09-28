import React from "react";
import { AppBar, Toolbar, IconButton, Button, Box } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HistoryIcon from "@mui/icons-material/History";

interface AppMenuProps {
  onShowQrScanner: () => void;
  onShowHistory: () => void;
}

const AppMenu: React.FC<AppMenuProps> = ({
  onShowQrScanner,
  onShowHistory
}) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" onClick={onShowQrScanner}>
          <QrCodeScannerIcon />
          <Button color="inherit">Scan</Button>
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" onClick={onShowHistory}>
          <HistoryIcon />
          <Button color="inherit">History</Button>
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default AppMenu;
