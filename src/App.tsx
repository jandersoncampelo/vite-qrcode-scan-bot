import { Component } from 'react';
import AppMenu from './Components/AppMenu';
import ScanHistory from './Components/ScanHistory';
import WebApp from '@twa-dev/sdk';
import { detectCodeType } from './utils/helper';
import { Buffer } from 'buffer';
(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;

interface AppState {
  lastCode: string;
  showHistory: boolean;
  enrichedValues: { [key: string]: { type: string; value: string } }[];
  cloudStorageKeys: string[];
  cloudStorageValues: { [key: string]: string };
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      lastCode: '',
      showHistory: true,
      enrichedValues: [],
      cloudStorageKeys: [],
      cloudStorageValues: {},
    };
  }

  componentDidMount() {
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
      this.setState({ cloudStorageKeys: keys });
    });

    WebApp.onEvent('qrTextReceived', this.processQRCode);
    WebApp.onEvent('mainButtonClicked', this.showQrScanner);
  }

  componentDidUpdate(prevProps: object, prevState: AppState) {
    if (prevState.cloudStorageKeys !== this.state.cloudStorageKeys) {
      const values: { [key: string]: string } = {};
      this.state.cloudStorageKeys.forEach((key) => {
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
          this.setState({ cloudStorageValues: values });
        });
      });
      WebApp.showAlert('Values loaded');
    }

    if (prevState.cloudStorageKeys !== this.state.cloudStorageKeys || prevState.cloudStorageValues !== this.state.cloudStorageValues) {
      const enrichedValues = this.state.cloudStorageKeys.map((key) => {
        const value = this.state.cloudStorageValues[key];
        return { [key]: { type: 'url', value } };
      });
      this.setState({ enrichedValues });
    }
  }

  processQRCode = async ({ data }: { data: string }) => {
    if (data.length > 4096) {
      WebApp.showAlert('QR code is too long');
      return;
    }

    if (data === this.state.lastCode) return;

    this.setState({ lastCode: data });
    this.hapticImpact();

    const codeType = detectCodeType(data);
    if (codeType === null || codeType === undefined || codeType !== "url") {
      WebApp.showAlert('Unsupported QR code type');
      return;
    }

    await fetch(import.meta.env.VITE_HTTP_TRIGGER, {
      method: 'POST',
      body: JSON.stringify({ name: data }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setState({ showHistory: true });
    WebApp.closeScanQrPopup();
  };

  hapticImpact = () => {
    WebApp.HapticFeedback.impactOccurred('rigid');
    WebApp.HapticFeedback.impactOccurred('heavy');
  };

  showQrScanner = async () => {
    const params = { text: "", isContinuous: false };
    WebApp.showScanQrPopup(params);
  };

  removeKey = (key: string) => {
    WebApp.CloudStorage.removeItem(key, (error) => {
      if (error) {
        WebApp.showAlert('Failed to remove item');
        return;
      }
      const keys = this.state.cloudStorageKeys.filter((k) => k !== key);
      const values = { ...this.state.cloudStorageValues };
      delete values[key];
      this.setState({ cloudStorageKeys: keys, cloudStorageValues: values });
    });
  };

  render() {
    return (
      <div id="main">
        <AppMenu
          onShowQrScanner={this.showQrScanner}
          onShowHistory={() => this.setState({ showHistory: !this.state.showHistory })}
        />
        <ScanHistory
          showHistory={this.state.showHistory}
          enrichedValues={this.state.enrichedValues}
          removeKey={this.removeKey}
        />
      </div>
    );
  }
}

export default App;