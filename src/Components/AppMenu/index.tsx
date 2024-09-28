import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
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
        <Button startIcon={<QrCodeScannerIcon />} color="inherit" onClick={onShowQrScanner}>
          Scan
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button startIcon={<HistoryIcon />} color="inherit" onClick={onShowHistory}>
        History
        </Button>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default AppMenu;
