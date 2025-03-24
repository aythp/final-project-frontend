import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F2937" barStyle="light-content" />
      <WebView
        source={{ uri: 'https://sga-project.netlify.app/' }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  webview: {
    flex: 1,
  },
});