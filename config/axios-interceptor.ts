import { AsyncStorageConfig } from "@/constants/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN = AsyncStorageConfig.accessToken;
const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = "http://localhost:3000";

const setupAxiosInterceptors = (onUnauthenticated: any) => {
  const onRequestSuccess = async (config: any) => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };
  const onResponseSuccess = (response: any) => response;
  const onResponseError = (err: any) => {
    if (err) {
      let status = null;
      if (err.status) {
        status = err.status || err.response.status;
      } else if (err.response != null) {
        status = err.response.status;
      }

      if (status === 403 || status === 401) {
        onUnauthenticated();
      }
    }
    return Promise.reject(err);
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
