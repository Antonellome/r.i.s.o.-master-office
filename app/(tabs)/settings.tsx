import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { User, Database, Clock, Euro, Ship, MapPin, Users, Server } from 'lucide-react-native';
import { Stack, router } from 'expo-router';

export default function SettingsScreen() {
  const menuItems = [
    {
      icon: User,
      title: 'Info Utente',
      subtitle: 'Nome, ditta e password',
      route: '/settings/user-info',
    },
    {
      icon: Database,
      title: 'Archiviazione Dati',
      subtitle: 'Backup e ripristino',
      route: '/settings/storage',
    },
    {
      icon: Server,
      title: 'Sincronizzazione',
      subtitle: 'Sync con app master',
      route: '/settings/sync',
    },
    {
      icon: Clock,
      title: 'Orari Default',
      subtitle: 'Inizio, fine e pausa',
      route: '/settings/work-hours',
    },
    {
      icon: Euro,
      title: 'Tariffe Orarie',
      subtitle: 'Tariffe per tipo turno',
      route: '/settings/rates',
    },
    {
      icon: Ship,
      title: 'Navi',
      subtitle: 'Gestisci elenco navi',
      route: '/settings/ships',
    },
    {
      icon: MapPin,
      title: 'Luoghi',
      subtitle: 'Gestisci luoghi di lavoro',
      route: '/settings/locations',
    },
    {
      icon: Users,
      title: 'Tecnici',
      subtitle: 'Gestisci elenco tecnici',
      route: '/settings/technicians',
    },
  ];

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: true,
        title: 'Impostazioni',
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700' as const },
      }} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <item.icon size={24} color="#4F7DFF" />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.menuItemArrow}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>by &quot;AS&quot;</Text>
        </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  menuList: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 125, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 125, 255, 0.3)',
    shadowColor: '#4F7DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 125, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  menuItemArrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '300' as const,
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
