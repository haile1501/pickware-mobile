import { Formik } from "formik";
import * as Yup from "yup";
import { neonBlue } from "@/utils/color";
import {
  Button,
  H2,
  H5,
  Image,
  Input,
  Stack,
  YStack,
  Text,
  Spinner,
} from "tamagui";
import { useDispatch, useSelector } from "@/redux/store";
import { login } from "@/redux/slices/authentication";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useEffect } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, errorMessage, loading } = useSelector(
    (state) => state.authentication
  );

  useEffect(() => {
    if (isAuthenticated && errorMessage !== "") {
      router.push("/(tabs)/tasks");
    } else if (errorMessage) {
      Toast.show({
        type: "error",
        text1: "Wrong username or password!",
      });
    }
  }, [isAuthenticated, errorMessage]);

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
      })}
      onSubmit={async (values) => {
        const loginData = {
          username: values.username,
          password: values.password,
        };

        await dispatch(login(loginData));
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
      }) => (
        <Stack
          alignItems="center"
          marginTop={95}
          paddingBottom={30}
          width="100%"
          height="100%"
          flex={1}
          justifyContent="space-between"
        >
          <YStack width="100%" alignItems="center" gap={32}>
            <Image
              source={require("../assets/images/logo.jpg")}
              width={150}
              height={150}
            />
            <H2 fontWeight="bold">Welcome back!</H2>
            <YStack width="100%" paddingHorizontal={32} gap={16}>
              <Input
                id="username"
                placeholder="Username"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
                autoCapitalize="none"
              />
              {touched.username && errors.username && (
                <Text color="red" fontSize={13}>
                  {errors.username}
                </Text>
              )}
              <Input
                id="password"
                secureTextEntry
                placeholder="Password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                autoCapitalize="none"
              />
              {touched.password && errors.password && (
                <Text color="red" fontSize={13}>
                  {errors.password}
                </Text>
              )}
              <Button
                fontWeight="bold"
                backgroundColor={neonBlue[400]}
                color="#fff"
                fontSize={16}
                onPress={() => handleSubmit()}
              >
                {!loading ? "Log in" : <Spinner size="small" color="#fff" />}
              </Button>
            </YStack>
          </YStack>
          <H5 fontWeight="bold">2024 Pickware</H5>
        </Stack>
      )}
    </Formik>
  );
}
