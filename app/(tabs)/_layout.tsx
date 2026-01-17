import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" options={{ title: "Timer" }}>
        <Icon sf="timer" />
        <Label>Timer</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings" options={{ title: "Settings" }}>
        <Icon sf="gearshape" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
