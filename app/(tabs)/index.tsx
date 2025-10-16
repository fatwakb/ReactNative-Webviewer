import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Button, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);
  const WEBSITE_URL = 'https://synergy3s.web.id';

  useEffect(() => {
    // Kunci orientasi ke landscape
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // Sembunyikan navigation bar bawah
    NavigationBar.setVisibilityAsync('hidden');

    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      } else {
        Alert.alert('Keluar Aplikasi', 'Apakah kamu yakin ingin keluar?', [
          { text: 'Batal', style: 'cancel' },
          { text: 'Ya', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [canGoBack]);

  const reloadWebView = () => {
    setHasError(false);
    webViewRef.current?.reload();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'android' ? undefined : 'padding'}>
        {/* Sembunyikan status bar atas */}
        <StatusBar hidden={true} translucent={true} />

        {!hasError ? (
          <WebView
            ref={webViewRef}
            source={{ uri: WEBSITE_URL }}
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
            onError={() => setHasError(true)}
            style={styles.webview}
          />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Gagal memuat halaman 😕</Text>
            <Button title="Coba Lagi" onPress={reloadWebView} color="#007bff" />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
});
