import { r as a, W as $, x as M } from "./components-Be_8OGgv.js";
import {
  w as V,
  A as ne,
  D as Me,
  s as ce,
  L as Ee,
  _ as K,
} from "./DashboardLayout-CHVXsdWb.js";
import { S as Se } from "./SubNavbar-C-X8dpKw.js";
import { _ as xe } from "./index-kUoaJ0iR.js";
function Pe(e, t, r) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = r),
    e
  );
}
function ue(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n);
  }
  return r;
}
function le(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? ue(Object(r), !0).forEach(function (n) {
          Pe(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
      : ue(Object(r)).forEach(function (n) {
          Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
        });
  }
  return e;
}
function Ae(e, t) {
  if (e == null) return {};
  var r = {},
    n = Object.keys(e),
    i,
    o;
  for (o = 0; o < n.length; o++)
    (i = n[o]), !(t.indexOf(i) >= 0) && (r[i] = e[i]);
  return r;
}
function Ce(e, t) {
  if (e == null) return {};
  var r = Ae(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (i = 0; i < o.length; i++)
      (n = o[i]),
        !(t.indexOf(n) >= 0) &&
          Object.prototype.propertyIsEnumerable.call(e, n) &&
          (r[n] = e[n]);
  }
  return r;
}
function Re(e, t) {
  return Ie(e) || Le(e, t) || Te(e, t) || Fe();
}
function Ie(e) {
  if (Array.isArray(e)) return e;
}
function Le(e, t) {
  if (!(typeof Symbol > "u" || !(Symbol.iterator in Object(e)))) {
    var r = [],
      n = !0,
      i = !1,
      o = void 0;
    try {
      for (
        var u = e[Symbol.iterator](), p;
        !(n = (p = u.next()).done) && (r.push(p.value), !(t && r.length === t));
        n = !0
      );
    } catch (h) {
      (i = !0), (o = h);
    } finally {
      try {
        !n && u.return != null && u.return();
      } finally {
        if (i) throw o;
      }
    }
    return r;
  }
}
function Te(e, t) {
  if (e) {
    if (typeof e == "string") return se(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (
      (r === "Object" && e.constructor && (r = e.constructor.name),
      r === "Map" || r === "Set")
    )
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return se(e, t);
  }
}
function se(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Fe() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ve(e, t, r) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = r),
    e
  );
}
function fe(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n);
  }
  return r;
}
function de(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? fe(Object(r), !0).forEach(function (n) {
          Ve(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
      : fe(Object(r)).forEach(function (n) {
          Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
        });
  }
  return e;
}
function De() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return function (n) {
    return t.reduceRight(function (i, o) {
      return o(i);
    }, n);
  };
}
function B(e) {
  return function t() {
    for (
      var r = this, n = arguments.length, i = new Array(n), o = 0;
      o < n;
      o++
    )
      i[o] = arguments[o];
    return i.length >= e.length
      ? e.apply(this, i)
      : function () {
          for (var u = arguments.length, p = new Array(u), h = 0; h < u; h++)
            p[h] = arguments[h];
          return t.apply(r, [].concat(i, p));
        };
  };
}
function Q(e) {
  return {}.toString.call(e).includes("Object");
}
function $e(e) {
  return !Object.keys(e).length;
}
function _(e) {
  return typeof e == "function";
}
function Ne(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function ze(e, t) {
  return (
    Q(t) || C("changeType"),
    Object.keys(t).some(function (r) {
      return !Ne(e, r);
    }) && C("changeField"),
    t
  );
}
function He(e) {
  _(e) || C("selectorType");
}
function We(e) {
  _(e) || Q(e) || C("handlerType"),
    Q(e) &&
      Object.values(e).some(function (t) {
        return !_(t);
      }) &&
      C("handlersType");
}
function qe(e) {
  e || C("initialIsRequired"),
    Q(e) || C("initialType"),
    $e(e) && C("initialContent");
}
function Be(e, t) {
  throw new Error(e[t] || e.default);
}
var Ue = {
    initialIsRequired: "initial state is required",
    initialType: "initial state should be an object",
    initialContent: "initial state shouldn't be an empty object",
    handlerType: "handler should be an object or a function",
    handlersType: "all handlers should be a functions",
    selectorType: "selector should be a function",
    changeType: "provided value of changes should be an object",
    changeField:
      'it seams you want to change a field in the state which is not specified in the "initial" state',
    default: "an unknown error accured in `state-local` package",
  },
  C = B(Be)(Ue),
  Y = { changes: ze, selector: He, handler: We, initial: qe };
function _e(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Y.initial(e), Y.handler(t);
  var r = { current: e },
    n = B(Ge)(r, t),
    i = B(Ze)(r),
    o = B(Y.changes)(e),
    u = B(ke)(r);
  function p() {
    var m =
      arguments.length > 0 && arguments[0] !== void 0
        ? arguments[0]
        : function (x) {
            return x;
          };
    return Y.selector(m), m(r.current);
  }
  function h(m) {
    De(n, i, o, u)(m);
  }
  return [p, h];
}
function ke(e, t) {
  return _(t) ? t(e.current) : t;
}
function Ze(e, t) {
  return (e.current = de(de({}, e.current), t)), t;
}
function Ge(e, t, r) {
  return (
    _(t)
      ? t(e.current)
      : Object.keys(r).forEach(function (n) {
          var i;
          return (i = t[n]) === null || i === void 0
            ? void 0
            : i.call(t, e.current[n]);
        }),
    r
  );
}
var Ke = { create: _e },
  Ye = {
    paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs" },
  };
function Je(e) {
  return function t() {
    for (
      var r = this, n = arguments.length, i = new Array(n), o = 0;
      o < n;
      o++
    )
      i[o] = arguments[o];
    return i.length >= e.length
      ? e.apply(this, i)
      : function () {
          for (var u = arguments.length, p = new Array(u), h = 0; h < u; h++)
            p[h] = arguments[h];
          return t.apply(r, [].concat(i, p));
        };
  };
}
function Qe(e) {
  return {}.toString.call(e).includes("Object");
}
function Xe(e) {
  return (
    e || pe("configIsRequired"),
    Qe(e) || pe("configType"),
    e.urls ? (et(), { paths: { vs: e.urls.monacoBase } }) : e
  );
}
function et() {
  console.warn(ge.deprecation);
}
function tt(e, t) {
  throw new Error(e[t] || e.default);
}
var ge = {
    configIsRequired: "the configuration object is required",
    configType: "the configuration object should be an object",
    default: "an unknown error accured in `@monaco-editor/loader` package",
    deprecation: `Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `,
  },
  pe = Je(tt)(ge),
  rt = { config: Xe },
  nt = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return function (i) {
      return r.reduceRight(function (o, u) {
        return u(o);
      }, i);
    };
  };
function he(e, t) {
  return (
    Object.keys(t).forEach(function (r) {
      t[r] instanceof Object && e[r] && Object.assign(t[r], he(e[r], t[r]));
    }),
    le(le({}, e), t)
  );
}
var it = { type: "cancelation", msg: "operation is manually canceled" };
function ie(e) {
  var t = !1,
    r = new Promise(function (n, i) {
      e.then(function (o) {
        return t ? i(it) : n(o);
      }),
        e.catch(i);
    });
  return (
    (r.cancel = function () {
      return (t = !0);
    }),
    r
  );
}
var ot = Ke.create({
    config: Ye,
    isInitialized: !1,
    resolve: null,
    reject: null,
    monaco: null,
  }),
  ve = Re(ot, 2),
  k = ve[0],
  X = ve[1];
function at(e) {
  var t = rt.config(e),
    r = t.monaco,
    n = Ce(t, ["monaco"]);
  X(function (i) {
    return { config: he(i.config, n), monaco: r };
  });
}
function ct() {
  var e = k(function (t) {
    var r = t.monaco,
      n = t.isInitialized,
      i = t.resolve;
    return { monaco: r, isInitialized: n, resolve: i };
  });
  if (!e.isInitialized) {
    if ((X({ isInitialized: !0 }), e.monaco))
      return e.resolve(e.monaco), ie(oe);
    if (window.monaco && window.monaco.editor)
      return me(window.monaco), e.resolve(window.monaco), ie(oe);
    nt(ut, st)(ft);
  }
  return ie(oe);
}
function ut(e) {
  return document.body.appendChild(e);
}
function lt(e) {
  var t = document.createElement("script");
  return e && (t.src = e), t;
}
function st(e) {
  var t = k(function (n) {
      var i = n.config,
        o = n.reject;
      return { config: i, reject: o };
    }),
    r = lt("".concat(t.config.paths.vs, "/loader.js"));
  return (
    (r.onload = function () {
      return e();
    }),
    (r.onerror = t.reject),
    r
  );
}
function ft() {
  var e = k(function (r) {
      var n = r.config,
        i = r.resolve,
        o = r.reject;
      return { config: n, resolve: i, reject: o };
    }),
    t = window.require;
  t.config(e.config),
    t(
      ["vs/editor/editor.main"],
      function (r) {
        me(r), e.resolve(r);
      },
      function (r) {
        e.reject(r);
      }
    );
}
function me(e) {
  k().monaco || X({ monaco: e });
}
function dt() {
  return k(function (e) {
    var t = e.monaco;
    return t;
  });
}
var oe = new Promise(function (e, t) {
    return X({ resolve: e, reject: t });
  }),
  we = { config: at, init: ct, __getMonacoInstance: dt },
  pt = {
    wrapper: { display: "flex", position: "relative", textAlign: "initial" },
    fullWidth: { width: "100%" },
    hide: { display: "none" },
  },
  ae = pt,
  gt = {
    container: {
      display: "flex",
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  ht = gt;
function vt({ children: e }) {
  return $.createElement("div", { style: ht.container }, e);
}
var mt = vt,
  wt = mt;
function bt({
  width: e,
  height: t,
  isEditorReady: r,
  loading: n,
  _ref: i,
  className: o,
  wrapperProps: u,
}) {
  return $.createElement(
    "section",
    { style: { ...ae.wrapper, width: e, height: t }, ...u },
    !r && $.createElement(wt, null, n),
    $.createElement("div", {
      ref: i,
      style: { ...ae.fullWidth, ...(!r && ae.hide) },
      className: o,
    })
  );
}
var yt = bt,
  be = a.memo(yt);
function jt(e) {
  a.useEffect(e, []);
}
var ye = jt;
function Ot(e, t, r = !0) {
  let n = a.useRef(!0);
  a.useEffect(
    n.current || !r
      ? () => {
          n.current = !1;
        }
      : e,
    t
  );
}
var E = Ot;
function U() {}
function D(e, t, r, n) {
  return Mt(e, n) || Et(e, t, r, n);
}
function Mt(e, t) {
  return e.editor.getModel(je(e, t));
}
function Et(e, t, r, n) {
  return e.editor.createModel(t, r, n ? je(e, n) : void 0);
}
function je(e, t) {
  return e.Uri.parse(t);
}
function St({
  original: e,
  modified: t,
  language: r,
  originalLanguage: n,
  modifiedLanguage: i,
  originalModelPath: o,
  modifiedModelPath: u,
  keepCurrentOriginalModel: p = !1,
  keepCurrentModifiedModel: h = !1,
  theme: m = "light",
  loading: x = "Loading...",
  options: S = {},
  height: I = "100%",
  width: g = "100%",
  className: P,
  wrapperProps: ee = {},
  beforeMount: te = U,
  onMount: re = U,
}) {
  let [j, N] = a.useState(!1),
    [R, w] = a.useState(!0),
    b = a.useRef(null),
    v = a.useRef(null),
    z = a.useRef(null),
    y = a.useRef(re),
    s = a.useRef(te),
    L = a.useRef(!1);
  ye(() => {
    let c = we.init();
    return (
      c
        .then((f) => (v.current = f) && w(!1))
        .catch(
          (f) =>
            (f == null ? void 0 : f.type) !== "cancelation" &&
            console.error("Monaco initialization: error:", f)
        ),
      () => (b.current ? H() : c.cancel())
    );
  }),
    E(
      () => {
        if (b.current && v.current) {
          let c = b.current.getOriginalEditor(),
            f = D(v.current, e || "", n || r || "text", o || "");
          f !== c.getModel() && c.setModel(f);
        }
      },
      [o],
      j
    ),
    E(
      () => {
        if (b.current && v.current) {
          let c = b.current.getModifiedEditor(),
            f = D(v.current, t || "", i || r || "text", u || "");
          f !== c.getModel() && c.setModel(f);
        }
      },
      [u],
      j
    ),
    E(
      () => {
        let c = b.current.getModifiedEditor();
        c.getOption(v.current.editor.EditorOption.readOnly)
          ? c.setValue(t || "")
          : t !== c.getValue() &&
            (c.executeEdits("", [
              {
                range: c.getModel().getFullModelRange(),
                text: t || "",
                forceMoveMarkers: !0,
              },
            ]),
            c.pushUndoStop());
      },
      [t],
      j
    ),
    E(
      () => {
        var c, f;
        (f = (c = b.current) == null ? void 0 : c.getModel()) == null ||
          f.original.setValue(e || "");
      },
      [e],
      j
    ),
    E(
      () => {
        let { original: c, modified: f } = b.current.getModel();
        v.current.editor.setModelLanguage(c, n || r || "text"),
          v.current.editor.setModelLanguage(f, i || r || "text");
      },
      [r, n, i],
      j
    ),
    E(
      () => {
        var c;
        (c = v.current) == null || c.editor.setTheme(m);
      },
      [m],
      j
    ),
    E(
      () => {
        var c;
        (c = b.current) == null || c.updateOptions(S);
      },
      [S],
      j
    );
  let Z = a.useCallback(() => {
      var A;
      if (!v.current) return;
      s.current(v.current);
      let c = D(v.current, e || "", n || r || "text", o || ""),
        f = D(v.current, t || "", i || r || "text", u || "");
      (A = b.current) == null || A.setModel({ original: c, modified: f });
    }, [r, t, i, e, n, o, u]),
    G = a.useCallback(() => {
      var c;
      !L.current &&
        z.current &&
        ((b.current = v.current.editor.createDiffEditor(z.current, {
          automaticLayout: !0,
          ...S,
        })),
        Z(),
        (c = v.current) == null || c.editor.setTheme(m),
        N(!0),
        (L.current = !0));
    }, [S, m, Z]);
  a.useEffect(() => {
    j && y.current(b.current, v.current);
  }, [j]),
    a.useEffect(() => {
      !R && !j && G();
    }, [R, j, G]);
  function H() {
    var f, A, T, W;
    let c = (f = b.current) == null ? void 0 : f.getModel();
    p || (A = c == null ? void 0 : c.original) == null || A.dispose(),
      h || (T = c == null ? void 0 : c.modified) == null || T.dispose(),
      (W = b.current) == null || W.dispose();
  }
  return $.createElement(be, {
    width: g,
    height: I,
    isEditorReady: j,
    loading: x,
    _ref: z,
    className: P,
    wrapperProps: ee,
  });
}
var xt = St;
a.memo(xt);
function Pt(e) {
  let t = a.useRef();
  return (
    a.useEffect(() => {
      t.current = e;
    }, [e]),
    t.current
  );
}
var At = Pt,
  J = new Map();
function Ct({
  defaultValue: e,
  defaultLanguage: t,
  defaultPath: r,
  value: n,
  language: i,
  path: o,
  theme: u = "light",
  line: p,
  loading: h = "Loading...",
  options: m = {},
  overrideServices: x = {},
  saveViewState: S = !0,
  keepCurrentModel: I = !1,
  width: g = "100%",
  height: P = "100%",
  className: ee,
  wrapperProps: te = {},
  beforeMount: re = U,
  onMount: j = U,
  onChange: N,
  onValidate: R = U,
}) {
  let [w, b] = a.useState(!1),
    [v, z] = a.useState(!0),
    y = a.useRef(null),
    s = a.useRef(null),
    L = a.useRef(null),
    Z = a.useRef(j),
    G = a.useRef(re),
    H = a.useRef(),
    c = a.useRef(n),
    f = At(o),
    A = a.useRef(!1),
    T = a.useRef(!1);
  ye(() => {
    let l = we.init();
    return (
      l
        .then((d) => (y.current = d) && z(!1))
        .catch(
          (d) =>
            (d == null ? void 0 : d.type) !== "cancelation" &&
            console.error("Monaco initialization: error:", d)
        ),
      () => (s.current ? Oe() : l.cancel())
    );
  }),
    E(
      () => {
        var d, O, q, F;
        let l = D(y.current, e || n || "", t || i || "", o || r || "");
        l !== ((d = s.current) == null ? void 0 : d.getModel()) &&
          (S && J.set(f, (O = s.current) == null ? void 0 : O.saveViewState()),
          (q = s.current) == null || q.setModel(l),
          S && ((F = s.current) == null || F.restoreViewState(J.get(o))));
      },
      [o],
      w
    ),
    E(
      () => {
        var l;
        (l = s.current) == null || l.updateOptions(m);
      },
      [m],
      w
    ),
    E(
      () => {
        !s.current ||
          n === void 0 ||
          (s.current.getOption(y.current.editor.EditorOption.readOnly)
            ? s.current.setValue(n)
            : n !== s.current.getValue() &&
              ((T.current = !0),
              s.current.executeEdits("", [
                {
                  range: s.current.getModel().getFullModelRange(),
                  text: n,
                  forceMoveMarkers: !0,
                },
              ]),
              s.current.pushUndoStop(),
              (T.current = !1)));
      },
      [n],
      w
    ),
    E(
      () => {
        var d, O;
        let l = (d = s.current) == null ? void 0 : d.getModel();
        l && i && ((O = y.current) == null || O.editor.setModelLanguage(l, i));
      },
      [i],
      w
    ),
    E(
      () => {
        var l;
        p !== void 0 && ((l = s.current) == null || l.revealLine(p));
      },
      [p],
      w
    ),
    E(
      () => {
        var l;
        (l = y.current) == null || l.editor.setTheme(u);
      },
      [u],
      w
    );
  let W = a.useCallback(() => {
    var l;
    if (!(!L.current || !y.current) && !A.current) {
      G.current(y.current);
      let d = o || r,
        O = D(y.current, n || e || "", t || i || "", d || "");
      (s.current =
        (l = y.current) == null
          ? void 0
          : l.editor.create(
              L.current,
              { model: O, automaticLayout: !0, ...m },
              x
            )),
        S && s.current.restoreViewState(J.get(d)),
        y.current.editor.setTheme(u),
        p !== void 0 && s.current.revealLine(p),
        b(!0),
        (A.current = !0);
    }
  }, [e, t, r, n, i, o, m, x, S, u, p]);
  a.useEffect(() => {
    w && Z.current(s.current, y.current);
  }, [w]),
    a.useEffect(() => {
      !v && !w && W();
    }, [v, w, W]),
    (c.current = n),
    a.useEffect(() => {
      var l, d;
      w &&
        N &&
        ((l = H.current) == null || l.dispose(),
        (H.current =
          (d = s.current) == null
            ? void 0
            : d.onDidChangeModelContent((O) => {
                T.current || N(s.current.getValue(), O);
              })));
    }, [w, N]),
    a.useEffect(() => {
      if (w) {
        let l = y.current.editor.onDidChangeMarkers((d) => {
          var q;
          let O = (q = s.current.getModel()) == null ? void 0 : q.uri;
          if (O && d.find((F) => F.path === O.path)) {
            let F = y.current.editor.getModelMarkers({ resource: O });
            R == null || R(F);
          }
        });
        return () => {
          l == null || l.dispose();
        };
      }
      return () => {};
    }, [w, R]);
  function Oe() {
    var l, d;
    (l = H.current) == null || l.dispose(),
      I
        ? S && J.set(o, s.current.saveViewState())
        : (d = s.current.getModel()) == null || d.dispose(),
      s.current.dispose();
  }
  return $.createElement(be, {
    width: g,
    height: P,
    isEditorReady: w,
    loading: h,
    _ref: L,
    className: ee,
    wrapperProps: te,
  });
}
var Rt = Ct,
  It = a.memo(Rt),
  Lt = It;
const $t = () => [{ title: ce("meta.title.files") }];
function Nt() {
  var I;
  const [e, t] = a.useState(void 0),
    [r, n] = a.useState(""),
    [i, o] = a.useState("/"),
    [u, p] = a.useState(),
    [h, m] = a.useState("html"),
    x = a.useRef(null);
  a.useEffect(() => {
    let g = String(u == null ? void 0 : u.split(".").pop()).toLowerCase();
    switch (g) {
      case "js":
        m("javascript");
        break;
      default:
        m(g);
        break;
    }
  }, [r]),
    a.useEffect(() => {
      S();
    }, [i]),
    a.useEffect(() => {
      p(void 0);
    }, [i]),
    a.useEffect(() => {
      u &&
        (n("Loading... 😈"),
        V.axiosFactory("PRIVATE").then((g) => {
          g.get(V.apiEndpointFactory(ne.GetFile) + "?path=" + u).then((P) => {
            n(P.data.value);
          });
        }));
    }, [u]);
  const S = a.useCallback(() => {
    V.axiosFactory("PRIVATE").then((g) => {
      g.get(V.apiEndpointFactory(ne.GetAllFiles) + "?path=" + i).then((P) => {
        t(P.data.value);
      });
    });
  }, [i]);
  return M.jsxs(Me, {
    subTitle: ce("dashboard.subtitle.files"),
    currentLeftActiveBarItem: Ee.FILES,
    children: [
      M.jsx(Se, {
        createActionLabel: "Save file",
        onCreateAction: () => {
          if (K.isEmpty(r)) return;
          let g = new FormData();
          g.append("content", r),
            V.axiosFactory("PRIVATE").then((P) => {
              xe.promise(
                P.post(V.apiEndpointFactory(ne.WriteFile) + "?path=" + u, g),
                {
                  loading: "Saving...",
                  success: "File saved!",
                  error: "Could not save.",
                }
              );
            });
        },
        title: ce("dashboard.subtitle.files"),
      }),
      M.jsxs("div", {
        className: "w-full h-full bg-white overflow-hidden flex flex-row",
        children: [
          M.jsx("div", {
            className: "w-[200px] h-full divide-y divide-zinc-200 border-r ",
            children: K.orderBy(e || [], "is_file").map((g) =>
              M.jsxs("div", {
                onClick: () => {
                  g.is_file ? p(g.path) : o(g.path);
                },
                className:
                  "w-full cursor-pointer flex flex-row items-center gap-2 bg-white py-1 px-2",
                children: [
                  g.is_file
                    ? M.jsxs("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        fill: "currentColor",
                        className: "size-3 fill-gray-500",
                        children: [
                          M.jsx("path", {
                            d: "M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z",
                          }),
                          M.jsx("path", {
                            d: "M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z",
                          }),
                        ],
                      })
                    : M.jsx("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        className: "size-3 fill-yellow-500",
                        children: M.jsx("path", {
                          d: "M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-4.5A1.75 1.75 0 0 0 16.25 9H3.75Z",
                        }),
                      }),
                  M.jsx("span", {
                    className: "text-xs",
                    children: K.last(K.split(g.path, "/")),
                  }),
                ],
              })
            ),
          }),
          M.jsx("div", {
            className: "overflow-hidden w-full h-full",
            ref: x,
            children:
              typeof window < "u" &&
              M.jsx(Lt, {
                width: (I = x.current) == null ? void 0 : I.clientWidth,
                line: 0,
                height: "calc(100vh - 120px)",
                defaultLanguage: "html",
                language: h,
                value: r,
                theme: "vs-light",
                options: { formatOnType: !0, formatOnPaste: !0 },
                onChange: (g) => {
                  g && n(g);
                },
              }),
          }),
        ],
      }),
    ],
  });
}
export { Nt as default, $t as meta };
