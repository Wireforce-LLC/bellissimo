import axios from "axios";

export enum ApiPathEnum {
  Ping = "/ping",
  Routes = "/api/route/list",
  Filters = "/api/filter/list",
  Resources = "/api/resource/list",

  CreateRoutes = "/api/route/create",
  CreateResources = "/api/resource/create",
  CreateFilters = "/api/filter/create",
}

// API endpoint host
const API_ENDPOINT = process.env.NODE_ENV === 'development' ?
  "http://localhost:8000" :
  "/";

/* @deprecated */
const AXIOS_INSTANCE_PUBLIC = axios.create({
  baseURL: "/",
  headers: {
    'X-Database-Zone': ""
  }
});

async function getPrivateAxiosInstance() {
  return axios.create({
    baseURL: "/",
    headers: {
      
    }
  });
}

export default {
  apiEndpoint: API_ENDPOINT,

  apiEndpointFactory(pathWithoutHost: ApiPathEnum) {
    return API_ENDPOINT + pathWithoutHost;
  },

  async axiosFactory(mode: "PUBLIC" | "PRIVATE" = "PUBLIC") {
    switch (mode) {
      case "PRIVATE":
        return await getPrivateAxiosInstance();
      case "PUBLIC":
        return axios.create({
          baseURL: "/",
          headers: {}   
        });
    }
  },
};
