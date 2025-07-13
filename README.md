# 📱 rn-sms-otp-autofill

Módulo React Native para preenchimento automático de códigos OTP recebidos via SMS no Android.

## 📦 Instalação

```sh
npm install rn-sms-otp-autofill
```

## 🏗️ Requisitos

Este módulo é implementado como **TurboModule** e requer:

- **React Native 0.68+**
- **New Architecture habilitada**

Para habilitar a New Architecture em seu projeto:

### Android
No arquivo `android/gradle.properties`:
```properties
newArchEnabled=true
```

### iOS
No arquivo `ios/Podfile`:
```ruby
use_frameworks! :linkage => :static
$RNNewArchEnabled = true
```

### Android

1. **Permissões**: As permissões necessárias são **incluídas automaticamente** pelo módulo via manifest merge:

```xml
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />
```

> 💡 **Dica**: Não é necessário adicionar essas permissões manualmente no seu `AndroidManifest.xml` - elas são mergeadas automaticamente durante o build. Porém, é uma boa prática verificar se aparecem no manifest final do app.

2. **React Native 0.68+**: O módulo é automaticamente linkado via autolinking (TurboModule).

> **Nota**: Este módulo requer React Native 0.68+ com New Architecture habilitada, pois é implementado como TurboModule.

### iOS

O iOS possui autofill nativo de OTP, então este módulo é específico para Android.

## 🚀 Uso Básico

### Importação - Opções Disponíveis

```typescript
// Opção 1: Importação nomeada (recomendado)
import {
  requestOtpAutofill,
  listenOtpAutofill,
  stopOtpAutofill,
} from 'rn-sms-otp-autofill';

// Opção 2: Importação default
import RnSmsOtpAutofill from 'rn-sms-otp-autofill';
// Use: RnSmsOtpAutofill.requestOtpAutofill()

// Opção 3: Acesso direto ao TurboModule
import { RnSmsOtpAutofill } from 'rn-sms-otp-autofill';
// Para uso avançado do módulo nativo
```

### Exemplo de Uso

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

- **React Native**: Requer versão 0.68+ com New Architecture
- **Android**: ✅ Suportado (API 16+)
- **iOS**: Use o autofill nativo do sistema
- **Permissões**: RECEIVE_SMS e READ_SMS (incluídas automaticamente)
- **Detecção**: Códigos de 4-6 dígitos apenas
- **Arquitetura**: TurboModule (New Architecture)

## 📄 License

MIT
