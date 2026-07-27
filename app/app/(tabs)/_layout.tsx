import React from 'react';
import { Tabs } from 'expo-router';
import { BottomNavigation } from '../../components/ui/BottomNavigation';

export default function TabLayout() {
  return (
    <>
      <Tabs
        tabBar={() => <BottomNavigation />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: '#F6F8FB' },
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="map" />
        <Tabs.Screen name="complaints" />
        <Tabs.Screen name="ai" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
