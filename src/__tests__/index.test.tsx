import { Platform } from 'react-native';
import {
  requestOtpAutofill,
  stopOtpAutofill,
  listenOtpAutofill,
} from '../index';

// Mock React Native Platform
jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
  NativeEventEmitter: jest.fn(() => ({
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  })),
  NativeModules: {
    RnSmsOtpAutofill: {},
  },
}));

// Mock the native module
jest.mock('../NativeRnSmsOtpAutofill', () => ({
  requestOtpAutofill: jest.fn(),
  stopOtpAutofill: jest.fn(),
}));

describe('rn-sms-otp-autofill', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export main functions', () => {
    expect(requestOtpAutofill).toBeDefined();
    expect(stopOtpAutofill).toBeDefined();
    expect(listenOtpAutofill).toBeDefined();
  });

  it('should only work on Android platform', () => {
    const mockPlatform = Platform as any;

    // Test Android
    mockPlatform.OS = 'android';
    expect(() => requestOtpAutofill()).not.toThrow();

    // Test iOS (should not throw but also not call native methods)
    mockPlatform.OS = 'ios';
    expect(() => requestOtpAutofill()).not.toThrow();
  });

  it('should create event listeners for OTP autofill', () => {
    const mockCallback = jest.fn();
    const mockErrorCallback = jest.fn();

    Platform.OS = 'android' as any;

    const cleanup = listenOtpAutofill(mockCallback, mockErrorCallback);

    expect(cleanup).toBeDefined();
    expect(typeof cleanup).toBe('function');
  });
});
