import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

type LockStatus = 'locked' | 'checking' | 'no-hardware' | 'not-enrolled' | 'locked-out' | 'web';

const messageForStatus: Record<LockStatus, string> = {
  locked: 'Use your fingerprint or face to unlock your journal.',
  checking: 'Checking your biometrics…',
  'no-hardware': 'This device does not support biometric unlock.',
  'not-enrolled': 'Set up fingerprint or face unlock in your device settings, then try again.',
  'locked-out': 'Biometrics are temporarily locked. Try again later.',
  web: 'Open the Android or iOS app to unlock your journal with biometrics.',
};

export const BiometricGate = ({ children }: PropsWithChildren) => {
  const [unlocked, setUnlocked] = useState(false);
  const [hasUnlockedOnce, setHasUnlockedOnce] = useState(false);
  const [status, setStatus] = useState<LockStatus>('locked');
  const appState = useRef(AppState.currentState);
  const unlockedRef = useRef(false);
  const attemptEpoch = useRef(0);
  const runningEpoch = useRef<number | null>(null);
  const retryAfterCurrentAttempt = useRef(false);
  const mounted = useRef(true);

  const authenticate = useCallback(async () => {
    if (Platform.OS === 'web') {
      setStatus('web');
      return;
    }
    if (runningEpoch.current !== null) {
      retryAfterCurrentAttempt.current = true;
      return;
    }

    const epoch = ++attemptEpoch.current;
    runningEpoch.current = epoch;
    retryAfterCurrentAttempt.current = false;
    setStatus('checking');

    try {
      if (!(await LocalAuthentication.hasHardwareAsync())) {
        if (mounted.current && epoch === attemptEpoch.current) setStatus('no-hardware');
        return;
      }
      if (!(await LocalAuthentication.isEnrolledAsync())) {
        if (mounted.current && epoch === attemptEpoch.current) setStatus('not-enrolled');
        return;
      }
      if (!mounted.current || epoch !== attemptEpoch.current) return;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Gratitude Journal',
        disableDeviceFallback: true,
        fallbackLabel: '',
        biometricsSecurityLevel: 'weak',
      });
      if (!mounted.current || epoch !== attemptEpoch.current) return;

      if (result.success) {
        unlockedRef.current = true;
        setUnlocked(true);
        setHasUnlockedOnce(true);
      } else {
        setStatus(
          result.error === 'not_enrolled'
            ? 'not-enrolled'
            : result.error === 'lockout'
              ? 'locked-out'
              : 'locked'
        );
      }
    } catch {
      if (mounted.current && epoch === attemptEpoch.current) setStatus('locked');
    } finally {
      runningEpoch.current = null;
      if (
        retryAfterCurrentAttempt.current &&
        !unlockedRef.current &&
        AppState.currentState === 'active' &&
        mounted.current
      ) {
        retryAfterCurrentAttempt.current = false;
        void authenticate();
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appState.current;
      appState.current = nextState;

      if (nextState === 'background' || (nextState === 'inactive' && unlockedRef.current)) {
        attemptEpoch.current += 1;
        unlockedRef.current = false;
        setUnlocked(false);
        setStatus('locked');
        if (nextState === 'background' && Platform.OS === 'android' && runningEpoch.current) {
          void LocalAuthentication.cancelAuthenticate().catch(() => {});
        }
      }

      if (nextState === 'active' && previousState !== 'active' && !unlockedRef.current) {
        if (runningEpoch.current === attemptEpoch.current) return;
        void authenticate();
      }
    });

    if (AppState.currentState === 'active') void authenticate();
    return () => {
      mounted.current = false;
      attemptEpoch.current += 1;
      subscription.remove();
    };
  }, [authenticate]);

  return (
    <View style={styles.container}>
      {hasUnlockedOnce && (
        <View
          testID="journal-content"
          style={[styles.content, !unlocked && styles.hidden]}
          pointerEvents={unlocked ? 'auto' : 'none'}
          accessibilityElementsHidden={!unlocked}
          importantForAccessibility={unlocked ? 'auto' : 'no-hide-descendants'}
        >
          {children}
        </View>
      )}
      {!unlocked && (
        <View testID="biometric-lock-screen" style={styles.lockScreen}>
          <Text style={styles.title}>Gratitude Journal</Text>
          <Text style={styles.message}>{messageForStatus[status]}</Text>
          {status === 'checking' ? (
            <ActivityIndicator size="large" color="#007BAA" />
          ) : (
            status !== 'web' && (
              <Pressable
                onPress={() => void authenticate()}
                accessibilityRole="button"
                style={styles.unlockButton}
              >
                <Text style={styles.unlockText}>Unlock with biometrics</Text>
              </Pressable>
            )
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3E6' },
  content: { flex: 1 },
  hidden: { display: 'none' },
  lockScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: { color: '#0B5968', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  message: { color: '#333333', fontSize: 16, marginTop: 16, textAlign: 'center' },
  unlockButton: {
    backgroundColor: '#007BAA',
    borderRadius: 8,
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  unlockText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
