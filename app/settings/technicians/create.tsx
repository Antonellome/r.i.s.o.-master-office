import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react-native';

import { saveConfigForCode } from '@/utils/firebase';
import { generateActivationCode } from '@/utils/activationCodes';
import { useApp } from '@/contexts/AppContext';
import type { UserConfig } from '@/utils/firebase';

export default function CreateTechnicianScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { settings } = useApp();

  const [technicianName, setTechnicianName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userId, setUserId] = useState('');
  const [selectedShips, setSelectedShips] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [workStartTime, setWorkStartTime] = useState('08:00');
  const [workEndTime, setWorkEndTime] = useState('17:00');
  const [standardBreakMinutes, setStandardBreakMinutes] = useState('60');

  const ships = settings.ships;
  const locations = settings.locations;

  const createMutation = useMutation({
    mutationFn: async (config: UserConfig) => {
      const activationCode = generateActivationCode();
      await saveConfigForCode(activationCode, config);
      return activationCode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-configs'] });
      Alert.alert('Successo', 'Configurazione tecnico creata con successo', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    },
    onError: (error) => {
      Alert.alert('Errore', `Impossibile creare la configurazione: ${error.message}`);
    },
  });

  const toggleShip = (shipId: string) => {
    setSelectedShips((prev) =>
      prev.includes(shipId) ? prev.filter((id) => id !== shipId) : [...prev, shipId]
    );
  };

  const toggleLocation = (locationId: string) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId]
    );
  };

  const handleSave = () => {
    if (!technicianName.trim()) {
      Alert.alert('Errore', 'Inserisci il nome del tecnico');
      return;
    }

    if (!companyName.trim()) {
      Alert.alert('Errore', 'Inserisci il nome dell\'azienda');
      return;
    }

    if (!userId.trim()) {
      Alert.alert('Errore', 'Inserisci l\'ID utente');
      return;
    }

    const config: UserConfig = {
      technicianName: technicianName.trim(),
      companyName: companyName.trim(),
      userId: userId.trim(),
      ships: selectedShips,
      locations: selectedLocations,
      work: {
        defaultStartTime: workStartTime,
        defaultEndTime: workEndTime,
        defaultPauseMinutes: parseInt(standardBreakMinutes, 10) || 60,
        hourlyRates: [],
      },
      apiKey: generateActivationCode(),
      serverUrl: '',
      autoSync: false,
      active: true,
      createdAt: Date.now(),
    };

    createMutation.mutate(config);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Nuovo Tecnico',
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informazioni Base</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Nome Tecnico *</Text>
              <TextInput
                style={styles.input}
                value={technicianName}
                onChangeText={setTechnicianName}
                placeholder="Es: Mario Rossi"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Azienda *</Text>
              <TextInput
                style={styles.input}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Es: ACME Corp"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>ID Utente *</Text>
              <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                placeholder="Es: mario.rossi"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Orari di Lavoro</Text>

            <View style={styles.row}>
              <View style={[styles.field, styles.halfWidth]}>
                <Text style={styles.label}>Inizio Turno</Text>
                <TextInput
                  style={styles.input}
                  value={workStartTime}
                  onChangeText={setWorkStartTime}
                  placeholder="HH:MM"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={[styles.field, styles.halfWidth]}>
                <Text style={styles.label}>Fine Turno</Text>
                <TextInput
                  style={styles.input}
                  value={workEndTime}
                  onChangeText={setWorkEndTime}
                  placeholder="HH:MM"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Pausa Standard (minuti)</Text>
              <TextInput
                style={styles.input}
                value={standardBreakMinutes}
                onChangeText={setStandardBreakMinutes}
                placeholder="60"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Navi Accessibili</Text>
            {ships.length === 0 ? (
              <Text style={styles.emptyText}>Nessuna nave disponibile</Text>
            ) : (
              ships.map((ship: string) => (
                <TouchableOpacity
                  key={ship}
                  style={styles.checkboxRow}
                  onPress={() => toggleShip(ship)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedShips.includes(ship) && styles.checkboxChecked,
                    ]}
                  >
                    {selectedShips.includes(ship) && (
                      <View style={styles.checkboxInner} />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{ship}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cantieri Accessibili</Text>
            {locations.length === 0 ? (
              <Text style={styles.emptyText}>Nessun cantiere disponibile</Text>
            ) : (
              locations.map((location: string) => (
                <TouchableOpacity
                  key={location}
                  style={styles.checkboxRow}
                  onPress={() => toggleLocation(location)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedLocations.includes(location) && styles.checkboxChecked,
                    ]}
                  >
                    {selectedLocations.includes(location) && (
                      <View style={styles.checkboxInner} />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{location}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Annulla</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Save size={18} color="#ffffff" />
                <Text style={styles.saveButtonText}>Salva</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    paddingVertical: 20,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
});
