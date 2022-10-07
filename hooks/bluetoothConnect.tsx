import BleManager from 'react-native-ble-manager';
import type {PeripheralInfo} from 'react-native-ble-manager';

const serviceUUID: string = 'FE60';
const notificationUUID: string = 'FE62';

/**
 *
 * @param id 장비 UUID
 */
export const bluetoothConnect = async (
  id: string,
): Promise<PeripheralInfo | null> => {
  console.log('Hook에서 Device 연결 시도');

  // try {
  await BleManager.connect(id);
  const data = await BleManager.retrieveServices(id);
  await BleManager.startNotification(data?.id, serviceUUID, notificationUUID);
  return data;
  // } catch (err) {
  // console.log(err);
  // return null;
  // }
};
