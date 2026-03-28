import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import { Stack, useRouter, Link } from 'expo-router';
import { Plus, Trash2, Edit2, Copy, Check } from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getAllConfigs, deleteConfigByCode, toggleConfigActive } from '@/utils/firebase';
import { generateActivationCode, formatActivationCode } from '@/utils/activationCodes';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import type { UserConfig } from '@/utils/firebase';

export default function TechniciansManagementScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedConfig, setSelectedConfig] = useState<(UserConfig & { activationCode: string }) | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: configs = [], isLoading, error } = useQuery({
    queryKey: ['technician-configs'],
    queryFn: getAllConfigs,
    staleTime: 30000,
    gcTime: 60000,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ code, active }: { code: string; active: boolean }) => 
      toggleConfigActive(code, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-configs'] });
      Alert.alert('Successo', 'Status aggiornato con successo');
    },
    onError: () => {
      Alert.alert('Errore', 'Impossibile aggiornare lo status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (code: string) => deleteConfigByCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-configs'] });
      Alert.alert('Successo', 'Configurazione eliminata');
    },
    onError: () => {
      Alert.alert('Errore', 'Impossibile eliminare la configurazione');
    },
  });

  const handleDelete = (code: string, technicianName: string) => {
    Alert.alert(
      'Conferma Eliminazione',
      `Sei sicuro di voler eliminare la configurazione per ${technicianName}?`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(code),
        },
      ]
    );
  };

  const handleToggleActive = (code: string, currentActive: boolean) => {
    toggleMutation.mutate({ code, active: !currentActive });
  };

  const handleCopyCode = async (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShowQR = (config: UserConfig & { activationCode: string }) => {
    setSelectedConfig(config);
    setShowQRModal(true);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  console.log('Technicians page - Loading:', isLoading, 'Configs:', configs.length, 'Error:', error);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Gestione Tecnici',
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Configurazioni Tecnici</Text>
          <Text style={styles.headerSubtitle}>
            {configs.length} {configs.length === 1 ? 'configurazione' : 'configurazioni'}
          </Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {configs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>Nessuna configurazione</Text>
              <Text style={styles.emptyStateText}>
                Crea la prima configurazione tecnico per iniziare
              </Text>
            </View>
          ) : (
            configs.map((config) => (
              <View key={config.activationCode} style={styles.configCard}>
                <View style={styles.configHeader}>
                  <View style={styles.configTitleRow}>
                    <Text style={styles.configName}>{config.technicianName}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        config.active ? styles.statusBadgeActive : styles.statusBadgeInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          config.active ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive,
                        ]}
                      >
                        {config.active ? 'Attivo' : 'Disattivato'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.configCompany}>{config.companyName}</Text>
                  <Text style={styles.configUserId}>ID: {config.userId}</Text>
                </View>

                <View style={styles.configDetails}>
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Codice Attivazione:</Text>
                    <View style={styles.codeValueContainer}>
                      <Text style={styles.codeValue}>
                        {formatActivationCode(config.activationCode)}
                      </Text>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => handleCopyCode(config.activationCode)}
                      >
                        {copiedCode === config.activationCode ? (
                          <Check size={16} color="#10b981" />
                        ) : (
                          <Copy size={16} color="#6b7280" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.configInfo}>
                    <Text style={styles.configInfoText}>
                      Navi: {config.ships?.length || 0}
                    </Text>
                    <Text style={styles.configInfoText}>
                      Cantieri: {config.locations?.length || 0}
                    </Text>
                    <Text style={styles.configInfoText}>
                      Creato: {formatDate(config.createdAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.configActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShowQR(config)}
                  >
                    <Text style={styles.actionButtonText}>Mostra QR</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.toggleContainer}>
                    <Switch
                      value={config.active}
                      onValueChange={() =>
                        handleToggleActive(config.activationCode, config.active)
                      }
                      trackColor={{ false: '#d1d5db', true: '#10b981' }}
                      thumbColor="#ffffff"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(config.activationCode, config.technicianName)}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <Link href="/settings/technicians/create" asChild>
          <TouchableOpacity style={styles.fab}>
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </Link>

        <Modal visible={showQRModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowQRModal(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Codice Attivazione</Text>
              {selectedConfig && (
                <>
                  <Text style={styles.modalSubtitle}>{selectedConfig.technicianName}</Text>
                  <QRCodeDisplay
                    value={selectedConfig.activationCode}
                    size={250}
                    style={styles.qrCode}
                  />
                  <Text style={styles.modalCode}>
                    {formatActivationCode(selectedConfig.activationCode)}
                  </Text>
                </>
              )}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowQRModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Chiudi</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79, 125, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
  },
  configCard: {
    backgroundColor: 'rgba(79, 125, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(79, 125, 255, 0.3)',
    shadowColor: '#4F7DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  configHeader: {
    marginBottom: 12,
  },
  configTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  configName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: '#d1fae5',
  },
  statusBadgeInactive: {
    backgroundColor: '#fee2e2',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statusBadgeTextActive: {
    color: '#047857',
  },
  statusBadgeTextInactive: {
    color: '#dc2626',
  },
  configCompany: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  configUserId: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  configDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(79, 125, 255, 0.3)',
    paddingTop: 12,
    marginBottom: 12,
  },
  codeContainer: {
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  codeValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 125, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  codeValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4F7DFF',
    letterSpacing: 1,
  },
  copyButton: {
    padding: 4,
  },
  configInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  configInfoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  configActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4F7DFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ef4444',
    flex: 0,
    paddingHorizontal: 12,
  },
  toggleContainer: {
    paddingHorizontal: 4,
  },
  fab: {
    position: 'absolute' as const,
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F7DFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F7DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 125, 255, 0.3)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 24,
  },
  qrCode: {
    marginBottom: 20,
  },
  modalCode: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#4F7DFF',
    letterSpacing: 2,
    marginBottom: 24,
  },
  modalCloseButton: {
    backgroundColor: '#4F7DFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    textAlign: 'center' as const,
  },
});
