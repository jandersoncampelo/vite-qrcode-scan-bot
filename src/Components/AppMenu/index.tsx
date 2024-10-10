import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

interface AppMenuProps {
  onShowQrScanner: () => void;
}

const AppMenu: React.FC<AppMenuProps> = ({
  onShowQrScanner
}) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Button startIcon={<QrCodeScannerIcon />} color="inherit" onClick={onShowQrScanner}>
          Scan
        </Button>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default AppMenu;
