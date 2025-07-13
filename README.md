# 📱 rn-sms-otp-autofill

Módulo React Native para preenchimento automático de códigos OTP recebidos via SMS no Android.

## 📦 Instalação

```sh
npm install rn-sms-otp-autofill
```

Adicione a permissão no `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECEIVE_SMS" />
```

## 🚀 Uso Básico

```typescript
import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import {
  requestOtpAutofill,
  listenOtpAutofill,
  stopOtpAutofill,
} from 'rn-sms-otp-autofill';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');

  useEffect(() => {
    requestOtpAutofill();

    const removeListener = listenOtpAutofill(
      (otpCode) => setOtp(otpCode),
      (error) => console.error(error)
    );

    return () => {
      removeListener();
      stopOtpAutofill();
    };
  }, []);

  return (
    <TextInput
      value={otp}
      onChangeText={setOtp}
      placeholder="Digite o código OTP"
      keyboardType="numeric"
      maxLength={6}
    />
  );
}
```

## 🎣 Hook Personalizado

```typescript
// useOtpAutofill.ts
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
```

## 📚 API

### `requestOtpAutofill()`
Inicia o listener para mensagens SMS.

### `listenOtpAutofill(callback, onError?)`
Escuta por códigos OTP. Retorna função para remover o listener.

### `stopOtpAutofill()`
Para o listener e limpa recursos.

## ⚠️ Importante

- **Android**: ✅ Suportado (API 16+)
- **iOS**: Use o autofill nativo
- **Permissão**: RECEIVE_SMS obrigatória
- **Detecção**: Códigos de 4-6 dígitos apenas

## 📄 License

MIT
