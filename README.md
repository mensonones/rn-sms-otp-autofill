
# 📱 rn-sms-otp-autofill

[![Português](https://img.shields.io/badge/lang-Português-green.svg)](README.md)
[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.en.md)

Módulo React Native para preenchimento automático de códigos OTP recebidos via SMS no Android.

## 📦 Instalação

```sh
npm install rn-sms-otp-autofill

🏗️ Requisitos

Este módulo é implementado como TurboModule e requer:

React Native 0.68+

New Architecture habilitada


Para habilitar a New Architecture em seu projeto:

Android

No arquivo android/gradle.properties:

newArchEnabled=true

iOS

No arquivo ios/Podfile:

use_frameworks! :linkage => :static
$RNNewArchEnabled = true

Android

1. Permissões: As permissões necessárias são incluídas automaticamente pelo módulo via manifest merge:



<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />

> 💡 Dica: Não é necessário adicionar essas permissões manualmente no seu AndroidManifest.xml - elas são mergeadas automaticamente durante o build. Porém, é uma boa prática verificar se aparecem no manifest final do app.



2. React Native 0.68+: O módulo é automaticamente linkado via autolinking (TurboModule).



> Nota: Este módulo requer React Native 0.68+ com New Architecture habilitada, pois é implementado como TurboModule.



iOS

O iOS possui autofill nativo de OTP, então este módulo é específico para Android.


---

🔄 Status atual e futuras melhorias

> 🛠️ Importante:
Atualmente, este módulo utiliza a abordagem tradicional baseada nas permissões:

<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />

Essa abordagem ainda funciona, porém é considerada sensível pela Google Play e requer justificativas adicionais no processo de publicação do app.

⚠️ Por isso, estamos trabalhando em uma nova versão baseada na SMS Retriever API, que permite a leitura do código OTP sem solicitar permissões sensíveis, estando totalmente alinhada com as políticas mais recentes da Play Store.

A nova versão irá:

Remover a dependência de RECEIVE_SMS e READ_SMS;

Usar somente APIs aprovadas pelo Google (SMS Retriever);

Manter compatibilidade com a New Architecture e Turbo Modules.




⏳ Fique atento: O suporte ao SMS Retriever será lançado em breve.
Enquanto isso, recomendamos revisar as políticas da Play Store para permissões de SMS caso pretenda publicar seu app com as permissões atuais.


---

🚀 Uso Básico

Importação - Opções Disponíveis

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

Exemplo de Uso

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

🎣 Hook Personalizado

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

📚 API

requestOtpAutofill()

Inicia o listener para mensagens SMS.

listenOtpAutofill(callback, onError?)

Escuta por códigos OTP. Retorna função para remover o listener.

stopOtpAutofill()

Para o listener e limpa recursos.

⚠️ Importante

React Native: Requer versão 0.68+ com New Architecture

Android: ✅ Suportado (API 16+)

iOS: Use o autofill nativo do sistema

Permissões: RECEIVE_SMS e READ_SMS (incluídas automaticamente)

Detecção: Códigos de 4-6 dígitos apenas

Arquitetura: TurboModule (New Architecture)


📄 License

MIT

