import { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import {
  getAuth,
  signInWithPhoneNumber as firebaseSignInWithPhoneNumber,
} from '@react-native-firebase/auth';
import { useOtpAutofill } from './useOtpAutofill';
import { useSmsPermission } from './useSmsPermission';
import { OtpInput } from './OtpInput';

// Componente customizado para botão moderno
const ModernButton = ({
  title,
  onPress,
  disabled,
  loading,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          variant === 'secondary' && styles.buttonSecondary,
          disabled && styles.buttonDisabled,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text
            style={[
              styles.buttonText,
              variant === 'secondary' && styles.buttonTextSecondary,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [errorState, setErrorState] = useState('');
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const otpFadeAnim = useRef(new Animated.Value(0)).current;
  const otpSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animação inicial
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    // Animação para o input OTP
    if (confirm) {
      Animated.parallel([
        Animated.timing(otpFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(otpSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [confirm, otpFadeAnim, otpSlideAnim]);

  useOtpAutofill(
    (otp) => {
      setCode(otp);
      setMessage('Code automatically filled!');
      setErrorState('');
    },
    (err) => {
      setErrorState(err);
      setMessage('');
    }
  );

  const signInWithPhoneNumber = async () => {
    setLoadingSend(true);
    setMessage('');
    try {
      const auth = getAuth();
      const confirmation = await firebaseSignInWithPhoneNumber(auth, phone);
      setConfirm(confirmation);
      setMessage('SMS sent!');
    } catch (error) {
      setMessage(
        'Error sending SMS: ' +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoadingSend(false);
    }
  };

  const resetState = () => {
    setPhone('');
    setConfirm(null);
    setCode('');
    setMessage('');
    setErrorState('');
    setLoadingSend(false);
    setLoadingConfirm(false);

    // Reset das animações
    otpFadeAnim.setValue(0);
    otpSlideAnim.setValue(30);
  };

  const confirmCode = async () => {
    if (!confirm) return;
    setLoadingConfirm(true);
    setMessage('');
    try {
      await confirm.confirm(code);
      setMessage('Successfully authenticated!');
      // Show success message for 3 seconds then reset state
      setTimeout(() => {
        resetState();
      }, 3000);
    } catch (error) {
      setMessage(
        'Invalid code: ' +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoadingConfirm(false);
    }
  };

  useSmsPermission();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>SMS Verification</Text>
            <Text style={styles.subtitle}>
              SMS code autofill (Firebase) using Native Module
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone number</Text>
              <TextInput
                style={[styles.input, loadingSend && styles.inputDisabled]}
                placeholder="+55 (85) 99999-9999"
                placeholderTextColor="#8E8E93"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!loadingSend && !loadingConfirm}
              />
            </View>

            <ModernButton
              title="Send SMS code"
              onPress={signInWithPhoneNumber}
              disabled={!phone.trim()}
              loading={loadingSend}
            />

            {confirm && (
              <Animated.View
                style={[
                  styles.otpSection,
                  {
                    opacity: otpFadeAnim,
                    transform: [{ translateY: otpSlideAnim }],
                  },
                ]}
              >
                <Text style={styles.otpLabel}>Enter the 6-digit code</Text>
                <OtpInput length={6} value={code} onChange={setCode} />
                <ModernButton
                  title="Verify code"
                  onPress={confirmCode}
                  disabled={code.length !== 6}
                  loading={loadingConfirm}
                />
              </Animated.View>
            )}
          </View>

          {message ? (
            <Animated.View
              style={[
                styles.messageContainer,
                message.includes('Successfully') && styles.successMessage,
                message.includes('Error') && styles.errorMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.includes('Successfully') && styles.successText,
                  message.includes('Error') && styles.errorText,
                ]}
              >
                {message}
              </Text>
            </Animated.View>
          ) : null}

          {errorState ? (
            <Animated.View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorState}</Text>
            </Animated.View>
          ) : null}
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: '#1c1c1e',
    borderWidth: 2,
    borderColor: '#2c2c2e',
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  inputDisabled: {
    opacity: 0.6,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonDisabled: {
    backgroundColor: '#2c2c2e',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
  },
  otpSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  successMessage: {
    backgroundColor: '#0d5016',
    borderLeftColor: '#30d158',
  },
  errorMessage: {
    backgroundColor: '#5c1317',
    borderLeftColor: '#ff453a',
  },
  messageText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  successText: {
    color: '#30d158',
  },
  errorText: {
    color: '#ff453a',
  },
  errorContainer: {
    backgroundColor: '#5c1317',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff453a',
  },
});
