import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react-native';

import { saveConfigForCode } from '@/utils/firebase';
import { generateActivationCode } from '@/utils/activationCodes';
import { useApp } from '@/contexts/AppContext';
import type { UserConfig } from '@/utils/firebase';

export default function CreateTechnicianScreen() {
  const queryClient = useQueryClient();
  const { settings } = useApp();

  const [technicianName, setTechnicianName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userId, setUserId] = useState('');
  const [selectedShips, setSelectedShips] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const ships = settings.ships;
  const locations = settings.locations;

  const handleCancel = () => {
    router.back();
  };

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

  const handleSave = async () => {
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

    setIsSaving(true);
    try {
      const config: UserConfig = {
        technicianName: technicianName.trim(),
        companyName: companyName.trim(),
        userId: userId.trim(),
        ships: selectedShips,
        locations: selectedLocations,
        work: {
          defaultStartTime: '08:00',
          defaultEndTime: '17:00',
          defaultPauseMinutes: 60,
          hourlyRates: [],
        },
        apiKey: generateActivationCode(),
        serverUrl: '',
        autoSync: false,
        active: true,
        createdAt: Date.now(),
      };

      const activationCode = generateActivationCode();
      await saveConfigForCode(activationCode, config);
      
      queryClient.invalidateQueries({ queryKey: ['technician-configs'] });
      Alert.alert('Successo', 'Configurazione tecnico creata con successo');
      router.back();
    } catch (error) {
      Alert.alert('Errore', 'Impossibile creare la configurazione');
    } finally {
      setIsSaving(false);
    }
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
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
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

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Save size={20} color="#ffffff" />
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Salvataggio...' : 'Salva'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>by AS</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'rgba(79, 125, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(79, 125, 255, 0.3)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(79, 125, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(79, 125, 255, 0.3)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79, 125, 255, 0.2)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(79, 125, 255, 0.5)',
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
    color: '#ffffff',
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    paddingVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(79, 125, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic' as const,
  },
});
