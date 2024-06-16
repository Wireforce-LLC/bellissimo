import { r as s, x as e } from "./components-Be_8OGgv.js";
import {
  w as i,
  A as h,
  s as d,
  D as J,
  L as K,
  _ as r,
  c as E,
} from "./DashboardLayout-CHVXsdWb.js";
import { h as Q } from "./index-BXCooODB.js";
import { h as R } from "./moment-C5S46NFB.js";
import { B as F, I as C, S } from "./Select-D-8QOF0t.js";
import { M as I, T as X } from "./Table-DZl5MJvO.js";
import { S as Y } from "./SubNavbar-C-X8dpKw.js";
import "./LoadingActivity-D2AtNIzl.js";
const ie = () => [{ title: d("meta.title.routes") }],
  O = [""];
function ce() {
  const [m, k] = s.useState(void 0),
    [V, p] = s.useState(!1),
    [f, T] = s.useState(),
    [l, L] = s.useState(),
    [c, Z] = s.useState(),
    [v, b] = s.useState(),
    [j, w] = s.useState(),
    [u, B] = s.useState(void 0),
    [x, M] = s.useState(void 0),
    [y, _] = s.useState(),
    [N, z] = s.useState("http"),
    [a, g] = s.useState(),
    [W, P] = s.useState(0),
    [H, D] = s.useState(0);
  s.useEffect(() => {
    const t = setInterval(() => {
      D(R().unix());
    }, 1e3);
    return () => clearInterval(t);
  }, []),
    s.useEffect(() => {
      _(window.location.hostname), z(window.location.protocol.replace(":", ""));
    }, []),
    s.useEffect(() => {
      A();
    }, []);
  const A = s.useCallback(() => {
    i.axiosFactory("PRIVATE").then((t) => {
      t.get(i.apiEndpointFactory(h.Routes)).then((o) => {
        k(o.data.value);
      });
    });
  }, []);
  s.useEffect(() => {
    i.axiosFactory("PRIVATE").then((t) => {
      t.get(i.apiEndpointFactory(h.Filters)).then((o) => {
        B(
          o.data.value.map((n) => ({
            value: n.filter_id,
            name: n.name || n.filter_id || "Without Name",
          }))
        );
      }),
        t.get(i.apiEndpointFactory(h.Resources)).then((o) => {
          M(
            o.data.value.map((n) => ({
              value: n.resource_id,
              name: `[${n.driver || "Without Driver"}] ` + n.resource_id,
            }))
          );
        });
    });
  }, []),
    s.useEffect(() => {
      var t, o;
      u &&
        x &&
        (b((t = u[0]) == null ? void 0 : t.value),
        w((o = x[0]) == null ? void 0 : o.value));
    }, [u, x]);
  const U = s.useCallback(() => {
      if (l != null && l.startsWith("/")) return;
      let t = new FormData();
      t.append("name", f),
        t.append("path", "/" + l),
        t.append("domain", c),
        t.append("filter_id", v),
        t.append("resource_id", j),
        i.axiosFactory("PRIVATE").then((o) => {
          o.post(i.apiEndpointFactory(h.CreateRoutes), t).then((n) => {
            n.status == 201 && (p(!1), A());
          });
        });
    }, [v, l, f, j]),
    $ = e.jsxs("div", {
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
          children: d("routes.create.resourcesNotFoundTitle"),
        }),
        e.jsx("p", {
          className: "text-xs text-center font-normal opacity-50",
          children: d("routes.create.resourcesNotFoundDescription"),
        }),
      ],
    }),
    q = e.jsxs("div", {
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
          children: d("routes.create.filtersNotFoundTitle"),
        }),
        e.jsx("p", {
          className: "text-xs text-center font-normal opacity-50",
          children: d("routes.create.filtersNotFoundDescription"),
        }),
      ],
    }),
    G = e.jsxs("div", {
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
          children: d("routes.create.anyNotFoundTitle"),
        }),
        e.jsx("p", {
          className: "text-xs text-center font-normal opacity-50",
          children: d("routes.create.anyNotFoundDescription"),
        }),
      ],
    });
  return e.jsxs(J, {
    subTitle: d("dashboard.subtitle.routes"),
    currentLeftActiveBarItem: K.ROUTES,
    children: [
      a &&
        e.jsxs(I, {
          onClose: () => g(void 0),
          title: "Overview route",
          children: [
            e.jsxs("div", {
              className: "w-full overflow-hidden mb-4",
              children: [
                e.jsx("h2", {
                  className: "text-xl font-medium text-left mb-0 p-0",
                  children: a == null ? void 0 : a.name,
                }),
                e.jsxs("p", {
                  className: "flex flex-row items-center mb-4",
                  children: [
                    e.jsx("span", {
                      className: "text-xs text-left font-normal text-blue-500",
                      children: a == null ? void 0 : a.domain,
                    }),
                    e.jsx("span", {
                      className: "text-xs text-left font-normal text-blue-500",
                      children: a == null ? void 0 : a.path,
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className:
                    "w-full flex flex-row justify-start items-center gap-2",
                  children: [
                    e.jsx("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 20 20",
                      fill: "currentColor",
                      className: "size-3",
                      children: e.jsx("path", {
                        fillRule: "evenodd",
                        d: "M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z",
                        clipRule: "evenodd",
                      }),
                    }),
                    e.jsx("span", {
                      className: "text-xs text-left font-normal text-black",
                      children: a == null ? void 0 : a.filter_id,
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className:
                    "w-full flex flex-row justify-start items-center gap-2",
                  children: [
                    e.jsx("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 20 20",
                      fill: "currentColor",
                      className: "size-3",
                      children: e.jsx("path", {
                        fillRule: "evenodd",
                        d: "M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z",
                        clipRule: "evenodd",
                      }),
                    }),
                    e.jsx("span", {
                      className: "text-xs text-left font-normal text-black",
                      children: a == null ? void 0 : a.resource_id,
                    }),
                  ],
                }),
              ],
            }),
            e.jsx(F, {
              variant: "delete",
              disabled: !(H - W > 3),
              onPress: () => {
                console.log(a),
                  i.axiosFactory("PRIVATE").then((t) => {
                    t.delete(i.apiEndpointFactory(h.Route) + a.name).then(
                      () => {
                        g(void 0);
                      }
                    );
                  });
              },
              children: "Delete",
            }),
          ],
        }),
      V &&
        e.jsxs(I, {
          title: "Create route",
          onClose: () => {
            p(!1);
          },
          children: [
            r.isEmpty(u) && !r.isEmpty(x) && q,
            !r.isEmpty(u) && r.isEmpty(x) && $,
            r.isEmpty(u) && r.isEmpty(x) && G,
            !r.isEmpty(u) &&
              !r.isEmpty(x) &&
              e.jsxs("div", {
                className: "space-y-4",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("div", {
                        className: "grid grid-cols-2 gap-2",
                        children: [
                          e.jsx(C, {
                            label: "Domain",
                            value: c,
                            className: E("outline-none w-full", {
                              "text-red-500 font-semibold":
                                (c == null
                                  ? void 0
                                  : c.startsWith("http://")) ||
                                (c == null ? void 0 : c.startsWith("https://")),
                            }),
                            onChangeValue: Z,
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("label", {
                                className:
                                  "text-xs text-gray-500 mb-[5px] block",
                                children: "Path",
                              }),
                              e.jsxs("div", {
                                className:
                                  "w-full flex flex-row h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
                                children: [
                                  e.jsxs("span", { children: [c || y, "/"] }),
                                  e.jsx("input", {
                                    value: l,
                                    onChange: (t) => L(t.target.value),
                                    type: "text",
                                    placeholder: "any-path",
                                    className: E("outline-none w-full", {
                                      "text-red-500 font-semibold":
                                        l == null ? void 0 : l.startsWith("/"),
                                      "text-zinc-500": !(
                                        l != null && l.startsWith("/")
                                      ),
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsx("span", {
                        className:
                          "text-xs w-[75%] mt-2 text-gray-400 mb-[5px] block",
                        children:
                          'Along this path, your traffic will be sent to the filter. The path can be nested, for example "/level1/level2"',
                      }),
                    ],
                  }),
                  e.jsx(C, { label: "Name", value: f, onChangeValue: T }),
                  e.jsx(S, {
                    label: "Resource",
                    value: j,
                    values: x,
                    onChangeValue: w,
                  }),
                  e.jsx(S, {
                    label: "Filter",
                    value: v,
                    values: u,
                    onChangeValue: b,
                  }),
                  e.jsx(F, { onPress: U, children: "Create" }),
                ],
              }),
          ],
        }),
      e.jsx(Y, {
        title: d("dashboard.subtitle.routes"),
        onCreateAction: () => p(!0),
      }),
      e.jsx(X, {
        headers:
          m &&
          (r.isEmpty(m)
            ? []
            : r
                .keys(r.omit(r.first(m), O))
                .map((t) => Q(t).replace("Asn", "ASN"))),
        data:
          m == null
            ? void 0
            : m.map((t) => ({
                ...t,
                name: e.jsx("span", {
                  onClick: () => {
                    i.axiosFactory("PRIVATE").then((o) => {
                      o.get(i.apiEndpointFactory(h.Route) + t.name).then(
                        (n) => {
                          g(n.data.value), P(R().unix());
                        }
                      );
                    });
                  },
                  className: "text-gray-400 hover:underline",
                  children: t.name,
                }),
                path: e.jsxs("div", {
                  className: "flex flex-row gap-1.5 items-center",
                  children: [
                    e.jsxs("svg", {
                      fill: "none",
                      stroke: "currentColor",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      viewBox: "0 0 24 24",
                      height: "1em",
                      width: "1em",
                      children: [
                        e.jsx("path", { stroke: "none", d: "M0 0h24v24H0z" }),
                        e.jsx("path", {
                          d: "M11 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-5M10 14L20 4M15 4h5v5",
                        }),
                      ],
                    }),
                    e.jsx("a", {
                      className: "hover:underline",
                      href:
                        N + "://" + (t.domain || y).replace(" ", "") + t.path,
                      target: "_blank",
                      children:
                        N + "://" + (t.domain || y).replace(" ", "") + t.path,
                    }),
                  ],
                }),
              })),
      }),
    ],
  });
}
export { ce as default, ie as meta };
