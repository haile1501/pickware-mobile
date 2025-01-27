import React from "react";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Tasks",
        }}
      />
      <Stack.Screen
        name="picking"
        options={{
          title: "Picking Details",
        }}
      />
    </Stack>
  );
}
