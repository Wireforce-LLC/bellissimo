import { r as l, x as e } from "./components-Be_8OGgv.js";
import {
  w as i,
  A as v,
  _ as c,
  s as d,
  D,
  L,
} from "./DashboardLayout-CHVXsdWb.js";
import { I as x, B as C, S as m } from "./Select-D-8QOF0t.js";
import { M as _, T as B } from "./Table-DZl5MJvO.js";
import { S as $ } from "./SubNavbar-C-X8dpKw.js";
import "./LoadingActivity-D2AtNIzl.js";
const O = [
    "facebook",
    "fb",
    "facebookexternalhit",
    "facebookexternalhit/1.1",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  ],
  G = ["bingbot", "bingpreview", "bingbot/2.0", "bing"],
  U = ["baidu"],
  Z = ["yandex"],
  H = [
    "amazon",
    "amazon-adsystem",
    "amazon-adsystem.com",
    "amazon-adsystem.com/3.0",
  ],
  W = [
    "google",
    "googlebot",
    "googlebot-news",
    "googlebot-image",
    "googlebot-video",
    "googlebot-mobile",
    "googlebot-sitemaps",
    "googlebot-mobile-sitemaps",
    "googlebot-ads",
    "googlebot-ads-sitemaps",
    "googleusercontent",
    "google-sitemap-generator",
    "google-sitemap",
    "google-sitemaps",
    "google-sitemap-xml",
    "google-sitemap-generator",
    "google-sitemap-generator-xml",
  ],
  q = ["instagram"],
  J = ["pinterest"],
  K = ["twitter"],
  Q = ["vk"],
  X = ["msn"],
  Y = ["w3c", "w3c-validator"],
  ee = [
    "bingpreview",
    "bingbot/2.0",
    "bingbot",
    "bingbot-news",
    "bingbot-image",
    "bingbot-video",
    "bingbot-mobile",
    "bingbot-sitemaps",
    "bingbot-mobile-sitemaps",
    "bingbot-ads",
    "bingbot-ads-sitemaps",
    "bing",
  ],
  te = ["yahoo"],
  oe = ["mozilla"],
  ae = ["duckduckbot"],
  se = ["coccoc"],
  ne = [
    "reddit",
    "redditbot",
    "redditbot/1.0",
    "redditbot/1.0 (http://www.reddit.com/bots)",
  ],
  le = {
    facebook: O,
    bing: G,
    baidu: U,
    yandex: Z,
    amazon: H,
    google: W,
    instagram: q,
    pinterest: J,
    twitter: K,
    vk: Q,
    msn: X,
    w3c: Y,
    microsoft: ee,
    yahoo: te,
    mozilla: oe,
    duckduckgo: ae,
    coccoc: se,
    reddit: ne,
  },
  pe = () => [{ title: d("meta.title.filters") }],
  re = [
    { name: "IP", value: "ip" },
    { name: "ASN Owner", value: "asn::owner" },
    { name: "User Agent", value: "ua" },
    { name: "Referrer", value: "referrer" },
    { name: "Domain", value: "domain" },
    { name: "Country by IP", value: "ip::country_code" },
    { name: "Country by ASN", value: "asn::country_code" },
    { name: "Cookies", value: "cookie::string" },
    { name: "Headers", value: "header::string" },
    { name: "Session ID", value: "session_id" },
    { name: "BotDetect by User Agent", value: "ua::bot" },
  ];
function be() {
  const g = { name: "", value: "", operator: "==", plugin: "", resourceId: "" },
    [h, N] = l.useState(void 0),
    [u, I] = l.useState(void 0),
    [f, A] = l.useState(0),
    [E, S] = l.useState([]),
    [R] = l.useState([
      { name: "==", value: "==" },
      { name: "!=", value: "!=" },
      { name: "~", value: "~" },
      { name: "in", value: "in" },
    ]),
    [p, j] = l.useState(),
    [b, y] = l.useState(),
    [n, r] = l.useState([g]),
    [F, w] = l.useState(!1);
  l.useEffect(() => {
    k();
  }, []),
    l.useEffect(() => {
      P();
    }, [F]);
  const k = l.useCallback(() => {
      i.axiosFactory("PRIVATE").then((o) => {
        o.get(i.apiEndpointFactory(v.Filters)).then((a) => {
          N(a.data.value);
        });
      }),
        i.axiosFactory("PRIVATE").then((o) => {
          o.get(i.apiEndpointFactory(v.GetAllFilterPlugins)).then((a) => {
            c.isArray(a.data.value) &&
              S(
                a.data.value.map((t) => {
                  var s;
                  return {
                    name:
                      ((s = re.find((T) => T.value === t)) == null
                        ? void 0
                        : s.name) || t,
                    value: t,
                  };
                })
              );
          });
        });
    }, []),
    P = l.useCallback(() => {
      i.axiosFactory("PRIVATE").then((o) => {
        o.get(i.apiEndpointFactory(v.Resources)).then((a) => {
          I(a.data.value);
        });
      });
    }, []),
    V = (o, a, t) => {
      switch (o) {
        case "asn::groups":
          return e.jsx(m, {
            label: "Filter value",
            values: Object.keys(le).map((s) => ({ name: s, value: s })),
            value: a,
            onChangeValue: t,
          });
        case "asn::owner":
          return e.jsx(m, {
            label: "Filter value",
            values: [{ value: "d", name: "d" }],
            value: a,
            onChangeValue: t,
          });
        default:
          return e.jsx(x, {
            label: "Filter value",
            className: "w-full",
            value: a,
            onChangeValue: t,
          });
      }
    },
    z = l.useCallback(() => {
      i.axiosFactory("PRIVATE").then((o) => {
        let a = new FormData();
        a.append("name", p),
          a.append("filter_id", b),
          n == null ||
            n.forEach((t, s) => {
              a.append(`conditions[${s}][name]`, t.name),
                a.append(`conditions[${s}][value]`, t.value),
                a.append(`conditions[${s}][operator]`, t.operator),
                a.append(`conditions[${s}][plugin]`, t.plugin),
                a.append(`conditions[${s}][resource_id]`, t.resourceId);
            }),
          o.post(i.apiEndpointFactory(v.CreateFilters), a).then((t) => {
            t.status == 201 && (k(), w(!1), r([g]), y(void 0), j(void 0));
          });
      });
    }, [b, p, n]),
    M = e.jsxs("div", {
      className: "w-full flex flex-col justify-center items-center py-8",
      children: [
        e.jsx("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          className: "size-10 mb-4",
          children: e.jsx("path", {
            fillRule: "evenodd",
            d: "M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z",
            clipRule: "evenodd",
          }),
        }),
        e.jsx("h1", {
          className: "text-md font-medium text-center mb-0 p-0",
          children: d("filters.create.resourcesNotFoundTitle"),
        }),
        e.jsx("p", {
          className: "text-xs text-center font-normal opacity-50 w-72",
          children: d("filters.create.resourcesNotFoundDescription"),
        }),
      ],
    });
  return e.jsxs(D, {
    subTitle: d("dashboard.subtitle.filters"),
    currentLeftActiveBarItem: L.FILTERS,
    children: [
      F &&
        e.jsx(_, {
          isBigModal: !0,
          title: "Create new filter",
          onClose: () => w(!1),
          children: e.jsxs("div", {
            className: "relative h-full w-full",
            children: [
              f == 0 &&
                e.jsx("div", {
                  className: "w-full h-full flex items-center justify-center",
                  children: e.jsxs("div", {
                    className: "flex items-center justify-center flex-col",
                    children: [
                      e.jsx("img", {
                        src: "/filter.png",
                        alt: "",
                        className: "h-40",
                      }),
                      e.jsxs("h2", {
                        className: "text-lg font-medium",
                        children: [
                          e.jsx("b", { children: "FilterEngine." }),
                          " Factory of new filters.",
                        ],
                      }),
                      e.jsx("p", {
                        className:
                          "text-xs text-gray-500 text-center w-[400px]",
                        children:
                          "Creating a filter to distribute traffic between resources. In the future, you will be able to reference the same filter multiple times",
                      }),
                      e.jsxs("div", {
                        className: "space-y-2 w-1/2 min-w-[400px] mt-8",
                        children: [
                          e.jsx(x, {
                            label: "Filter ID",
                            value: b,
                            onChangeValue: y,
                          }),
                          e.jsx(x, {
                            label: "Filter name",
                            value: p,
                            onChangeValue: j,
                          }),
                          e.jsx(C, {
                            onPress: () => {
                              b && p && A(1);
                            },
                            children: "Next",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              f == 1 &&
                e.jsx(e.Fragment, {
                  children: e.jsxs("div", {
                    className:
                      "w-full h-full absolute top-0 left-0 right-0 bottom-0 flex flex-col overflow-y-auto pb-32 overflow-x-auto space-y-4",
                    children: [
                      !u && M,
                      u &&
                        (n == null
                          ? void 0
                          : n.map((o, a) =>
                              e.jsx("div", {
                                children: e.jsxs("div", {
                                  className:
                                    "flex flex-row justify-between items-center space-x-2 h-14 w-full",
                                  children: [
                                    e.jsx(x, {
                                      label: "Filter name",
                                      value: o == null ? void 0 : o.name,
                                      onChangeValue: (t) => {
                                        const s = c.clone(n);
                                        (s[a].name = t), r(s);
                                      },
                                    }),
                                    e.jsx(m, {
                                      label: "Plugin",
                                      values: E,
                                      value: o == null ? void 0 : o.plugin,
                                      onChangeValue: (t) => {
                                        const s = c.clone(n);
                                        (s[a].plugin = t), r(s);
                                      },
                                    }),
                                    e.jsx(m, {
                                      label: "Operator",
                                      values: R,
                                      value: o == null ? void 0 : o.operator,
                                      onChangeValue: (t) => {
                                        const s = c.clone(n);
                                        (s[a].operator = t), r(s);
                                      },
                                    }),
                                    V(
                                      o == null ? void 0 : o.plugin,
                                      o == null ? void 0 : o.value,
                                      (t) => {
                                        const s = c.clone(n);
                                        (s[a].value = t), r(s);
                                      }
                                    ),
                                    e.jsx(m, {
                                      label: "Resource",
                                      values:
                                        u == null
                                          ? void 0
                                          : u.map((t) => ({
                                              name:
                                                t == null
                                                  ? void 0
                                                  : t.resource_id,
                                              value:
                                                t == null
                                                  ? void 0
                                                  : t.resource_id,
                                            })),
                                      value: o == null ? void 0 : o.resourceId,
                                      onChangeValue: (t) => {
                                        const s = c.clone(n);
                                        (s[a].resourceId = t), r(s);
                                      },
                                    }),
                                    e.jsx("svg", {
                                      onClick: () => {
                                        if (n.length > 1) {
                                          const t = c.clone(n);
                                          delete t[a], r(c.compact(t));
                                        } else r([g]);
                                      },
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      strokeWidth: 1.5,
                                      stroke: "currentColor",
                                      className:
                                        "w-6 h-6 flex-shrink-0 hover:text-red-800 hover:bg-red-100 cursor-pointer p-1 text-red-500",
                                      children: e.jsx("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M6 18 18 6M6 6l12 12",
                                      }),
                                    }),
                                  ],
                                }),
                              })
                            )),
                      u &&
                        e.jsx("button", {
                          className:
                            "w-full text-[#003049] bg-zinc-100 text-xs font-medium cursor-pointer py-2",
                          onClick: () => {
                            r([...n, g]);
                          },
                          children: "Add filter",
                        }),
                    ],
                  }),
                }),
              f == 1 &&
                e.jsx("div", {
                  className: "bottom-0 absolute left-0 right-0",
                  children: e.jsx(C, {
                    onPress: () => z(),
                    children: "Create",
                  }),
                }),
            ],
          }),
        }),
      e.jsx($, {
        title: d("dashboard.subtitle.filters"),
        onCreateAction: () => w(!0),
      }),
      e.jsx(B, {
        headers: ["Name", "Filter ID", "Conditions count"],
        data:
          h == null
            ? void 0
            : h.map((o) => ({ ...o, conditions: o.conditions.length })),
      }),
    ],
  });
}
export { be as default, pe as meta };
