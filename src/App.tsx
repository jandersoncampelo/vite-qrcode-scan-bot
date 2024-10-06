import React, { useState, useEffect, useCallback } from 'react';
import AppMenu from './Components/AppMenu';
import ScanHistory from './Components/ScanHistory';

import WebApp from '@twa-dev/sdk';
import { detectCodeType } from './utils/helper';


const App: React.FC = () => {
  const [lastCode, setLastCode] = useState<string>('');
  const [showHistory, setShowHistory] = useState(true);

  const [enrichedValues, setEnrichedValues] = useState<{ [key: string] : {type: string; value: string} }[]>([]);
  const [cloudStorageKeys, setCloudStorageKeys] = useState<string[]>([]);
  const [cloudStorageValues, setCloudStorageValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    WebApp.ready();
    WebApp.MainButton.setText("Scan QR code");
    WebApp.MainButton.show();
  }, []);

  const addToStorage = useCallback((value: string) => {
    const key = new Date().toISOString();
    WebApp.CloudStorage.setItem(key, value, (error: string | null, result?: boolean) => {
      if (error) {
        WebApp.showAlert('Failed to save item');
        return;
      }

      if (result === false) {
        WebApp.showAlert('Failed to save item');
        return;
      }

      setCloudStorageKeys([...cloudStorageKeys, key]);
      setCloudStorageValues({ ...cloudStorageValues, [key]: value });
    });

    return key;
  }, [cloudStorageKeys, cloudStorageValues]); 

  const sendToServer = useCallback(async (qrcode: string) => {
    try {
      const response = await fetch('https://func-process-link.azurewebsites.net/api/process_link_function?code=eQ3o9ct14HS-uH-8ChDnHutobeBlbcg0uap6JTsYv501AzFuty7Xlw%3D%3D', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: qrcode }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const apiData = await response.json();
      WebApp.showAlert(`API Response: ${JSON.stringify(apiData)}`);
    } catch (error) {
      WebApp.showAlert(`Fetch error: ${(error as Error).message}`);
    }
  }, []);
  
  const processQRCode = useCallback(async ({ data }: { data: string }) => {
    if(data.length > 4096) {
      WebApp.showAlert('QR code is too long');
      return;
    }
    if(data == lastCode)
      return;

    setLastCode(data);
    hapticImpact();

    WebApp.showAlert(data);

    const codeType = detectCodeType(data);
    if (codeType === null || codeType === undefined || codeType !== "url") {
      WebApp.showAlert('Unsupported QR code type');
      return;
    }

    await sendToServer(data);

    const key = addToStorage(data);
    setEnrichedValues({ ...enrichedValues, [key]: { type: 'url', value: cloudStorageValues[key] } });

    setShowHistory(true);

    WebApp.closeScanQrPopup();   
  }, [lastCode, cloudStorageValues, enrichedValues, addToStorage, sendToServer]);

  useEffect(() => {
    WebApp.onEvent('qrTextReceived', processQRCode);
    WebApp.onEvent('mainButtonClicked', () => showQrScanner());
  }, [processQRCode]);

  const hapticImpact = () => {
    WebApp.HapticFeedback.impactOccurred('rigid');
    WebApp.HapticFeedback.impactOccurred('heavy');
  };

  const showQrScanner = () => {
    const params = { text: "", isContinuous: false };
    WebApp.showScanQrPopup(params);
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
        <ScanHistory
          showHistory={showHistory}
          enrichedValues={enrichedValues}
          removeKey={removeKey}
        />
      </div>
  );
};

export default App;