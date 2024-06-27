import axios from "axios";
import production from "./production";
import axiosRetry from 'axios-retry';

export enum ApiPathEnum {
  Ping = "/ping",
  CampaignsByRequests = "/api/requests/selector/g/q/utm_campaign",
  CampaignsBySource = "/api/requests/selector/g/q/utm_source",
  SelectorRequests = "/api/requests/selector/g/q/",
  GetResource = "/api/resource",
  GetAllFiles = "/api/file/list/all",
  GetFile = "/api/file/read",
  WriteFile = "/api/file/write",
  Routes = "/api/route/list",
  Filters = "/api/filter/list",
  Filter = "/api/filter",
  UpdateFilter = "/api/filter/update",
  Resources = "/api/resource/list",
  Resource = "/api/resource/",
  Route = "/api/route/",
  SelectGuard = "/api/requests/guard/",
  RouteSetPrams = "/api/resource/params",
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
  let _axios = axios.create({
    baseURL: "/",
    headers: {},
  });

  axiosRetry(_axios, { 
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay 
  });

  return _axios;
}

export const DEFAULT_FILTER_ROW = {
  name: "",
  value: "",
  operator: "==",
  plugin: "",
  resourceId: "",
};

export const OPEARTORS = [
  { name: "==", value: "==" },
  { name: "!=", value: "!=" },
  { name: "~", value: "~" },
  { name: "in", value: "in" },
];

export const DEFAULT_PLUGINS = [
  { name: "🔥 BotDetect by User Agent", value: "ua::bot" },

  { name: "🔥 IP", value: "ip" },
  { name: "🔥 Country by IP", value: "ip::country_code" },

  { name: "🔥 User Agent", value: "ua" },

  { name: "📡 Owner network by ASN", value: "asn::owner" },
  { name: "📡 Group of ASN", value: "asn::groups" },
  { name: "📡 Country by ASN", value: "asn::country_code" },

  { name: "🛡️ Referrer", value: "referrer" },
  { name: "🛡️ Domain", value: "domain" },

  { name: "🛡️ Tor Traffic", value: "traffic::tor" },
  { name: "🛡️ Cookies", value: "cookie::string" },
  { name: "🛡️ Headers", value: "header::string" },
  { name: "🛡️ Session ID", value: "session_id" },
  { name: "🛡️ Accept Language", value: "accept_language" },

  { name: "📦 User Agent Brand", value: "ua::device::brand" },
  { name: "📦 User Agent Family", value: "ua::device::family" },

  { name: "🚥 Clean Traffic", value: "request_guard" },
  { name: "🔒 ProxyCheck", value: "proxycheck_io" },

  { name: "🚧 Other", value: "other" },
  { name: "🚧 Unknown", value: "unknown" },
];

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
