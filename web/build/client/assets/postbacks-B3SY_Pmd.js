import { r as s, x as t } from "./components-Be_8OGgv.js";
import {
  w as n,
  A as p,
  D as b,
  s as r,
  L as f,
  _ as a,
} from "./DashboardLayout-CHVXsdWb.js";
import { M as x, T as l } from "./Table-DZl5MJvO.js";
import { S as h } from "./SubNavbar-C-X8dpKw.js";
import { h as w } from "./index-BXCooODB.js";
import "./LoadingActivity-D2AtNIzl.js";
const E = () => [{ title: r("meta.title.filters") }],
  y = ["asn_description"];
function N() {
  const [e, c] = s.useState(void 0),
    [i, d] = s.useState();
  s.useEffect(() => {
    m();
  }, []);
  const m = s.useCallback(() => {
    n.axiosFactory("PRIVATE").then((o) => {
      o.get(n.apiEndpointFactory(p.GetAllPostbacks)).then((u) => {
        c(u.data.value);
      });
    });
  }, []);
  return t.jsxs(b, {
    subTitle: r("dashboard.subtitle.postbacks"),
    currentLeftActiveBarItem: f.POSTBACKS,
    children: [
      i &&
        t.jsx(x, {
          isBigModal: !0,
          onClose: () => d(void 0),
          title: "Overview request",
          children: t.jsx(l, { data: i, headers: ["Key", "Value"] }),
        }),
      t.jsx(h, { title: r("dashboard.subtitle.postbacks") }),
      t.jsxs("div", {
        className:
          "w-full flex flex-col justify-center items-start px-4 pt-2 pb-2.5 bg-white border-b border-b-gray-200",
        children: [
          t.jsxs("h2", {
            className: "text-sm font-bold",
            children: [
              "How to send postbacks ",
              t.jsx("span", {
                className: "text-gray-400",
                children: "(webhooks)",
              }),
              "?",
            ],
          }),
          t.jsx("p", {
            className: "text-xs font-normal text-gray-500",
            children:
              "Sending postbacks is very easy. Set up a posbek link in your affiliate program as follows:",
          }),
          typeof window < "u" &&
            t.jsxs("p", {
              className: "text-xs font-normal text-blue-500 block mt-2",
              children: [
                window.location.protocol,
                "//",
                window.location.hostname,
                "/service/postback?",
                "uuid={uuid}&date={date}&status={status}&ip={ip}&amount={amount}&stream={stream}&currency={currency}&time={time}",
              ],
            }),
        ],
      }),
      t.jsx(l, {
        headers:
          e &&
          (a.isEmpty(e)
            ? []
            : a
                .keys(a.omit(a.first(e), y))
                .map((o) => w(o).replace("Asn", "ASN"))),
        data: e,
      }),
    ],
  });
}
export { N as default, E as meta };
