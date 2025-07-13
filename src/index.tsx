import { NativeEventEmitter, Platform } from 'react-native';
import RnSmsOtpAutofill from './NativeRnSmsOtpAutofill';

export function requestOtpAutofill() {
  if (Platform.OS === 'android') {
    RnSmsOtpAutofill.requestOtpAutofill();
  }
}

export function stopOtpAutofill() {
  if (Platform.OS === 'android') {
    RnSmsOtpAutofill.stopOtpAutofill();
  }
}

export function listenOtpAutofill(
  callback: (otp: string) => void,
  onError?: (error: string) => void
) {
  if (Platform.OS === 'android') {
    const emitter = new NativeEventEmitter();
    const subOtp = emitter.addListener('onOtpAutofill', (event) => {
      if (event?.otp) callback(event.otp);
    });
    let subError: { remove: () => void } | undefined;
    if (onError) {
      subError = emitter.addListener('onOtpAutofillError', (event) => {
        if (event?.error) onError(event.error);
      });
    }
    return () => {
      subOtp.remove();
      subError?.remove();
    };
  }
  return () => {};
}
