import BleManager from 'react-native-ble-manager';
import store from '../src/store';
import {BluetoothDataRequestType} from '../src/types';

type Props = {type: BluetoothDataRequestType; id: string; value: number[]};
export default function bluetoothWrite({type, id, value}: Props) {
  const dispatch = store(x => x?.setState);
  const serviceUUID: string = 'FE60';
  const writeUUID: string = 'FE61';

  dispatch('bluetoothDataRequestType', type);

  BleManager.writeWithoutResponse(id, serviceUUID, writeUUID, value)
    .then(() => {
      console.log('Write Success');
    })
    .catch(err => {
      console.log(err);
      // Clean 작업
      dispatch('bluetoothDataRequestType', null);
    });
}
