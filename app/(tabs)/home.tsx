import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Users, Ship, MapPin, FileText, Send, BarChart3 } from 'lucide-react-native';

import { useApp } from '@/contexts/AppContext';

export default function HomeScreen() {
  console.log('[HomeScreen] Component rendering');
  const router = useRouter();
  const appContext = useApp();
  
  console.log('[HomeScreen] AppContext loaded:', appContext ? 'YES' : 'NO');
  console.log('[HomeScreen] isLoading:', appContext?.isLoading);
  
  if (!appContext || appContext.isLoading) {
    console.log('[HomeScreen] Showing loading screen');
    return (
      <>
        <Stack.Screen options={{ 
          headerShown: true,
          title: 'R.I.S.O. Master Office',
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '700' as const },
        }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Caricamento...</Text>
        </View>
      </>
    );
  }

  console.log('[HomeScreen] Returning JSX');
  
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
      }} />
      <ScrollView style={styles.container}>
        <View style={styles.centeredContent}>
          <Text style={styles.appTitle}>R.I.S.O. Master Office</Text>
          <Text style={styles.appSubtitle}>Gestione Centralizzata Report e Tecnici</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{appContext.reports.length}</Text>
              <Text style={styles.statLabel}>Report Totali</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{appContext.settings.technicians?.length || 0}</Text>
              <Text style={styles.statLabel}>Tecnici</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{appContext.settings.ships?.length || 0}</Text>
              <Text style={styles.statLabel}>Navi</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{appContext.settings.locations?.length || 0}</Text>
              <Text style={styles.statLabel}>Cantieri</Text>
            </View>
          </View>
          
          <View style={styles.menuGrid}>
            <TouchableOpacity 
              style={styles.menuCard}
              onPress={() => router.push('/settings/technicians')}
            >
              <View style={styles.menuIconContainer}>
                <Users size={32} color="#ffffff" />
              </View>
              <Text style={styles.menuCardTitle}>Gestione Tecnici</Text>
              <Text style={styles.menuCardSubtitle}>Crea e gestisci configurazioni</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCard}
              onPress={() => router.push('/settings/ships')}
            >
              <View style={styles.menuIconContainer}>
                <Ship size={32} color="#ffffff" />
              </View>
              <Text style={styles.menuCardTitle}>Gestione Navi</Text>
              <Text style={styles.menuCardSubtitle}>Aggiungi e modifica navi</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCard}
              onPress={() => router.push('/settings/locations')}
            >
              <View style={styles.menuIconContainer}>
                <MapPin size={32} color="#ffffff" />
              </View>
              <Text style={styles.menuCardTitle}>Gestione Cantieri</Text>
              <Text style={styles.menuCardSubtitle}>Gestisci location di lavoro</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCard}
              onPress={() => router.push('/(tabs)/reports')}
            >
              <View style={styles.menuIconContainer}>
                <FileText size={32} color="#ffffff" />
              </View>
              <Text style={styles.menuCardTitle}>Dashboard Report</Text>
              <Text style={styles.menuCardSubtitle}>Visualizza tutti i report</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCard}
              onPress={() => router.push('/(tabs)/notifications')}
            >
              <View style={styles.menuIconContainer}>
                <Send size={32} color="#ffffff" />
              </View>
              <Text style={styles.menuCardTitle}>Invia Notifiche</Text>
              <Text style={styles.menuCardSubtitle}>Comunica con i tecnici</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuCard}
              onPress={() => router.push('/statistics')}
            >
              <View style={styles.menuIconContainer}>
                <BarChart3 size={32} color="#ffffff" />
              </View>
              <Text style={styles.menuCardTitle}>Statistiche</Text>
              <Text style={styles.menuCardSubtitle}>Analytics e report</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>by &quot;AS&quot;</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  centeredContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#ffffff',
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: 'rgba(79, 125, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 125, 255, 0.3)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#4F7DFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  menuCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#2563eb',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  menuIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  menuCardSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center' as const,
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic' as const,
  },
});
