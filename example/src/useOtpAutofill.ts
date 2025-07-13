import { useEffect } from 'react';
import {
  listenOtpAutofill,
  requestOtpAutofill,
  stopOtpAutofill,
} from 'rn-sms-otp-autofill';

export function useOtpAutofill(
  onOtp: (otp: string) => void,
  onError?: (error: string) => void
) {
  useEffect(() => {
    requestOtpAutofill();
    const removeListener = listenOtpAutofill(onOtp, onError);
    return () => {
      removeListener();
      stopOtpAutofill();
    };
  }, [onOtp, onError]);
}
