import axios from "axios";
import production from "./production";

export enum ApiPathEnum {
  Ping = "/ping",
  GetResource = "/api/resource",
  GetAllFiles = "/api/file/list/all",
  GetFile = "/api/file/read",
  WriteFile = "/api/file/write",
  Routes = "/api/route/list",
  Filters = "/api/filter/list",
  Resources = "/api/resource/list",
  Resource = "/api/resource/",
  Route = "/api/route/",
  RouteSetPrams = "/api/resource/setParams",
  CreateFile = "/api/file/create",
  GetAllFilesShort = "/api/file/list/short",
  GetMoneyVolumeByPostbacks = "/api/postback/24h-amount",
  GetSummaryRequests = "/api/requests/summary",

  CreateRoutes = "/api/route/create",
  CreateResources = "/api/resource/create",
  CreateFilters = "/api/filter/create",

  GetAllASNRecords = "/api/requests/asn/list",
  GetAllPostbacks = "/api/postback/list",
  GetAllResourceDrivers = "/api/resource/driver/list",
  GetAllFilterPlugins = "/api/filter/plugin/list",
}

// API endpoint host
const API_ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : production.API_HOST;

/* @deprecated */
const AXIOS_INSTANCE_PUBLIC = axios.create({
  baseURL: "/",
  headers: {
    "X-Database-Zone": "",
  },
});

async function getPrivateAxiosInstance() {
  return axios.create({
    baseURL: "/",
    headers: {},
  });
}

export const DRIVERS = [
  {
    name: "JSON",
    description: "Return JSON data",
    value: "json",
    rules: {
      valueType: "any",
    },
  },
  {
    name: "HTML",
    description: "Render single HTML page",
    value: "html",
    rules: {
      valueType: "file",
    },
  },
  {
    name: "JavaScript Redirect",
    description: "Redirect to other path with JS",
    value: "redirect::javascript",
    rules: {
      valueType: "raw",
    },
  },
  {
    name: "WebManifest",
    description: "For Progressive Web App (PWA)",
    value: "webmanifest",
    rules: {
      valueType: "raw",
    },
  },
  {
    name: "Meta Redirect",
    description: "Redirect to other path with <meta>",
    value: "redirect::meta",
    rules: {
      valueType: "raw",
    },
  },
  {
    name: "Tunnel",
    description: "Reverse proxy, like target site hosted in this resource",
    value: "proxy::html",
    rules: {
      valueType: "raw",
    },
  },
  {
    name: "JavaScript (.js) file",
    value: "file::javascript",
    description: "Serve static javascript file",
    rules: {
      valueType: "any",
    },
  },
  {
    name: "CSS (.css) file",
    value: "file::css",
    description: "Serve static css file",
    rules: {
      valueType: "any",
    },
  },
  {
    name: "Any file",
    value: "file::plain",
    description: "Serve static plain/text file",
    rules: {
      valueType: "any",
    },
  },
  {
    name: "PHP",
    description: "Render PHP page",
    value: "php",
    rules: {
      valueType: "file",
    },
  },
  {
    name: "HTTP Status Page",
    description: "Render HTTP status page with message",
    value: "http_status_page",
    rules: {
      valueType: "raw",
    },
  },
];

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
          headers: {},
        });
    }
  },
};
