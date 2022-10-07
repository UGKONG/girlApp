import BleManager from 'react-native-ble-manager';
import store from '../src/store';

export default function (): () => void {
  const dispatch = store(x => x?.setState);

  const init = () => {
    BleManager.enableBluetooth()
      .then(() => {
        BleManager.start({showAlert: false})
          .then(() => {
            dispatch('isBluetoothReady', true);
          })
          .catch(() => {
            dispatch('isBluetoothReady', false);
          });
      })
      .catch(() => {
        dispatch('isBluetoothReady', false);
      });
  };

  return init;
}
