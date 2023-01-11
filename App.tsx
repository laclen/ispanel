import WebView from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import BackButton from "./components/BackButton";
import { useEffect, useRef, useState } from "react";
import isFirstLaunch from "./utils/DetectFirstLaunch";
import { WebViewScrollEvent } from "react-native-webview/lib/WebViewTypes";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { StyleSheet, View, Platform, Alert, Linking, RefreshControl, ScrollView, BackHandler } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function App() {
  const webViewRef = useRef<WebView>();
  const PLATFORM = Platform.OS;

  const [canGoBack, setCanGoBack] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refresherEnabled, setEnableRefresher] = useState(true);

  const getSettings = () => Linking.openSettings();
  const onBackPress = () => (webViewRef.current ? webViewRef.current.goBack() : null);
  const handleScroll = (e: WebViewScrollEvent) =>
    Number(e.nativeEvent.contentOffset.y) === 0 ? setEnableRefresher(true) : setEnableRefresher(false);

  useEffect(() => {
    const getPermissions = async () => {
      const firstLaunch = await isFirstLaunch();
      await check(PLATFORM === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then((result) => {
        if (result !== RESULTS.GRANTED && result !== RESULTS.UNAVAILABLE) {
          request(PLATFORM === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then((response) => {
            if (response === RESULTS.DENIED && firstLaunch) {
              Alert.alert(
                "Dikkat!",
                "Profil fotoğrafı çekebilmek için uygulama ayarlarından kamera erişimine izin vermeyi unutmayın.",
                [
                  {
                    text: "İptal",
                    style: "cancel",
                  },
                  { text: "Ayarlara Git", onPress: () => getSettings() },
                ]
              );
            }
          });
        }
      });
      await check(PLATFORM === "ios" ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then(
        (result) => {
          if (result !== RESULTS.GRANTED && result !== RESULTS.UNAVAILABLE) {
            request(PLATFORM === "ios" ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then(
              (response) => {
                if (response === RESULTS.DENIED && firstLaunch) {
                  Alert.alert(
                    "Dikkat!",
                    "Galeriden profil fotoğrafı seçebilmek için uygulama ayarlarından izinleri düzenlemeyi unutmayın.",
                    [
                      {
                        text: "İptal",
                        style: "cancel",
                      },
                      { text: "Ayarlara Git", onPress: () => getSettings() },
                    ]
                  );
                }
              }
            );
          }
        }
      );
    };

    getPermissions();
  }, []);

  return (
    <View style={styles.container}>
      {PLATFORM === "ios" && <StatusBar style="light" />}
      {PLATFORM === "ios" ? (
        <WebView
          pullToRefreshEnabled
          source={{ uri: "https://lim10medya.com/ispanel" }}
          ref={webViewRef}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
          allowsBackForwardNavigationGestures // only works with iOS
          allowsInlineMediaPlayback
          javaScriptEnabled
          javaScriptCanOpenWindowsAutomatically
          style={styles.webview}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              enabled={refresherEnabled}
              onRefresh={() => {
                webViewRef.current.reload();
                setRefreshing(true);
                setTimeout(() => setRefreshing(false), 2000);
              }}
            />
          }
        >
          <StatusBar style="light" backgroundColor="black" translucent />
          <WebView
            source={{ uri: "https://lim10medya.com/ispanel" }}
            ref={webViewRef}
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
            allowsBackForwardNavigationGestures // only works with iOS
            allowsInlineMediaPlayback
            javaScriptEnabled
            javaScriptCanOpenWindowsAutomatically
            scalesPageToFit
            style={styles.webview}
            onScroll={handleScroll}
          />
        </ScrollView>
      )}
      {canGoBack && (
        <View style={styles.buttonWrapper}>
          <BackButton onPress={onBackPress} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  webview: {
    flex: 1,
    zIndex: 1,
    marginTop: Platform.OS === "ios" ? hp(2.7) : hp(3.5),
  },
  buttonWrapper: {
    zIndex: 2,
    position: "absolute",
    top: Platform.OS === "ios" ? hp(87.72) : hp(86.95),
    left: Platform.OS === "ios" ? wp(5) : wp(5),

    borderRadius: 20,
    shadowColor: "black",

    // ios shadow
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,

    // android shadow
    elevation: 15,
  },
});