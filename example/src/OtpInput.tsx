import { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
}

export function OtpInput({ length, value, onChange }: OtpInputProps) {
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const inputs = Array.from({ length });

  return (
    <View style={styles.container}>
      {inputs.map((_, idx) => (
        <View
          key={idx}
          style={[styles.inputWrapper, value[idx] && styles.inputWrapperFilled]}
        >
          <TextInput
            ref={(instance) => {
              inputsRef.current[idx] = instance;
            }}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={value[idx] || ''}
            onChangeText={(text) => {
              const newValue = value.split('');
              newValue[idx] = text;
              const joined = newValue.join('').slice(0, length);
              onChange(joined);
              if (text && idx < length - 1) {
                inputsRef.current[idx + 1]?.focus();
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !value[idx] && idx > 0) {
                inputsRef.current[idx - 1]?.focus();
              }
            }}
            placeholderTextColor="#8E8E93"
            selectionColor="#007AFF"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  inputWrapper: {
    width: 50,
    height: 55,
    borderWidth: 2,
    borderColor: '#2c2c2e',
    borderRadius: 16,
    backgroundColor: '#1c1c1e',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputWrapperFilled: {
    borderColor: '#007AFF',
    backgroundColor: '#1a1a2e',
    shadowOpacity: 0.3,
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 0,
  },
});
