import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export function useSmsPermission(onResult?: (granted: boolean) => void) {
  useEffect(() => {
    async function request() {
      let granted = true;
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: 'Permissão para ler SMS',
            message:
              'Precisamos acessar seus SMS para preencher o código automaticamente.',
            buttonPositive: 'OK',
          }
        );
        granted = result === PermissionsAndroid.RESULTS.GRANTED;
      }
      onResult?.(granted);
    }
    request();
  }, [onResult]);
}
