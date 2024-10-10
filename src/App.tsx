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
      WebApp.showAlert(keys.length + ' keys loaded');
      setCloudStorageKeys(keys);
    });
  }, []);

  useEffect(() => {
    const values: { [key: string]: string } = {};
    cloudStorageKeys.forEach((key) => {
      WebApp.CloudStorage.getItem(key, (error: string | null, value?: string) => {
        if (error) {
          WebApp.showAlert('Failed to load item');
          return;
        }

        if (value === undefined) {
          WebApp.showAlert('Failed to load item');
          return;
        }

        values[key] = value;
        setCloudStorageValues(values);
      });
    });
    WebApp.showAlert('Values loaded');
  }, [cloudStorageKeys]);

  useEffect(() => {
    const enrichedValues = cloudStorageKeys.map((key) => {
      const value = cloudStorageValues[key];
      return { [key]: { type: 'url', value } };
    });
    setEnrichedValues(enrichedValues);
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

    setShowHistory(true);
    WebApp.CloudStorage.setItem(Date.now().toString(), data, (error) => {
      if (error) {
        WebApp.showAlert('Failed to save item');
        return;
      }
      WebApp.showAlert('Item saved');
    });

    WebApp.closeScanQrPopup();   

  }, [lastCode]);

  useEffect(() => {
    WebApp.onEvent('qrTextReceived', processQRCode);
    WebApp.onEvent('mainButtonClicked', () => showQrScanner());
  }, [processQRCode]);

  const hapticImpact = () => {
    WebApp.HapticFeedback.impactOccurred('rigid');
    WebApp.HapticFeedback.impactOccurred('heavy');
  };

  const showQrScanner = async () => {
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