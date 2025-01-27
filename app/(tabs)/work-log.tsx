import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { YStack } from "tamagui";

export default function WorkLog() {
  return (
    <View style={styles.container}>
      <YStack width="100%" height="100%">
        <Calendar
          style={{
            width: "100%",
          }}
        />
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
