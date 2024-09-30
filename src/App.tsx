import React, { useState, useEffect } from 'react';
import AppMenu from './Components/AppMenu';
import RequirementsMessage from './Components/RequirementsMessage';
import ScanHistory from './Components/ScanHistory';

import WebApp from '@twa-dev/sdk';
import { detectCodeType } from './utils/helper';


const App: React.FC = () => {
  const [isTelegramClient, setIsTelegramClient] = useState(false);
  const [isTelegramApiUpdated, setIsTelegramApiUpdated] = useState(false);
  const [lastCode, setLastCode] = useState<string>('');
  const [showHistory, setShowHistory] = useState(true);

  const [enrichedValues, setEnrichedValues] = useState<{ [key: string]: { type: string; value: string } }>({});
  const [cloudStorageKeys, setCloudStorageKeys] = useState<string[]>([]);
  const [cloudStorageValues, setCloudStorageValues] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    WebApp.MainButton.setText("Scan QR code");
    WebApp.onEvent('qrTextReceived', processQRCode);
    WebApp.onEvent('mainButtonClicked', mainButtonClicked);

    setIsTelegramApiUpdated(WebApp.isVersionAtLeast('6.9'));
    if (WebApp.platform !== "unknown") {
      setIsTelegramClient(true);
    }
    if (isTelegramClient && isTelegramApiUpdated) {
      WebApp.MainButton.show();
      loadStorage();
    }

  }, [isTelegramClient, isTelegramApiUpdated]);

  useEffect(() => {
    WebApp.ready();

    const enriched = Object.keys(cloudStorageValues).reduce((acc, key) => {
      acc[key] = { type: 'url', value: cloudStorageValues[key] };
      return acc;
    }, {} as { [key: string]: { type: string; value: string } });
    
    setEnrichedValues(enriched);
  }, [cloudStorageValues]);

  const processQRCode = ({ data }: { data: string }) => {
    // Implement QR code processing logic
    if(data.length > 4096) {
      WebApp.showAlert('QR code is too long');
      return;
    }
    if(data == lastCode)
      return;

    setLastCode(data);
    hapticImpact();

    const codeType = detectCodeType(data);
    if (codeType === null || codeType === undefined || codeType !== "url") {
      WebApp.showAlert('Unsupported QR code type');
      return;
    }

    const key = addToStorage(data);
    setEnrichedValues({ ...enrichedValues, [key]: { type: 'url', value: cloudStorageValues[key] } });

    setShowHistory(true);

    WebApp.closeScanQrPopup();   
  };

  const hapticImpact = () => {
    WebApp.HapticFeedback.impactOccurred('rigid');
    WebApp.HapticFeedback.impactOccurred('heavy');
  };

  const addToStorage = (value: string) => {
    const key = new Date().toISOString();
    WebApp.CloudStorage.setItem(key, value, () => {
      setCloudStorageKeys([...cloudStorageKeys, key]);
      setCloudStorageValues({ ...cloudStorageValues, [key]: value });
    });

    return key;
  } 

  const loadStorage = () => {
    WebApp.CloudStorage.getKeys((error, data) => processStorage(error, data));
  };

  const processStorage = (error: string | null, data:string[] | undefined) => {
    if (error) {
      WebApp.showAlert('Failed to load storage');
      return;
    }
    if (data === undefined) {
      return;
    }
    data.sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
    setCloudStorageKeys(data);
    data.forEach((key) => {
      loadStorageItem(key);
    });
  };

  const loadStorageItem = (key: string) => {
    WebApp.CloudStorage.getItem(key, (error, value) => {
      if (error) {
        WebApp.showAlert('Failed to load storage item');
        return;
      }
      if (value !== undefined) 
        setCloudStorageValues({ ...cloudStorageValues, [key]: value });
    });
  };

  const showQrScanner = () => {
    const params = { text: "", isContinuous: false };
    WebApp.showScanQrPopup(params);
  };

  const mainButtonClicked = () => {
    showQrScanner();
  };

  const removeKey = (key: string) => {
    WebApp.CloudStorage.removeItem(key, (error) => {
      if (error) {
        WebApp.showAlert('Failed to remove item');
        return;
      }
      const keys = cloudStorageKeys.filter((k) => k !== key);
      setCloudStorageKeys(keys);
      const values = { ...cloudStorageValues };
      delete values[key];
      setCloudStorageValues(values);
    });
  }
  return (
      <div id="main">
        <AppMenu
          onShowQrScanner={() => showQrScanner()}
          onShowHistory={() => setShowHistory(!showHistory)}
        />
        <RequirementsMessage
          isTelegramClient={isTelegramClient}
          isTelegramApiUpdated={isTelegramApiUpdated}
          telegramApiVersion="6.9"
        />
        <ScanHistory
          showHistory={showHistory}
          cloudStorageKeys={cloudStorageKeys}
          enrichedValues={enrichedValues}
          removeKey={removeKey}
        />
      </div>
  );
};

export default App;