import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Requests the native module to attempt OTP autofill
   */
  requestOtpAutofill(): void;
  /**
   * Stops the SMS listener and cleans up resources
   */
  stopOtpAutofill(): void;
}

const NativeModule = TurboModuleRegistry.getEnforcing<Spec>('RnSmsOtpAutofill');
export default NativeModule;
