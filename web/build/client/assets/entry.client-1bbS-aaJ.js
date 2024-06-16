import {
  r as n,
  i as Y,
  u as W,
  S as q,
  E as C,
  a as $,
  l as J,
  p as I,
  b as V,
  f as G,
  c as K,
  d as Q,
  e as Z,
  g as ee,
  h as te,
  j as re,
  k as oe,
  m as ne,
  n as ae,
  o as ie,
  q as le,
  s as se,
  t as de,
  R as ue,
  v as ce,
  w as me,
  x as P,
} from "./components-Be_8OGgv.js";
/**
 * @remix-run/react v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ class fe extends n.Component {
  constructor(t) {
    super(t), (this.state = { error: t.error || null, location: t.location });
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, r) {
    return r.location !== t.location
      ? { error: t.error || null, location: t.location }
      : { error: t.error || r.error, location: r.location };
  }
  render() {
    return this.state.error
      ? n.createElement(T, { error: this.state.error })
      : this.props.children;
  }
}
function T({ error: e }) {
  console.error(e);
  let t = n.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `
        console.log(
          "💿 Hey developer 👋. You can provide a way better UX than this when your app throws errors. Check out https://remix.run/guides/errors for more information."
        );
      `,
    },
  });
  if (Y(e))
    return n.createElement(
      B,
      { title: "Unhandled Thrown Response!" },
      n.createElement(
        "h1",
        { style: { fontSize: "24px" } },
        e.status,
        " ",
        e.statusText
      ),
      t
    );
  let r;
  if (e instanceof Error) r = e;
  else {
    let a =
      e == null
        ? "Unknown Error"
        : typeof e == "object" && "toString" in e
        ? e.toString()
        : JSON.stringify(e);
    r = new Error(a);
  }
  return n.createElement(
    B,
    { title: "Application Error!" },
    n.createElement("h1", { style: { fontSize: "24px" } }, "Application Error"),
    n.createElement(
      "pre",
      {
        style: {
          padding: "2rem",
          background: "hsla(10, 50%, 50%, 0.1)",
          color: "red",
          overflow: "auto",
        },
      },
      r.stack
    ),
    t
  );
}
function B({ title: e, renderScripts: t, children: r }) {
  var a;
  let { routeModules: o } = W();
  return (a = o.root) !== null && a !== void 0 && a.Layout
    ? r
    : n.createElement(
        "html",
        { lang: "en" },
        n.createElement(
          "head",
          null,
          n.createElement("meta", { charSet: "utf-8" }),
          n.createElement("meta", {
            name: "viewport",
            content: "width=device-width,initial-scale=1,viewport-fit=cover",
          }),
          n.createElement("title", null, e)
        ),
        n.createElement(
          "body",
          null,
          n.createElement(
            "main",
            { style: { fontFamily: "system-ui, sans-serif", padding: "2rem" } },
            r,
            t ? n.createElement(q, null) : null
          )
        )
      );
}
/**
 * @remix-run/react v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function we(e) {
  if (!e) return null;
  let t = Object.entries(e),
    r = {};
  for (let [a, o] of t)
    if (o && o.__type === "RouteErrorResponse")
      r[a] = new C(o.status, o.statusText, o.data, o.internal === !0);
    else if (o && o.__type === "Error") {
      if (o.__subType) {
        let s = window[o.__subType];
        if (typeof s == "function")
          try {
            let f = new s(o.message);
            (f.stack = o.stack), (r[a] = f);
          } catch {}
      }
      if (r[a] == null) {
        let s = new Error(o.message);
        (s.stack = o.stack), (r[a] = s);
      }
    } else r[a] = o;
  return r;
}
/**
 * @remix-run/react v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function he() {
  return n.createElement(
    B,
    { title: "Loading...", renderScripts: !0 },
    n.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: `
              console.log(
                "💿 Hey developer 👋. You can provide a way better UX than this " +
                "when your app is running \`clientLoader\` functions on hydration. " +
                "Check out https://remix.run/route/hydrate-fallback for more information."
              );
            `,
      },
    })
  );
}
/**
 * @remix-run/react v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function z(e) {
  let t = {};
  return (
    Object.values(e).forEach((r) => {
      let a = r.parentId || "";
      t[a] || (t[a] = []), t[a].push(r);
    }),
    t
  );
}
function _e(e, t, r) {
  let a = X(t),
    o =
      t.HydrateFallback && (!r || e.id === "root")
        ? t.HydrateFallback
        : e.id === "root"
        ? he
        : void 0,
    s = t.ErrorBoundary
      ? t.ErrorBoundary
      : e.id === "root"
      ? () => n.createElement(T, { error: V() })
      : void 0;
  return e.id === "root" && t.Layout
    ? {
        ...(a
          ? {
              element: n.createElement(
                t.Layout,
                null,
                n.createElement(a, null)
              ),
            }
          : { Component: a }),
        ...(s
          ? {
              errorElement: n.createElement(
                t.Layout,
                null,
                n.createElement(s, null)
              ),
            }
          : { ErrorBoundary: s }),
        ...(o
          ? {
              hydrateFallbackElement: n.createElement(
                t.Layout,
                null,
                n.createElement(o, null)
              ),
            }
          : { HydrateFallback: o }),
      }
    : { Component: a, ErrorBoundary: s, HydrateFallback: o };
}
function Re(e, t, r, a, o, s) {
  return F(t, r, a, o, s, "", z(t), e);
}
function g(e, t, r) {
  if (r) {
    let f = `You cannot call ${
      e === "action" ? "serverAction()" : "serverLoader()"
    } in SPA Mode (routeId: "${t.id}")`;
    throw (console.error(f), new C(400, "Bad Request", new Error(f), !0));
  }
  let o = `You are trying to call ${
    e === "action" ? "serverAction()" : "serverLoader()"
  } on a route that does not have a server ${e} (routeId: "${t.id}")`;
  if ((e === "loader" && !t.hasLoader) || (e === "action" && !t.hasAction))
    throw (console.error(o), new C(400, "Bad Request", new Error(o), !0));
}
function A(e, t) {
  let r = e === "clientAction" ? "a" : "an",
    a = `Route "${t}" does not have ${r} ${e}, but you are trying to submit to it. To fix this, please add ${r} \`${e}\` function to the route`;
  throw (console.error(a), new C(405, "Method Not Allowed", new Error(a), !0));
}
function F(e, t, r, a, o, s = "", f = z(e), _) {
  return (f[s] || []).map((i) => {
    let d = t[i.id];
    async function y(u, l, m) {
      if (typeof m == "function") return await m();
      let c = await ye(u, i);
      return l ? ve(c) : c;
    }
    function R(u, l, m) {
      return i.hasLoader ? y(u, l, m) : Promise.resolve(null);
    }
    function v(u, l, m) {
      if (!i.hasAction) throw A("action", i.id);
      return y(u, l, m);
    }
    async function x(u) {
      let l = t[i.id],
        m = l ? I(i, l) : Promise.resolve();
      try {
        return u();
      } finally {
        await m;
      }
    }
    let h = { id: i.id, index: i.index, path: i.path };
    if (d) {
      var M, L, k;
      Object.assign(h, {
        ...h,
        ..._e(i, d, o),
        handle: d.handle,
        shouldRevalidate: _
          ? j(i.id, d.shouldRevalidate, _)
          : d.shouldRevalidate,
      });
      let u =
          r == null || (M = r.loaderData) === null || M === void 0
            ? void 0
            : M[i.id],
        l =
          r == null || (L = r.errors) === null || L === void 0
            ? void 0
            : L[i.id],
        m =
          _ == null &&
          (((k = d.clientLoader) === null || k === void 0
            ? void 0
            : k.hydrate) === !0 ||
            !i.hasLoader);
      (h.loader = async ({ request: c, params: p }, b) => {
        try {
          return await x(
            async () => (
              $(d, "No `routeModule` available for critical-route loader"),
              d.clientLoader
                ? d.clientLoader({
                    request: c,
                    params: p,
                    async serverLoader() {
                      if ((g("loader", i, o), m)) {
                        if (l !== void 0) throw l;
                        return u;
                      }
                      return R(c, !0, b);
                    },
                  })
                : o
                ? null
                : R(c, !1, b)
            )
          );
        } finally {
          m = !1;
        }
      }),
        (h.loader.hydrate = U(i, d, o)),
        (h.action = ({ request: c, params: p }, b) =>
          x(async () => {
            if (
              ($(d, "No `routeModule` available for critical-route action"),
              !d.clientAction)
            ) {
              if (o) throw A("clientAction", i.id);
              return v(c, !1, b);
            }
            return d.clientAction({
              request: c,
              params: p,
              async serverAction() {
                return g("action", i, o), v(c, !0, b);
              },
            });
          }));
    } else
      i.hasClientLoader ||
        (h.loader = ({ request: u }, l) =>
          x(() => (o ? Promise.resolve(null) : R(u, !1, l)))),
        i.hasClientAction ||
          (h.action = ({ request: u }, l) =>
            x(() => {
              if (o) throw A("clientAction", i.id);
              return v(u, !1, l);
            })),
        (h.lazy = async () => {
          let u = await xe(i, t),
            l = { ...u };
          if (u.clientLoader) {
            let m = u.clientLoader;
            l.loader = (c, p) =>
              m({
                ...c,
                async serverLoader() {
                  return g("loader", i, o), R(c.request, !0, p);
                },
              });
          }
          if (u.clientAction) {
            let m = u.clientAction;
            l.action = (c, p) =>
              m({
                ...c,
                async serverAction() {
                  return g("action", i, o), v(c.request, !0, p);
                },
              });
          }
          return (
            _ && (l.shouldRevalidate = j(i.id, u.shouldRevalidate, _)),
            {
              ...(l.loader ? { loader: l.loader } : {}),
              ...(l.action ? { action: l.action } : {}),
              hasErrorBoundary: l.hasErrorBoundary,
              shouldRevalidate: l.shouldRevalidate,
              handle: l.handle,
              Component: l.Component,
              ErrorBoundary: l.ErrorBoundary,
            }
          );
        });
    let D = F(e, t, r, a, o, i.id, f, _);
    return D.length > 0 && (h.children = D), h;
  });
}
function j(e, t, r) {
  let a = !1;
  return (o) =>
    a ? (t ? t(o) : o.defaultShouldRevalidate) : ((a = !0), r.has(e));
}
async function xe(e, t) {
  let r = await J(e, t);
  return (
    await I(e, r),
    {
      Component: X(r),
      ErrorBoundary: r.ErrorBoundary,
      clientAction: r.clientAction,
      clientLoader: r.clientLoader,
      handle: r.handle,
      links: r.links,
      meta: r.meta,
      shouldRevalidate: r.shouldRevalidate,
    }
  );
}
async function ye(e, t) {
  let r = await G(e, t.id);
  if (r instanceof Error) throw r;
  if (K(r)) throw pe(r);
  if (Q(r)) throw r;
  return Z(r) && r.body ? await ee(r.body) : r;
}
function ve(e) {
  if (te(e)) return e.data;
  if (re(e)) {
    let t = e.headers.get("Content-Type");
    return t && /\bapplication\/json\b/.test(t) ? e.json() : e.text();
  }
  return e;
}
function pe(e) {
  let t = parseInt(e.headers.get("X-Remix-Status"), 10) || 302,
    r = e.headers.get("X-Remix-Redirect"),
    a = {},
    o = e.headers.get("X-Remix-Revalidate");
  o && (a["X-Remix-Revalidate"] = o);
  let s = e.headers.get("X-Remix-Reload-Document");
  return (
    s && (a["X-Remix-Reload-Document"] = s), oe(r, { status: t, headers: a })
  );
}
function X(e) {
  if (e.default == null) return;
  if (!(typeof e.default == "object" && Object.keys(e.default).length === 0))
    return e.default;
}
function U(e, t, r) {
  return (
    (r && e.id !== "root") ||
    (t.clientLoader != null &&
      (t.clientLoader.hydrate === !0 || e.hasLoader !== !0))
  );
}
/**
 * @remix-run/react v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ let E,
  w,
  H = !1;
let S,
  Ce = new Promise((e) => {
    S = e;
  }).catch(() => {});
function Ee(e) {
  if (!w) {
    let s = window.__remixContext.url,
      f = window.location.pathname;
    if (s !== f && !window.__remixContext.isSpaMode) {
      let d = `Initial URL (${s}) does not match URL at time of hydration (${f}), reloading page...`;
      return (
        console.error(d),
        window.location.reload(),
        n.createElement(n.Fragment, null)
      );
    }
    if (window.__remixContext.future.unstable_singleFetch) {
      if (!E) {
        let d = window.__remixContext.stream;
        $(d, "No stream found for single fetch decoding"),
          (window.__remixContext.stream = void 0),
          (E = ne(d, window)
            .then((y) => {
              (window.__remixContext.state = y.value), (E.value = !0);
            })
            .catch((y) => {
              E.error = y;
            }));
      }
      if (E.error) throw E.error;
      if (!E.value) throw E;
    }
    let _ = F(
        window.__remixManifest.routes,
        window.__remixRouteModules,
        window.__remixContext.state,
        window.__remixContext.future,
        window.__remixContext.isSpaMode
      ),
      i;
    if (!window.__remixContext.isSpaMode) {
      i = {
        ...window.__remixContext.state,
        loaderData: { ...window.__remixContext.state.loaderData },
      };
      let d = ae(_, window.location);
      if (d)
        for (let y of d) {
          let R = y.route.id,
            v = window.__remixRouteModules[R],
            x = window.__remixManifest.routes[R];
          v &&
          U(x, v, window.__remixContext.isSpaMode) &&
          (v.HydrateFallback || !x.hasLoader)
            ? (i.loaderData[R] = void 0)
            : x && !x.hasLoader && (i.loaderData[R] = null);
        }
      i && i.errors && (i.errors = we(i.errors));
    }
    (w = ie({
      routes: _,
      history: le(),
      basename: window.__remixContext.basename,
      future: {
        v7_normalizeFormMethod: !0,
        v7_fetcherPersist: window.__remixContext.future.v3_fetcherPersist,
        v7_partialHydration: !0,
        v7_prependBasename: !0,
        v7_relativeSplatPath: window.__remixContext.future.v3_relativeSplatPath,
        unstable_skipActionErrorRevalidation:
          window.__remixContext.future.unstable_singleFetch === !0,
      },
      hydrationData: i,
      mapRouteProperties: se,
      unstable_dataStrategy: window.__remixContext.future.unstable_singleFetch
        ? de(window.__remixManifest, window.__remixRouteModules)
        : void 0,
    })),
      w.state.initialized && ((H = !0), w.initialize()),
      (w.createRoutesForHMR = Re),
      (window.__remixRouter = w),
      S && S(w);
  }
  let [t, r] = n.useState(void 0),
    [a, o] = n.useState(w.state.location);
  return (
    n.useLayoutEffect(() => {
      H || ((H = !0), w.initialize());
    }, []),
    n.useLayoutEffect(
      () =>
        w.subscribe((s) => {
          s.location !== a && o(s.location);
        }),
      [a]
    ),
    n.createElement(
      n.Fragment,
      null,
      n.createElement(
        ue.Provider,
        {
          value: {
            manifest: window.__remixManifest,
            routeModules: window.__remixRouteModules,
            future: window.__remixContext.future,
            criticalCss: t,
            isSpaMode: window.__remixContext.isSpaMode,
          },
        },
        n.createElement(
          fe,
          { location: a },
          n.createElement(ce, {
            router: w,
            fallbackElement: null,
            future: { v7_startTransition: !0 },
          })
        )
      ),
      window.__remixContext.future.unstable_singleFetch
        ? n.createElement(n.Fragment, null)
        : null
    )
  );
}
var N,
  O = me;
O.createRoot, (N = O.hydrateRoot);
n.startTransition(() => {
  N(document, P.jsx(n.StrictMode, { children: P.jsx(Ee, {}) }));
});
