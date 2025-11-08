import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  style?: ViewStyle;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  value, 
  size = 200,
  style 
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrIcon}>⬜</Text>
        <Text style={styles.codeText}>{value}</Text>
        <Text style={styles.helperText}>Codice Attivazione</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1f2937',
    letterSpacing: 2,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center' as const,
  },
});
