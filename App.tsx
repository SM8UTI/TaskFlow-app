import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { JSX, useEffect } from "react";
import { StatusBar } from "react-native";
import TabNavigator from "./src/navigation/TabNavigator";
import FocusSetupScreen from "./src/screens/FocusSetupScreen";
import FocusScreen from "./src/screens/FocusScreen";
import AnalyticsScreen from "./src/screens/AnalyticsScreen";
import HelpSupportScreen from "./src/screens/HelpSupportScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import customTheme from "./src/data/color-theme";
import { TimerProvider } from "./src/context/TimerContext";
import GlobalCelebration from "./src/components/GlobalCelebration";
import { ShareIntentHandler } from "./src/presentation/ShareIntentHandler";
import {
  createNotificationChannel,
  requestNotificationPermission,
  scheduleDailyStreakReminder,
} from "./src/services/NotificationService";

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: customTheme.background,
    text: customTheme.text,
    primary: customTheme.primary[2],
  },
};

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  // ── Notification bootstrap ──────────────────────────────────────────────────
  useEffect(() => {
    async function initNotifications() {
      // 1. Request permission (Android 13+ / API 33+)
      await requestNotificationPermission();
      // 2. Create the main notification channel (idempotent)
      await createNotificationChannel();
      // 3. Schedule tonight's streak reminder (at 8 PM)
      await scheduleDailyStreakReminder();
    }

    initNotifications();
  }, []);

  return (
    <TimerProvider>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <NavigationContainer theme={AppTheme}>
        <GlobalCelebration />
        <ShareIntentHandler />
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: customTheme.background } }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="FocusSetupScreen" component={FocusSetupScreen} />
          <Stack.Screen name="FocusScreen" component={FocusScreen} />
          <Stack.Screen name="AnalyticsScreen" component={AnalyticsScreen} />
          <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TimerProvider>
  );
}