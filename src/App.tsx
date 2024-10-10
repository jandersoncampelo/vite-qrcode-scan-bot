import React, { useState, useEffect } from 'react';
import { prepareUrl } from './utils/helper';
import AppMenu from './Components/AppMenu';
import ScanHistory from './Components/ScanHistory';

import WebApp from '@twa-dev/sdk';

import { Buffer } from 'buffer';
(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;

interface CloudStorageValues {
  [key: string]: string;
}

export interface EnrichedValues {
  [key: string]: {
    type: string;
    info: string;
  };
}

const App: React.FC = () => {
  const [isTelegramClient, setIsTelegramClient] = useState(false);
  const [isTelegramApiUpdated, setIsTelegramApiUpdated] = useState(false);

  const [lastCode, setLastCode] = useState<string>('');
  const [showHistory, setShowHistory] = useState(true);

  const [enrichedValues, setEnrichedValues] = useState<EnrichedValues[]>([]);
  const [cloudStorageKeys, setCloudStorageKeys] = useState<string[]>([]);
  const [cloudStorageValues, setCloudStorageValues] = useState<CloudStorageValues>({});

  useEffect(() => {
    WebApp.MainButton.setText('Scan QR');
    WebApp.onEvent('mainButtonClicked', mainButtonClicked);
    WebApp.onEvent('qrTextReceived', processQRCode);

    setIsTelegramApiUpdated(WebApp.isVersionAtLeast('6.9'));
    setIsTelegramClient(WebApp.platform !== 'unknown');

    if (isTelegramClient && isTelegramApiUpdated) {
      WebApp.MainButton.show();
      loadStorage()
    }

    WebApp.ready();

  }, [isTelegramClient, isTelegramApiUpdated]);

  const mainButtonClicked = () => {
    showQRScanner();
  };

  const showQRScanner = () => {
    const params = { text: "", isContinuous: false };
    WebApp.showScanQrPopup(params);
  };

  const loadStorage = () => {
    WebApp.CloudStorage.getKeys((error: string | null, keys?: string[]) => {
      if (error) {
        WebApp.showAlert('Failed to load keys');
        return;
      }

      if (keys) {
        keys.sort((a, b) => parseInt(b) - parseInt(a));
        
        setCloudStorageKeys(keys);
      }
    });

    WebApp.showAlert(cloudStorageKeys.length + ' keys loaded');
    WebApp.CloudStorage.getItems(cloudStorageKeys, (error: string | null, values?: CloudStorageValues) => {
      if (error) {
        WebApp.showAlert('Failed to load items');
        return;
      }

      if (values) {
        setCloudStorageValues(values);
        enrichValues(values);
      }
    });

    WebApp.showAlert(cloudStorageValues.length + ' values loaded');
  }


  const enrichValues = (data: CloudStorageValues) => {
    for (const key in data) {
      enrichValue(key);
    }

    WebApp.showAlert(enrichedValues.length + ' rich values loaded');
  };

  const enrichValue = (key: string) => {
    const value = cloudStorageValues[key];
    const result = prepareUrl(value);
    if (result.is_url)
      setEnrichedValues([{ [key]: { type: 'url', info: result.value } }, ...enrichedValues]);
  };


  const processQRCode = (data: { data: string }) => {
    if (data.data.length > 4096) {
      WebApp.showAlert('Error cannot store QR codes longer than 4096 characters');
      return;
    }
    if (data.data === lastCode) {
      return;
    }
    setLastCode(data.data);

    hapticImpact();

    const key = addToStorage(data.data);

    enrichValue(key);

    setShowHistory(true);

    WebApp.closeScanQrPopup();
  };

  const hapticImpact = () => {
    WebApp.HapticFeedback.impactOccurred('rigid');
    WebApp.HapticFeedback.impactOccurred('heavy');
  };

  const addToStorage = (value: string) => {
    const timestamp = new Date().getTime().toString();

    WebApp.CloudStorage.setItem(timestamp, value);
    setCloudStorageKeys([timestamp, ...cloudStorageKeys]);
    setCloudStorageValues({ ...cloudStorageValues, [timestamp]: value });
    return timestamp;
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
          onShowQrScanner={ showQrScanner }
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