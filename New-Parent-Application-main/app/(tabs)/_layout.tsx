import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Tracking from '@/app/tracking/Tracker';

export default function Layout() {
  return (
    <View style={styles.container}>
      <View style={styles.feedTrackingContainer}>
        <Tracking />
      </View>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.highlight,
          headerShown: false
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="Home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />

        {/* Daily Log */}
        <Tabs.Screen
          name="dailylog"
          options={{
            title: 'Daily Log',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="calendar" size={size} color={color} />
            ),
          }}
        />

        {/* Memories */}
        <Tabs.Screen
          name="memories"
          options={{
            title: 'Memories',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="camera" size={size} color={color} />
            ),
          }}
        />

        {/* Evolution */}
        <Tabs.Screen
          name="evolution"
          options={{
            title: 'Evolution',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome
                name="line-chart"
                size={size}
                color={color}
              />
            ),
          }}
        />

        {/* Chatbot */}
        <Tabs.Screen
          name="Chatbot"
          options={{
            title: 'Chatbot',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="comments" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  feedTrackingContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
  },
});