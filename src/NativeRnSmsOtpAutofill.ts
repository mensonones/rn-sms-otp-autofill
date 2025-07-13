import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Solicita ao nativo que tente autofill do OTP
   */
  requestOtpAutofill(): void;
  /**
   * Para o listener de SMS e limpa recursos
   */
  stopOtpAutofill(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RnSmsOtpAutofill');
