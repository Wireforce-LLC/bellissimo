import { r as f, x as s } from "./components-Be_8OGgv.js";
import {
  w as v,
  A,
  D as N,
  s as h,
  L as S,
  _ as o,
} from "./DashboardLayout-CHVXsdWb.js";
import { h as D } from "./moment-C5S46NFB.js";
import { M as E, T as _ } from "./Table-DZl5MJvO.js";
import { S as C } from "./SubNavbar-C-X8dpKw.js";
import { h as O } from "./index-BXCooODB.js";
import "./LoadingActivity-D2AtNIzl.js";
function R(t) {
  return (
    t &&
    t.constructor &&
    typeof t.constructor.isBuffer == "function" &&
    t.constructor.isBuffer(t)
  );
}
function q(t) {
  return t;
}
function B(t, a) {
  a = a || {};
  const u = a.delimiter || ".",
    l = a.maxDepth,
    m = a.transformKey || q,
    e = {};
  function r(d, i, n) {
    (n = n || 1),
      Object.keys(d).forEach(function (p) {
        const c = d[p],
          b = a.safe && Array.isArray(c),
          x = Object.prototype.toString.call(c),
          g = R(c),
          w = x === "[object Object]" || x === "[object Array]",
          y = i ? i + u + m(p) : m(p);
        if (!b && !g && w && Object.keys(c).length && (!a.maxDepth || n < l))
          return r(c, y, n + 1);
        e[y] = c;
      });
  }
  return r(t), e;
}
const z = () => [{ title: h("meta.title.filters") }],
  j = ["asn_description", "asn_number", "route_way"];
function P() {
  const [t, a] = f.useState(void 0),
    [u, l] = f.useState();
  f.useEffect(() => {
    m();
  }, []);
  const m = f.useCallback(() => {
    v.axiosFactory("PRIVATE").then((e) => {
      e.get(v.apiEndpointFactory(A.GetAllASNRecords)).then((r) => {
        a(r.data.value);
      });
    });
  }, []);
  return s.jsxs(N, {
    subTitle: h("dashboard.subtitle.asnRecords"),
    currentLeftActiveBarItem: S.ASN_RECORDS,
    children: [
      u &&
        s.jsx(E, {
          isBigModal: !0,
          onClose: () => l(void 0),
          title: "Overview request",
          children: s.jsx("div", {
            className: "w-full overflow-hidden",
            children: s.jsx(_, {
              data: u.map(([e, r]) =>
                e == "route_way"
                  ? { key: e, value: "Data is corrupted" }
                  : e == "query"
                  ? { key: e, value: "Data is corrupted" }
                  : { key: e, value: r }
              ),
              headers: ["Key", "Value"],
            }),
          }),
        }),
      s.jsx(C, { title: h("dashboard.subtitle.asnRecords") }),
      s.jsx(_, {
        headers:
          t &&
          (o.isEmpty(t)
            ? []
            : o
                .keys(o.omit(o.first(t), j))
                .map((e) => O(e).replace("Asn", "ASN"))),
        data:
          t == null
            ? void 0
            : t.map((e, r) => {
                var i, n;
                const d = {
                  ...e,
                  request_id: s.jsx("span", {
                    onClick: () => {
                      l(o.toPairs(B(t[r]) || {}));
                    },
                    className: "text-gray-400 hover:underline",
                    children: e.request_id,
                  }),
                  time: s.jsx("span", {
                    className: "text-gray-400",
                    children: D(e.time / 1e3).format("DD.MM.YYYY HH:mm"),
                  }),
                  headers: s.jsxs("span", {
                    children: [
                      s.jsx("span", { children: o.size(e.headers) }),
                      " ",
                      s.jsx("span", {
                        className: "text-gray-400",
                        children: "times",
                      }),
                    ],
                  }),
                  route_way: e.route_way ? "Existing" : "Unknown",
                  query: e.query ? "Yes" : "No",
                  asn_country_code:
                    (e == null ? void 0 : e.asn_country_code) &&
                    s.jsxs("span", {
                      className: "flex items-center flex-row gap-2",
                      children: [
                        s.jsx("img", {
                          className: "size-3",
                          alt: "United States",
                          src: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${
                            (i = e == null ? void 0 : e.asn_country_code) ==
                            null
                              ? void 0
                              : i.toUpperCase()
                          }.svg`,
                        }),
                        s.jsx("span", {
                          className: "font-medium",
                          children:
                            (n = e == null ? void 0 : e.asn_country_code) ==
                            null
                              ? void 0
                              : n.toUpperCase(),
                        }),
                      ],
                    }),
                };
                return o.omit(d, j);
              }),
      }),
    ],
  });
}
export { P as default, z as meta };
