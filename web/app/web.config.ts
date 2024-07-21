import axios from "axios";
import production from "./production";

export enum ApiPathEnum {
  Ping = "/ping",
  Playground= "/api/playground",
  CreateDataset = "/api/dataset/create",
  CampaignsByRequests = "/api/requests/selector/g/q/utm_campaign",
  CampaignsBySource = "/api/requests/selector/g/q/utm_source",
  SelectorRequests = "/api/requests/selector/g/q/",
  GetAllUsers = "/api/user/list",
  GetAllTemplatesList = "/api/explorer/template/list",
  GetResource = "/api/resource",
  GetAllFiles = "/api/file/list/all",
  GetListOfClicks = "/api/click/list/by/ip/",
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
  CreateTemplate = "/api/explorer/template/create",
  GetAllFilesShort = "/api/file/list/short",
  GetMoneyVolumeByPostbacks = "/api/postback/24h-amount",
  GetSummaryRequests = "/api/requests/summary",
  GetFunnelClicks = "/api/funnel/clicks",
  GetFunnelClicksDate = "/api/funnel/clicks/date",
  ExplorerExplore = "/api/explorer/explore",
  GetAllDatabasesList = "/api/explorer/databases/list",
  GetAllCollectionsList = "/api/explorer/collections/list",
  GetAllDatasetsList = "/api/dataset/list",
  GetAdsManagerCampaignsClicksHistory = "/api/adsmanager/campaign/clicks/history",
  GetAdsManagerCampaignsList = "/api/adsmanager/campaign/list",
  CreateAdsManagerCampaign = "/api/adsmanager/campaign/create",
  GetAllTriggersList = "/api/trigger/list",
  CreateTrigger = "/api/trigger/create",
  UpdateTrigger = "/api/trigger/update",
  GetTrigger = "/api/trigger",
  DeleteTrigger = "/api/trigger/delete",
  GetFunctionList = "/api/function/list",
  GetTriggersListByFunction = "/api/function/triggers/list",

  GetAllRemoteFunctions = "/api/function/list",
  CreateRemoteFunction = "/api/function/create",
  GetFunction = "/api/function",
  ReadFunction = "/api/function/read",
  DeleteFunction = "/api/function/delete",
  WriteFunction = "/api/function/write",
  RunFunctionWithDebugger = "/api/function/run/debug",

  CreateRoutes = "/api/route/create",
  CreateResources = "/api/resource/create",
  CreateFilters = "/api/filter/create",

  GetAllASNRecords = "/api/requests/asn/list",
  GetAllPostbacks = "/api/postback/list",
  GetAllClicks = "/api/click/list",
  GetAllResourceDrivers = "/api/resource/driver/list",
  GetAllFilterPlugins = "/api/filter/plugin/list",
  GetMappingClicks = "/api/click/ipMapping",

  GetAllScenarioLogs = "/api/scenario/logs/list",
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

  return _axios;
}

export const DEFAULT_FILTER_ROW = {
  name: "",
  value: undefined,
  operator: "==",
  plugin: undefined,
  resourceId: undefined,
};

export const OPERATORS = [
  { name: "==", value: "==" },
  { name: "!=", value: "!=" },
  { name: "~", value: "~" },
  { name: "in", value: "in" },
];

export const DEFAULT_PLUGINS = [
  {
    name: "🔥 BotDetect by User Agent",
    value: "ua::bot",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
    ],
  },

  {
    name: "🔥 IP",
    value: "ip",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "in list", value: "in" },
      { name: "contains", value: "~" },
    ],
  },
  {
    name: "🔥 Country by IP",
    value: "ip::country_code",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "in list", value: "in" },
      { name: "contains", value: "~" },
    ],
  },

  {
    name: "🔥 User Agent",
    value: "ua",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "in list", value: "in" },
      { name: "contains", value: "~" },
    ],
  },

  {
    name: "📡 Owner network by ASN",
    value: "asn::owner",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "in list", value: "in" },
      { name: "contains", value: "~" },
    ],
  },
  {
    name: "📡 Group of ASN",
    value: "asn::groups",
    operators: [{ name: "one of", value: "in" }],
  },
  {
    name: "📡 Country by ASN",
    value: "asn::country_code",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "in list", value: "in" },
      { name: "contains", value: "~" },
    ],
  },

  {
    name: "🕵️ Search Query Key",
    value: "request::query_bind",
    operators: [
      { name: "has key", value: "==" },
      { name: "dont has key", value: "!=" },
      { name: "has key like", value: "~" },
    ],
  },
  {
    name: "🕵️ DDOS",
    value: "is_ddos",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
    ],
  },
  {
    name: "🕵️ WebView",
    value: "is_webview",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
    ],
  },
  {
    name: "🕵️ Referer in spam list",
    value: "bad_referer",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
    ],
  },

  { name: "🎲 Random", value: "random", operators: [
    { name: ">", value: ">" }
  ] },

  {
    name: "👮 IPSUM",
    value: "traffic::ipsum",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
    ],
  },
  {
    name: "👮 IPSUM FULL",
    value: "traffic::ipsum_full",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
    ],
  },

  {
    name: "🛡️ Referrer",
    value: "referrer",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "in list", value: "in" },
      { name: "contains", value: "~" },
    ],
  },
  {
    name: "🛡️ Domain",
    value: "domain",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "in list", value: "in" },
      { name: "contains", value: "~" },
    ],
  },

  {
    name: "🛡️ Tor Traffic",
    value: "traffic::tor",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
    ],
  },
  {
    name: "🛡️ Cookies",
    value: "cookie::string",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "contains", value: "~" },
    ],
  },
  { name: "🛡️ Headers", value: "header::string" },
  {
    name: "🛡️ Session ID",
    value: "session_id",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "contains", value: "~" },
    ],
  },
  {
    name: "🛡️ Accept Language",
    value: "accept_language",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "in list", value: "in" },
      { name: "contains", value: "~" },
    ],
  },

  {
    name: "📦 User Agent Brand",
    value: "ua::device::brand",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "contains", value: "~" },
    ],
  },
  {
    name: "📦 User Agent Family",
    value: "ua::device::family",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "contains", value: "~" },
    ],
  },

  {
    name: "🚥 Clean Traffic",
    value: "request_guard",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: ">", value: ">" },
      { name: "<", value: "<" },
      { name: ">=", value: ">=" },
      { name: "<=", value: "<=" }
    ],
  },
  {
    name: "🔒 ProxyCheck",
    value: "proxycheck_io",
    operators: [
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
    ],
  },

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
