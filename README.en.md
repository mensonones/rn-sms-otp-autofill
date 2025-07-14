# 📱 rn-sms-otp-autofill

[![Português](https://img.shields.io/badge/lang-Português-green.svg)](README.md)
[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.en.md)

**React Native module for automatic OTP code filling from SMS on Android.**

---

## 📦 Installation

```sh
npm install rn-sms-otp-autofill
```

### 🏗️ Requirements

This module is implemented as a TurboModule and requires:

- **React Native 0.68+**
- **New Architecture enabled**

#### To enable New Architecture in your project:

**Android**  
In the `android/gradle.properties` file:
```properties
newArchEnabled=true
```

**iOS**  
In the `ios/Podfile` file:
```ruby
use_frameworks! :linkage => :static
$RNNewArchEnabled = true
```

---

### Android

1. **Permissions:**  
   Required permissions are automatically included by the module via manifest merge:
   ```xml
   <uses-permission android:name="android.permission.RECEIVE_SMS" />
   <uses-permission android:name="android.permission.READ_SMS" />
   ```
   > 💡 Tip: You don't need to manually add these permissions to your AndroidManifest.xml - they are automatically merged during build. However, it's good practice to verify they are present.

2. **React Native 0.68+:**  
   The module is automatically linked via autolinking (TurboModule).

> **Note**: This module requires React Native 0.68+ with New Architecture enabled, as it's implemented as a TurboModule.

### iOS

iOS has native OTP autofill, so this module is Android-specific.

---

## 🔄 Current Status and Future Improvements

> 🛠️ **Important:**  
Currently, this module uses the traditional approach based on permissions:
```xml
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />
```
This approach still works, but is considered sensitive by Google Play and requires additional justifications during the app publishing process.

⚠️ Therefore, we are working on a new version based on the SMS Retriever API, which allows reading OTP codes without requesting sensitive permissions, being fully aligned with store policies.

#### The new version will:
- Remove dependency on RECEIVE_SMS and READ_SMS;
- Use only Google-approved APIs (SMS Retriever);
- Maintain compatibility with New Architecture and TurboModules.

⏳ **Stay tuned:** SMS Retriever support will be released soon.  
Meanwhile, we recommend reviewing Play Store policies for SMS permissions if you plan to publish your app with current permissions.

---

## 🚀 Basic Usage

### Import - Available Options

```js
// Option 1: Named import (recommended)
import {
  requestOtpAutofill,
  listenOtpAutofill,
  stopOtpAutofill,
} from 'rn-sms-otp-autofill';

// Option 2: Default import
import RnSmsOtpAutofill from 'rn-sms-otp-autofill';
// Use: RnSmsOtpAutofill.requestOtpAutofill()

// Option 3: Direct TurboModule access
import { RnSmsOtpAutofill } from 'rn-sms-otp-autofill';
// For advanced native module usage
```

### Usage Example

```js
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
      placeholder="Enter OTP code"
      keyboardType="numeric"
      maxLength={6}
    />
  );
}
```

## 🎣 Custom Hook

```js
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

- **requestOtpAutofill()**  
  Starts the SMS message listener.

- **listenOtpAutofill(callback, onError?)**  
  Listens for OTP codes. Returns function to remove the listener.

- **stopOtpAutofill()**  
  Stops the listener and cleans up resources.

## ⚠️ Important

- React Native: Requires version 0.68+ with New Architecture
- Android: ✅ Supported (API 16+)
- iOS: Use native system autofill
- Permissions: RECEIVE_SMS and READ_SMS (automatically included)
- Detection: 4-6 digit codes only
- Architecture: TurboModule (New Architecture)

## 📄 License

MIT
