import React, { useState, useEffect, useCallback } from 'react';
import AppMenu from './Components/AppMenu';
import ScanHistory from './Components/ScanHistory';

import WebApp from '@twa-dev/sdk';
import { detectCodeType } from './utils/helper';

import { Buffer } from 'buffer';
(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;

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

    WebApp.CloudStorage.getKeys((error: string | null, keys?: string[]) => {
      if (error) {
        WebApp.showAlert('Failed to load items');
        return;
      }

      if (keys === undefined) {
        WebApp.showAlert('Failed to load items');
        return;
      }

      setCloudStorageKeys(keys);
      const values: { [key: string]: string } = {};
      keys.forEach((key) => {
        WebApp.CloudStorage.getItem(key, (error: string | null, value?: string) => {
          if (error) {
            WebApp.showAlert('Failed to load items');
            return;
          }

          if (value === undefined) {
            WebApp.showAlert('Failed to load items');
            return;
          }

          values[key] = value;
          setCloudStorageValues(values);
        });
      });
      WebApp.showAlert(cloudStorageValues.length + ' items loaded');
    });
  });

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

  const processQRCode = useCallback(async ({ data }: { data: string }) => {
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

    try {
      const response = await fetch(import.meta.env.VITE_HTTP_TRIGGER, {
        method: 'POST',
        body: JSON.stringify({ name: data }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      WebApp.showAlert('Success:', result);
    } catch (error) {
      WebApp.showAlert('Error: ' + String(error));
    }

    const key = addToStorage(data);
    setEnrichedValues({ ...enrichedValues, [key]: { type: 'url', value: cloudStorageValues[key] } });

    setShowHistory(true);

    WebApp.closeScanQrPopup();   
  }, [lastCode, cloudStorageValues, enrichedValues, addToStorage]);

  useEffect(() => {
    WebApp.onEvent('qrTextReceived', processQRCode);
    WebApp.onEvent('mainButtonClicked', () => showQrScanner());
  }, [processQRCode]);

  const hapticImpact = () => {
    WebApp.HapticFeedback.impactOccurred('rigid');
    WebApp.HapticFeedback.impactOccurred('heavy');
  };

  const showQrScanner = async () => {
    console.log("Link Enviado");

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