import { x as e, r as a } from "./components-Be_8OGgv.js";
import {
  _ as x,
  w as l,
  A as m,
  D as A,
  s as H,
  L as P,
  c as B,
} from "./DashboardLayout-CHVXsdWb.js";
import { _ as b } from "./index-kUoaJ0iR.js";
import { I as F, S as E, B as I } from "./Select-D-8QOF0t.js";
import { M as D, T as _ } from "./Table-DZl5MJvO.js";
import { S as k } from "./SubNavbar-C-X8dpKw.js";
import "./LoadingActivity-D2AtNIzl.js";
function J({
  placeholder: o,
  isDisabled: c,
  label: i,
  isRequired: g,
  name: s,
  onChangeValue: h,
  value: d,
}) {
  return e.jsxs("div", {
    "data-role": "input-group",
    children: [
      i
        ? e.jsx("label", {
            className: "text-xs text-gray-500 mb-[5px] block",
            children: i,
          })
        : void 0,
      e.jsx("textarea", {
        value: d,
        name: s,
        rows: 6,
        required: g,
        disabled: x.isBoolean(c) ? c : !1,
        onChange: (f) => {
          h && h(f.target.value);
        },
        placeholder: o,
        className:
          "w-full px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
      }),
    ],
  });
}
const X = () => [{ title: H("meta.title.filters") }],
  n = [
    {
      name: "JSON",
      description: "Return JSON data",
      value: "json",
      rules: { valueType: "any" },
    },
    {
      name: "HTML",
      description: "Render single HTML page",
      value: "html",
      rules: { valueType: "file" },
    },
    {
      name: "JavaScript Redirect",
      description: "Redirect to other path with JS",
      value: "redirect::javascript",
      rules: { valueType: "raw" },
    },
    {
      name: "Meta Redirect",
      description: "Redirect to other path with <meta>",
      value: "redirect::meta",
      rules: { valueType: "raw" },
    },
    {
      name: "HTML Proxy",
      description: "Reverse proxy, like target site hosted in this resource",
      value: "proxy::html",
      rules: { valueType: "raw" },
    },
    {
      name: "PHP",
      description: "Render PHP page",
      value: "php",
      rules: { valueType: "file" },
    },
    {
      name: "HTTP Status Page",
      description: "Render HTTP status page with message",
      value: "http_status_page",
      rules: { valueType: "raw" },
    },
  ];
function Y() {
  const [o, c] = a.useState(void 0),
    [i, g] = a.useState(void 0),
    [s, h] = a.useState(0),
    [d, f] = a.useState(n),
    [u, S] = a.useState(),
    [j, T] = a.useState(d[0].value),
    [v, C] = a.useState(),
    [p, N] = a.useState(),
    [V, w] = a.useState(!1);
  a.useEffect(() => {
    R(),
      l.axiosFactory("PRIVATE").then((t) => {
        t.get(l.apiEndpointFactory(m.GetAllFilesShort)).then((r) => {
          g(r.data.value), r.data.value && C(x.first(r.data.value));
        });
      }),
      l.axiosFactory("PRIVATE").then((t) => {
        t.get(l.apiEndpointFactory(m.GetAllResourceDrivers)).then((r) => {
          const y = n.concat(
              r.data.value.map((M) => ({
                name: M,
                description: "Driver from other suppliers",
                value: M,
              }))
            ),
            z = x.uniqBy(y, "value");
          f(z);
        });
      });
  }, []);
  const R = a.useCallback(() => {
      l.axiosFactory("PRIVATE").then((t) => {
        t.get(l.apiEndpointFactory(m.Resources)).then((r) => {
          c(r.data.value);
        });
      });
    }, []),
    L = a.useCallback(() => {
      let t = new FormData();
      u &&
        (t.append("resource_id", u || ""),
        t.append("driver", j || ""),
        s == 0 && t.append("file_path", v || ""),
        s == 1 && t.append("raw_data", p || ""),
        l.axiosFactory("PRIVATE").then((r) => {
          r.post(l.apiEndpointFactory(m.CreateResources), t)
            .then((y) => {
              y.status == 201
                ? (w(!1), R(), b.success("Resource created"))
                : b.error("Resource not created");
            })
            .catch(() => {
              b.error("Resource not created");
            });
        }));
    }, [p, j, v, u, s]);
  return e.jsxs(A, {
    subTitle: H("dashboard.subtitle.resources"),
    currentLeftActiveBarItem: P.RESOURCES,
    children: [
      V &&
        e.jsx(D, {
          title: "Create new resource",
          onClose: () => {
            w(!1);
          },
          children: e.jsxs("div", {
            className: "space-y-4 pt-2",
            children: [
              e.jsx(F, { label: "Resource ID", value: u, onChangeValue: S }),
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className: "text-xs text-gray-400 mb-[5px] block",
                    children: "Driver",
                  }),
                  e.jsx("div", {
                    className: "grid grid-cols-3 gap-2",
                    children: d.map((t) =>
                      e.jsxs("div", {
                        onClick: () => T(t.value),
                        className: B(
                          "w-full cursor-pointer px-2 py-1 border border-gray-200",
                          { "border-blue-500 bg-blue-50": j == t.value }
                        ),
                        children: [
                          e.jsx("h4", {
                            className: "text-sm font-regular",
                            children: t.name,
                          }),
                          e.jsx("p", {
                            className: "text-[10px] w-[80%] text-gray-400",
                            children: t.description,
                          }),
                        ],
                      })
                    ),
                  }),
                  e.jsx("span", {
                    className:
                      "text-xs w-[75%] mt-2 text-gray-400 mb-[5px] block",
                    children:
                      "The driver is the method by which the response will be displayed to the user when he visits the page with this resource.",
                  }),
                ],
              }),
              s == 0 &&
                e.jsx(E, {
                  label: "Content type",
                  values:
                    (i == null
                      ? void 0
                      : i.map((t) => ({ name: t, value: t }))) || [],
                  value: v,
                  onChangeValue: C,
                }),
              s == 1 &&
                e.jsx(J, {
                  label: "Regular content",
                  value: p,
                  onChangeValue: N,
                }),
              e.jsx("a", {
                className: "text-blue-500 text-xs",
                href: "#",
                onClick: () => h(s == 0 ? 1 : 0),
                children: "Toogle content type",
              }),
              e.jsx(I, { disabled: !v && !p, onPress: L, children: "Create" }),
            ],
          }),
        }),
      e.jsx(k, {
        title: H("dashboard.subtitle.resources"),
        onCreateAction: () => w(!0),
      }),
      e.jsx(_, {
        headers: ["Resource ID", "Driver", "Content", "File path"],
        data:
          o == null
            ? void 0
            : o.map((t) => ({
                ...t,
                driver: e.jsxs(e.Fragment, {
                  children: [
                    !(n != null && n.map((r) => r.value).includes(t.driver)) &&
                      e.jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          e.jsx("svg", {
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: e.jsx("path", {
                              d: "M20 14v4a2 2 0 01-2 2h-4v-2a2 2 0 00-2-2 2 2 0 00-2 2v2H6a2 2 0 01-2-2v-4H2a2 2 0 01-2-2 2 2 0 012-2h2V6c0-1.1.9-2 2-2h4V2a2 2 0 012-2 2 2 0 012 2v2h4a2 2 0 012 2v4h-2a2 2 0 00-2 2 2 2 0 002 2h2z",
                            }),
                          }),
                          e.jsx("span", { children: t.driver }),
                        ],
                      }),
                    t.driver == "json" &&
                      e.jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          e.jsx("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: e.jsx("path", {
                              d: "M5 3h2v2H5v5a2 2 0 01-2 2 2 2 0 012 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 00-2-2H0v-2h1a2 2 0 002-2V5a2 2 0 012-2m14 0a2 2 0 012 2v4a2 2 0 002 2h1v2h-1a2 2 0 00-2 2v4a2 2 0 01-2 2h-2v-2h2v-5a2 2 0 012-2 2 2 0 01-2-2V5h-2V3h2m-7 12a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m-4 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m8 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1z",
                            }),
                          }),
                          e.jsx("span", { children: "JSON" }),
                        ],
                      }),
                    t.driver == "php" &&
                      e.jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          e.jsx("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: e.jsx("path", {
                              d: "M12 18.08c-6.63 0-12-2.72-12-6.08s5.37-6.08 12-6.08S24 8.64 24 12s-5.37 6.08-12 6.08m-5.19-7.95c.54 0 .91.1 1.09.31.18.2.22.56.13 1.03-.1.53-.29.87-.58 1.09-.28.22-.71.33-1.29.33h-.87l.53-2.76h.99m-3.5 5.55h1.44l.34-1.75h1.23c.54 0 .98-.06 1.33-.17.35-.12.67-.31.96-.58.24-.22.43-.46.58-.73.15-.26.26-.56.31-.88.16-.78.05-1.39-.33-1.82-.39-.44-.99-.65-1.82-.65H4.59l-1.28 6.58m7.25-8.33l-1.28 6.58h1.42l.74-3.77h1.14c.36 0 .6.06.71.18.11.12.13.34.07.66l-.57 2.93h1.45l.59-3.07c.13-.62.03-1.07-.27-1.36-.3-.27-.85-.4-1.65-.4h-1.27L12 7.35h-1.44M18 10.13c.55 0 .91.1 1.09.31.18.2.22.56.13 1.03-.1.53-.29.87-.57 1.09-.29.22-.72.33-1.3.33h-.85l.5-2.76h1m-3.5 5.55h1.44l.34-1.75h1.22c.55 0 1-.06 1.35-.17.35-.12.65-.31.95-.58.24-.22.44-.46.58-.73.15-.26.26-.56.32-.88.15-.78.04-1.39-.34-1.82-.36-.44-.99-.65-1.82-.65h-2.75l-1.29 6.58z",
                            }),
                          }),
                          e.jsx("span", { children: "PHP" }),
                        ],
                      }),
                    t.driver == "html" &&
                      e.jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          e.jsx("svg", {
                            viewBox: "0 0 384 512",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: e.jsx("path", {
                              d: "M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z",
                            }),
                          }),
                          e.jsx("span", { children: "Single HTML" }),
                        ],
                      }),
                    t.driver == "redirect::javascript" &&
                      e.jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          e.jsx("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: e.jsx("path", {
                              d: "M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z",
                            }),
                          }),
                          e.jsx("svg", {
                            fill: "currentColor",
                            viewBox: "0 0 16 16",
                            height: "1em",
                            width: "1em",
                            children: e.jsx("path", {
                              d: "M2 2a2 2 0 00-2 2v1a2 2 0 002 2h5.5v3A1.5 1.5 0 006 11.5H.5a.5.5 0 000 1H6A1.5 1.5 0 007.5 14h1a1.5 1.5 0 001.5-1.5h5.5a.5.5 0 000-1H10A1.5 1.5 0 008.5 10V7H14a2 2 0 002-2V4a2 2 0 00-2-2H2zm.5 3a.5.5 0 110-1 .5.5 0 010 1zm2 0a.5.5 0 110-1 .5.5 0 010 1z",
                            }),
                          }),
                          e.jsx("span", { children: "JavaScript Redirect" }),
                        ],
                      }),
                    t.driver == "redirect::meta" &&
                      e.jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          e.jsx("svg", {
                            viewBox: "0 0 16 16",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: e.jsx("path", {
                              fill: "currentColor",
                              d: "M.946 0L2.23 14.4 7.992 16l5.777-1.602L15.055 0H.947zM12.26 4.71H5.502l.161 1.809H12.1l-.485 5.422-3.623 1.004-3.618-1.004-.247-2.774H5.9l.126 1.41 1.967.53.004-.001 1.968-.531.204-2.29H4.048l-.476-5.341h8.847l-.158 1.766z",
                            }),
                          }),
                          e.jsx("svg", {
                            fill: "currentColor",
                            viewBox: "0 0 16 16",
                            height: "1em",
                            width: "1em",
                            children: e.jsx("path", {
                              d: "M2 2a2 2 0 00-2 2v1a2 2 0 002 2h5.5v3A1.5 1.5 0 006 11.5H.5a.5.5 0 000 1H6A1.5 1.5 0 007.5 14h1a1.5 1.5 0 001.5-1.5h5.5a.5.5 0 000-1H10A1.5 1.5 0 008.5 10V7H14a2 2 0 002-2V4a2 2 0 00-2-2H2zm.5 3a.5.5 0 110-1 .5.5 0 010 1zm2 0a.5.5 0 110-1 .5.5 0 010 1z",
                            }),
                          }),
                          e.jsx("span", { children: "Meta Redirect" }),
                        ],
                      }),
                    t.driver == "proxy::html" &&
                      e.jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          e.jsx("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: e.jsx("path", {
                              d: "M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6 16.59c0 .705-.646 1.29-1.529 1.29-.631 0-1.351-.255-1.801-.81l-6-7.141v6.66c0 .721-.57 1.29-1.274 1.29H7.32c-.721 0-1.29-.6-1.29-1.29V7.41c0-.705.63-1.29 1.5-1.29.646 0 1.38.255 1.83.81l5.97 7.141V7.41c0-.721.6-1.29 1.29-1.29h.075c.72 0 1.29.6 1.29 1.29v9.18H18z",
                            }),
                          }),
                          e.jsx("span", { children: "Proxy Rewrite" }),
                        ],
                      }),
                  ],
                }),
                raw_content: t.raw_content ? x.take(t.raw_content, 64) : void 0,
              })),
      }),
    ],
  });
}
export { Y as default, X as meta };
