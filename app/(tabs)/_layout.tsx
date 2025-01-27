import setupAxiosInterceptors from "@/config/axios-interceptor";
import { WebsocketContext } from "@/contexts/socket-provider";
import { logout } from "@/redux/slices/authentication";
import {
  handleSetNewBatchAssigned,
  handleSetUnreadBatchAssigned,
} from "@/redux/slices/batch";
import { useDispatch, useSelector } from "@/redux/store";
import { neonBlue } from "@/utils/color";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { Circle, View } from "tamagui";

export default function TabLayout() {
  const router = useRouter();
  const pathName = usePathname();
  const socket = useContext(WebsocketContext);
  const dispatch = useDispatch();
  const { unreadBatchAssigned } = useSelector((state) => state.batch);

  useEffect(() => {
    socket?.on("batch-assigned", () => {
      if (pathName === "/tasks") {
        dispatch(handleSetNewBatchAssigned(true));
      } else {
        dispatch(handleSetUnreadBatchAssigned(true));
      }
      Toast.show({
        type: "info",
        text1: "New batch assigned",
      });
    });

    return () => {
      socket?.off("batch-assigned");
    };
  }, [socket]);

  setupAxiosInterceptors(() => {
    logout();
    router.push("/login");
  });

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: neonBlue[600] }}>
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <View position="relative">
              <FontAwesome size={28} name="tasks" color={color} />
              {unreadBatchAssigned && (
                <Circle
                  size={10}
                  backgroundColor="#FA3E3E"
                  style={{
                    position: "absolute",
                    left: "72%",
                  }}
                />
              )}
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="work-log"
        options={{
          title: "Work Log",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bell" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
