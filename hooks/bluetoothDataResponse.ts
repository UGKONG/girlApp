import store from '../src/store';
import type {BluetoothDataResponse} from '../src/types';

export default function bluetoothDataResponse({value}: BluetoothDataResponse) {
  const dispatch = store(x => x?.setState);
  const type = store(x => x?.bluetoothDataRequestType);

  // 응답에 대한 로직
  console.log(type, value);

  // Clean 작업
  dispatch('bluetoothDataRequestType', null);
}
