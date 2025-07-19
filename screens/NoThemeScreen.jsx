import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NoThemeScreen({ route }) {
  const message = route.params?.message || '';
  return (
    <View style={[styles.container, { backgroundColor: '#333' }]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#fff' },
});
