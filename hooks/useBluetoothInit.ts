import {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';

export default function useBluetoothInit(): boolean {
  const [state, setState] = useState<boolean>(false);

  const init = () => {
    BleManager.enableBluetooth()
      .then(() => setState(true))
      .catch(() => setState(false))
      .finally(() => BleManager.start({showAlert: false}));
  };

  useEffect(init, []);

  return state;
}
