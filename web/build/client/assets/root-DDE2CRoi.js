import {
  u as x,
  y as p,
  z as y,
  A as f,
  r as n,
  _ as S,
  x as e,
  O as j,
  M as w,
  L as g,
  S as k,
} from "./components-Be_8OGgv.js";
import { I as M } from "./index-kUoaJ0iR.js";
/**
 * @remix-run/react v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ let a = "positions";
function O({ getKey: t, ...l }) {
  let { isSpaMode: c } = x(),
    o = p(),
    u = y();
  f({ getKey: t, storageKey: a });
  let d = n.useMemo(() => {
    if (!t) return null;
    let s = t(o, u);
    return s !== o.key ? s : null;
  }, []);
  if (c) return null;
  let h = ((s, m) => {
    if (!window.history.state || !window.history.state.key) {
      let r = Math.random().toString(32).slice(2);
      window.history.replaceState({ key: r }, "");
    }
    try {
      let i = JSON.parse(sessionStorage.getItem(s) || "{}")[
        m || window.history.state.key
      ];
      typeof i == "number" && window.scrollTo(0, i);
    } catch (r) {
      console.error(r), sessionStorage.removeItem(s);
    }
  }).toString();
  return n.createElement(
    "script",
    S({}, l, {
      suppressHydrationWarning: !0,
      dangerouslySetInnerHTML: {
        __html: `(${h})(${JSON.stringify(a)}, ${JSON.stringify(d)})`,
      },
    })
  );
}
const v = "/assets/tailwind-D_VndJrC.css",
  _ = () => [{ rel: "stylesheet", href: v }];
function J({ children: t }) {
  return e.jsxs("html", {
    lang: "en",
    className: "dark-off",
    children: [
      e.jsxs("head", {
        children: [
          e.jsx("meta", { charSet: "utf-8" }),
          e.jsx("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1",
          }),
          e.jsx(w, {}),
          e.jsx(g, {}),
        ],
      }),
      e.jsxs("body", {
        children: [
          e.jsx("main", { children: t }),
          e.jsx("div", {
            children: e.jsx(M, { position: "bottom-right", reverseOrder: !1 }),
          }),
          e.jsx(O, {}),
          e.jsx(k, {}),
        ],
      }),
    ],
  });
}
function N() {
  return e.jsx(j, {});
}
export { J as Layout, N as default, _ as links };
