import React, { useState, useEffect, useCallback } from 'react';
import AppMenu from './Components/AppMenu';

import WebApp from '@twa-dev/sdk';


const App: React.FC = () => {
  const [isTelegramClient, setIsTelegramClient] = useState(false);
  const [isTelegramApiUpdated, setIsTelegramApiUpdated] = useState(false);

  const [lastCode, setLastCode] = useState<string>('');

  const processQRCode = useCallback(async ( data : { data: string }) => {
    if (data.data.length > 4096) {
      WebApp.showAlert('Error cannot store QR codes longer than 4096 characters');
      return;
    }
    if (data.data === lastCode) {
      return;
    }
    setLastCode(data.data);

    hapticImpact();

    try {
        // Enviar o link como mensagem no Telegram
        WebApp.sendData(data.data);
        
        // Then proceed with the API call
        fetch(import.meta.env.VITE_HTTP_TRIGGER, {
          method: 'POST',
          body: JSON.stringify({ url: data.data }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          WebApp.showAlert('Cupom enfileirado com sucesso!');
        })
        .catch(error => {
          console.error('API error:', error);
          WebApp.showAlert(`Erro: ${error.message || 'Falha na requisição'}`);
        });

    } catch (error) {
      console.error('request error:', error);
      WebApp.showAlert('Não foi possível realizar a requisição. Tente novamente mais tarde.');
    }
    finally {
      WebApp.closeScanQrPopup();
    }
  }, [lastCode]);

  const hapticImpact = () => {
    WebApp.HapticFeedback.impactOccurred('rigid');
    WebApp.HapticFeedback.impactOccurred('heavy');
  };

  useEffect(() => {
    WebApp.MainButton.setText('Scan QR');
    WebApp.onEvent('mainButtonClicked', () => showQrScanner());
    WebApp.onEvent('qrTextReceived', processQRCode);

    setIsTelegramApiUpdated(WebApp.isVersionAtLeast('6.9'));
    setIsTelegramClient(WebApp.platform !== 'unknown');

    if (isTelegramClient && isTelegramApiUpdated) {
      WebApp.MainButton.show();
    }

    WebApp.ready();

  }, [isTelegramClient, isTelegramApiUpdated, processQRCode]);

  const showQrScanner = () => {
    const params = { text: "", isContinuous: false };
    WebApp.showScanQrPopup(params);
  };

  return (
      <div id="main">
        <AppMenu
          onShowQrScanner={ showQrScanner }
        />
      </div>
  );
};

export default App;