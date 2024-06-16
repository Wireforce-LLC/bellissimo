var $p = Object.defineProperty;
var Ap = (e, t, n) =>
  t in e
    ? $p(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[t] = n);
var Pl = (e, t, n) => (Ap(e, typeof t != "symbol" ? t + "" : t, n), n);
function Nc(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const l in r)
        if (l !== "default" && !(l in e)) {
          const i = Object.getOwnPropertyDescriptor(r, l);
          i &&
            Object.defineProperty(
              e,
              l,
              i.get ? i : { enumerable: !0, get: () => r[l] }
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: "Module" })
  );
}
var Yg =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
    ? window
    : typeof global < "u"
    ? global
    : typeof self < "u"
    ? self
    : {};
function Dc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var Mc = { exports: {} },
  zi = {},
  Oc = { exports: {} },
  Q = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var pl = Symbol.for("react.element"),
  Bp = Symbol.for("react.portal"),
  Hp = Symbol.for("react.fragment"),
  Vp = Symbol.for("react.strict_mode"),
  Wp = Symbol.for("react.profiler"),
  Kp = Symbol.for("react.provider"),
  Qp = Symbol.for("react.context"),
  Yp = Symbol.for("react.forward_ref"),
  Jp = Symbol.for("react.suspense"),
  Xp = Symbol.for("react.memo"),
  Gp = Symbol.for("react.lazy"),
  qu = Symbol.iterator;
function Zp(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (qu && e[qu]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var zc = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  jc = Object.assign,
  Fc = {};
function fr(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = Fc),
    (this.updater = n || zc);
}
fr.prototype.isReactComponent = {};
fr.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
fr.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Ic() {}
Ic.prototype = fr.prototype;
function Oa(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = Fc),
    (this.updater = n || zc);
}
var za = (Oa.prototype = new Ic());
za.constructor = Oa;
jc(za, fr.prototype);
za.isPureReactComponent = !0;
var bu = Array.isArray,
  Uc = Object.prototype.hasOwnProperty,
  ja = { current: null },
  $c = { key: !0, ref: !0, __self: !0, __source: !0 };
function Ac(e, t, n) {
  var r,
    l = {},
    i = null,
    o = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (o = t.ref),
    t.key !== void 0 && (i = "" + t.key),
    t))
      Uc.call(t, r) && !$c.hasOwnProperty(r) && (l[r] = t[r]);
  var a = arguments.length - 2;
  if (a === 1) l.children = n;
  else if (1 < a) {
    for (var u = Array(a), s = 0; s < a; s++) u[s] = arguments[s + 2];
    l.children = u;
  }
  if (e && e.defaultProps)
    for (r in ((a = e.defaultProps), a)) l[r] === void 0 && (l[r] = a[r]);
  return {
    $$typeof: pl,
    type: e,
    key: i,
    ref: o,
    props: l,
    _owner: ja.current,
  };
}
function qp(e, t) {
  return {
    $$typeof: pl,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Fa(e) {
  return typeof e == "object" && e !== null && e.$$typeof === pl;
}
function bp(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var es = /\/+/g;
function to(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? bp("" + e.key)
    : t.toString(36);
}
function Yl(e, t, n, r, l) {
  var i = typeof e;
  (i === "undefined" || i === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else
    switch (i) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case pl:
          case Bp:
            o = !0;
        }
    }
  if (o)
    return (
      (o = e),
      (l = l(o)),
      (e = r === "" ? "." + to(o, 0) : r),
      bu(l)
        ? ((n = ""),
          e != null && (n = e.replace(es, "$&/") + "/"),
          Yl(l, t, n, "", function (s) {
            return s;
          }))
        : l != null &&
          (Fa(l) &&
            (l = qp(
              l,
              n +
                (!l.key || (o && o.key === l.key)
                  ? ""
                  : ("" + l.key).replace(es, "$&/") + "/") +
                e
            )),
          t.push(l)),
      1
    );
  if (((o = 0), (r = r === "" ? "." : r + ":"), bu(e)))
    for (var a = 0; a < e.length; a++) {
      i = e[a];
      var u = r + to(i, a);
      o += Yl(i, t, n, u, l);
    }
  else if (((u = Zp(e)), typeof u == "function"))
    for (e = u.call(e), a = 0; !(i = e.next()).done; )
      (i = i.value), (u = r + to(i, a++)), (o += Yl(i, t, n, u, l));
  else if (i === "object")
    throw (
      ((t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead."
      ))
    );
  return o;
}
function Rl(e, t, n) {
  if (e == null) return e;
  var r = [],
    l = 0;
  return (
    Yl(e, r, "", "", function (i) {
      return t.call(n, i, l++);
    }),
    r
  );
}
function eh(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        }
      ),
      e._status === -1 && ((e._status = 0), (e._result = t));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Fe = { current: null },
  Jl = { transition: null },
  th = {
    ReactCurrentDispatcher: Fe,
    ReactCurrentBatchConfig: Jl,
    ReactCurrentOwner: ja,
  };
function Bc() {
  throw Error("act(...) is not supported in production builds of React.");
}
Q.Children = {
  map: Rl,
  forEach: function (e, t, n) {
    Rl(
      e,
      function () {
        t.apply(this, arguments);
      },
      n
    );
  },
  count: function (e) {
    var t = 0;
    return (
      Rl(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      Rl(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Fa(e))
      throw Error(
        "React.Children.only expected to receive a single React element child."
      );
    return e;
  },
};
Q.Component = fr;
Q.Fragment = Hp;
Q.Profiler = Wp;
Q.PureComponent = Oa;
Q.StrictMode = Vp;
Q.Suspense = Jp;
Q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = th;
Q.act = Bc;
Q.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        "."
    );
  var r = jc({}, e.props),
    l = e.key,
    i = e.ref,
    o = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((i = t.ref), (o = ja.current)),
      t.key !== void 0 && (l = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var a = e.type.defaultProps;
    for (u in t)
      Uc.call(t, u) &&
        !$c.hasOwnProperty(u) &&
        (r[u] = t[u] === void 0 && a !== void 0 ? a[u] : t[u]);
  }
  var u = arguments.length - 2;
  if (u === 1) r.children = n;
  else if (1 < u) {
    a = Array(u);
    for (var s = 0; s < u; s++) a[s] = arguments[s + 2];
    r.children = a;
  }
  return { $$typeof: pl, type: e.type, key: l, ref: i, props: r, _owner: o };
};
Q.createContext = function (e) {
  return (
    (e = {
      $$typeof: Qp,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Kp, _context: e }),
    (e.Consumer = e)
  );
};
Q.createElement = Ac;
Q.createFactory = function (e) {
  var t = Ac.bind(null, e);
  return (t.type = e), t;
};
Q.createRef = function () {
  return { current: null };
};
Q.forwardRef = function (e) {
  return { $$typeof: Yp, render: e };
};
Q.isValidElement = Fa;
Q.lazy = function (e) {
  return { $$typeof: Gp, _payload: { _status: -1, _result: e }, _init: eh };
};
Q.memo = function (e, t) {
  return { $$typeof: Xp, type: e, compare: t === void 0 ? null : t };
};
Q.startTransition = function (e) {
  var t = Jl.transition;
  Jl.transition = {};
  try {
    e();
  } finally {
    Jl.transition = t;
  }
};
Q.unstable_act = Bc;
Q.useCallback = function (e, t) {
  return Fe.current.useCallback(e, t);
};
Q.useContext = function (e) {
  return Fe.current.useContext(e);
};
Q.useDebugValue = function () {};
Q.useDeferredValue = function (e) {
  return Fe.current.useDeferredValue(e);
};
Q.useEffect = function (e, t) {
  return Fe.current.useEffect(e, t);
};
Q.useId = function () {
  return Fe.current.useId();
};
Q.useImperativeHandle = function (e, t, n) {
  return Fe.current.useImperativeHandle(e, t, n);
};
Q.useInsertionEffect = function (e, t) {
  return Fe.current.useInsertionEffect(e, t);
};
Q.useLayoutEffect = function (e, t) {
  return Fe.current.useLayoutEffect(e, t);
};
Q.useMemo = function (e, t) {
  return Fe.current.useMemo(e, t);
};
Q.useReducer = function (e, t, n) {
  return Fe.current.useReducer(e, t, n);
};
Q.useRef = function (e) {
  return Fe.current.useRef(e);
};
Q.useState = function (e) {
  return Fe.current.useState(e);
};
Q.useSyncExternalStore = function (e, t, n) {
  return Fe.current.useSyncExternalStore(e, t, n);
};
Q.useTransition = function () {
  return Fe.current.useTransition();
};
Q.version = "18.3.1";
Oc.exports = Q;
var y = Oc.exports;
const nh = Dc(y),
  rh = Nc({ __proto__: null, default: nh }, [y]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var lh = y,
  ih = Symbol.for("react.element"),
  oh = Symbol.for("react.fragment"),
  ah = Object.prototype.hasOwnProperty,
  uh = lh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  sh = { key: !0, ref: !0, __self: !0, __source: !0 };
function Hc(e, t, n) {
  var r,
    l = {},
    i = null,
    o = null;
  n !== void 0 && (i = "" + n),
    t.key !== void 0 && (i = "" + t.key),
    t.ref !== void 0 && (o = t.ref);
  for (r in t) ah.call(t, r) && !sh.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) l[r] === void 0 && (l[r] = t[r]);
  return {
    $$typeof: ih,
    type: e,
    key: i,
    ref: o,
    props: l,
    _owner: uh.current,
  };
}
zi.Fragment = oh;
zi.jsx = Hc;
zi.jsxs = Hc;
Mc.exports = zi;
var Jg = Mc.exports,
  Vc = { exports: {} },
  Ze = {},
  Wc = { exports: {} },
  Kc = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(N, U) {
    var A = N.length;
    N.push(U);
    e: for (; 0 < A; ) {
      var q = (A - 1) >>> 1,
        b = N[q];
      if (0 < l(b, U)) (N[q] = U), (N[A] = b), (A = q);
      else break e;
    }
  }
  function n(N) {
    return N.length === 0 ? null : N[0];
  }
  function r(N) {
    if (N.length === 0) return null;
    var U = N[0],
      A = N.pop();
    if (A !== U) {
      N[0] = A;
      e: for (var q = 0, b = N.length, ft = b >>> 1; q < ft; ) {
        var We = 2 * (q + 1) - 1,
          Ke = N[We],
          Me = We + 1,
          et = N[Me];
        if (0 > l(Ke, A))
          Me < b && 0 > l(et, Ke)
            ? ((N[q] = et), (N[Me] = A), (q = Me))
            : ((N[q] = Ke), (N[We] = A), (q = We));
        else if (Me < b && 0 > l(et, A)) (N[q] = et), (N[Me] = A), (q = Me);
        else break e;
      }
    }
    return U;
  }
  function l(N, U) {
    var A = N.sortIndex - U.sortIndex;
    return A !== 0 ? A : N.id - U.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    e.unstable_now = function () {
      return i.now();
    };
  } else {
    var o = Date,
      a = o.now();
    e.unstable_now = function () {
      return o.now() - a;
    };
  }
  var u = [],
    s = [],
    c = 1,
    f = null,
    d = 3,
    E = !1,
    S = !1,
    w = !1,
    P = typeof setTimeout == "function" ? setTimeout : null,
    h = typeof clearTimeout == "function" ? clearTimeout : null,
    p = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function v(N) {
    for (var U = n(s); U !== null; ) {
      if (U.callback === null) r(s);
      else if (U.startTime <= N)
        r(s), (U.sortIndex = U.expirationTime), t(u, U);
      else break;
      U = n(s);
    }
  }
  function x(N) {
    if (((w = !1), v(N), !S))
      if (n(u) !== null) (S = !0), Ee(L);
      else {
        var U = n(s);
        U !== null && be(x, U.startTime - N);
      }
  }
  function L(N, U) {
    (S = !1), w && ((w = !1), h(C), (C = -1)), (E = !0);
    var A = d;
    try {
      for (
        v(U), f = n(u);
        f !== null && (!(f.expirationTime > U) || (N && !H()));

      ) {
        var q = f.callback;
        if (typeof q == "function") {
          (f.callback = null), (d = f.priorityLevel);
          var b = q(f.expirationTime <= U);
          (U = e.unstable_now()),
            typeof b == "function" ? (f.callback = b) : f === n(u) && r(u),
            v(U);
        } else r(u);
        f = n(u);
      }
      if (f !== null) var ft = !0;
      else {
        var We = n(s);
        We !== null && be(x, We.startTime - U), (ft = !1);
      }
      return ft;
    } finally {
      (f = null), (d = A), (E = !1);
    }
  }
  var M = !1,
    m = null,
    C = -1,
    O = 5,
    D = -1;
  function H() {
    return !(e.unstable_now() - D < O);
  }
  function G() {
    if (m !== null) {
      var N = e.unstable_now();
      D = N;
      var U = !0;
      try {
        U = m(!0, N);
      } finally {
        U ? X() : ((M = !1), (m = null));
      }
    } else M = !1;
  }
  var X;
  if (typeof p == "function")
    X = function () {
      p(G);
    };
  else if (typeof MessageChannel < "u") {
    var he = new MessageChannel(),
      Ve = he.port2;
    (he.port1.onmessage = G),
      (X = function () {
        Ve.postMessage(null);
      });
  } else
    X = function () {
      P(G, 0);
    };
  function Ee(N) {
    (m = N), M || ((M = !0), X());
  }
  function be(N, U) {
    C = P(function () {
      N(e.unstable_now());
    }, U);
  }
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (N) {
      N.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      S || E || ((S = !0), Ee(L));
    }),
    (e.unstable_forceFrameRate = function (N) {
      0 > N || 125 < N
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
          )
        : (O = 0 < N ? Math.floor(1e3 / N) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return d;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(u);
    }),
    (e.unstable_next = function (N) {
      switch (d) {
        case 1:
        case 2:
        case 3:
          var U = 3;
          break;
        default:
          U = d;
      }
      var A = d;
      d = U;
      try {
        return N();
      } finally {
        d = A;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (N, U) {
      switch (N) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          N = 3;
      }
      var A = d;
      d = N;
      try {
        return U();
      } finally {
        d = A;
      }
    }),
    (e.unstable_scheduleCallback = function (N, U, A) {
      var q = e.unstable_now();
      switch (
        (typeof A == "object" && A !== null
          ? ((A = A.delay), (A = typeof A == "number" && 0 < A ? q + A : q))
          : (A = q),
        N)
      ) {
        case 1:
          var b = -1;
          break;
        case 2:
          b = 250;
          break;
        case 5:
          b = 1073741823;
          break;
        case 4:
          b = 1e4;
          break;
        default:
          b = 5e3;
      }
      return (
        (b = A + b),
        (N = {
          id: c++,
          callback: U,
          priorityLevel: N,
          startTime: A,
          expirationTime: b,
          sortIndex: -1,
        }),
        A > q
          ? ((N.sortIndex = A),
            t(s, N),
            n(u) === null &&
              N === n(s) &&
              (w ? (h(C), (C = -1)) : (w = !0), be(x, A - q)))
          : ((N.sortIndex = b), t(u, N), S || E || ((S = !0), Ee(L))),
        N
      );
    }),
    (e.unstable_shouldYield = H),
    (e.unstable_wrapCallback = function (N) {
      var U = d;
      return function () {
        var A = d;
        d = U;
        try {
          return N.apply(this, arguments);
        } finally {
          d = A;
        }
      };
    });
})(Kc);
Wc.exports = Kc;
var ch = Wc.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var fh = y,
  Ge = ch;
function R(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var Qc = new Set(),
  Jr = {};
function Dn(e, t) {
  nr(e, t), nr(e + "Capture", t);
}
function nr(e, t) {
  for (Jr[e] = t, e = 0; e < t.length; e++) Qc.add(t[e]);
}
var zt = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Mo = Object.prototype.hasOwnProperty,
  dh =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  ts = {},
  ns = {};
function ph(e) {
  return Mo.call(ns, e)
    ? !0
    : Mo.call(ts, e)
    ? !1
    : dh.test(e)
    ? (ns[e] = !0)
    : ((ts[e] = !0), !1);
}
function hh(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
        ? !n.acceptsBooleans
        : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function mh(e, t, n, r) {
  if (t === null || typeof t > "u" || hh(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function Ie(e, t, n, r, l, i, o) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = l),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = i),
    (this.removeEmptyString = o);
}
var Re = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    Re[e] = new Ie(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  Re[t] = new Ie(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  Re[e] = new Ie(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  Re[e] = new Ie(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    Re[e] = new Ie(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  Re[e] = new Ie(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  Re[e] = new Ie(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  Re[e] = new Ie(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  Re[e] = new Ie(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Ia = /[\-:]([a-z])/g;
function Ua(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Ia, Ua);
    Re[t] = new Ie(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Ia, Ua);
    Re[t] = new Ie(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(Ia, Ua);
  Re[t] = new Ie(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  Re[e] = new Ie(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Re.xlinkHref = new Ie(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1
);
["src", "href", "action", "formAction"].forEach(function (e) {
  Re[e] = new Ie(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function $a(e, t, n, r) {
  var l = Re.hasOwnProperty(t) ? Re[t] : null;
  (l !== null
    ? l.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (mh(t, n, l, r) && (n = null),
    r || l === null
      ? ph(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : l.mustUseProperty
      ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : "") : n)
      : ((t = l.attributeName),
        (r = l.attributeNamespace),
        n === null
          ? e.removeAttribute(t)
          : ((l = l.type),
            (n = l === 3 || (l === 4 && n === !0) ? "" : "" + n),
            r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var Ut = fh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Ll = Symbol.for("react.element"),
  Un = Symbol.for("react.portal"),
  $n = Symbol.for("react.fragment"),
  Aa = Symbol.for("react.strict_mode"),
  Oo = Symbol.for("react.profiler"),
  Yc = Symbol.for("react.provider"),
  Jc = Symbol.for("react.context"),
  Ba = Symbol.for("react.forward_ref"),
  zo = Symbol.for("react.suspense"),
  jo = Symbol.for("react.suspense_list"),
  Ha = Symbol.for("react.memo"),
  Qt = Symbol.for("react.lazy"),
  Xc = Symbol.for("react.offscreen"),
  rs = Symbol.iterator;
function kr(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (rs && e[rs]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var se = Object.assign,
  no;
function zr(e) {
  if (no === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      no = (t && t[1]) || "";
    }
  return (
    `
` +
    no +
    e
  );
}
var ro = !1;
function lo(e, t) {
  if (!e || ro) return "";
  ro = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (s) {
          var r = s;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (s) {
          r = s;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (s) {
        r = s;
      }
      e();
    }
  } catch (s) {
    if (s && r && typeof s.stack == "string") {
      for (
        var l = s.stack.split(`
`),
          i = r.stack.split(`
`),
          o = l.length - 1,
          a = i.length - 1;
        1 <= o && 0 <= a && l[o] !== i[a];

      )
        a--;
      for (; 1 <= o && 0 <= a; o--, a--)
        if (l[o] !== i[a]) {
          if (o !== 1 || a !== 1)
            do
              if ((o--, a--, 0 > a || l[o] !== i[a])) {
                var u =
                  `
` + l[o].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    u.includes("<anonymous>") &&
                    (u = u.replace("<anonymous>", e.displayName)),
                  u
                );
              }
            while (1 <= o && 0 <= a);
          break;
        }
    }
  } finally {
    (ro = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? zr(e) : "";
}
function vh(e) {
  switch (e.tag) {
    case 5:
      return zr(e.type);
    case 16:
      return zr("Lazy");
    case 13:
      return zr("Suspense");
    case 19:
      return zr("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = lo(e.type, !1)), e;
    case 11:
      return (e = lo(e.type.render, !1)), e;
    case 1:
      return (e = lo(e.type, !0)), e;
    default:
      return "";
  }
}
function Fo(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case $n:
      return "Fragment";
    case Un:
      return "Portal";
    case Oo:
      return "Profiler";
    case Aa:
      return "StrictMode";
    case zo:
      return "Suspense";
    case jo:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Jc:
        return (e.displayName || "Context") + ".Consumer";
      case Yc:
        return (e._context.displayName || "Context") + ".Provider";
      case Ba:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case Ha:
        return (
          (t = e.displayName || null), t !== null ? t : Fo(e.type) || "Memo"
        );
      case Qt:
        (t = e._payload), (e = e._init);
        try {
          return Fo(e(t));
        } catch {}
    }
  return null;
}
function yh(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Fo(t);
    case 8:
      return t === Aa ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function un(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Gc(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function gh(e) {
  var t = Gc(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var l = n.get,
      i = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return l.call(this);
        },
        set: function (o) {
          (r = "" + o), i.call(this, o);
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (o) {
          r = "" + o;
        },
        stopTracking: function () {
          (e._valueTracker = null), delete e[t];
        },
      }
    );
  }
}
function Tl(e) {
  e._valueTracker || (e._valueTracker = gh(e));
}
function Zc(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Gc(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function oi(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Io(e, t) {
  var n = t.checked;
  return se({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function ls(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = un(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function qc(e, t) {
  (t = t.checked), t != null && $a(e, "checked", t, !1);
}
function Uo(e, t) {
  qc(e, t);
  var n = un(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value")
    ? $o(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && $o(e, t.type, un(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function is(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    (t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t);
  }
  (n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n);
}
function $o(e, t, n) {
  (t !== "number" || oi(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var jr = Array.isArray;
function Gn(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
    for (n = 0; n < e.length; n++)
      (l = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== l && (e[n].selected = l),
        l && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + un(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        (e[l].selected = !0), r && (e[l].defaultSelected = !0);
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = !0);
  }
}
function Ao(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(R(91));
  return se({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function os(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(R(92));
      if (jr(n)) {
        if (1 < n.length) throw Error(R(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: un(n) };
}
function bc(e, t) {
  var n = un(t.value),
    r = un(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function as(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function ef(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Bo(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? ef(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
    ? "http://www.w3.org/1999/xhtml"
    : e;
}
var Nl,
  tf = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, l) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, l);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        Nl = Nl || document.createElement("div"),
          Nl.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Nl.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Xr(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Ur = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  wh = ["Webkit", "ms", "Moz", "O"];
Object.keys(Ur).forEach(function (e) {
  wh.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Ur[t] = Ur[e]);
  });
});
function nf(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (Ur.hasOwnProperty(e) && Ur[e])
    ? ("" + t).trim()
    : t + "px";
}
function rf(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        l = nf(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : (e[n] = l);
    }
}
var Sh = se(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  }
);
function Ho(e, t) {
  if (t) {
    if (Sh[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(R(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(R(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(R(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(R(62));
  }
}
function Vo(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Wo = null;
function Va(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Ko = null,
  Zn = null,
  qn = null;
function us(e) {
  if ((e = vl(e))) {
    if (typeof Ko != "function") throw Error(R(280));
    var t = e.stateNode;
    t && ((t = $i(t)), Ko(e.stateNode, e.type, t));
  }
}
function lf(e) {
  Zn ? (qn ? qn.push(e) : (qn = [e])) : (Zn = e);
}
function of() {
  if (Zn) {
    var e = Zn,
      t = qn;
    if (((qn = Zn = null), us(e), t)) for (e = 0; e < t.length; e++) us(t[e]);
  }
}
function af(e, t) {
  return e(t);
}
function uf() {}
var io = !1;
function sf(e, t, n) {
  if (io) return e(t, n);
  io = !0;
  try {
    return af(e, t, n);
  } finally {
    (io = !1), (Zn !== null || qn !== null) && (uf(), of());
  }
}
function Gr(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = $i(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r);
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(R(231, t, typeof n));
  return n;
}
var Qo = !1;
if (zt)
  try {
    var xr = {};
    Object.defineProperty(xr, "passive", {
      get: function () {
        Qo = !0;
      },
    }),
      window.addEventListener("test", xr, xr),
      window.removeEventListener("test", xr, xr);
  } catch {
    Qo = !1;
  }
function Eh(e, t, n, r, l, i, o, a, u) {
  var s = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, s);
  } catch (c) {
    this.onError(c);
  }
}
var $r = !1,
  ai = null,
  ui = !1,
  Yo = null,
  kh = {
    onError: function (e) {
      ($r = !0), (ai = e);
    },
  };
function xh(e, t, n, r, l, i, o, a, u) {
  ($r = !1), (ai = null), Eh.apply(kh, arguments);
}
function _h(e, t, n, r, l, i, o, a, u) {
  if ((xh.apply(this, arguments), $r)) {
    if ($r) {
      var s = ai;
      ($r = !1), (ai = null);
    } else throw Error(R(198));
    ui || ((ui = !0), (Yo = s));
  }
}
function Mn(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do (t = e), t.flags & 4098 && (n = t.return), (e = t.return);
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function cf(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function ss(e) {
  if (Mn(e) !== e) throw Error(R(188));
}
function Ch(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Mn(e)), t === null)) throw Error(R(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var i = l.alternate;
    if (i === null) {
      if (((r = l.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === i.child) {
      for (i = l.child; i; ) {
        if (i === n) return ss(l), e;
        if (i === r) return ss(l), t;
        i = i.sibling;
      }
      throw Error(R(188));
    }
    if (n.return !== r.return) (n = l), (r = i);
    else {
      for (var o = !1, a = l.child; a; ) {
        if (a === n) {
          (o = !0), (n = l), (r = i);
          break;
        }
        if (a === r) {
          (o = !0), (r = l), (n = i);
          break;
        }
        a = a.sibling;
      }
      if (!o) {
        for (a = i.child; a; ) {
          if (a === n) {
            (o = !0), (n = i), (r = l);
            break;
          }
          if (a === r) {
            (o = !0), (r = i), (n = l);
            break;
          }
          a = a.sibling;
        }
        if (!o) throw Error(R(189));
      }
    }
    if (n.alternate !== r) throw Error(R(190));
  }
  if (n.tag !== 3) throw Error(R(188));
  return n.stateNode.current === n ? e : t;
}
function ff(e) {
  return (e = Ch(e)), e !== null ? df(e) : null;
}
function df(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = df(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var pf = Ge.unstable_scheduleCallback,
  cs = Ge.unstable_cancelCallback,
  Ph = Ge.unstable_shouldYield,
  Rh = Ge.unstable_requestPaint,
  fe = Ge.unstable_now,
  Lh = Ge.unstable_getCurrentPriorityLevel,
  Wa = Ge.unstable_ImmediatePriority,
  hf = Ge.unstable_UserBlockingPriority,
  si = Ge.unstable_NormalPriority,
  Th = Ge.unstable_LowPriority,
  mf = Ge.unstable_IdlePriority,
  ji = null,
  Ct = null;
function Nh(e) {
  if (Ct && typeof Ct.onCommitFiberRoot == "function")
    try {
      Ct.onCommitFiberRoot(ji, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var gt = Math.clz32 ? Math.clz32 : Oh,
  Dh = Math.log,
  Mh = Math.LN2;
function Oh(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((Dh(e) / Mh) | 0)) | 0;
}
var Dl = 64,
  Ml = 4194304;
function Fr(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function ci(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    l = e.suspendedLanes,
    i = e.pingedLanes,
    o = n & 268435455;
  if (o !== 0) {
    var a = o & ~l;
    a !== 0 ? (r = Fr(a)) : ((i &= o), i !== 0 && (r = Fr(i)));
  } else (o = n & ~l), o !== 0 ? (r = Fr(o)) : i !== 0 && (r = Fr(i));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & l) &&
    ((l = r & -r), (i = t & -t), l >= i || (l === 16 && (i & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      (n = 31 - gt(t)), (l = 1 << n), (r |= e[n]), (t &= ~l);
  return r;
}
function zh(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function jh(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      l = e.expirationTimes,
      i = e.pendingLanes;
    0 < i;

  ) {
    var o = 31 - gt(i),
      a = 1 << o,
      u = l[o];
    u === -1
      ? (!(a & n) || a & r) && (l[o] = zh(a, t))
      : u <= t && (e.expiredLanes |= a),
      (i &= ~a);
  }
}
function Jo(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function vf() {
  var e = Dl;
  return (Dl <<= 1), !(Dl & 4194240) && (Dl = 64), e;
}
function oo(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function hl(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - gt(t)),
    (e[t] = n);
}
function Fh(e, t) {
  var n = e.pendingLanes & ~t;
  (e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements);
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - gt(n),
      i = 1 << l;
    (t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~i);
  }
}
function Ka(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - gt(n),
      l = 1 << r;
    (l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l);
  }
}
var Z = 0;
function yf(e) {
  return (e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1;
}
var gf,
  Qa,
  wf,
  Sf,
  Ef,
  Xo = !1,
  Ol = [],
  bt = null,
  en = null,
  tn = null,
  Zr = new Map(),
  qr = new Map(),
  Jt = [],
  Ih =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " "
    );
function fs(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      bt = null;
      break;
    case "dragenter":
    case "dragleave":
      en = null;
      break;
    case "mouseover":
    case "mouseout":
      tn = null;
      break;
    case "pointerover":
    case "pointerout":
      Zr.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      qr.delete(t.pointerId);
  }
}
function _r(e, t, n, r, l, i) {
  return e === null || e.nativeEvent !== i
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: i,
        targetContainers: [l],
      }),
      t !== null && ((t = vl(t)), t !== null && Qa(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      l !== null && t.indexOf(l) === -1 && t.push(l),
      e);
}
function Uh(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return (bt = _r(bt, e, t, n, r, l)), !0;
    case "dragenter":
      return (en = _r(en, e, t, n, r, l)), !0;
    case "mouseover":
      return (tn = _r(tn, e, t, n, r, l)), !0;
    case "pointerover":
      var i = l.pointerId;
      return Zr.set(i, _r(Zr.get(i) || null, e, t, n, r, l)), !0;
    case "gotpointercapture":
      return (
        (i = l.pointerId), qr.set(i, _r(qr.get(i) || null, e, t, n, r, l)), !0
      );
  }
  return !1;
}
function kf(e) {
  var t = gn(e.target);
  if (t !== null) {
    var n = Mn(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = cf(n)), t !== null)) {
          (e.blockedOn = t),
            Ef(e.priority, function () {
              wf(n);
            });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Xl(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Go(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      (Wo = r), n.target.dispatchEvent(r), (Wo = null);
    } else return (t = vl(n)), t !== null && Qa(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function ds(e, t, n) {
  Xl(e) && n.delete(t);
}
function $h() {
  (Xo = !1),
    bt !== null && Xl(bt) && (bt = null),
    en !== null && Xl(en) && (en = null),
    tn !== null && Xl(tn) && (tn = null),
    Zr.forEach(ds),
    qr.forEach(ds);
}
function Cr(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Xo ||
      ((Xo = !0),
      Ge.unstable_scheduleCallback(Ge.unstable_NormalPriority, $h)));
}
function br(e) {
  function t(l) {
    return Cr(l, e);
  }
  if (0 < Ol.length) {
    Cr(Ol[0], e);
    for (var n = 1; n < Ol.length; n++) {
      var r = Ol[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    bt !== null && Cr(bt, e),
      en !== null && Cr(en, e),
      tn !== null && Cr(tn, e),
      Zr.forEach(t),
      qr.forEach(t),
      n = 0;
    n < Jt.length;
    n++
  )
    (r = Jt[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < Jt.length && ((n = Jt[0]), n.blockedOn === null); )
    kf(n), n.blockedOn === null && Jt.shift();
}
var bn = Ut.ReactCurrentBatchConfig,
  fi = !0;
function Ah(e, t, n, r) {
  var l = Z,
    i = bn.transition;
  bn.transition = null;
  try {
    (Z = 1), Ya(e, t, n, r);
  } finally {
    (Z = l), (bn.transition = i);
  }
}
function Bh(e, t, n, r) {
  var l = Z,
    i = bn.transition;
  bn.transition = null;
  try {
    (Z = 4), Ya(e, t, n, r);
  } finally {
    (Z = l), (bn.transition = i);
  }
}
function Ya(e, t, n, r) {
  if (fi) {
    var l = Go(e, t, n, r);
    if (l === null) yo(e, t, r, di, n), fs(e, r);
    else if (Uh(l, e, t, n, r)) r.stopPropagation();
    else if ((fs(e, r), t & 4 && -1 < Ih.indexOf(e))) {
      for (; l !== null; ) {
        var i = vl(l);
        if (
          (i !== null && gf(i),
          (i = Go(e, t, n, r)),
          i === null && yo(e, t, r, di, n),
          i === l)
        )
          break;
        l = i;
      }
      l !== null && r.stopPropagation();
    } else yo(e, t, r, null, n);
  }
}
var di = null;
function Go(e, t, n, r) {
  if (((di = null), (e = Va(r)), (e = gn(e)), e !== null))
    if (((t = Mn(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = cf(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (di = e), null;
}
function xf(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Lh()) {
        case Wa:
          return 1;
        case hf:
          return 4;
        case si:
        case Th:
          return 16;
        case mf:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Gt = null,
  Ja = null,
  Gl = null;
function _f() {
  if (Gl) return Gl;
  var e,
    t = Ja,
    n = t.length,
    r,
    l = "value" in Gt ? Gt.value : Gt.textContent,
    i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++);
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === l[i - r]; r++);
  return (Gl = l.slice(e, 1 < r ? 1 - r : void 0));
}
function Zl(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function zl() {
  return !0;
}
function ps() {
  return !1;
}
function qe(e) {
  function t(n, r, l, i, o) {
    (this._reactName = n),
      (this._targetInst = l),
      (this.type = r),
      (this.nativeEvent = i),
      (this.target = o),
      (this.currentTarget = null);
    for (var a in e)
      e.hasOwnProperty(a) && ((n = e[a]), (this[a] = n ? n(i) : i[a]));
    return (
      (this.isDefaultPrevented = (
        i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
      )
        ? zl
        : ps),
      (this.isPropagationStopped = ps),
      this
    );
  }
  return (
    se(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = zl));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = zl));
      },
      persist: function () {},
      isPersistent: zl,
    }),
    t
  );
}
var dr = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Xa = qe(dr),
  ml = se({}, dr, { view: 0, detail: 0 }),
  Hh = qe(ml),
  ao,
  uo,
  Pr,
  Fi = se({}, ml, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Ga,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== Pr &&
            (Pr && e.type === "mousemove"
              ? ((ao = e.screenX - Pr.screenX), (uo = e.screenY - Pr.screenY))
              : (uo = ao = 0),
            (Pr = e)),
          ao);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : uo;
    },
  }),
  hs = qe(Fi),
  Vh = se({}, Fi, { dataTransfer: 0 }),
  Wh = qe(Vh),
  Kh = se({}, ml, { relatedTarget: 0 }),
  so = qe(Kh),
  Qh = se({}, dr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Yh = qe(Qh),
  Jh = se({}, dr, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  Xh = qe(Jh),
  Gh = se({}, dr, { data: 0 }),
  ms = qe(Gh),
  Zh = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  qh = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  bh = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function em(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = bh[e]) ? !!t[e] : !1;
}
function Ga() {
  return em;
}
var tm = se({}, ml, {
    key: function (e) {
      if (e.key) {
        var t = Zh[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Zl(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
        ? qh[e.keyCode] || "Unidentified"
        : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Ga,
    charCode: function (e) {
      return e.type === "keypress" ? Zl(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Zl(e)
        : e.type === "keydown" || e.type === "keyup"
        ? e.keyCode
        : 0;
    },
  }),
  nm = qe(tm),
  rm = se({}, Fi, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  vs = qe(rm),
  lm = se({}, ml, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Ga,
  }),
  im = qe(lm),
  om = se({}, dr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  am = qe(om),
  um = se({}, Fi, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
        ? -e.wheelDeltaY
        : "wheelDelta" in e
        ? -e.wheelDelta
        : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  sm = qe(um),
  cm = [9, 13, 27, 32],
  Za = zt && "CompositionEvent" in window,
  Ar = null;
zt && "documentMode" in document && (Ar = document.documentMode);
var fm = zt && "TextEvent" in window && !Ar,
  Cf = zt && (!Za || (Ar && 8 < Ar && 11 >= Ar)),
  ys = " ",
  gs = !1;
function Pf(e, t) {
  switch (e) {
    case "keyup":
      return cm.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Rf(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var An = !1;
function dm(e, t) {
  switch (e) {
    case "compositionend":
      return Rf(t);
    case "keypress":
      return t.which !== 32 ? null : ((gs = !0), ys);
    case "textInput":
      return (e = t.data), e === ys && gs ? null : e;
    default:
      return null;
  }
}
function pm(e, t) {
  if (An)
    return e === "compositionend" || (!Za && Pf(e, t))
      ? ((e = _f()), (Gl = Ja = Gt = null), (An = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Cf && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var hm = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function ws(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!hm[e.type] : t === "textarea";
}
function Lf(e, t, n, r) {
  lf(r),
    (t = pi(t, "onChange")),
    0 < t.length &&
      ((n = new Xa("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t }));
}
var Br = null,
  el = null;
function mm(e) {
  $f(e, 0);
}
function Ii(e) {
  var t = Vn(e);
  if (Zc(t)) return e;
}
function vm(e, t) {
  if (e === "change") return t;
}
var Tf = !1;
if (zt) {
  var co;
  if (zt) {
    var fo = "oninput" in document;
    if (!fo) {
      var Ss = document.createElement("div");
      Ss.setAttribute("oninput", "return;"),
        (fo = typeof Ss.oninput == "function");
    }
    co = fo;
  } else co = !1;
  Tf = co && (!document.documentMode || 9 < document.documentMode);
}
function Es() {
  Br && (Br.detachEvent("onpropertychange", Nf), (el = Br = null));
}
function Nf(e) {
  if (e.propertyName === "value" && Ii(el)) {
    var t = [];
    Lf(t, el, e, Va(e)), sf(mm, t);
  }
}
function ym(e, t, n) {
  e === "focusin"
    ? (Es(), (Br = t), (el = n), Br.attachEvent("onpropertychange", Nf))
    : e === "focusout" && Es();
}
function gm(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Ii(el);
}
function wm(e, t) {
  if (e === "click") return Ii(t);
}
function Sm(e, t) {
  if (e === "input" || e === "change") return Ii(t);
}
function Em(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var St = typeof Object.is == "function" ? Object.is : Em;
function tl(e, t) {
  if (St(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!Mo.call(t, l) || !St(e[l], t[l])) return !1;
  }
  return !0;
}
function ks(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function xs(e, t) {
  var n = ks(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = ks(n);
  }
}
function Df(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
      ? !1
      : t && t.nodeType === 3
      ? Df(e, t.parentNode)
      : "contains" in e
      ? e.contains(t)
      : e.compareDocumentPosition
      ? !!(e.compareDocumentPosition(t) & 16)
      : !1
    : !1;
}
function Mf() {
  for (var e = window, t = oi(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = oi(e.document);
  }
  return t;
}
function qa(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function km(e) {
  var t = Mf(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    Df(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && qa(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        (n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var l = n.textContent.length,
          i = Math.min(r.start, l);
        (r = r.end === void 0 ? i : Math.min(r.end, l)),
          !e.extend && i > r && ((l = r), (r = i), (i = l)),
          (l = xs(n, i));
        var o = xs(n, r);
        l &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== l.node ||
            e.anchorOffset !== l.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(l.node, l.offset),
          e.removeAllRanges(),
          i > r
            ? (e.addRange(t), e.extend(o.node, o.offset))
            : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      (e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top);
  }
}
var xm = zt && "documentMode" in document && 11 >= document.documentMode,
  Bn = null,
  Zo = null,
  Hr = null,
  qo = !1;
function _s(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  qo ||
    Bn == null ||
    Bn !== oi(r) ||
    ((r = Bn),
    "selectionStart" in r && qa(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (Hr && tl(Hr, r)) ||
      ((Hr = r),
      (r = pi(Zo, "onSelect")),
      0 < r.length &&
        ((t = new Xa("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = Bn))));
}
function jl(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var Hn = {
    animationend: jl("Animation", "AnimationEnd"),
    animationiteration: jl("Animation", "AnimationIteration"),
    animationstart: jl("Animation", "AnimationStart"),
    transitionend: jl("Transition", "TransitionEnd"),
  },
  po = {},
  Of = {};
zt &&
  ((Of = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete Hn.animationend.animation,
    delete Hn.animationiteration.animation,
    delete Hn.animationstart.animation),
  "TransitionEvent" in window || delete Hn.transitionend.transition);
function Ui(e) {
  if (po[e]) return po[e];
  if (!Hn[e]) return e;
  var t = Hn[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in Of) return (po[e] = t[n]);
  return e;
}
var zf = Ui("animationend"),
  jf = Ui("animationiteration"),
  Ff = Ui("animationstart"),
  If = Ui("transitionend"),
  Uf = new Map(),
  Cs =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
function cn(e, t) {
  Uf.set(e, t), Dn(t, [e]);
}
for (var ho = 0; ho < Cs.length; ho++) {
  var mo = Cs[ho],
    _m = mo.toLowerCase(),
    Cm = mo[0].toUpperCase() + mo.slice(1);
  cn(_m, "on" + Cm);
}
cn(zf, "onAnimationEnd");
cn(jf, "onAnimationIteration");
cn(Ff, "onAnimationStart");
cn("dblclick", "onDoubleClick");
cn("focusin", "onFocus");
cn("focusout", "onBlur");
cn(If, "onTransitionEnd");
nr("onMouseEnter", ["mouseout", "mouseover"]);
nr("onMouseLeave", ["mouseout", "mouseover"]);
nr("onPointerEnter", ["pointerout", "pointerover"]);
nr("onPointerLeave", ["pointerout", "pointerover"]);
Dn(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(" ")
);
Dn(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " "
  )
);
Dn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Dn(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" ")
);
Dn(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" ")
);
Dn(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
);
var Ir =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ),
  Pm = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ir));
function Ps(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), _h(r, t, void 0, e), (e.currentTarget = null);
}
function $f(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      l = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t)
        for (var o = r.length - 1; 0 <= o; o--) {
          var a = r[o],
            u = a.instance,
            s = a.currentTarget;
          if (((a = a.listener), u !== i && l.isPropagationStopped())) break e;
          Ps(l, a, s), (i = u);
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((a = r[o]),
            (u = a.instance),
            (s = a.currentTarget),
            (a = a.listener),
            u !== i && l.isPropagationStopped())
          )
            break e;
          Ps(l, a, s), (i = u);
        }
    }
  }
  if (ui) throw ((e = Yo), (ui = !1), (Yo = null), e);
}
function te(e, t) {
  var n = t[ra];
  n === void 0 && (n = t[ra] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Af(t, e, 2, !1), n.add(r));
}
function vo(e, t, n) {
  var r = 0;
  t && (r |= 4), Af(n, e, r, t);
}
var Fl = "_reactListening" + Math.random().toString(36).slice(2);
function nl(e) {
  if (!e[Fl]) {
    (e[Fl] = !0),
      Qc.forEach(function (n) {
        n !== "selectionchange" && (Pm.has(n) || vo(n, !1, e), vo(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Fl] || ((t[Fl] = !0), vo("selectionchange", !1, t));
  }
}
function Af(e, t, n, r) {
  switch (xf(t)) {
    case 1:
      var l = Ah;
      break;
    case 4:
      l = Bh;
      break;
    default:
      l = Ya;
  }
  (n = l.bind(null, t, n, e)),
    (l = void 0),
    !Qo ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (l = !0),
    r
      ? l !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: l })
        : e.addEventListener(t, n, !0)
      : l !== void 0
      ? e.addEventListener(t, n, { passive: l })
      : e.addEventListener(t, n, !1);
}
function yo(e, t, n, r, l) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var a = r.stateNode.containerInfo;
        if (a === l || (a.nodeType === 8 && a.parentNode === l)) break;
        if (o === 4)
          for (o = r.return; o !== null; ) {
            var u = o.tag;
            if (
              (u === 3 || u === 4) &&
              ((u = o.stateNode.containerInfo),
              u === l || (u.nodeType === 8 && u.parentNode === l))
            )
              return;
            o = o.return;
          }
        for (; a !== null; ) {
          if (((o = gn(a)), o === null)) return;
          if (((u = o.tag), u === 5 || u === 6)) {
            r = i = o;
            continue e;
          }
          a = a.parentNode;
        }
      }
      r = r.return;
    }
  sf(function () {
    var s = i,
      c = Va(n),
      f = [];
    e: {
      var d = Uf.get(e);
      if (d !== void 0) {
        var E = Xa,
          S = e;
        switch (e) {
          case "keypress":
            if (Zl(n) === 0) break e;
          case "keydown":
          case "keyup":
            E = nm;
            break;
          case "focusin":
            (S = "focus"), (E = so);
            break;
          case "focusout":
            (S = "blur"), (E = so);
            break;
          case "beforeblur":
          case "afterblur":
            E = so;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            E = hs;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            E = Wh;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            E = im;
            break;
          case zf:
          case jf:
          case Ff:
            E = Yh;
            break;
          case If:
            E = am;
            break;
          case "scroll":
            E = Hh;
            break;
          case "wheel":
            E = sm;
            break;
          case "copy":
          case "cut":
          case "paste":
            E = Xh;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            E = vs;
        }
        var w = (t & 4) !== 0,
          P = !w && e === "scroll",
          h = w ? (d !== null ? d + "Capture" : null) : d;
        w = [];
        for (var p = s, v; p !== null; ) {
          v = p;
          var x = v.stateNode;
          if (
            (v.tag === 5 &&
              x !== null &&
              ((v = x),
              h !== null && ((x = Gr(p, h)), x != null && w.push(rl(p, x, v)))),
            P)
          )
            break;
          p = p.return;
        }
        0 < w.length &&
          ((d = new E(d, S, null, n, c)), f.push({ event: d, listeners: w }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((d = e === "mouseover" || e === "pointerover"),
          (E = e === "mouseout" || e === "pointerout"),
          d &&
            n !== Wo &&
            (S = n.relatedTarget || n.fromElement) &&
            (gn(S) || S[jt]))
        )
          break e;
        if (
          (E || d) &&
          ((d =
            c.window === c
              ? c
              : (d = c.ownerDocument)
              ? d.defaultView || d.parentWindow
              : window),
          E
            ? ((S = n.relatedTarget || n.toElement),
              (E = s),
              (S = S ? gn(S) : null),
              S !== null &&
                ((P = Mn(S)), S !== P || (S.tag !== 5 && S.tag !== 6)) &&
                (S = null))
            : ((E = null), (S = s)),
          E !== S)
        ) {
          if (
            ((w = hs),
            (x = "onMouseLeave"),
            (h = "onMouseEnter"),
            (p = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((w = vs),
              (x = "onPointerLeave"),
              (h = "onPointerEnter"),
              (p = "pointer")),
            (P = E == null ? d : Vn(E)),
            (v = S == null ? d : Vn(S)),
            (d = new w(x, p + "leave", E, n, c)),
            (d.target = P),
            (d.relatedTarget = v),
            (x = null),
            gn(c) === s &&
              ((w = new w(h, p + "enter", S, n, c)),
              (w.target = v),
              (w.relatedTarget = P),
              (x = w)),
            (P = x),
            E && S)
          )
            t: {
              for (w = E, h = S, p = 0, v = w; v; v = Fn(v)) p++;
              for (v = 0, x = h; x; x = Fn(x)) v++;
              for (; 0 < p - v; ) (w = Fn(w)), p--;
              for (; 0 < v - p; ) (h = Fn(h)), v--;
              for (; p--; ) {
                if (w === h || (h !== null && w === h.alternate)) break t;
                (w = Fn(w)), (h = Fn(h));
              }
              w = null;
            }
          else w = null;
          E !== null && Rs(f, d, E, w, !1),
            S !== null && P !== null && Rs(f, P, S, w, !0);
        }
      }
      e: {
        if (
          ((d = s ? Vn(s) : window),
          (E = d.nodeName && d.nodeName.toLowerCase()),
          E === "select" || (E === "input" && d.type === "file"))
        )
          var L = vm;
        else if (ws(d))
          if (Tf) L = Sm;
          else {
            L = gm;
            var M = ym;
          }
        else
          (E = d.nodeName) &&
            E.toLowerCase() === "input" &&
            (d.type === "checkbox" || d.type === "radio") &&
            (L = wm);
        if (L && (L = L(e, s))) {
          Lf(f, L, n, c);
          break e;
        }
        M && M(e, d, s),
          e === "focusout" &&
            (M = d._wrapperState) &&
            M.controlled &&
            d.type === "number" &&
            $o(d, "number", d.value);
      }
      switch (((M = s ? Vn(s) : window), e)) {
        case "focusin":
          (ws(M) || M.contentEditable === "true") &&
            ((Bn = M), (Zo = s), (Hr = null));
          break;
        case "focusout":
          Hr = Zo = Bn = null;
          break;
        case "mousedown":
          qo = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (qo = !1), _s(f, n, c);
          break;
        case "selectionchange":
          if (xm) break;
        case "keydown":
        case "keyup":
          _s(f, n, c);
      }
      var m;
      if (Za)
        e: {
          switch (e) {
            case "compositionstart":
              var C = "onCompositionStart";
              break e;
            case "compositionend":
              C = "onCompositionEnd";
              break e;
            case "compositionupdate":
              C = "onCompositionUpdate";
              break e;
          }
          C = void 0;
        }
      else
        An
          ? Pf(e, n) && (C = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (C = "onCompositionStart");
      C &&
        (Cf &&
          n.locale !== "ko" &&
          (An || C !== "onCompositionStart"
            ? C === "onCompositionEnd" && An && (m = _f())
            : ((Gt = c),
              (Ja = "value" in Gt ? Gt.value : Gt.textContent),
              (An = !0))),
        (M = pi(s, C)),
        0 < M.length &&
          ((C = new ms(C, e, null, n, c)),
          f.push({ event: C, listeners: M }),
          m ? (C.data = m) : ((m = Rf(n)), m !== null && (C.data = m)))),
        (m = fm ? dm(e, n) : pm(e, n)) &&
          ((s = pi(s, "onBeforeInput")),
          0 < s.length &&
            ((c = new ms("onBeforeInput", "beforeinput", null, n, c)),
            f.push({ event: c, listeners: s }),
            (c.data = m)));
    }
    $f(f, t);
  });
}
function rl(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function pi(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var l = e,
      i = l.stateNode;
    l.tag === 5 &&
      i !== null &&
      ((l = i),
      (i = Gr(e, n)),
      i != null && r.unshift(rl(e, i, l)),
      (i = Gr(e, t)),
      i != null && r.push(rl(e, i, l))),
      (e = e.return);
  }
  return r;
}
function Fn(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Rs(e, t, n, r, l) {
  for (var i = t._reactName, o = []; n !== null && n !== r; ) {
    var a = n,
      u = a.alternate,
      s = a.stateNode;
    if (u !== null && u === r) break;
    a.tag === 5 &&
      s !== null &&
      ((a = s),
      l
        ? ((u = Gr(n, i)), u != null && o.unshift(rl(n, u, a)))
        : l || ((u = Gr(n, i)), u != null && o.push(rl(n, u, a)))),
      (n = n.return);
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var Rm = /\r\n?/g,
  Lm = /\u0000|\uFFFD/g;
function Ls(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      Rm,
      `
`
    )
    .replace(Lm, "");
}
function Il(e, t, n) {
  if (((t = Ls(t)), Ls(e) !== t && n)) throw Error(R(425));
}
function hi() {}
var bo = null,
  ea = null;
function ta(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var na = typeof setTimeout == "function" ? setTimeout : void 0,
  Tm = typeof clearTimeout == "function" ? clearTimeout : void 0,
  Ts = typeof Promise == "function" ? Promise : void 0,
  Nm =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof Ts < "u"
      ? function (e) {
          return Ts.resolve(null).then(e).catch(Dm);
        }
      : na;
function Dm(e) {
  setTimeout(function () {
    throw e;
  });
}
function go(e, t) {
  var n = t,
    r = 0;
  do {
    var l = n.nextSibling;
    if ((e.removeChild(n), l && l.nodeType === 8))
      if (((n = l.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(l), br(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = l;
  } while (n);
  br(t);
}
function nn(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Ns(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var pr = Math.random().toString(36).slice(2),
  _t = "__reactFiber$" + pr,
  ll = "__reactProps$" + pr,
  jt = "__reactContainer$" + pr,
  ra = "__reactEvents$" + pr,
  Mm = "__reactListeners$" + pr,
  Om = "__reactHandles$" + pr;
function gn(e) {
  var t = e[_t];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[jt] || n[_t])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = Ns(e); e !== null; ) {
          if ((n = e[_t])) return n;
          e = Ns(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function vl(e) {
  return (
    (e = e[_t] || e[jt]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function Vn(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(R(33));
}
function $i(e) {
  return e[ll] || null;
}
var la = [],
  Wn = -1;
function fn(e) {
  return { current: e };
}
function ne(e) {
  0 > Wn || ((e.current = la[Wn]), (la[Wn] = null), Wn--);
}
function ee(e, t) {
  Wn++, (la[Wn] = e.current), (e.current = t);
}
var sn = {},
  De = fn(sn),
  Ae = fn(!1),
  Cn = sn;
function rr(e, t) {
  var n = e.type.contextTypes;
  if (!n) return sn;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var l = {},
    i;
  for (i in n) l[i] = t[i];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = l)),
    l
  );
}
function Be(e) {
  return (e = e.childContextTypes), e != null;
}
function mi() {
  ne(Ae), ne(De);
}
function Ds(e, t, n) {
  if (De.current !== sn) throw Error(R(168));
  ee(De, t), ee(Ae, n);
}
function Bf(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(R(108, yh(e) || "Unknown", l));
  return se({}, n, r);
}
function vi(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || sn),
    (Cn = De.current),
    ee(De, e),
    ee(Ae, Ae.current),
    !0
  );
}
function Ms(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(R(169));
  n
    ? ((e = Bf(e, t, Cn)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      ne(Ae),
      ne(De),
      ee(De, e))
    : ne(Ae),
    ee(Ae, n);
}
var Tt = null,
  Ai = !1,
  wo = !1;
function Hf(e) {
  Tt === null ? (Tt = [e]) : Tt.push(e);
}
function zm(e) {
  (Ai = !0), Hf(e);
}
function dn() {
  if (!wo && Tt !== null) {
    wo = !0;
    var e = 0,
      t = Z;
    try {
      var n = Tt;
      for (Z = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (Tt = null), (Ai = !1);
    } catch (l) {
      throw (Tt !== null && (Tt = Tt.slice(e + 1)), pf(Wa, dn), l);
    } finally {
      (Z = t), (wo = !1);
    }
  }
  return null;
}
var Kn = [],
  Qn = 0,
  yi = null,
  gi = 0,
  lt = [],
  it = 0,
  Pn = null,
  Nt = 1,
  Dt = "";
function vn(e, t) {
  (Kn[Qn++] = gi), (Kn[Qn++] = yi), (yi = e), (gi = t);
}
function Vf(e, t, n) {
  (lt[it++] = Nt), (lt[it++] = Dt), (lt[it++] = Pn), (Pn = e);
  var r = Nt;
  e = Dt;
  var l = 32 - gt(r) - 1;
  (r &= ~(1 << l)), (n += 1);
  var i = 32 - gt(t) + l;
  if (30 < i) {
    var o = l - (l % 5);
    (i = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (l -= o),
      (Nt = (1 << (32 - gt(t) + l)) | (n << l) | r),
      (Dt = i + e);
  } else (Nt = (1 << i) | (n << l) | r), (Dt = e);
}
function ba(e) {
  e.return !== null && (vn(e, 1), Vf(e, 1, 0));
}
function eu(e) {
  for (; e === yi; )
    (yi = Kn[--Qn]), (Kn[Qn] = null), (gi = Kn[--Qn]), (Kn[Qn] = null);
  for (; e === Pn; )
    (Pn = lt[--it]),
      (lt[it] = null),
      (Dt = lt[--it]),
      (lt[it] = null),
      (Nt = lt[--it]),
      (lt[it] = null);
}
var Xe = null,
  Je = null,
  oe = !1,
  yt = null;
function Wf(e, t) {
  var n = at(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function Os(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (Xe = e), (Je = nn(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Xe = e), (Je = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Pn !== null ? { id: Nt, overflow: Dt } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = at(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Xe = e),
            (Je = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function ia(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function oa(e) {
  if (oe) {
    var t = Je;
    if (t) {
      var n = t;
      if (!Os(e, t)) {
        if (ia(e)) throw Error(R(418));
        t = nn(n.nextSibling);
        var r = Xe;
        t && Os(e, t)
          ? Wf(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (oe = !1), (Xe = e));
      }
    } else {
      if (ia(e)) throw Error(R(418));
      (e.flags = (e.flags & -4097) | 2), (oe = !1), (Xe = e);
    }
  }
}
function zs(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Xe = e;
}
function Ul(e) {
  if (e !== Xe) return !1;
  if (!oe) return zs(e), (oe = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !ta(e.type, e.memoizedProps))),
    t && (t = Je))
  ) {
    if (ia(e)) throw (Kf(), Error(R(418)));
    for (; t; ) Wf(e, t), (t = nn(t.nextSibling));
  }
  if ((zs(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(R(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Je = nn(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      Je = null;
    }
  } else Je = Xe ? nn(e.stateNode.nextSibling) : null;
  return !0;
}
function Kf() {
  for (var e = Je; e; ) e = nn(e.nextSibling);
}
function lr() {
  (Je = Xe = null), (oe = !1);
}
function tu(e) {
  yt === null ? (yt = [e]) : yt.push(e);
}
var jm = Ut.ReactCurrentBatchConfig;
function Rr(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(R(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(R(147, e));
      var l = r,
        i = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === i
        ? t.ref
        : ((t = function (o) {
            var a = l.refs;
            o === null ? delete a[i] : (a[i] = o);
          }),
          (t._stringRef = i),
          t);
    }
    if (typeof e != "string") throw Error(R(284));
    if (!n._owner) throw Error(R(290, e));
  }
  return e;
}
function $l(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      R(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e
      )
    ))
  );
}
function js(e) {
  var t = e._init;
  return t(e._payload);
}
function Qf(e) {
  function t(h, p) {
    if (e) {
      var v = h.deletions;
      v === null ? ((h.deletions = [p]), (h.flags |= 16)) : v.push(p);
    }
  }
  function n(h, p) {
    if (!e) return null;
    for (; p !== null; ) t(h, p), (p = p.sibling);
    return null;
  }
  function r(h, p) {
    for (h = new Map(); p !== null; )
      p.key !== null ? h.set(p.key, p) : h.set(p.index, p), (p = p.sibling);
    return h;
  }
  function l(h, p) {
    return (h = an(h, p)), (h.index = 0), (h.sibling = null), h;
  }
  function i(h, p, v) {
    return (
      (h.index = v),
      e
        ? ((v = h.alternate),
          v !== null
            ? ((v = v.index), v < p ? ((h.flags |= 2), p) : v)
            : ((h.flags |= 2), p))
        : ((h.flags |= 1048576), p)
    );
  }
  function o(h) {
    return e && h.alternate === null && (h.flags |= 2), h;
  }
  function a(h, p, v, x) {
    return p === null || p.tag !== 6
      ? ((p = Po(v, h.mode, x)), (p.return = h), p)
      : ((p = l(p, v)), (p.return = h), p);
  }
  function u(h, p, v, x) {
    var L = v.type;
    return L === $n
      ? c(h, p, v.props.children, x, v.key)
      : p !== null &&
        (p.elementType === L ||
          (typeof L == "object" &&
            L !== null &&
            L.$$typeof === Qt &&
            js(L) === p.type))
      ? ((x = l(p, v.props)), (x.ref = Rr(h, p, v)), (x.return = h), x)
      : ((x = li(v.type, v.key, v.props, null, h.mode, x)),
        (x.ref = Rr(h, p, v)),
        (x.return = h),
        x);
  }
  function s(h, p, v, x) {
    return p === null ||
      p.tag !== 4 ||
      p.stateNode.containerInfo !== v.containerInfo ||
      p.stateNode.implementation !== v.implementation
      ? ((p = Ro(v, h.mode, x)), (p.return = h), p)
      : ((p = l(p, v.children || [])), (p.return = h), p);
  }
  function c(h, p, v, x, L) {
    return p === null || p.tag !== 7
      ? ((p = _n(v, h.mode, x, L)), (p.return = h), p)
      : ((p = l(p, v)), (p.return = h), p);
  }
  function f(h, p, v) {
    if ((typeof p == "string" && p !== "") || typeof p == "number")
      return (p = Po("" + p, h.mode, v)), (p.return = h), p;
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case Ll:
          return (
            (v = li(p.type, p.key, p.props, null, h.mode, v)),
            (v.ref = Rr(h, null, p)),
            (v.return = h),
            v
          );
        case Un:
          return (p = Ro(p, h.mode, v)), (p.return = h), p;
        case Qt:
          var x = p._init;
          return f(h, x(p._payload), v);
      }
      if (jr(p) || kr(p))
        return (p = _n(p, h.mode, v, null)), (p.return = h), p;
      $l(h, p);
    }
    return null;
  }
  function d(h, p, v, x) {
    var L = p !== null ? p.key : null;
    if ((typeof v == "string" && v !== "") || typeof v == "number")
      return L !== null ? null : a(h, p, "" + v, x);
    if (typeof v == "object" && v !== null) {
      switch (v.$$typeof) {
        case Ll:
          return v.key === L ? u(h, p, v, x) : null;
        case Un:
          return v.key === L ? s(h, p, v, x) : null;
        case Qt:
          return (L = v._init), d(h, p, L(v._payload), x);
      }
      if (jr(v) || kr(v)) return L !== null ? null : c(h, p, v, x, null);
      $l(h, v);
    }
    return null;
  }
  function E(h, p, v, x, L) {
    if ((typeof x == "string" && x !== "") || typeof x == "number")
      return (h = h.get(v) || null), a(p, h, "" + x, L);
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case Ll:
          return (h = h.get(x.key === null ? v : x.key) || null), u(p, h, x, L);
        case Un:
          return (h = h.get(x.key === null ? v : x.key) || null), s(p, h, x, L);
        case Qt:
          var M = x._init;
          return E(h, p, v, M(x._payload), L);
      }
      if (jr(x) || kr(x)) return (h = h.get(v) || null), c(p, h, x, L, null);
      $l(p, x);
    }
    return null;
  }
  function S(h, p, v, x) {
    for (
      var L = null, M = null, m = p, C = (p = 0), O = null;
      m !== null && C < v.length;
      C++
    ) {
      m.index > C ? ((O = m), (m = null)) : (O = m.sibling);
      var D = d(h, m, v[C], x);
      if (D === null) {
        m === null && (m = O);
        break;
      }
      e && m && D.alternate === null && t(h, m),
        (p = i(D, p, C)),
        M === null ? (L = D) : (M.sibling = D),
        (M = D),
        (m = O);
    }
    if (C === v.length) return n(h, m), oe && vn(h, C), L;
    if (m === null) {
      for (; C < v.length; C++)
        (m = f(h, v[C], x)),
          m !== null &&
            ((p = i(m, p, C)), M === null ? (L = m) : (M.sibling = m), (M = m));
      return oe && vn(h, C), L;
    }
    for (m = r(h, m); C < v.length; C++)
      (O = E(m, h, C, v[C], x)),
        O !== null &&
          (e && O.alternate !== null && m.delete(O.key === null ? C : O.key),
          (p = i(O, p, C)),
          M === null ? (L = O) : (M.sibling = O),
          (M = O));
    return (
      e &&
        m.forEach(function (H) {
          return t(h, H);
        }),
      oe && vn(h, C),
      L
    );
  }
  function w(h, p, v, x) {
    var L = kr(v);
    if (typeof L != "function") throw Error(R(150));
    if (((v = L.call(v)), v == null)) throw Error(R(151));
    for (
      var M = (L = null), m = p, C = (p = 0), O = null, D = v.next();
      m !== null && !D.done;
      C++, D = v.next()
    ) {
      m.index > C ? ((O = m), (m = null)) : (O = m.sibling);
      var H = d(h, m, D.value, x);
      if (H === null) {
        m === null && (m = O);
        break;
      }
      e && m && H.alternate === null && t(h, m),
        (p = i(H, p, C)),
        M === null ? (L = H) : (M.sibling = H),
        (M = H),
        (m = O);
    }
    if (D.done) return n(h, m), oe && vn(h, C), L;
    if (m === null) {
      for (; !D.done; C++, D = v.next())
        (D = f(h, D.value, x)),
          D !== null &&
            ((p = i(D, p, C)), M === null ? (L = D) : (M.sibling = D), (M = D));
      return oe && vn(h, C), L;
    }
    for (m = r(h, m); !D.done; C++, D = v.next())
      (D = E(m, h, C, D.value, x)),
        D !== null &&
          (e && D.alternate !== null && m.delete(D.key === null ? C : D.key),
          (p = i(D, p, C)),
          M === null ? (L = D) : (M.sibling = D),
          (M = D));
    return (
      e &&
        m.forEach(function (G) {
          return t(h, G);
        }),
      oe && vn(h, C),
      L
    );
  }
  function P(h, p, v, x) {
    if (
      (typeof v == "object" &&
        v !== null &&
        v.type === $n &&
        v.key === null &&
        (v = v.props.children),
      typeof v == "object" && v !== null)
    ) {
      switch (v.$$typeof) {
        case Ll:
          e: {
            for (var L = v.key, M = p; M !== null; ) {
              if (M.key === L) {
                if (((L = v.type), L === $n)) {
                  if (M.tag === 7) {
                    n(h, M.sibling),
                      (p = l(M, v.props.children)),
                      (p.return = h),
                      (h = p);
                    break e;
                  }
                } else if (
                  M.elementType === L ||
                  (typeof L == "object" &&
                    L !== null &&
                    L.$$typeof === Qt &&
                    js(L) === M.type)
                ) {
                  n(h, M.sibling),
                    (p = l(M, v.props)),
                    (p.ref = Rr(h, M, v)),
                    (p.return = h),
                    (h = p);
                  break e;
                }
                n(h, M);
                break;
              } else t(h, M);
              M = M.sibling;
            }
            v.type === $n
              ? ((p = _n(v.props.children, h.mode, x, v.key)),
                (p.return = h),
                (h = p))
              : ((x = li(v.type, v.key, v.props, null, h.mode, x)),
                (x.ref = Rr(h, p, v)),
                (x.return = h),
                (h = x));
          }
          return o(h);
        case Un:
          e: {
            for (M = v.key; p !== null; ) {
              if (p.key === M)
                if (
                  p.tag === 4 &&
                  p.stateNode.containerInfo === v.containerInfo &&
                  p.stateNode.implementation === v.implementation
                ) {
                  n(h, p.sibling),
                    (p = l(p, v.children || [])),
                    (p.return = h),
                    (h = p);
                  break e;
                } else {
                  n(h, p);
                  break;
                }
              else t(h, p);
              p = p.sibling;
            }
            (p = Ro(v, h.mode, x)), (p.return = h), (h = p);
          }
          return o(h);
        case Qt:
          return (M = v._init), P(h, p, M(v._payload), x);
      }
      if (jr(v)) return S(h, p, v, x);
      if (kr(v)) return w(h, p, v, x);
      $l(h, v);
    }
    return (typeof v == "string" && v !== "") || typeof v == "number"
      ? ((v = "" + v),
        p !== null && p.tag === 6
          ? (n(h, p.sibling), (p = l(p, v)), (p.return = h), (h = p))
          : (n(h, p), (p = Po(v, h.mode, x)), (p.return = h), (h = p)),
        o(h))
      : n(h, p);
  }
  return P;
}
var ir = Qf(!0),
  Yf = Qf(!1),
  wi = fn(null),
  Si = null,
  Yn = null,
  nu = null;
function ru() {
  nu = Yn = Si = null;
}
function lu(e) {
  var t = wi.current;
  ne(wi), (e._currentValue = t);
}
function aa(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function er(e, t) {
  (Si = e),
    (nu = Yn = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && ($e = !0), (e.firstContext = null));
}
function st(e) {
  var t = e._currentValue;
  if (nu !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), Yn === null)) {
      if (Si === null) throw Error(R(308));
      (Yn = e), (Si.dependencies = { lanes: 0, firstContext: e });
    } else Yn = Yn.next = e;
  return t;
}
var wn = null;
function iu(e) {
  wn === null ? (wn = [e]) : wn.push(e);
}
function Jf(e, t, n, r) {
  var l = t.interleaved;
  return (
    l === null ? ((n.next = n), iu(t)) : ((n.next = l.next), (l.next = n)),
    (t.interleaved = n),
    Ft(e, r)
  );
}
function Ft(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    (e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return);
  return n.tag === 3 ? n.stateNode : null;
}
var Yt = !1;
function ou(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Xf(e, t) {
  (e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      });
}
function Mt(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function rn(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), J & 2)) {
    var l = r.pending;
    return (
      l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
      (r.pending = t),
      Ft(e, n)
    );
  }
  return (
    (l = r.interleaved),
    l === null ? ((t.next = t), iu(r)) : ((t.next = l.next), (l.next = t)),
    (r.interleaved = t),
    Ft(e, n)
  );
}
function ql(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), Ka(e, n);
  }
}
function Fs(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var l = null,
      i = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        i === null ? (l = i = o) : (i = i.next = o), (n = n.next);
      } while (n !== null);
      i === null ? (l = i = t) : (i = i.next = t);
    } else l = i = t;
    (n = {
      baseState: r.baseState,
      firstBaseUpdate: l,
      lastBaseUpdate: i,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n);
    return;
  }
  (e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t);
}
function Ei(e, t, n, r) {
  var l = e.updateQueue;
  Yt = !1;
  var i = l.firstBaseUpdate,
    o = l.lastBaseUpdate,
    a = l.shared.pending;
  if (a !== null) {
    l.shared.pending = null;
    var u = a,
      s = u.next;
    (u.next = null), o === null ? (i = s) : (o.next = s), (o = u);
    var c = e.alternate;
    c !== null &&
      ((c = c.updateQueue),
      (a = c.lastBaseUpdate),
      a !== o &&
        (a === null ? (c.firstBaseUpdate = s) : (a.next = s),
        (c.lastBaseUpdate = u)));
  }
  if (i !== null) {
    var f = l.baseState;
    (o = 0), (c = s = u = null), (a = i);
    do {
      var d = a.lane,
        E = a.eventTime;
      if ((r & d) === d) {
        c !== null &&
          (c = c.next =
            {
              eventTime: E,
              lane: 0,
              tag: a.tag,
              payload: a.payload,
              callback: a.callback,
              next: null,
            });
        e: {
          var S = e,
            w = a;
          switch (((d = t), (E = n), w.tag)) {
            case 1:
              if (((S = w.payload), typeof S == "function")) {
                f = S.call(E, f, d);
                break e;
              }
              f = S;
              break e;
            case 3:
              S.flags = (S.flags & -65537) | 128;
            case 0:
              if (
                ((S = w.payload),
                (d = typeof S == "function" ? S.call(E, f, d) : S),
                d == null)
              )
                break e;
              f = se({}, f, d);
              break e;
            case 2:
              Yt = !0;
          }
        }
        a.callback !== null &&
          a.lane !== 0 &&
          ((e.flags |= 64),
          (d = l.effects),
          d === null ? (l.effects = [a]) : d.push(a));
      } else
        (E = {
          eventTime: E,
          lane: d,
          tag: a.tag,
          payload: a.payload,
          callback: a.callback,
          next: null,
        }),
          c === null ? ((s = c = E), (u = f)) : (c = c.next = E),
          (o |= d);
      if (((a = a.next), a === null)) {
        if (((a = l.shared.pending), a === null)) break;
        (d = a),
          (a = d.next),
          (d.next = null),
          (l.lastBaseUpdate = d),
          (l.shared.pending = null);
      }
    } while (!0);
    if (
      (c === null && (u = f),
      (l.baseState = u),
      (l.firstBaseUpdate = s),
      (l.lastBaseUpdate = c),
      (t = l.shared.interleaved),
      t !== null)
    ) {
      l = t;
      do (o |= l.lane), (l = l.next);
      while (l !== t);
    } else i === null && (l.shared.lanes = 0);
    (Ln |= o), (e.lanes = o), (e.memoizedState = f);
  }
}
function Is(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        l = r.callback;
      if (l !== null) {
        if (((r.callback = null), (r = n), typeof l != "function"))
          throw Error(R(191, l));
        l.call(r);
      }
    }
}
var yl = {},
  Pt = fn(yl),
  il = fn(yl),
  ol = fn(yl);
function Sn(e) {
  if (e === yl) throw Error(R(174));
  return e;
}
function au(e, t) {
  switch ((ee(ol, t), ee(il, e), ee(Pt, yl), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Bo(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = Bo(t, e));
  }
  ne(Pt), ee(Pt, t);
}
function or() {
  ne(Pt), ne(il), ne(ol);
}
function Gf(e) {
  Sn(ol.current);
  var t = Sn(Pt.current),
    n = Bo(t, e.type);
  t !== n && (ee(il, e), ee(Pt, n));
}
function uu(e) {
  il.current === e && (ne(Pt), ne(il));
}
var ae = fn(0);
function ki(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      (t.child.return = t), (t = t.child);
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    (t.sibling.return = t.return), (t = t.sibling);
  }
  return null;
}
var So = [];
function su() {
  for (var e = 0; e < So.length; e++)
    So[e]._workInProgressVersionPrimary = null;
  So.length = 0;
}
var bl = Ut.ReactCurrentDispatcher,
  Eo = Ut.ReactCurrentBatchConfig,
  Rn = 0,
  ue = null,
  me = null,
  we = null,
  xi = !1,
  Vr = !1,
  al = 0,
  Fm = 0;
function Le() {
  throw Error(R(321));
}
function cu(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!St(e[n], t[n])) return !1;
  return !0;
}
function fu(e, t, n, r, l, i) {
  if (
    ((Rn = i),
    (ue = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (bl.current = e === null || e.memoizedState === null ? Am : Bm),
    (e = n(r, l)),
    Vr)
  ) {
    i = 0;
    do {
      if (((Vr = !1), (al = 0), 25 <= i)) throw Error(R(301));
      (i += 1),
        (we = me = null),
        (t.updateQueue = null),
        (bl.current = Hm),
        (e = n(r, l));
    } while (Vr);
  }
  if (
    ((bl.current = _i),
    (t = me !== null && me.next !== null),
    (Rn = 0),
    (we = me = ue = null),
    (xi = !1),
    t)
  )
    throw Error(R(300));
  return e;
}
function du() {
  var e = al !== 0;
  return (al = 0), e;
}
function xt() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return we === null ? (ue.memoizedState = we = e) : (we = we.next = e), we;
}
function ct() {
  if (me === null) {
    var e = ue.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = me.next;
  var t = we === null ? ue.memoizedState : we.next;
  if (t !== null) (we = t), (me = e);
  else {
    if (e === null) throw Error(R(310));
    (me = e),
      (e = {
        memoizedState: me.memoizedState,
        baseState: me.baseState,
        baseQueue: me.baseQueue,
        queue: me.queue,
        next: null,
      }),
      we === null ? (ue.memoizedState = we = e) : (we = we.next = e);
  }
  return we;
}
function ul(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function ko(e) {
  var t = ct(),
    n = t.queue;
  if (n === null) throw Error(R(311));
  n.lastRenderedReducer = e;
  var r = me,
    l = r.baseQueue,
    i = n.pending;
  if (i !== null) {
    if (l !== null) {
      var o = l.next;
      (l.next = i.next), (i.next = o);
    }
    (r.baseQueue = l = i), (n.pending = null);
  }
  if (l !== null) {
    (i = l.next), (r = r.baseState);
    var a = (o = null),
      u = null,
      s = i;
    do {
      var c = s.lane;
      if ((Rn & c) === c)
        u !== null &&
          (u = u.next =
            {
              lane: 0,
              action: s.action,
              hasEagerState: s.hasEagerState,
              eagerState: s.eagerState,
              next: null,
            }),
          (r = s.hasEagerState ? s.eagerState : e(r, s.action));
      else {
        var f = {
          lane: c,
          action: s.action,
          hasEagerState: s.hasEagerState,
          eagerState: s.eagerState,
          next: null,
        };
        u === null ? ((a = u = f), (o = r)) : (u = u.next = f),
          (ue.lanes |= c),
          (Ln |= c);
      }
      s = s.next;
    } while (s !== null && s !== i);
    u === null ? (o = r) : (u.next = a),
      St(r, t.memoizedState) || ($e = !0),
      (t.memoizedState = r),
      (t.baseState = o),
      (t.baseQueue = u),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    l = e;
    do (i = l.lane), (ue.lanes |= i), (Ln |= i), (l = l.next);
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function xo(e) {
  var t = ct(),
    n = t.queue;
  if (n === null) throw Error(R(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    l = n.pending,
    i = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var o = (l = l.next);
    do (i = e(i, o.action)), (o = o.next);
    while (o !== l);
    St(i, t.memoizedState) || ($e = !0),
      (t.memoizedState = i),
      t.baseQueue === null && (t.baseState = i),
      (n.lastRenderedState = i);
  }
  return [i, r];
}
function Zf() {}
function qf(e, t) {
  var n = ue,
    r = ct(),
    l = t(),
    i = !St(r.memoizedState, l);
  if (
    (i && ((r.memoizedState = l), ($e = !0)),
    (r = r.queue),
    pu(td.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || i || (we !== null && we.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      sl(9, ed.bind(null, n, r, l, t), void 0, null),
      Se === null)
    )
      throw Error(R(349));
    Rn & 30 || bf(n, t, l);
  }
  return l;
}
function bf(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = ue.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (ue.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function ed(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), nd(t) && rd(e);
}
function td(e, t, n) {
  return n(function () {
    nd(t) && rd(e);
  });
}
function nd(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !St(e, n);
  } catch {
    return !0;
  }
}
function rd(e) {
  var t = Ft(e, 1);
  t !== null && wt(t, e, 1, -1);
}
function Us(e) {
  var t = xt();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ul,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = $m.bind(null, ue, e)),
    [t.memoizedState, e]
  );
}
function sl(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = ue.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (ue.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function ld() {
  return ct().memoizedState;
}
function ei(e, t, n, r) {
  var l = xt();
  (ue.flags |= e),
    (l.memoizedState = sl(1 | t, n, void 0, r === void 0 ? null : r));
}
function Bi(e, t, n, r) {
  var l = ct();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (me !== null) {
    var o = me.memoizedState;
    if (((i = o.destroy), r !== null && cu(r, o.deps))) {
      l.memoizedState = sl(t, n, i, r);
      return;
    }
  }
  (ue.flags |= e), (l.memoizedState = sl(1 | t, n, i, r));
}
function $s(e, t) {
  return ei(8390656, 8, e, t);
}
function pu(e, t) {
  return Bi(2048, 8, e, t);
}
function id(e, t) {
  return Bi(4, 2, e, t);
}
function od(e, t) {
  return Bi(4, 4, e, t);
}
function ad(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function ud(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), Bi(4, 4, ad.bind(null, t, e), n)
  );
}
function hu() {}
function sd(e, t) {
  var n = ct();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && cu(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function cd(e, t) {
  var n = ct();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && cu(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function fd(e, t, n) {
  return Rn & 21
    ? (St(n, t) || ((n = vf()), (ue.lanes |= n), (Ln |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), ($e = !0)), (e.memoizedState = n));
}
function Im(e, t) {
  var n = Z;
  (Z = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = Eo.transition;
  Eo.transition = {};
  try {
    e(!1), t();
  } finally {
    (Z = n), (Eo.transition = r);
  }
}
function dd() {
  return ct().memoizedState;
}
function Um(e, t, n) {
  var r = on(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    pd(e))
  )
    hd(t, n);
  else if (((n = Jf(e, t, n, r)), n !== null)) {
    var l = je();
    wt(n, e, r, l), md(n, t, r);
  }
}
function $m(e, t, n) {
  var r = on(e),
    l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (pd(e)) hd(t, l);
  else {
    var i = e.alternate;
    if (
      e.lanes === 0 &&
      (i === null || i.lanes === 0) &&
      ((i = t.lastRenderedReducer), i !== null)
    )
      try {
        var o = t.lastRenderedState,
          a = i(o, n);
        if (((l.hasEagerState = !0), (l.eagerState = a), St(a, o))) {
          var u = t.interleaved;
          u === null
            ? ((l.next = l), iu(t))
            : ((l.next = u.next), (u.next = l)),
            (t.interleaved = l);
          return;
        }
      } catch {
      } finally {
      }
    (n = Jf(e, t, l, r)),
      n !== null && ((l = je()), wt(n, e, r, l), md(n, t, r));
  }
}
function pd(e) {
  var t = e.alternate;
  return e === ue || (t !== null && t === ue);
}
function hd(e, t) {
  Vr = xi = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function md(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), Ka(e, n);
  }
}
var _i = {
    readContext: st,
    useCallback: Le,
    useContext: Le,
    useEffect: Le,
    useImperativeHandle: Le,
    useInsertionEffect: Le,
    useLayoutEffect: Le,
    useMemo: Le,
    useReducer: Le,
    useRef: Le,
    useState: Le,
    useDebugValue: Le,
    useDeferredValue: Le,
    useTransition: Le,
    useMutableSource: Le,
    useSyncExternalStore: Le,
    useId: Le,
    unstable_isNewReconciler: !1,
  },
  Am = {
    readContext: st,
    useCallback: function (e, t) {
      return (xt().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: st,
    useEffect: $s,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        ei(4194308, 4, ad.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return ei(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return ei(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = xt();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var r = xt();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = Um.bind(null, ue, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = xt();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: Us,
    useDebugValue: hu,
    useDeferredValue: function (e) {
      return (xt().memoizedState = e);
    },
    useTransition: function () {
      var e = Us(!1),
        t = e[0];
      return (e = Im.bind(null, e[1])), (xt().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = ue,
        l = xt();
      if (oe) {
        if (n === void 0) throw Error(R(407));
        n = n();
      } else {
        if (((n = t()), Se === null)) throw Error(R(349));
        Rn & 30 || bf(r, t, n);
      }
      l.memoizedState = n;
      var i = { value: n, getSnapshot: t };
      return (
        (l.queue = i),
        $s(td.bind(null, r, i, e), [e]),
        (r.flags |= 2048),
        sl(9, ed.bind(null, r, i, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = xt(),
        t = Se.identifierPrefix;
      if (oe) {
        var n = Dt,
          r = Nt;
        (n = (r & ~(1 << (32 - gt(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = al++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = Fm++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  Bm = {
    readContext: st,
    useCallback: sd,
    useContext: st,
    useEffect: pu,
    useImperativeHandle: ud,
    useInsertionEffect: id,
    useLayoutEffect: od,
    useMemo: cd,
    useReducer: ko,
    useRef: ld,
    useState: function () {
      return ko(ul);
    },
    useDebugValue: hu,
    useDeferredValue: function (e) {
      var t = ct();
      return fd(t, me.memoizedState, e);
    },
    useTransition: function () {
      var e = ko(ul)[0],
        t = ct().memoizedState;
      return [e, t];
    },
    useMutableSource: Zf,
    useSyncExternalStore: qf,
    useId: dd,
    unstable_isNewReconciler: !1,
  },
  Hm = {
    readContext: st,
    useCallback: sd,
    useContext: st,
    useEffect: pu,
    useImperativeHandle: ud,
    useInsertionEffect: id,
    useLayoutEffect: od,
    useMemo: cd,
    useReducer: xo,
    useRef: ld,
    useState: function () {
      return xo(ul);
    },
    useDebugValue: hu,
    useDeferredValue: function (e) {
      var t = ct();
      return me === null ? (t.memoizedState = e) : fd(t, me.memoizedState, e);
    },
    useTransition: function () {
      var e = xo(ul)[0],
        t = ct().memoizedState;
      return [e, t];
    },
    useMutableSource: Zf,
    useSyncExternalStore: qf,
    useId: dd,
    unstable_isNewReconciler: !1,
  };
function ht(e, t) {
  if (e && e.defaultProps) {
    (t = se({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function ua(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : se({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Hi = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Mn(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = je(),
      l = on(e),
      i = Mt(r, l);
    (i.payload = t),
      n != null && (i.callback = n),
      (t = rn(e, i, l)),
      t !== null && (wt(t, e, l, r), ql(t, e, l));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = je(),
      l = on(e),
      i = Mt(r, l);
    (i.tag = 1),
      (i.payload = t),
      n != null && (i.callback = n),
      (t = rn(e, i, l)),
      t !== null && (wt(t, e, l, r), ql(t, e, l));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = je(),
      r = on(e),
      l = Mt(n, r);
    (l.tag = 2),
      t != null && (l.callback = t),
      (t = rn(e, l, r)),
      t !== null && (wt(t, e, r, n), ql(t, e, r));
  },
};
function As(e, t, n, r, l, i, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, i, o)
      : t.prototype && t.prototype.isPureReactComponent
      ? !tl(n, r) || !tl(l, i)
      : !0
  );
}
function vd(e, t, n) {
  var r = !1,
    l = sn,
    i = t.contextType;
  return (
    typeof i == "object" && i !== null
      ? (i = st(i))
      : ((l = Be(t) ? Cn : De.current),
        (r = t.contextTypes),
        (i = (r = r != null) ? rr(e, l) : sn)),
    (t = new t(n, i)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Hi),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = l),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    t
  );
}
function Bs(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Hi.enqueueReplaceState(t, t.state, null);
}
function sa(e, t, n, r) {
  var l = e.stateNode;
  (l.props = n), (l.state = e.memoizedState), (l.refs = {}), ou(e);
  var i = t.contextType;
  typeof i == "object" && i !== null
    ? (l.context = st(i))
    : ((i = Be(t) ? Cn : De.current), (l.context = rr(e, i))),
    (l.state = e.memoizedState),
    (i = t.getDerivedStateFromProps),
    typeof i == "function" && (ua(e, t, i, n), (l.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof l.getSnapshotBeforeUpdate == "function" ||
      (typeof l.UNSAFE_componentWillMount != "function" &&
        typeof l.componentWillMount != "function") ||
      ((t = l.state),
      typeof l.componentWillMount == "function" && l.componentWillMount(),
      typeof l.UNSAFE_componentWillMount == "function" &&
        l.UNSAFE_componentWillMount(),
      t !== l.state && Hi.enqueueReplaceState(l, l.state, null),
      Ei(e, n, l, r),
      (l.state = e.memoizedState)),
    typeof l.componentDidMount == "function" && (e.flags |= 4194308);
}
function ar(e, t) {
  try {
    var n = "",
      r = t;
    do (n += vh(r)), (r = r.return);
    while (r);
    var l = n;
  } catch (i) {
    l =
      `
Error generating stack: ` +
      i.message +
      `
` +
      i.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function _o(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function ca(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var Vm = typeof WeakMap == "function" ? WeakMap : Map;
function yd(e, t, n) {
  (n = Mt(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      Pi || ((Pi = !0), (Sa = r)), ca(e, t);
    }),
    n
  );
}
function gd(e, t, n) {
  (n = Mt(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    (n.payload = function () {
      return r(l);
    }),
      (n.callback = function () {
        ca(e, t);
      });
  }
  var i = e.stateNode;
  return (
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (n.callback = function () {
        ca(e, t),
          typeof r != "function" &&
            (ln === null ? (ln = new Set([this])) : ln.add(this));
        var o = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: o !== null ? o : "",
        });
      }),
    n
  );
}
function Hs(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Vm();
    var l = new Set();
    r.set(t, l);
  } else (l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l));
  l.has(n) || (l.add(n), (e = rv.bind(null, e, t, n)), t.then(e, e));
}
function Vs(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Ws(e, t, n, r, l) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = l), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = Mt(-1, 1)), (t.tag = 2), rn(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var Wm = Ut.ReactCurrentOwner,
  $e = !1;
function ze(e, t, n, r) {
  t.child = e === null ? Yf(t, null, n, r) : ir(t, e.child, n, r);
}
function Ks(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return (
    er(t, l),
    (r = fu(e, t, n, r, i, l)),
    (n = du()),
    e !== null && !$e
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        It(e, t, l))
      : (oe && n && ba(t), (t.flags |= 1), ze(e, t, r, l), t.child)
  );
}
function Qs(e, t, n, r, l) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" &&
      !ku(i) &&
      i.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = i), wd(e, t, i, r, l))
      : ((e = li(n.type, null, r, t, t.mode, l)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((i = e.child), !(e.lanes & l))) {
    var o = i.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : tl), n(o, r) && e.ref === t.ref)
    )
      return It(e, t, l);
  }
  return (
    (t.flags |= 1),
    (e = an(i, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function wd(e, t, n, r, l) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (tl(i, r) && e.ref === t.ref)
      if ((($e = !1), (t.pendingProps = r = i), (e.lanes & l) !== 0))
        e.flags & 131072 && ($e = !0);
      else return (t.lanes = e.lanes), It(e, t, l);
  }
  return fa(e, t, n, r, l);
}
function Sd(e, t, n) {
  var r = t.pendingProps,
    l = r.children,
    i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        ee(Xn, Ye),
        (Ye |= n);
    else {
      if (!(n & 1073741824))
        return (
          (e = i !== null ? i.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          ee(Xn, Ye),
          (Ye |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = i !== null ? i.baseLanes : n),
        ee(Xn, Ye),
        (Ye |= r);
    }
  else
    i !== null ? ((r = i.baseLanes | n), (t.memoizedState = null)) : (r = n),
      ee(Xn, Ye),
      (Ye |= r);
  return ze(e, t, l, n), t.child;
}
function Ed(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function fa(e, t, n, r, l) {
  var i = Be(n) ? Cn : De.current;
  return (
    (i = rr(t, i)),
    er(t, l),
    (n = fu(e, t, n, r, i, l)),
    (r = du()),
    e !== null && !$e
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        It(e, t, l))
      : (oe && r && ba(t), (t.flags |= 1), ze(e, t, n, l), t.child)
  );
}
function Ys(e, t, n, r, l) {
  if (Be(n)) {
    var i = !0;
    vi(t);
  } else i = !1;
  if ((er(t, l), t.stateNode === null))
    ti(e, t), vd(t, n, r), sa(t, n, r, l), (r = !0);
  else if (e === null) {
    var o = t.stateNode,
      a = t.memoizedProps;
    o.props = a;
    var u = o.context,
      s = n.contextType;
    typeof s == "object" && s !== null
      ? (s = st(s))
      : ((s = Be(n) ? Cn : De.current), (s = rr(t, s)));
    var c = n.getDerivedStateFromProps,
      f =
        typeof c == "function" ||
        typeof o.getSnapshotBeforeUpdate == "function";
    f ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((a !== r || u !== s) && Bs(t, o, r, s)),
      (Yt = !1);
    var d = t.memoizedState;
    (o.state = d),
      Ei(t, r, o, l),
      (u = t.memoizedState),
      a !== r || d !== u || Ae.current || Yt
        ? (typeof c == "function" && (ua(t, n, c, r), (u = t.memoizedState)),
          (a = Yt || As(t, n, a, r, d, u, s))
            ? (f ||
                (typeof o.UNSAFE_componentWillMount != "function" &&
                  typeof o.componentWillMount != "function") ||
                (typeof o.componentWillMount == "function" &&
                  o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == "function" &&
                  o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = u)),
          (o.props = r),
          (o.state = u),
          (o.context = s),
          (r = a))
        : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1));
  } else {
    (o = t.stateNode),
      Xf(e, t),
      (a = t.memoizedProps),
      (s = t.type === t.elementType ? a : ht(t.type, a)),
      (o.props = s),
      (f = t.pendingProps),
      (d = o.context),
      (u = n.contextType),
      typeof u == "object" && u !== null
        ? (u = st(u))
        : ((u = Be(n) ? Cn : De.current), (u = rr(t, u)));
    var E = n.getDerivedStateFromProps;
    (c =
      typeof E == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function") ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((a !== f || d !== u) && Bs(t, o, r, u)),
      (Yt = !1),
      (d = t.memoizedState),
      (o.state = d),
      Ei(t, r, o, l);
    var S = t.memoizedState;
    a !== f || d !== S || Ae.current || Yt
      ? (typeof E == "function" && (ua(t, n, E, r), (S = t.memoizedState)),
        (s = Yt || As(t, n, s, r, d, S, u) || !1)
          ? (c ||
              (typeof o.UNSAFE_componentWillUpdate != "function" &&
                typeof o.componentWillUpdate != "function") ||
              (typeof o.componentWillUpdate == "function" &&
                o.componentWillUpdate(r, S, u),
              typeof o.UNSAFE_componentWillUpdate == "function" &&
                o.UNSAFE_componentWillUpdate(r, S, u)),
            typeof o.componentDidUpdate == "function" && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != "function" ||
              (a === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" ||
              (a === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = S)),
        (o.props = r),
        (o.state = S),
        (o.context = u),
        (r = s))
      : (typeof o.componentDidUpdate != "function" ||
          (a === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != "function" ||
          (a === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return da(e, t, n, r, i, l);
}
function da(e, t, n, r, l, i) {
  Ed(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return l && Ms(t, n, !1), It(e, t, i);
  (r = t.stateNode), (Wm.current = t);
  var a =
    o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = ir(t, e.child, null, i)), (t.child = ir(t, null, a, i)))
      : ze(e, t, a, i),
    (t.memoizedState = r.state),
    l && Ms(t, n, !0),
    t.child
  );
}
function kd(e) {
  var t = e.stateNode;
  t.pendingContext
    ? Ds(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Ds(e, t.context, !1),
    au(e, t.containerInfo);
}
function Js(e, t, n, r, l) {
  return lr(), tu(l), (t.flags |= 256), ze(e, t, n, r), t.child;
}
var pa = { dehydrated: null, treeContext: null, retryLane: 0 };
function ha(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function xd(e, t, n) {
  var r = t.pendingProps,
    l = ae.current,
    i = !1,
    o = (t.flags & 128) !== 0,
    a;
  if (
    ((a = o) ||
      (a = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
    a
      ? ((i = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (l |= 1),
    ee(ae, l & 1),
    e === null)
  )
    return (
      oa(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((o = r.children),
          (e = r.fallback),
          i
            ? ((r = t.mode),
              (i = t.child),
              (o = { mode: "hidden", children: o }),
              !(r & 1) && i !== null
                ? ((i.childLanes = 0), (i.pendingProps = o))
                : (i = Ki(o, r, 0, null)),
              (e = _n(e, r, n, null)),
              (i.return = t),
              (e.return = t),
              (i.sibling = e),
              (t.child = i),
              (t.child.memoizedState = ha(n)),
              (t.memoizedState = pa),
              e)
            : mu(t, o))
    );
  if (((l = e.memoizedState), l !== null && ((a = l.dehydrated), a !== null)))
    return Km(e, t, o, r, a, l, n);
  if (i) {
    (i = r.fallback), (o = t.mode), (l = e.child), (a = l.sibling);
    var u = { mode: "hidden", children: r.children };
    return (
      !(o & 1) && t.child !== l
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = u),
          (t.deletions = null))
        : ((r = an(l, u)), (r.subtreeFlags = l.subtreeFlags & 14680064)),
      a !== null ? (i = an(a, i)) : ((i = _n(i, o, n, null)), (i.flags |= 2)),
      (i.return = t),
      (r.return = t),
      (r.sibling = i),
      (t.child = r),
      (r = i),
      (i = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? ha(n)
          : {
              baseLanes: o.baseLanes | n,
              cachePool: null,
              transitions: o.transitions,
            }),
      (i.memoizedState = o),
      (i.childLanes = e.childLanes & ~n),
      (t.memoizedState = pa),
      r
    );
  }
  return (
    (i = e.child),
    (e = i.sibling),
    (r = an(i, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function mu(e, t) {
  return (
    (t = Ki({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function Al(e, t, n, r) {
  return (
    r !== null && tu(r),
    ir(t, e.child, null, n),
    (e = mu(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function Km(e, t, n, r, l, i, o) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = _o(Error(R(422)))), Al(e, t, o, r))
      : t.memoizedState !== null
      ? ((t.child = e.child), (t.flags |= 128), null)
      : ((i = r.fallback),
        (l = t.mode),
        (r = Ki({ mode: "visible", children: r.children }, l, 0, null)),
        (i = _n(i, l, o, null)),
        (i.flags |= 2),
        (r.return = t),
        (i.return = t),
        (r.sibling = i),
        (t.child = r),
        t.mode & 1 && ir(t, e.child, null, o),
        (t.child.memoizedState = ha(o)),
        (t.memoizedState = pa),
        i);
  if (!(t.mode & 1)) return Al(e, t, o, null);
  if (l.data === "$!") {
    if (((r = l.nextSibling && l.nextSibling.dataset), r)) var a = r.dgst;
    return (r = a), (i = Error(R(419))), (r = _o(i, r, void 0)), Al(e, t, o, r);
  }
  if (((a = (o & e.childLanes) !== 0), $e || a)) {
    if (((r = Se), r !== null)) {
      switch (o & -o) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      (l = l & (r.suspendedLanes | o) ? 0 : l),
        l !== 0 &&
          l !== i.retryLane &&
          ((i.retryLane = l), Ft(e, l), wt(r, e, l, -1));
    }
    return Eu(), (r = _o(Error(R(421)))), Al(e, t, o, r);
  }
  return l.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = lv.bind(null, e)),
      (l._reactRetry = t),
      null)
    : ((e = i.treeContext),
      (Je = nn(l.nextSibling)),
      (Xe = t),
      (oe = !0),
      (yt = null),
      e !== null &&
        ((lt[it++] = Nt),
        (lt[it++] = Dt),
        (lt[it++] = Pn),
        (Nt = e.id),
        (Dt = e.overflow),
        (Pn = t)),
      (t = mu(t, r.children)),
      (t.flags |= 4096),
      t);
}
function Xs(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), aa(e.return, t, n);
}
function Co(e, t, n, r, l) {
  var i = e.memoizedState;
  i === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: l,
      })
    : ((i.isBackwards = t),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = r),
      (i.tail = n),
      (i.tailMode = l));
}
function _d(e, t, n) {
  var r = t.pendingProps,
    l = r.revealOrder,
    i = r.tail;
  if ((ze(e, t, r.children, n), (r = ae.current), r & 2))
    (r = (r & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Xs(e, n, t);
        else if (e.tag === 19) Xs(e, n, t);
        else if (e.child !== null) {
          (e.child.return = e), (e = e.child);
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        (e.sibling.return = e.return), (e = e.sibling);
      }
    r &= 1;
  }
  if ((ee(ae, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; )
          (e = n.alternate),
            e !== null && ki(e) === null && (l = n),
            (n = n.sibling);
        (n = l),
          n === null
            ? ((l = t.child), (t.child = null))
            : ((l = n.sibling), (n.sibling = null)),
          Co(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (((e = l.alternate), e !== null && ki(e) === null)) {
            t.child = l;
            break;
          }
          (e = l.sibling), (l.sibling = n), (n = l), (l = e);
        }
        Co(t, !0, n, null, i);
        break;
      case "together":
        Co(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function ti(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function It(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Ln |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(R(153));
  if (t.child !== null) {
    for (
      e = t.child, n = an(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = an(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function Qm(e, t, n) {
  switch (t.tag) {
    case 3:
      kd(t), lr();
      break;
    case 5:
      Gf(t);
      break;
    case 1:
      Be(t.type) && vi(t);
      break;
    case 4:
      au(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        l = t.memoizedProps.value;
      ee(wi, r._currentValue), (r._currentValue = l);
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (ee(ae, ae.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
          ? xd(e, t, n)
          : (ee(ae, ae.current & 1),
            (e = It(e, t, n)),
            e !== null ? e.sibling : null);
      ee(ae, ae.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return _d(e, t, n);
        t.flags |= 128;
      }
      if (
        ((l = t.memoizedState),
        l !== null &&
          ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
        ee(ae, ae.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), Sd(e, t, n);
  }
  return It(e, t, n);
}
var Cd, ma, Pd, Rd;
Cd = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      (n.child.return = n), (n = n.child);
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    (n.sibling.return = n.return), (n = n.sibling);
  }
};
ma = function () {};
Pd = function (e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    (e = t.stateNode), Sn(Pt.current);
    var i = null;
    switch (n) {
      case "input":
        (l = Io(e, l)), (r = Io(e, r)), (i = []);
        break;
      case "select":
        (l = se({}, l, { value: void 0 })),
          (r = se({}, r, { value: void 0 })),
          (i = []);
        break;
      case "textarea":
        (l = Ao(e, l)), (r = Ao(e, r)), (i = []);
        break;
      default:
        typeof l.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = hi);
    }
    Ho(n, r);
    var o;
    n = null;
    for (s in l)
      if (!r.hasOwnProperty(s) && l.hasOwnProperty(s) && l[s] != null)
        if (s === "style") {
          var a = l[s];
          for (o in a) a.hasOwnProperty(o) && (n || (n = {}), (n[o] = ""));
        } else
          s !== "dangerouslySetInnerHTML" &&
            s !== "children" &&
            s !== "suppressContentEditableWarning" &&
            s !== "suppressHydrationWarning" &&
            s !== "autoFocus" &&
            (Jr.hasOwnProperty(s)
              ? i || (i = [])
              : (i = i || []).push(s, null));
    for (s in r) {
      var u = r[s];
      if (
        ((a = l != null ? l[s] : void 0),
        r.hasOwnProperty(s) && u !== a && (u != null || a != null))
      )
        if (s === "style")
          if (a) {
            for (o in a)
              !a.hasOwnProperty(o) ||
                (u && u.hasOwnProperty(o)) ||
                (n || (n = {}), (n[o] = ""));
            for (o in u)
              u.hasOwnProperty(o) &&
                a[o] !== u[o] &&
                (n || (n = {}), (n[o] = u[o]));
          } else n || (i || (i = []), i.push(s, n)), (n = u);
        else
          s === "dangerouslySetInnerHTML"
            ? ((u = u ? u.__html : void 0),
              (a = a ? a.__html : void 0),
              u != null && a !== u && (i = i || []).push(s, u))
            : s === "children"
            ? (typeof u != "string" && typeof u != "number") ||
              (i = i || []).push(s, "" + u)
            : s !== "suppressContentEditableWarning" &&
              s !== "suppressHydrationWarning" &&
              (Jr.hasOwnProperty(s)
                ? (u != null && s === "onScroll" && te("scroll", e),
                  i || a === u || (i = []))
                : (i = i || []).push(s, u));
    }
    n && (i = i || []).push("style", n);
    var s = i;
    (t.updateQueue = s) && (t.flags |= 4);
  }
};
Rd = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Lr(e, t) {
  if (!oe)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          t.alternate !== null && (n = t), (t = t.sibling);
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; )
          n.alternate !== null && (r = n), (n = n.sibling);
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function Te(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var l = e.child; l !== null; )
      (n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags & 14680064),
        (r |= l.flags & 14680064),
        (l.return = e),
        (l = l.sibling);
  else
    for (l = e.child; l !== null; )
      (n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags),
        (r |= l.flags),
        (l.return = e),
        (l = l.sibling);
  return (e.subtreeFlags |= r), (e.childLanes = n), t;
}
function Ym(e, t, n) {
  var r = t.pendingProps;
  switch ((eu(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return Te(t), null;
    case 1:
      return Be(t.type) && mi(), Te(t), null;
    case 3:
      return (
        (r = t.stateNode),
        or(),
        ne(Ae),
        ne(De),
        su(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Ul(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), yt !== null && (xa(yt), (yt = null)))),
        ma(e, t),
        Te(t),
        null
      );
    case 5:
      uu(t);
      var l = Sn(ol.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        Pd(e, t, n, r, l),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(R(166));
          return Te(t), null;
        }
        if (((e = Sn(Pt.current)), Ul(t))) {
          (r = t.stateNode), (n = t.type);
          var i = t.memoizedProps;
          switch (((r[_t] = t), (r[ll] = i), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              te("cancel", r), te("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              te("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < Ir.length; l++) te(Ir[l], r);
              break;
            case "source":
              te("error", r);
              break;
            case "img":
            case "image":
            case "link":
              te("error", r), te("load", r);
              break;
            case "details":
              te("toggle", r);
              break;
            case "input":
              ls(r, i), te("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!i.multiple }),
                te("invalid", r);
              break;
            case "textarea":
              os(r, i), te("invalid", r);
          }
          Ho(n, i), (l = null);
          for (var o in i)
            if (i.hasOwnProperty(o)) {
              var a = i[o];
              o === "children"
                ? typeof a == "string"
                  ? r.textContent !== a &&
                    (i.suppressHydrationWarning !== !0 &&
                      Il(r.textContent, a, e),
                    (l = ["children", a]))
                  : typeof a == "number" &&
                    r.textContent !== "" + a &&
                    (i.suppressHydrationWarning !== !0 &&
                      Il(r.textContent, a, e),
                    (l = ["children", "" + a]))
                : Jr.hasOwnProperty(o) &&
                  a != null &&
                  o === "onScroll" &&
                  te("scroll", r);
            }
          switch (n) {
            case "input":
              Tl(r), is(r, i, !0);
              break;
            case "textarea":
              Tl(r), as(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = hi);
          }
          (r = l), (t.updateQueue = r), r !== null && (t.flags |= 4);
        } else {
          (o = l.nodeType === 9 ? l : l.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = ef(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = o.createElement("div")),
                  (e.innerHTML = "<script></script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                ? (e = o.createElement(n, { is: r.is }))
                : ((e = o.createElement(n)),
                  n === "select" &&
                    ((o = e),
                    r.multiple
                      ? (o.multiple = !0)
                      : r.size && (o.size = r.size)))
              : (e = o.createElementNS(e, n)),
            (e[_t] = t),
            (e[ll] = r),
            Cd(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((o = Vo(n, r)), n)) {
              case "dialog":
                te("cancel", e), te("close", e), (l = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                te("load", e), (l = r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < Ir.length; l++) te(Ir[l], e);
                l = r;
                break;
              case "source":
                te("error", e), (l = r);
                break;
              case "img":
              case "image":
              case "link":
                te("error", e), te("load", e), (l = r);
                break;
              case "details":
                te("toggle", e), (l = r);
                break;
              case "input":
                ls(e, r), (l = Io(e, r)), te("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!r.multiple }),
                  (l = se({}, r, { value: void 0 })),
                  te("invalid", e);
                break;
              case "textarea":
                os(e, r), (l = Ao(e, r)), te("invalid", e);
                break;
              default:
                l = r;
            }
            Ho(n, l), (a = l);
            for (i in a)
              if (a.hasOwnProperty(i)) {
                var u = a[i];
                i === "style"
                  ? rf(e, u)
                  : i === "dangerouslySetInnerHTML"
                  ? ((u = u ? u.__html : void 0), u != null && tf(e, u))
                  : i === "children"
                  ? typeof u == "string"
                    ? (n !== "textarea" || u !== "") && Xr(e, u)
                    : typeof u == "number" && Xr(e, "" + u)
                  : i !== "suppressContentEditableWarning" &&
                    i !== "suppressHydrationWarning" &&
                    i !== "autoFocus" &&
                    (Jr.hasOwnProperty(i)
                      ? u != null && i === "onScroll" && te("scroll", e)
                      : u != null && $a(e, i, u, o));
              }
            switch (n) {
              case "input":
                Tl(e), is(e, r, !1);
                break;
              case "textarea":
                Tl(e), as(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + un(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (i = r.value),
                  i != null
                    ? Gn(e, !!r.multiple, i, !1)
                    : r.defaultValue != null &&
                      Gn(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof l.onClick == "function" && (e.onclick = hi);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return Te(t), null;
    case 6:
      if (e && t.stateNode != null) Rd(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(R(166));
        if (((n = Sn(ol.current)), Sn(Pt.current), Ul(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[_t] = t),
            (i = r.nodeValue !== n) && ((e = Xe), e !== null))
          )
            switch (e.tag) {
              case 3:
                Il(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Il(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          i && (t.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[_t] = t),
            (t.stateNode = r);
      }
      return Te(t), null;
    case 13:
      if (
        (ne(ae),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (oe && Je !== null && t.mode & 1 && !(t.flags & 128))
          Kf(), lr(), (t.flags |= 98560), (i = !1);
        else if (((i = Ul(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!i) throw Error(R(318));
            if (
              ((i = t.memoizedState),
              (i = i !== null ? i.dehydrated : null),
              !i)
            )
              throw Error(R(317));
            i[_t] = t;
          } else
            lr(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4);
          Te(t), (i = !1);
        } else yt !== null && (xa(yt), (yt = null)), (i = !0);
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || ae.current & 1 ? ve === 0 && (ve = 3) : Eu())),
          t.updateQueue !== null && (t.flags |= 4),
          Te(t),
          null);
    case 4:
      return (
        or(), ma(e, t), e === null && nl(t.stateNode.containerInfo), Te(t), null
      );
    case 10:
      return lu(t.type._context), Te(t), null;
    case 17:
      return Be(t.type) && mi(), Te(t), null;
    case 19:
      if ((ne(ae), (i = t.memoizedState), i === null)) return Te(t), null;
      if (((r = (t.flags & 128) !== 0), (o = i.rendering), o === null))
        if (r) Lr(i, !1);
        else {
          if (ve !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((o = ki(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    Lr(i, !1),
                    r = o.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  (i = n),
                    (e = r),
                    (i.flags &= 14680066),
                    (o = i.alternate),
                    o === null
                      ? ((i.childLanes = 0),
                        (i.lanes = e),
                        (i.child = null),
                        (i.subtreeFlags = 0),
                        (i.memoizedProps = null),
                        (i.memoizedState = null),
                        (i.updateQueue = null),
                        (i.dependencies = null),
                        (i.stateNode = null))
                      : ((i.childLanes = o.childLanes),
                        (i.lanes = o.lanes),
                        (i.child = o.child),
                        (i.subtreeFlags = 0),
                        (i.deletions = null),
                        (i.memoizedProps = o.memoizedProps),
                        (i.memoizedState = o.memoizedState),
                        (i.updateQueue = o.updateQueue),
                        (i.type = o.type),
                        (e = o.dependencies),
                        (i.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling);
                return ee(ae, (ae.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          i.tail !== null &&
            fe() > ur &&
            ((t.flags |= 128), (r = !0), Lr(i, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = ki(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Lr(i, !0),
              i.tail === null && i.tailMode === "hidden" && !o.alternate && !oe)
            )
              return Te(t), null;
          } else
            2 * fe() - i.renderingStartTime > ur &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Lr(i, !1), (t.lanes = 4194304));
        i.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = i.last),
            n !== null ? (n.sibling = o) : (t.child = o),
            (i.last = o));
      }
      return i.tail !== null
        ? ((t = i.tail),
          (i.rendering = t),
          (i.tail = t.sibling),
          (i.renderingStartTime = fe()),
          (t.sibling = null),
          (n = ae.current),
          ee(ae, r ? (n & 1) | 2 : n & 1),
          t)
        : (Te(t), null);
    case 22:
    case 23:
      return (
        Su(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? Ye & 1073741824 && (Te(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : Te(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(R(156, t.tag));
}
function Jm(e, t) {
  switch ((eu(t), t.tag)) {
    case 1:
      return (
        Be(t.type) && mi(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        or(),
        ne(Ae),
        ne(De),
        su(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return uu(t), null;
    case 13:
      if (
        (ne(ae), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(R(340));
        lr();
      }
      return (
        (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return ne(ae), null;
    case 4:
      return or(), null;
    case 10:
      return lu(t.type._context), null;
    case 22:
    case 23:
      return Su(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Bl = !1,
  Ne = !1,
  Xm = typeof WeakSet == "function" ? WeakSet : Set,
  z = null;
function Jn(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        ce(e, t, r);
      }
    else n.current = null;
}
function va(e, t, n) {
  try {
    n();
  } catch (r) {
    ce(e, t, r);
  }
}
var Gs = !1;
function Gm(e, t) {
  if (((bo = fi), (e = Mf()), qa(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset,
            i = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, i.nodeType;
          } catch {
            n = null;
            break e;
          }
          var o = 0,
            a = -1,
            u = -1,
            s = 0,
            c = 0,
            f = e,
            d = null;
          t: for (;;) {
            for (
              var E;
              f !== n || (l !== 0 && f.nodeType !== 3) || (a = o + l),
                f !== i || (r !== 0 && f.nodeType !== 3) || (u = o + r),
                f.nodeType === 3 && (o += f.nodeValue.length),
                (E = f.firstChild) !== null;

            )
              (d = f), (f = E);
            for (;;) {
              if (f === e) break t;
              if (
                (d === n && ++s === l && (a = o),
                d === i && ++c === r && (u = o),
                (E = f.nextSibling) !== null)
              )
                break;
              (f = d), (d = f.parentNode);
            }
            f = E;
          }
          n = a === -1 || u === -1 ? null : { start: a, end: u };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (ea = { focusedElem: e, selectionRange: n }, fi = !1, z = t; z !== null; )
    if (((t = z), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), (z = e);
    else
      for (; z !== null; ) {
        t = z;
        try {
          var S = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (S !== null) {
                  var w = S.memoizedProps,
                    P = S.memoizedState,
                    h = t.stateNode,
                    p = h.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? w : ht(t.type, w),
                      P
                    );
                  h.__reactInternalSnapshotBeforeUpdate = p;
                }
                break;
              case 3:
                var v = t.stateNode.containerInfo;
                v.nodeType === 1
                  ? (v.textContent = "")
                  : v.nodeType === 9 &&
                    v.documentElement &&
                    v.removeChild(v.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(R(163));
            }
        } catch (x) {
          ce(t, t.return, x);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), (z = e);
          break;
        }
        z = t.return;
      }
  return (S = Gs), (Gs = !1), S;
}
function Wr(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var l = (r = r.next);
    do {
      if ((l.tag & e) === e) {
        var i = l.destroy;
        (l.destroy = void 0), i !== void 0 && va(t, n, i);
      }
      l = l.next;
    } while (l !== r);
  }
}
function Vi(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function ya(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function Ld(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), Ld(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[_t], delete t[ll], delete t[ra], delete t[Mm], delete t[Om])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function Td(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Zs(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || Td(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      (e.child.return = e), (e = e.child);
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function ga(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = hi));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (ga(e, t, n), e = e.sibling; e !== null; ) ga(e, t, n), (e = e.sibling);
}
function wa(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (wa(e, t, n), e = e.sibling; e !== null; ) wa(e, t, n), (e = e.sibling);
}
var Ce = null,
  mt = !1;
function Wt(e, t, n) {
  for (n = n.child; n !== null; ) Nd(e, t, n), (n = n.sibling);
}
function Nd(e, t, n) {
  if (Ct && typeof Ct.onCommitFiberUnmount == "function")
    try {
      Ct.onCommitFiberUnmount(ji, n);
    } catch {}
  switch (n.tag) {
    case 5:
      Ne || Jn(n, t);
    case 6:
      var r = Ce,
        l = mt;
      (Ce = null),
        Wt(e, t, n),
        (Ce = r),
        (mt = l),
        Ce !== null &&
          (mt
            ? ((e = Ce),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : Ce.removeChild(n.stateNode));
      break;
    case 18:
      Ce !== null &&
        (mt
          ? ((e = Ce),
            (n = n.stateNode),
            e.nodeType === 8
              ? go(e.parentNode, n)
              : e.nodeType === 1 && go(e, n),
            br(e))
          : go(Ce, n.stateNode));
      break;
    case 4:
      (r = Ce),
        (l = mt),
        (Ce = n.stateNode.containerInfo),
        (mt = !0),
        Wt(e, t, n),
        (Ce = r),
        (mt = l);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !Ne &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        l = r = r.next;
        do {
          var i = l,
            o = i.destroy;
          (i = i.tag),
            o !== void 0 && (i & 2 || i & 4) && va(n, t, o),
            (l = l.next);
        } while (l !== r);
      }
      Wt(e, t, n);
      break;
    case 1:
      if (
        !Ne &&
        (Jn(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (a) {
          ce(n, t, a);
        }
      Wt(e, t, n);
      break;
    case 21:
      Wt(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((Ne = (r = Ne) || n.memoizedState !== null), Wt(e, t, n), (Ne = r))
        : Wt(e, t, n);
      break;
    default:
      Wt(e, t, n);
  }
}
function qs(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new Xm()),
      t.forEach(function (r) {
        var l = iv.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
  }
}
function dt(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e,
          o = t,
          a = o;
        e: for (; a !== null; ) {
          switch (a.tag) {
            case 5:
              (Ce = a.stateNode), (mt = !1);
              break e;
            case 3:
              (Ce = a.stateNode.containerInfo), (mt = !0);
              break e;
            case 4:
              (Ce = a.stateNode.containerInfo), (mt = !0);
              break e;
          }
          a = a.return;
        }
        if (Ce === null) throw Error(R(160));
        Nd(i, o, l), (Ce = null), (mt = !1);
        var u = l.alternate;
        u !== null && (u.return = null), (l.return = null);
      } catch (s) {
        ce(l, t, s);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) Dd(t, e), (t = t.sibling);
}
function Dd(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((dt(t, e), kt(e), r & 4)) {
        try {
          Wr(3, e, e.return), Vi(3, e);
        } catch (w) {
          ce(e, e.return, w);
        }
        try {
          Wr(5, e, e.return);
        } catch (w) {
          ce(e, e.return, w);
        }
      }
      break;
    case 1:
      dt(t, e), kt(e), r & 512 && n !== null && Jn(n, n.return);
      break;
    case 5:
      if (
        (dt(t, e),
        kt(e),
        r & 512 && n !== null && Jn(n, n.return),
        e.flags & 32)
      ) {
        var l = e.stateNode;
        try {
          Xr(l, "");
        } catch (w) {
          ce(e, e.return, w);
        }
      }
      if (r & 4 && ((l = e.stateNode), l != null)) {
        var i = e.memoizedProps,
          o = n !== null ? n.memoizedProps : i,
          a = e.type,
          u = e.updateQueue;
        if (((e.updateQueue = null), u !== null))
          try {
            a === "input" && i.type === "radio" && i.name != null && qc(l, i),
              Vo(a, o);
            var s = Vo(a, i);
            for (o = 0; o < u.length; o += 2) {
              var c = u[o],
                f = u[o + 1];
              c === "style"
                ? rf(l, f)
                : c === "dangerouslySetInnerHTML"
                ? tf(l, f)
                : c === "children"
                ? Xr(l, f)
                : $a(l, c, f, s);
            }
            switch (a) {
              case "input":
                Uo(l, i);
                break;
              case "textarea":
                bc(l, i);
                break;
              case "select":
                var d = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var E = i.value;
                E != null
                  ? Gn(l, !!i.multiple, E, !1)
                  : d !== !!i.multiple &&
                    (i.defaultValue != null
                      ? Gn(l, !!i.multiple, i.defaultValue, !0)
                      : Gn(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[ll] = i;
          } catch (w) {
            ce(e, e.return, w);
          }
      }
      break;
    case 6:
      if ((dt(t, e), kt(e), r & 4)) {
        if (e.stateNode === null) throw Error(R(162));
        (l = e.stateNode), (i = e.memoizedProps);
        try {
          l.nodeValue = i;
        } catch (w) {
          ce(e, e.return, w);
        }
      }
      break;
    case 3:
      if (
        (dt(t, e), kt(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          br(t.containerInfo);
        } catch (w) {
          ce(e, e.return, w);
        }
      break;
    case 4:
      dt(t, e), kt(e);
      break;
    case 13:
      dt(t, e),
        kt(e),
        (l = e.child),
        l.flags & 8192 &&
          ((i = l.memoizedState !== null),
          (l.stateNode.isHidden = i),
          !i ||
            (l.alternate !== null && l.alternate.memoizedState !== null) ||
            (gu = fe())),
        r & 4 && qs(e);
      break;
    case 22:
      if (
        ((c = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((Ne = (s = Ne) || c), dt(t, e), (Ne = s)) : dt(t, e),
        kt(e),
        r & 8192)
      ) {
        if (
          ((s = e.memoizedState !== null),
          (e.stateNode.isHidden = s) && !c && e.mode & 1)
        )
          for (z = e, c = e.child; c !== null; ) {
            for (f = z = c; z !== null; ) {
              switch (((d = z), (E = d.child), d.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Wr(4, d, d.return);
                  break;
                case 1:
                  Jn(d, d.return);
                  var S = d.stateNode;
                  if (typeof S.componentWillUnmount == "function") {
                    (r = d), (n = d.return);
                    try {
                      (t = r),
                        (S.props = t.memoizedProps),
                        (S.state = t.memoizedState),
                        S.componentWillUnmount();
                    } catch (w) {
                      ce(r, n, w);
                    }
                  }
                  break;
                case 5:
                  Jn(d, d.return);
                  break;
                case 22:
                  if (d.memoizedState !== null) {
                    ec(f);
                    continue;
                  }
              }
              E !== null ? ((E.return = d), (z = E)) : ec(f);
            }
            c = c.sibling;
          }
        e: for (c = null, f = e; ; ) {
          if (f.tag === 5) {
            if (c === null) {
              c = f;
              try {
                (l = f.stateNode),
                  s
                    ? ((i = l.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none"))
                    : ((a = f.stateNode),
                      (u = f.memoizedProps.style),
                      (o =
                        u != null && u.hasOwnProperty("display")
                          ? u.display
                          : null),
                      (a.style.display = nf("display", o)));
              } catch (w) {
                ce(e, e.return, w);
              }
            }
          } else if (f.tag === 6) {
            if (c === null)
              try {
                f.stateNode.nodeValue = s ? "" : f.memoizedProps;
              } catch (w) {
                ce(e, e.return, w);
              }
          } else if (
            ((f.tag !== 22 && f.tag !== 23) ||
              f.memoizedState === null ||
              f === e) &&
            f.child !== null
          ) {
            (f.child.return = f), (f = f.child);
            continue;
          }
          if (f === e) break e;
          for (; f.sibling === null; ) {
            if (f.return === null || f.return === e) break e;
            c === f && (c = null), (f = f.return);
          }
          c === f && (c = null), (f.sibling.return = f.return), (f = f.sibling);
        }
      }
      break;
    case 19:
      dt(t, e), kt(e), r & 4 && qs(e);
      break;
    case 21:
      break;
    default:
      dt(t, e), kt(e);
  }
}
function kt(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Td(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(R(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (Xr(l, ""), (r.flags &= -33));
          var i = Zs(e);
          wa(e, i, l);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            a = Zs(e);
          ga(e, a, o);
          break;
        default:
          throw Error(R(161));
      }
    } catch (u) {
      ce(e, e.return, u);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function Zm(e, t, n) {
  (z = e), Md(e);
}
function Md(e, t, n) {
  for (var r = (e.mode & 1) !== 0; z !== null; ) {
    var l = z,
      i = l.child;
    if (l.tag === 22 && r) {
      var o = l.memoizedState !== null || Bl;
      if (!o) {
        var a = l.alternate,
          u = (a !== null && a.memoizedState !== null) || Ne;
        a = Bl;
        var s = Ne;
        if (((Bl = o), (Ne = u) && !s))
          for (z = l; z !== null; )
            (o = z),
              (u = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? tc(l)
                : u !== null
                ? ((u.return = o), (z = u))
                : tc(l);
        for (; i !== null; ) (z = i), Md(i), (i = i.sibling);
        (z = l), (Bl = a), (Ne = s);
      }
      bs(e);
    } else
      l.subtreeFlags & 8772 && i !== null ? ((i.return = l), (z = i)) : bs(e);
  }
}
function bs(e) {
  for (; z !== null; ) {
    var t = z;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Ne || Vi(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Ne)
                if (n === null) r.componentDidMount();
                else {
                  var l =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : ht(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    l,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate
                  );
                }
              var i = t.updateQueue;
              i !== null && Is(t, i, r);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                Is(t, o, n);
              }
              break;
            case 5:
              var a = t.stateNode;
              if (n === null && t.flags & 4) {
                n = a;
                var u = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    u.autoFocus && n.focus();
                    break;
                  case "img":
                    u.src && (n.src = u.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var s = t.alternate;
                if (s !== null) {
                  var c = s.memoizedState;
                  if (c !== null) {
                    var f = c.dehydrated;
                    f !== null && br(f);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(R(163));
          }
        Ne || (t.flags & 512 && ya(t));
      } catch (d) {
        ce(t, t.return, d);
      }
    }
    if (t === e) {
      z = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (z = n);
      break;
    }
    z = t.return;
  }
}
function ec(e) {
  for (; z !== null; ) {
    var t = z;
    if (t === e) {
      z = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (z = n);
      break;
    }
    z = t.return;
  }
}
function tc(e) {
  for (; z !== null; ) {
    var t = z;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Vi(4, t);
          } catch (u) {
            ce(t, n, u);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (u) {
              ce(t, l, u);
            }
          }
          var i = t.return;
          try {
            ya(t);
          } catch (u) {
            ce(t, i, u);
          }
          break;
        case 5:
          var o = t.return;
          try {
            ya(t);
          } catch (u) {
            ce(t, o, u);
          }
      }
    } catch (u) {
      ce(t, t.return, u);
    }
    if (t === e) {
      z = null;
      break;
    }
    var a = t.sibling;
    if (a !== null) {
      (a.return = t.return), (z = a);
      break;
    }
    z = t.return;
  }
}
var qm = Math.ceil,
  Ci = Ut.ReactCurrentDispatcher,
  vu = Ut.ReactCurrentOwner,
  ut = Ut.ReactCurrentBatchConfig,
  J = 0,
  Se = null,
  pe = null,
  Pe = 0,
  Ye = 0,
  Xn = fn(0),
  ve = 0,
  cl = null,
  Ln = 0,
  Wi = 0,
  yu = 0,
  Kr = null,
  Ue = null,
  gu = 0,
  ur = 1 / 0,
  Lt = null,
  Pi = !1,
  Sa = null,
  ln = null,
  Hl = !1,
  Zt = null,
  Ri = 0,
  Qr = 0,
  Ea = null,
  ni = -1,
  ri = 0;
function je() {
  return J & 6 ? fe() : ni !== -1 ? ni : (ni = fe());
}
function on(e) {
  return e.mode & 1
    ? J & 2 && Pe !== 0
      ? Pe & -Pe
      : jm.transition !== null
      ? (ri === 0 && (ri = vf()), ri)
      : ((e = Z),
        e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : xf(e.type))),
        e)
    : 1;
}
function wt(e, t, n, r) {
  if (50 < Qr) throw ((Qr = 0), (Ea = null), Error(R(185)));
  hl(e, n, r),
    (!(J & 2) || e !== Se) &&
      (e === Se && (!(J & 2) && (Wi |= n), ve === 4 && Xt(e, Pe)),
      He(e, r),
      n === 1 && J === 0 && !(t.mode & 1) && ((ur = fe() + 500), Ai && dn()));
}
function He(e, t) {
  var n = e.callbackNode;
  jh(e, t);
  var r = ci(e, e === Se ? Pe : 0);
  if (r === 0)
    n !== null && cs(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && cs(n), t === 1))
      e.tag === 0 ? zm(nc.bind(null, e)) : Hf(nc.bind(null, e)),
        Nm(function () {
          !(J & 6) && dn();
        }),
        (n = null);
    else {
      switch (yf(r)) {
        case 1:
          n = Wa;
          break;
        case 4:
          n = hf;
          break;
        case 16:
          n = si;
          break;
        case 536870912:
          n = mf;
          break;
        default:
          n = si;
      }
      n = Ad(n, Od.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function Od(e, t) {
  if (((ni = -1), (ri = 0), J & 6)) throw Error(R(327));
  var n = e.callbackNode;
  if (tr() && e.callbackNode !== n) return null;
  var r = ci(e, e === Se ? Pe : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = Li(e, r);
  else {
    t = r;
    var l = J;
    J |= 2;
    var i = jd();
    (Se !== e || Pe !== t) && ((Lt = null), (ur = fe() + 500), xn(e, t));
    do
      try {
        tv();
        break;
      } catch (a) {
        zd(e, a);
      }
    while (!0);
    ru(),
      (Ci.current = i),
      (J = l),
      pe !== null ? (t = 0) : ((Se = null), (Pe = 0), (t = ve));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((l = Jo(e)), l !== 0 && ((r = l), (t = ka(e, l)))), t === 1)
    )
      throw ((n = cl), xn(e, 0), Xt(e, r), He(e, fe()), n);
    if (t === 6) Xt(e, r);
    else {
      if (
        ((l = e.current.alternate),
        !(r & 30) &&
          !bm(l) &&
          ((t = Li(e, r)),
          t === 2 && ((i = Jo(e)), i !== 0 && ((r = i), (t = ka(e, i)))),
          t === 1))
      )
        throw ((n = cl), xn(e, 0), Xt(e, r), He(e, fe()), n);
      switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(R(345));
        case 2:
          yn(e, Ue, Lt);
          break;
        case 3:
          if (
            (Xt(e, r), (r & 130023424) === r && ((t = gu + 500 - fe()), 10 < t))
          ) {
            if (ci(e, 0) !== 0) break;
            if (((l = e.suspendedLanes), (l & r) !== r)) {
              je(), (e.pingedLanes |= e.suspendedLanes & l);
              break;
            }
            e.timeoutHandle = na(yn.bind(null, e, Ue, Lt), t);
            break;
          }
          yn(e, Ue, Lt);
          break;
        case 4:
          if ((Xt(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var o = 31 - gt(r);
            (i = 1 << o), (o = t[o]), o > l && (l = o), (r &= ~i);
          }
          if (
            ((r = l),
            (r = fe() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                ? 480
                : 1080 > r
                ? 1080
                : 1920 > r
                ? 1920
                : 3e3 > r
                ? 3e3
                : 4320 > r
                ? 4320
                : 1960 * qm(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = na(yn.bind(null, e, Ue, Lt), r);
            break;
          }
          yn(e, Ue, Lt);
          break;
        case 5:
          yn(e, Ue, Lt);
          break;
        default:
          throw Error(R(329));
      }
    }
  }
  return He(e, fe()), e.callbackNode === n ? Od.bind(null, e) : null;
}
function ka(e, t) {
  var n = Kr;
  return (
    e.current.memoizedState.isDehydrated && (xn(e, t).flags |= 256),
    (e = Li(e, t)),
    e !== 2 && ((t = Ue), (Ue = n), t !== null && xa(t)),
    e
  );
}
function xa(e) {
  Ue === null ? (Ue = e) : Ue.push.apply(Ue, e);
}
function bm(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var l = n[r],
            i = l.getSnapshot;
          l = l.value;
          try {
            if (!St(i(), l)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      (n.return = t), (t = n);
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
  }
  return !0;
}
function Xt(e, t) {
  for (
    t &= ~yu,
      t &= ~Wi,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - gt(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function nc(e) {
  if (J & 6) throw Error(R(327));
  tr();
  var t = ci(e, 0);
  if (!(t & 1)) return He(e, fe()), null;
  var n = Li(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Jo(e);
    r !== 0 && ((t = r), (n = ka(e, r)));
  }
  if (n === 1) throw ((n = cl), xn(e, 0), Xt(e, t), He(e, fe()), n);
  if (n === 6) throw Error(R(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    yn(e, Ue, Lt),
    He(e, fe()),
    null
  );
}
function wu(e, t) {
  var n = J;
  J |= 1;
  try {
    return e(t);
  } finally {
    (J = n), J === 0 && ((ur = fe() + 500), Ai && dn());
  }
}
function Tn(e) {
  Zt !== null && Zt.tag === 0 && !(J & 6) && tr();
  var t = J;
  J |= 1;
  var n = ut.transition,
    r = Z;
  try {
    if (((ut.transition = null), (Z = 1), e)) return e();
  } finally {
    (Z = r), (ut.transition = n), (J = t), !(J & 6) && dn();
  }
}
function Su() {
  (Ye = Xn.current), ne(Xn);
}
function xn(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), Tm(n)), pe !== null))
    for (n = pe.return; n !== null; ) {
      var r = n;
      switch ((eu(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && mi();
          break;
        case 3:
          or(), ne(Ae), ne(De), su();
          break;
        case 5:
          uu(r);
          break;
        case 4:
          or();
          break;
        case 13:
          ne(ae);
          break;
        case 19:
          ne(ae);
          break;
        case 10:
          lu(r.type._context);
          break;
        case 22:
        case 23:
          Su();
      }
      n = n.return;
    }
  if (
    ((Se = e),
    (pe = e = an(e.current, null)),
    (Pe = Ye = t),
    (ve = 0),
    (cl = null),
    (yu = Wi = Ln = 0),
    (Ue = Kr = null),
    wn !== null)
  ) {
    for (t = 0; t < wn.length; t++)
      if (((n = wn[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var l = r.next,
          i = n.pending;
        if (i !== null) {
          var o = i.next;
          (i.next = l), (r.next = o);
        }
        n.pending = r;
      }
    wn = null;
  }
  return e;
}
function zd(e, t) {
  do {
    var n = pe;
    try {
      if ((ru(), (bl.current = _i), xi)) {
        for (var r = ue.memoizedState; r !== null; ) {
          var l = r.queue;
          l !== null && (l.pending = null), (r = r.next);
        }
        xi = !1;
      }
      if (
        ((Rn = 0),
        (we = me = ue = null),
        (Vr = !1),
        (al = 0),
        (vu.current = null),
        n === null || n.return === null)
      ) {
        (ve = 1), (cl = t), (pe = null);
        break;
      }
      e: {
        var i = e,
          o = n.return,
          a = n,
          u = t;
        if (
          ((t = Pe),
          (a.flags |= 32768),
          u !== null && typeof u == "object" && typeof u.then == "function")
        ) {
          var s = u,
            c = a,
            f = c.tag;
          if (!(c.mode & 1) && (f === 0 || f === 11 || f === 15)) {
            var d = c.alternate;
            d
              ? ((c.updateQueue = d.updateQueue),
                (c.memoizedState = d.memoizedState),
                (c.lanes = d.lanes))
              : ((c.updateQueue = null), (c.memoizedState = null));
          }
          var E = Vs(o);
          if (E !== null) {
            (E.flags &= -257),
              Ws(E, o, a, i, t),
              E.mode & 1 && Hs(i, s, t),
              (t = E),
              (u = s);
            var S = t.updateQueue;
            if (S === null) {
              var w = new Set();
              w.add(u), (t.updateQueue = w);
            } else S.add(u);
            break e;
          } else {
            if (!(t & 1)) {
              Hs(i, s, t), Eu();
              break e;
            }
            u = Error(R(426));
          }
        } else if (oe && a.mode & 1) {
          var P = Vs(o);
          if (P !== null) {
            !(P.flags & 65536) && (P.flags |= 256),
              Ws(P, o, a, i, t),
              tu(ar(u, a));
            break e;
          }
        }
        (i = u = ar(u, a)),
          ve !== 4 && (ve = 2),
          Kr === null ? (Kr = [i]) : Kr.push(i),
          (i = o);
        do {
          switch (i.tag) {
            case 3:
              (i.flags |= 65536), (t &= -t), (i.lanes |= t);
              var h = yd(i, u, t);
              Fs(i, h);
              break e;
            case 1:
              a = u;
              var p = i.type,
                v = i.stateNode;
              if (
                !(i.flags & 128) &&
                (typeof p.getDerivedStateFromError == "function" ||
                  (v !== null &&
                    typeof v.componentDidCatch == "function" &&
                    (ln === null || !ln.has(v))))
              ) {
                (i.flags |= 65536), (t &= -t), (i.lanes |= t);
                var x = gd(i, a, t);
                Fs(i, x);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      Id(n);
    } catch (L) {
      (t = L), pe === n && n !== null && (pe = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function jd() {
  var e = Ci.current;
  return (Ci.current = _i), e === null ? _i : e;
}
function Eu() {
  (ve === 0 || ve === 3 || ve === 2) && (ve = 4),
    Se === null || (!(Ln & 268435455) && !(Wi & 268435455)) || Xt(Se, Pe);
}
function Li(e, t) {
  var n = J;
  J |= 2;
  var r = jd();
  (Se !== e || Pe !== t) && ((Lt = null), xn(e, t));
  do
    try {
      ev();
      break;
    } catch (l) {
      zd(e, l);
    }
  while (!0);
  if ((ru(), (J = n), (Ci.current = r), pe !== null)) throw Error(R(261));
  return (Se = null), (Pe = 0), ve;
}
function ev() {
  for (; pe !== null; ) Fd(pe);
}
function tv() {
  for (; pe !== null && !Ph(); ) Fd(pe);
}
function Fd(e) {
  var t = $d(e.alternate, e, Ye);
  (e.memoizedProps = e.pendingProps),
    t === null ? Id(e) : (pe = t),
    (vu.current = null);
}
function Id(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = Jm(n, t)), n !== null)) {
        (n.flags &= 32767), (pe = n);
        return;
      }
      if (e !== null)
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (ve = 6), (pe = null);
        return;
      }
    } else if (((n = Ym(n, t, Ye)), n !== null)) {
      pe = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      pe = t;
      return;
    }
    pe = t = e;
  } while (t !== null);
  ve === 0 && (ve = 5);
}
function yn(e, t, n) {
  var r = Z,
    l = ut.transition;
  try {
    (ut.transition = null), (Z = 1), nv(e, t, n, r);
  } finally {
    (ut.transition = l), (Z = r);
  }
  return null;
}
function nv(e, t, n, r) {
  do tr();
  while (Zt !== null);
  if (J & 6) throw Error(R(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(R(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var i = n.lanes | n.childLanes;
  if (
    (Fh(e, i),
    e === Se && ((pe = Se = null), (Pe = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Hl ||
      ((Hl = !0),
      Ad(si, function () {
        return tr(), null;
      })),
    (i = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || i)
  ) {
    (i = ut.transition), (ut.transition = null);
    var o = Z;
    Z = 1;
    var a = J;
    (J |= 4),
      (vu.current = null),
      Gm(e, n),
      Dd(n, e),
      km(ea),
      (fi = !!bo),
      (ea = bo = null),
      (e.current = n),
      Zm(n),
      Rh(),
      (J = a),
      (Z = o),
      (ut.transition = i);
  } else e.current = n;
  if (
    (Hl && ((Hl = !1), (Zt = e), (Ri = l)),
    (i = e.pendingLanes),
    i === 0 && (ln = null),
    Nh(n.stateNode),
    He(e, fe()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (l = t[n]), r(l.value, { componentStack: l.stack, digest: l.digest });
  if (Pi) throw ((Pi = !1), (e = Sa), (Sa = null), e);
  return (
    Ri & 1 && e.tag !== 0 && tr(),
    (i = e.pendingLanes),
    i & 1 ? (e === Ea ? Qr++ : ((Qr = 0), (Ea = e))) : (Qr = 0),
    dn(),
    null
  );
}
function tr() {
  if (Zt !== null) {
    var e = yf(Ri),
      t = ut.transition,
      n = Z;
    try {
      if (((ut.transition = null), (Z = 16 > e ? 16 : e), Zt === null))
        var r = !1;
      else {
        if (((e = Zt), (Zt = null), (Ri = 0), J & 6)) throw Error(R(331));
        var l = J;
        for (J |= 4, z = e.current; z !== null; ) {
          var i = z,
            o = i.child;
          if (z.flags & 16) {
            var a = i.deletions;
            if (a !== null) {
              for (var u = 0; u < a.length; u++) {
                var s = a[u];
                for (z = s; z !== null; ) {
                  var c = z;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Wr(8, c, i);
                  }
                  var f = c.child;
                  if (f !== null) (f.return = c), (z = f);
                  else
                    for (; z !== null; ) {
                      c = z;
                      var d = c.sibling,
                        E = c.return;
                      if ((Ld(c), c === s)) {
                        z = null;
                        break;
                      }
                      if (d !== null) {
                        (d.return = E), (z = d);
                        break;
                      }
                      z = E;
                    }
                }
              }
              var S = i.alternate;
              if (S !== null) {
                var w = S.child;
                if (w !== null) {
                  S.child = null;
                  do {
                    var P = w.sibling;
                    (w.sibling = null), (w = P);
                  } while (w !== null);
                }
              }
              z = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) (o.return = i), (z = o);
          else
            e: for (; z !== null; ) {
              if (((i = z), i.flags & 2048))
                switch (i.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Wr(9, i, i.return);
                }
              var h = i.sibling;
              if (h !== null) {
                (h.return = i.return), (z = h);
                break e;
              }
              z = i.return;
            }
        }
        var p = e.current;
        for (z = p; z !== null; ) {
          o = z;
          var v = o.child;
          if (o.subtreeFlags & 2064 && v !== null) (v.return = o), (z = v);
          else
            e: for (o = p; z !== null; ) {
              if (((a = z), a.flags & 2048))
                try {
                  switch (a.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Vi(9, a);
                  }
                } catch (L) {
                  ce(a, a.return, L);
                }
              if (a === o) {
                z = null;
                break e;
              }
              var x = a.sibling;
              if (x !== null) {
                (x.return = a.return), (z = x);
                break e;
              }
              z = a.return;
            }
        }
        if (
          ((J = l), dn(), Ct && typeof Ct.onPostCommitFiberRoot == "function")
        )
          try {
            Ct.onPostCommitFiberRoot(ji, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (Z = n), (ut.transition = t);
    }
  }
  return !1;
}
function rc(e, t, n) {
  (t = ar(n, t)),
    (t = yd(e, t, 1)),
    (e = rn(e, t, 1)),
    (t = je()),
    e !== null && (hl(e, 1, t), He(e, t));
}
function ce(e, t, n) {
  if (e.tag === 3) rc(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        rc(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (ln === null || !ln.has(r)))
        ) {
          (e = ar(n, e)),
            (e = gd(t, e, 1)),
            (t = rn(t, e, 1)),
            (e = je()),
            t !== null && (hl(t, 1, e), He(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function rv(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = je()),
    (e.pingedLanes |= e.suspendedLanes & n),
    Se === e &&
      (Pe & n) === n &&
      (ve === 4 || (ve === 3 && (Pe & 130023424) === Pe && 500 > fe() - gu)
        ? xn(e, 0)
        : (yu |= n)),
    He(e, t);
}
function Ud(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = Ml), (Ml <<= 1), !(Ml & 130023424) && (Ml = 4194304))
      : (t = 1));
  var n = je();
  (e = Ft(e, t)), e !== null && (hl(e, t, n), He(e, n));
}
function lv(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), Ud(e, n);
}
function iv(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        l = e.memoizedState;
      l !== null && (n = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(R(314));
  }
  r !== null && r.delete(t), Ud(e, n);
}
var $d;
$d = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Ae.current) $e = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return ($e = !1), Qm(e, t, n);
      $e = !!(e.flags & 131072);
    }
  else ($e = !1), oe && t.flags & 1048576 && Vf(t, gi, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      ti(e, t), (e = t.pendingProps);
      var l = rr(t, De.current);
      er(t, n), (l = fu(null, t, r, e, l, n));
      var i = du();
      return (
        (t.flags |= 1),
        typeof l == "object" &&
        l !== null &&
        typeof l.render == "function" &&
        l.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            Be(r) ? ((i = !0), vi(t)) : (i = !1),
            (t.memoizedState =
              l.state !== null && l.state !== void 0 ? l.state : null),
            ou(t),
            (l.updater = Hi),
            (t.stateNode = l),
            (l._reactInternals = t),
            sa(t, r, e, n),
            (t = da(null, t, r, !0, i, n)))
          : ((t.tag = 0), oe && i && ba(t), ze(null, t, l, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (ti(e, t),
          (e = t.pendingProps),
          (l = r._init),
          (r = l(r._payload)),
          (t.type = r),
          (l = t.tag = av(r)),
          (e = ht(r, e)),
          l)
        ) {
          case 0:
            t = fa(null, t, r, e, n);
            break e;
          case 1:
            t = Ys(null, t, r, e, n);
            break e;
          case 11:
            t = Ks(null, t, r, e, n);
            break e;
          case 14:
            t = Qs(null, t, r, ht(r.type, e), n);
            break e;
        }
        throw Error(R(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : ht(r, l)),
        fa(e, t, r, l, n)
      );
    case 1:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : ht(r, l)),
        Ys(e, t, r, l, n)
      );
    case 3:
      e: {
        if ((kd(t), e === null)) throw Error(R(387));
        (r = t.pendingProps),
          (i = t.memoizedState),
          (l = i.element),
          Xf(e, t),
          Ei(t, r, null, n);
        var o = t.memoizedState;
        if (((r = o.element), i.isDehydrated))
          if (
            ((i = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = i),
            (t.memoizedState = i),
            t.flags & 256)
          ) {
            (l = ar(Error(R(423)), t)), (t = Js(e, t, r, n, l));
            break e;
          } else if (r !== l) {
            (l = ar(Error(R(424)), t)), (t = Js(e, t, r, n, l));
            break e;
          } else
            for (
              Je = nn(t.stateNode.containerInfo.firstChild),
                Xe = t,
                oe = !0,
                yt = null,
                n = Yf(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((lr(), r === l)) {
            t = It(e, t, n);
            break e;
          }
          ze(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Gf(t),
        e === null && oa(t),
        (r = t.type),
        (l = t.pendingProps),
        (i = e !== null ? e.memoizedProps : null),
        (o = l.children),
        ta(r, l) ? (o = null) : i !== null && ta(r, i) && (t.flags |= 32),
        Ed(e, t),
        ze(e, t, o, n),
        t.child
      );
    case 6:
      return e === null && oa(t), null;
    case 13:
      return xd(e, t, n);
    case 4:
      return (
        au(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = ir(t, null, r, n)) : ze(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : ht(r, l)),
        Ks(e, t, r, l, n)
      );
    case 7:
      return ze(e, t, t.pendingProps, n), t.child;
    case 8:
      return ze(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return ze(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (l = t.pendingProps),
          (i = t.memoizedProps),
          (o = l.value),
          ee(wi, r._currentValue),
          (r._currentValue = o),
          i !== null)
        )
          if (St(i.value, o)) {
            if (i.children === l.children && !Ae.current) {
              t = It(e, t, n);
              break e;
            }
          } else
            for (i = t.child, i !== null && (i.return = t); i !== null; ) {
              var a = i.dependencies;
              if (a !== null) {
                o = i.child;
                for (var u = a.firstContext; u !== null; ) {
                  if (u.context === r) {
                    if (i.tag === 1) {
                      (u = Mt(-1, n & -n)), (u.tag = 2);
                      var s = i.updateQueue;
                      if (s !== null) {
                        s = s.shared;
                        var c = s.pending;
                        c === null
                          ? (u.next = u)
                          : ((u.next = c.next), (c.next = u)),
                          (s.pending = u);
                      }
                    }
                    (i.lanes |= n),
                      (u = i.alternate),
                      u !== null && (u.lanes |= n),
                      aa(i.return, n, t),
                      (a.lanes |= n);
                    break;
                  }
                  u = u.next;
                }
              } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
              else if (i.tag === 18) {
                if (((o = i.return), o === null)) throw Error(R(341));
                (o.lanes |= n),
                  (a = o.alternate),
                  a !== null && (a.lanes |= n),
                  aa(o, n, t),
                  (o = i.sibling);
              } else o = i.child;
              if (o !== null) o.return = i;
              else
                for (o = i; o !== null; ) {
                  if (o === t) {
                    o = null;
                    break;
                  }
                  if (((i = o.sibling), i !== null)) {
                    (i.return = o.return), (o = i);
                    break;
                  }
                  o = o.return;
                }
              i = o;
            }
        ze(e, t, l.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (l = t.type),
        (r = t.pendingProps.children),
        er(t, n),
        (l = st(l)),
        (r = r(l)),
        (t.flags |= 1),
        ze(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (l = ht(r, t.pendingProps)),
        (l = ht(r.type, l)),
        Qs(e, t, r, l, n)
      );
    case 15:
      return wd(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : ht(r, l)),
        ti(e, t),
        (t.tag = 1),
        Be(r) ? ((e = !0), vi(t)) : (e = !1),
        er(t, n),
        vd(t, r, l),
        sa(t, r, l, n),
        da(null, t, r, !0, e, n)
      );
    case 19:
      return _d(e, t, n);
    case 22:
      return Sd(e, t, n);
  }
  throw Error(R(156, t.tag));
};
function Ad(e, t) {
  return pf(e, t);
}
function ov(e, t, n, r) {
  (this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function at(e, t, n, r) {
  return new ov(e, t, n, r);
}
function ku(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function av(e) {
  if (typeof e == "function") return ku(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Ba)) return 11;
    if (e === Ha) return 14;
  }
  return 2;
}
function an(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = at(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function li(e, t, n, r, l, i) {
  var o = 2;
  if (((r = e), typeof e == "function")) ku(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else
    e: switch (e) {
      case $n:
        return _n(n.children, l, i, t);
      case Aa:
        (o = 8), (l |= 8);
        break;
      case Oo:
        return (
          (e = at(12, n, t, l | 2)), (e.elementType = Oo), (e.lanes = i), e
        );
      case zo:
        return (e = at(13, n, t, l)), (e.elementType = zo), (e.lanes = i), e;
      case jo:
        return (e = at(19, n, t, l)), (e.elementType = jo), (e.lanes = i), e;
      case Xc:
        return Ki(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case Yc:
              o = 10;
              break e;
            case Jc:
              o = 9;
              break e;
            case Ba:
              o = 11;
              break e;
            case Ha:
              o = 14;
              break e;
            case Qt:
              (o = 16), (r = null);
              break e;
          }
        throw Error(R(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = at(o, n, t, l)), (t.elementType = e), (t.type = r), (t.lanes = i), t
  );
}
function _n(e, t, n, r) {
  return (e = at(7, e, r, t)), (e.lanes = n), e;
}
function Ki(e, t, n, r) {
  return (
    (e = at(22, e, r, t)),
    (e.elementType = Xc),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Po(e, t, n) {
  return (e = at(6, e, null, t)), (e.lanes = n), e;
}
function Ro(e, t, n) {
  return (
    (t = at(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function uv(e, t, n, r, l) {
  (this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = oo(0)),
    (this.expirationTimes = oo(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = oo(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = l),
    (this.mutableSourceEagerHydrationData = null);
}
function xu(e, t, n, r, l, i, o, a, u) {
  return (
    (e = new uv(e, t, n, a, u)),
    t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
    (i = at(3, null, null, t)),
    (e.current = i),
    (i.stateNode = e),
    (i.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    ou(i),
    e
  );
}
function sv(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Un,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Bd(e) {
  if (!e) return sn;
  e = e._reactInternals;
  e: {
    if (Mn(e) !== e || e.tag !== 1) throw Error(R(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Be(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(R(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Be(n)) return Bf(e, n, t);
  }
  return t;
}
function Hd(e, t, n, r, l, i, o, a, u) {
  return (
    (e = xu(n, r, !0, e, l, i, o, a, u)),
    (e.context = Bd(null)),
    (n = e.current),
    (r = je()),
    (l = on(n)),
    (i = Mt(r, l)),
    (i.callback = t ?? null),
    rn(n, i, l),
    (e.current.lanes = l),
    hl(e, l, r),
    He(e, r),
    e
  );
}
function Qi(e, t, n, r) {
  var l = t.current,
    i = je(),
    o = on(l);
  return (
    (n = Bd(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = Mt(i, o)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = rn(l, t, o)),
    e !== null && (wt(e, l, o, i), ql(e, l, o)),
    o
  );
}
function Ti(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function lc(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function _u(e, t) {
  lc(e, t), (e = e.alternate) && lc(e, t);
}
function cv() {
  return null;
}
var Vd =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Cu(e) {
  this._internalRoot = e;
}
Yi.prototype.render = Cu.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(R(409));
  Qi(e, t, null, null);
};
Yi.prototype.unmount = Cu.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Tn(function () {
      Qi(null, e, null, null);
    }),
      (t[jt] = null);
  }
};
function Yi(e) {
  this._internalRoot = e;
}
Yi.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Sf();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < Jt.length && t !== 0 && t < Jt[n].priority; n++);
    Jt.splice(n, 0, e), n === 0 && kf(e);
  }
};
function Pu(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Ji(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function ic() {}
function fv(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var i = r;
      r = function () {
        var s = Ti(o);
        i.call(s);
      };
    }
    var o = Hd(t, r, e, 0, null, !1, !1, "", ic);
    return (
      (e._reactRootContainer = o),
      (e[jt] = o.current),
      nl(e.nodeType === 8 ? e.parentNode : e),
      Tn(),
      o
    );
  }
  for (; (l = e.lastChild); ) e.removeChild(l);
  if (typeof r == "function") {
    var a = r;
    r = function () {
      var s = Ti(u);
      a.call(s);
    };
  }
  var u = xu(e, 0, !1, null, null, !1, !1, "", ic);
  return (
    (e._reactRootContainer = u),
    (e[jt] = u.current),
    nl(e.nodeType === 8 ? e.parentNode : e),
    Tn(function () {
      Qi(t, u, n, r);
    }),
    u
  );
}
function Xi(e, t, n, r, l) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof l == "function") {
      var a = l;
      l = function () {
        var u = Ti(o);
        a.call(u);
      };
    }
    Qi(t, o, e, l);
  } else o = fv(n, t, e, l, r);
  return Ti(o);
}
gf = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Fr(t.pendingLanes);
        n !== 0 &&
          (Ka(t, n | 1), He(t, fe()), !(J & 6) && ((ur = fe() + 500), dn()));
      }
      break;
    case 13:
      Tn(function () {
        var r = Ft(e, 1);
        if (r !== null) {
          var l = je();
          wt(r, e, 1, l);
        }
      }),
        _u(e, 1);
  }
};
Qa = function (e) {
  if (e.tag === 13) {
    var t = Ft(e, 134217728);
    if (t !== null) {
      var n = je();
      wt(t, e, 134217728, n);
    }
    _u(e, 134217728);
  }
};
wf = function (e) {
  if (e.tag === 13) {
    var t = on(e),
      n = Ft(e, t);
    if (n !== null) {
      var r = je();
      wt(n, e, t, r);
    }
    _u(e, t);
  }
};
Sf = function () {
  return Z;
};
Ef = function (e, t) {
  var n = Z;
  try {
    return (Z = e), t();
  } finally {
    Z = n;
  }
};
Ko = function (e, t, n) {
  switch (t) {
    case "input":
      if ((Uo(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]'
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = $i(r);
            if (!l) throw Error(R(90));
            Zc(r), Uo(r, l);
          }
        }
      }
      break;
    case "textarea":
      bc(e, n);
      break;
    case "select":
      (t = n.value), t != null && Gn(e, !!n.multiple, t, !1);
  }
};
af = wu;
uf = Tn;
var dv = { usingClientEntryPoint: !1, Events: [vl, Vn, $i, lf, of, wu] },
  Tr = {
    findFiberByHostInstance: gn,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  pv = {
    bundleType: Tr.bundleType,
    version: Tr.version,
    rendererPackageName: Tr.rendererPackageName,
    rendererConfig: Tr.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: Ut.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = ff(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: Tr.findFiberByHostInstance || cv,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Vl.isDisabled && Vl.supportsFiber)
    try {
      (ji = Vl.inject(pv)), (Ct = Vl);
    } catch {}
}
Ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = dv;
Ze.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Pu(t)) throw Error(R(200));
  return sv(e, t, null, n);
};
Ze.createRoot = function (e, t) {
  if (!Pu(e)) throw Error(R(299));
  var n = !1,
    r = "",
    l = Vd;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
    (t = xu(e, 1, !1, null, null, n, !1, r, l)),
    (e[jt] = t.current),
    nl(e.nodeType === 8 ? e.parentNode : e),
    new Cu(t)
  );
};
Ze.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(R(188))
      : ((e = Object.keys(e).join(",")), Error(R(268, e)));
  return (e = ff(t)), (e = e === null ? null : e.stateNode), e;
};
Ze.flushSync = function (e) {
  return Tn(e);
};
Ze.hydrate = function (e, t, n) {
  if (!Ji(t)) throw Error(R(200));
  return Xi(null, e, t, !0, n);
};
Ze.hydrateRoot = function (e, t, n) {
  if (!Pu(e)) throw Error(R(405));
  var r = (n != null && n.hydratedSources) || null,
    l = !1,
    i = "",
    o = Vd;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (l = !0),
      n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = Hd(t, null, e, 1, n ?? null, l, !1, i, o)),
    (e[jt] = t.current),
    nl(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (l = n._getVersion),
        (l = l(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, l])
          : t.mutableSourceEagerHydrationData.push(n, l);
  return new Yi(t);
};
Ze.render = function (e, t, n) {
  if (!Ji(t)) throw Error(R(200));
  return Xi(null, e, t, !1, n);
};
Ze.unmountComponentAtNode = function (e) {
  if (!Ji(e)) throw Error(R(40));
  return e._reactRootContainer
    ? (Tn(function () {
        Xi(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[jt] = null);
        });
      }),
      !0)
    : !1;
};
Ze.unstable_batchedUpdates = wu;
Ze.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Ji(n)) throw Error(R(200));
  if (e == null || e._reactInternals === void 0) throw Error(R(38));
  return Xi(e, t, n, !1, r);
};
Ze.version = "18.3.1-next-f1338f8080-20240426";
function Wd() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Wd);
    } catch (e) {
      console.error(e);
    }
}
Wd(), (Vc.exports = Ze);
var Kd = Vc.exports;
const hv = Dc(Kd),
  mv = Nc({ __proto__: null, default: hv }, [Kd]);
/**
 * @remix-run/router v1.16.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function le() {
  return (
    (le = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    le.apply(this, arguments)
  );
}
var de;
(function (e) {
  (e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE");
})(de || (de = {}));
const oc = "popstate";
function Xg(e) {
  e === void 0 && (e = {});
  function t(r, l) {
    let { pathname: i, search: o, hash: a } = r.location;
    return fl(
      "",
      { pathname: i, search: o, hash: a },
      (l.state && l.state.usr) || null,
      (l.state && l.state.key) || "default"
    );
  }
  function n(r, l) {
    return typeof l == "string" ? l : Nn(l);
  }
  return yv(t, n, null, e);
}
function W(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function sr(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function vv() {
  return Math.random().toString(36).substr(2, 8);
}
function ac(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function fl(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    le(
      { pathname: typeof e == "string" ? e : e.pathname, search: "", hash: "" },
      typeof t == "string" ? $t(t) : t,
      { state: n, key: (t && t.key) || r || vv() }
    )
  );
}
function Nn(e) {
  let { pathname: t = "/", search: n = "", hash: r = "" } = e;
  return (
    n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n),
    r && r !== "#" && (t += r.charAt(0) === "#" ? r : "#" + r),
    t
  );
}
function $t(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let r = e.indexOf("?");
    r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))),
      e && (t.pathname = e);
  }
  return t;
}
function yv(e, t, n, r) {
  r === void 0 && (r = {});
  let { window: l = document.defaultView, v5Compat: i = !1 } = r,
    o = l.history,
    a = de.Pop,
    u = null,
    s = c();
  s == null && ((s = 0), o.replaceState(le({}, o.state, { idx: s }), ""));
  function c() {
    return (o.state || { idx: null }).idx;
  }
  function f() {
    a = de.Pop;
    let P = c(),
      h = P == null ? null : P - s;
    (s = P), u && u({ action: a, location: w.location, delta: h });
  }
  function d(P, h) {
    a = de.Push;
    let p = fl(w.location, P, h);
    s = c() + 1;
    let v = ac(p, s),
      x = w.createHref(p);
    try {
      o.pushState(v, "", x);
    } catch (L) {
      if (L instanceof DOMException && L.name === "DataCloneError") throw L;
      l.location.assign(x);
    }
    i && u && u({ action: a, location: w.location, delta: 1 });
  }
  function E(P, h) {
    a = de.Replace;
    let p = fl(w.location, P, h);
    s = c();
    let v = ac(p, s),
      x = w.createHref(p);
    o.replaceState(v, "", x),
      i && u && u({ action: a, location: w.location, delta: 0 });
  }
  function S(P) {
    let h = l.location.origin !== "null" ? l.location.origin : l.location.href,
      p = typeof P == "string" ? P : Nn(P);
    return (
      (p = p.replace(/ $/, "%20")),
      W(
        h,
        "No window.location.(origin|href) available to create URL for href: " +
          p
      ),
      new URL(p, h)
    );
  }
  let w = {
    get action() {
      return a;
    },
    get location() {
      return e(l, o);
    },
    listen(P) {
      if (u) throw new Error("A history only accepts one active listener");
      return (
        l.addEventListener(oc, f),
        (u = P),
        () => {
          l.removeEventListener(oc, f), (u = null);
        }
      );
    },
    createHref(P) {
      return t(l, P);
    },
    createURL: S,
    encodeLocation(P) {
      let h = S(P);
      return { pathname: h.pathname, search: h.search, hash: h.hash };
    },
    push: d,
    replace: E,
    go(P) {
      return o.go(P);
    },
  };
  return w;
}
var ie;
(function (e) {
  (e.data = "data"),
    (e.deferred = "deferred"),
    (e.redirect = "redirect"),
    (e.error = "error");
})(ie || (ie = {}));
const gv = new Set([
  "lazy",
  "caseSensitive",
  "path",
  "id",
  "index",
  "children",
]);
function wv(e) {
  return e.index === !0;
}
function _a(e, t, n, r) {
  return (
    n === void 0 && (n = []),
    r === void 0 && (r = {}),
    e.map((l, i) => {
      let o = [...n, i],
        a = typeof l.id == "string" ? l.id : o.join("-");
      if (
        (W(
          l.index !== !0 || !l.children,
          "Cannot specify children on an index route"
        ),
        W(
          !r[a],
          'Found a route id collision on id "' +
            a +
            `".  Route id's must be globally unique within Data Router usages`
        ),
        wv(l))
      ) {
        let u = le({}, l, t(l), { id: a });
        return (r[a] = u), u;
      } else {
        let u = le({}, l, t(l), { id: a, children: void 0 });
        return (
          (r[a] = u), l.children && (u.children = _a(l.children, t, o, r)), u
        );
      }
    })
  );
}
function qt(e, t, n) {
  n === void 0 && (n = "/");
  let r = typeof t == "string" ? $t(t) : t,
    l = Rt(r.pathname || "/", n);
  if (l == null) return null;
  let i = Yd(e);
  Sv(i);
  let o = null;
  for (let a = 0; o == null && a < i.length; ++a) {
    let u = Dv(l);
    o = Tv(i[a], u);
  }
  return o;
}
function Qd(e, t) {
  let { route: n, pathname: r, params: l } = e;
  return { id: n.id, pathname: r, params: l, data: t[n.id], handle: n.handle };
}
function Yd(e, t, n, r) {
  t === void 0 && (t = []), n === void 0 && (n = []), r === void 0 && (r = "");
  let l = (i, o, a) => {
    let u = {
      relativePath: a === void 0 ? i.path || "" : a,
      caseSensitive: i.caseSensitive === !0,
      childrenIndex: o,
      route: i,
    };
    u.relativePath.startsWith("/") &&
      (W(
        u.relativePath.startsWith(r),
        'Absolute route path "' +
          u.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes."
      ),
      (u.relativePath = u.relativePath.slice(r.length)));
    let s = Ot([r, u.relativePath]),
      c = n.concat(u);
    i.children &&
      i.children.length > 0 &&
      (W(
        i.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + s + '".')
      ),
      Yd(i.children, t, c, s)),
      !(i.path == null && !i.index) &&
        t.push({ path: s, score: Rv(s, i.index), routesMeta: c });
  };
  return (
    e.forEach((i, o) => {
      var a;
      if (i.path === "" || !((a = i.path) != null && a.includes("?"))) l(i, o);
      else for (let u of Jd(i.path)) l(i, o, u);
    }),
    t
  );
}
function Jd(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [n, ...r] = t,
    l = n.endsWith("?"),
    i = n.replace(/\?$/, "");
  if (r.length === 0) return l ? [i, ""] : [i];
  let o = Jd(r.join("/")),
    a = [];
  return (
    a.push(...o.map((u) => (u === "" ? i : [i, u].join("/")))),
    l && a.push(...o),
    a.map((u) => (e.startsWith("/") && u === "" ? "/" : u))
  );
}
function Sv(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : Lv(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex)
        )
  );
}
const Ev = /^:[\w-]+$/,
  kv = 3,
  xv = 2,
  _v = 1,
  Cv = 10,
  Pv = -2,
  uc = (e) => e === "*";
function Rv(e, t) {
  let n = e.split("/"),
    r = n.length;
  return (
    n.some(uc) && (r += Pv),
    t && (r += xv),
    n
      .filter((l) => !uc(l))
      .reduce((l, i) => l + (Ev.test(i) ? kv : i === "" ? _v : Cv), r)
  );
}
function Lv(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, l) => r === t[l])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function Tv(e, t) {
  let { routesMeta: n } = e,
    r = {},
    l = "/",
    i = [];
  for (let o = 0; o < n.length; ++o) {
    let a = n[o],
      u = o === n.length - 1,
      s = l === "/" ? t : t.slice(l.length) || "/",
      c = Ca(
        { path: a.relativePath, caseSensitive: a.caseSensitive, end: u },
        s
      );
    if (!c) return null;
    Object.assign(r, c.params);
    let f = a.route;
    i.push({
      params: r,
      pathname: Ot([l, c.pathname]),
      pathnameBase: zv(Ot([l, c.pathnameBase])),
      route: f,
    }),
      c.pathnameBase !== "/" && (l = Ot([l, c.pathnameBase]));
  }
  return i;
}
function Ca(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = Nv(e.path, e.caseSensitive, e.end),
    l = t.match(n);
  if (!l) return null;
  let i = l[0],
    o = i.replace(/(.)\/+$/, "$1"),
    a = l.slice(1);
  return {
    params: r.reduce((s, c, f) => {
      let { paramName: d, isOptional: E } = c;
      if (d === "*") {
        let w = a[f] || "";
        o = i.slice(0, i.length - w.length).replace(/(.)\/+$/, "$1");
      }
      const S = a[f];
      return (
        E && !S ? (s[d] = void 0) : (s[d] = (S || "").replace(/%2F/g, "/")), s
      );
    }, {}),
    pathname: i,
    pathnameBase: o,
    pattern: e,
  };
}
function Nv(e, t, n) {
  t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    sr(
      e === "*" || !e.endsWith("*") || e.endsWith("/*"),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + e.replace(/\*$/, "/*") + '".')
    );
  let r = [],
    l =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (o, a, u) => (
            r.push({ paramName: a, isOptional: u != null }),
            u ? "/?([^\\/]+)?" : "/([^\\/]+)"
          )
        );
  return (
    e.endsWith("*")
      ? (r.push({ paramName: "*" }),
        (l += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
      ? (l += "\\/*$")
      : e !== "" && e !== "/" && (l += "(?:(?=\\/|$))"),
    [new RegExp(l, t ? void 0 : "i"), r]
  );
}
function Dv(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      sr(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + t + ").")
      ),
      e
    );
  }
}
function Rt(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== "/" ? null : e.slice(n) || "/";
}
function Mv(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: r = "",
    hash: l = "",
  } = typeof e == "string" ? $t(e) : e;
  return {
    pathname: n ? (n.startsWith("/") ? n : Ov(n, t)) : t,
    search: jv(r),
    hash: Fv(l),
  };
}
function Ov(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((l) => {
      l === ".." ? n.length > 1 && n.pop() : l !== "." && n.push(l);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function Lo(e, t, n, r) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ("`to." +
      t +
      "` field [" +
      JSON.stringify(r) +
      "].  Please separate it out to the ") +
    ("`to." + n + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function Xd(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0)
  );
}
function Ru(e, t) {
  let n = Xd(e);
  return t
    ? n.map((r, l) => (l === e.length - 1 ? r.pathname : r.pathnameBase))
    : n.map((r) => r.pathnameBase);
}
function Lu(e, t, n, r) {
  r === void 0 && (r = !1);
  let l;
  typeof e == "string"
    ? (l = $t(e))
    : ((l = le({}, e)),
      W(
        !l.pathname || !l.pathname.includes("?"),
        Lo("?", "pathname", "search", l)
      ),
      W(
        !l.pathname || !l.pathname.includes("#"),
        Lo("#", "pathname", "hash", l)
      ),
      W(!l.search || !l.search.includes("#"), Lo("#", "search", "hash", l)));
  let i = e === "" || l.pathname === "",
    o = i ? "/" : l.pathname,
    a;
  if (o == null) a = n;
  else {
    let f = t.length - 1;
    if (!r && o.startsWith("..")) {
      let d = o.split("/");
      for (; d[0] === ".."; ) d.shift(), (f -= 1);
      l.pathname = d.join("/");
    }
    a = f >= 0 ? t[f] : "/";
  }
  let u = Mv(l, a),
    s = o && o !== "/" && o.endsWith("/"),
    c = (i || o === ".") && n.endsWith("/");
  return !u.pathname.endsWith("/") && (s || c) && (u.pathname += "/"), u;
}
const Ot = (e) => e.join("/").replace(/\/\/+/g, "/"),
  zv = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  jv = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  Fv = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e);
class Ni extends Error {}
class Iv {
  constructor(t, n) {
    (this.pendingKeysSet = new Set()),
      (this.subscribers = new Set()),
      (this.deferredKeys = []),
      W(
        t && typeof t == "object" && !Array.isArray(t),
        "defer() only accepts plain objects"
      );
    let r;
    (this.abortPromise = new Promise((i, o) => (r = o))),
      (this.controller = new AbortController());
    let l = () => r(new Ni("Deferred data aborted"));
    (this.unlistenAbortSignal = () =>
      this.controller.signal.removeEventListener("abort", l)),
      this.controller.signal.addEventListener("abort", l),
      (this.data = Object.entries(t).reduce((i, o) => {
        let [a, u] = o;
        return Object.assign(i, { [a]: this.trackPromise(a, u) });
      }, {})),
      this.done && this.unlistenAbortSignal(),
      (this.init = n);
  }
  trackPromise(t, n) {
    if (!(n instanceof Promise)) return n;
    this.deferredKeys.push(t), this.pendingKeysSet.add(t);
    let r = Promise.race([n, this.abortPromise]).then(
      (l) => this.onSettle(r, t, void 0, l),
      (l) => this.onSettle(r, t, l)
    );
    return (
      r.catch(() => {}),
      Object.defineProperty(r, "_tracked", { get: () => !0 }),
      r
    );
  }
  onSettle(t, n, r, l) {
    if (this.controller.signal.aborted && r instanceof Ni)
      return (
        this.unlistenAbortSignal(),
        Object.defineProperty(t, "_error", { get: () => r }),
        Promise.reject(r)
      );
    if (
      (this.pendingKeysSet.delete(n),
      this.done && this.unlistenAbortSignal(),
      r === void 0 && l === void 0)
    ) {
      let i = new Error(
        'Deferred data for key "' +
          n +
          '" resolved/rejected with `undefined`, you must resolve/reject with a value or `null`.'
      );
      return (
        Object.defineProperty(t, "_error", { get: () => i }),
        this.emit(!1, n),
        Promise.reject(i)
      );
    }
    return l === void 0
      ? (Object.defineProperty(t, "_error", { get: () => r }),
        this.emit(!1, n),
        Promise.reject(r))
      : (Object.defineProperty(t, "_data", { get: () => l }),
        this.emit(!1, n),
        l);
  }
  emit(t, n) {
    this.subscribers.forEach((r) => r(t, n));
  }
  subscribe(t) {
    return this.subscribers.add(t), () => this.subscribers.delete(t);
  }
  cancel() {
    this.controller.abort(),
      this.pendingKeysSet.forEach((t, n) => this.pendingKeysSet.delete(n)),
      this.emit(!0);
  }
  async resolveData(t) {
    let n = !1;
    if (!this.done) {
      let r = () => this.cancel();
      t.addEventListener("abort", r),
        (n = await new Promise((l) => {
          this.subscribe((i) => {
            t.removeEventListener("abort", r), (i || this.done) && l(i);
          });
        }));
    }
    return n;
  }
  get done() {
    return this.pendingKeysSet.size === 0;
  }
  get unwrappedData() {
    return (
      W(
        this.data !== null && this.done,
        "Can only unwrap data on initialized and settled deferreds"
      ),
      Object.entries(this.data).reduce((t, n) => {
        let [r, l] = n;
        return Object.assign(t, { [r]: $v(l) });
      }, {})
    );
  }
  get pendingKeys() {
    return Array.from(this.pendingKeysSet);
  }
}
function Uv(e) {
  return e instanceof Promise && e._tracked === !0;
}
function $v(e) {
  if (!Uv(e)) return e;
  if (e._error) throw e._error;
  return e._data;
}
const Av = function (t, n) {
  n === void 0 && (n = 302);
  let r = n;
  typeof r == "number"
    ? (r = { status: r })
    : typeof r.status > "u" && (r.status = 302);
  let l = new Headers(r.headers);
  return l.set("Location", t), new Response(null, le({}, r, { headers: l }));
};
class Tu {
  constructor(t, n, r, l) {
    l === void 0 && (l = !1),
      (this.status = t),
      (this.statusText = n || ""),
      (this.internal = l),
      r instanceof Error
        ? ((this.data = r.toString()), (this.error = r))
        : (this.data = r);
  }
}
function Nu(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
const Gd = ["post", "put", "patch", "delete"],
  Bv = new Set(Gd),
  Hv = ["get", ...Gd],
  Vv = new Set(Hv),
  Wv = new Set([301, 302, 303, 307, 308]),
  Kv = new Set([307, 308]),
  To = {
    state: "idle",
    location: void 0,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
  },
  Qv = {
    state: "idle",
    data: void 0,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
  },
  Nr = { state: "unblocked", proceed: void 0, reset: void 0, location: void 0 },
  Du = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Yv = (e) => ({ hasErrorBoundary: !!e.hasErrorBoundary }),
  Zd = "remix-router-transitions";
function Gg(e) {
  const t = e.window ? e.window : typeof window < "u" ? window : void 0,
    n =
      typeof t < "u" &&
      typeof t.document < "u" &&
      typeof t.document.createElement < "u",
    r = !n;
  W(
    e.routes.length > 0,
    "You must provide a non-empty routes array to createRouter"
  );
  let l;
  if (e.mapRouteProperties) l = e.mapRouteProperties;
  else if (e.detectErrorBoundary) {
    let g = e.detectErrorBoundary;
    l = (k) => ({ hasErrorBoundary: g(k) });
  } else l = Yv;
  let i = {},
    o = _a(e.routes, l, void 0, i),
    a,
    u = e.basename || "/",
    s = e.unstable_dataStrategy || Zv,
    c = le(
      {
        v7_fetcherPersist: !1,
        v7_normalizeFormMethod: !1,
        v7_partialHydration: !1,
        v7_prependBasename: !1,
        v7_relativeSplatPath: !1,
        unstable_skipActionErrorRevalidation: !1,
      },
      e.future
    ),
    f = null,
    d = new Set(),
    E = null,
    S = null,
    w = null,
    P = e.hydrationData != null,
    h = qt(o, e.history.location, u),
    p = null;
  if (h == null) {
    let g = rt(404, { pathname: e.history.location.pathname }),
      { matches: k, route: _ } = gc(o);
    (h = k), (p = { [_.id]: g });
  }
  let v,
    x = h.some((g) => g.route.lazy),
    L = h.some((g) => g.route.loader);
  if (x) v = !1;
  else if (!L) v = !0;
  else if (c.v7_partialHydration) {
    let g = e.hydrationData ? e.hydrationData.loaderData : null,
      k = e.hydrationData ? e.hydrationData.errors : null,
      _ = (T) =>
        T.route.loader
          ? typeof T.route.loader == "function" && T.route.loader.hydrate === !0
            ? !1
            : (g && g[T.route.id] !== void 0) || (k && k[T.route.id] !== void 0)
          : !0;
    if (k) {
      let T = h.findIndex((j) => k[j.route.id] !== void 0);
      v = h.slice(0, T + 1).every(_);
    } else v = h.every(_);
  } else v = e.hydrationData != null;
  let M,
    m = {
      historyAction: e.history.action,
      location: e.history.location,
      matches: h,
      initialized: v,
      navigation: To,
      restoreScrollPosition: e.hydrationData != null ? !1 : null,
      preventScrollReset: !1,
      revalidation: "idle",
      loaderData: (e.hydrationData && e.hydrationData.loaderData) || {},
      actionData: (e.hydrationData && e.hydrationData.actionData) || null,
      errors: (e.hydrationData && e.hydrationData.errors) || p,
      fetchers: new Map(),
      blockers: new Map(),
    },
    C = de.Pop,
    O = !1,
    D,
    H = !1,
    G = new Map(),
    X = null,
    he = !1,
    Ve = !1,
    Ee = [],
    be = [],
    N = new Map(),
    U = 0,
    A = -1,
    q = new Map(),
    b = new Set(),
    ft = new Map(),
    We = new Map(),
    Ke = new Set(),
    Me = new Map(),
    et = new Map(),
    qi = !1;
  function _p() {
    if (
      ((f = e.history.listen((g) => {
        let { action: k, location: _, delta: T } = g;
        if (qi) {
          qi = !1;
          return;
        }
        sr(
          et.size === 0 || T != null,
          "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL."
        );
        let j = Ju({
          currentLocation: m.location,
          nextLocation: _,
          historyAction: k,
        });
        if (j && T != null) {
          (qi = !0),
            e.history.go(T * -1),
            kl(j, {
              state: "blocked",
              location: _,
              proceed() {
                kl(j, {
                  state: "proceeding",
                  proceed: void 0,
                  reset: void 0,
                  location: _,
                }),
                  e.history.go(T);
              },
              reset() {
                let V = new Map(m.blockers);
                V.set(j, Nr), Qe({ blockers: V });
              },
            });
          return;
        }
        return mn(k, _);
      })),
      n)
    ) {
      sy(t, G);
      let g = () => cy(t, G);
      t.addEventListener("pagehide", g),
        (X = () => t.removeEventListener("pagehide", g));
    }
    return m.initialized || mn(de.Pop, m.location, { initialHydration: !0 }), M;
  }
  function Cp() {
    f && f(),
      X && X(),
      d.clear(),
      D && D.abort(),
      m.fetchers.forEach((g, k) => El(k)),
      m.blockers.forEach((g, k) => Yu(k));
  }
  function Pp(g) {
    return d.add(g), () => d.delete(g);
  }
  function Qe(g, k) {
    k === void 0 && (k = {}), (m = le({}, m, g));
    let _ = [],
      T = [];
    c.v7_fetcherPersist &&
      m.fetchers.forEach((j, V) => {
        j.state === "idle" && (Ke.has(V) ? T.push(V) : _.push(V));
      }),
      [...d].forEach((j) =>
        j(m, {
          deletedFetchers: T,
          unstable_viewTransitionOpts: k.viewTransitionOpts,
          unstable_flushSync: k.flushSync === !0,
        })
      ),
      c.v7_fetcherPersist &&
        (_.forEach((j) => m.fetchers.delete(j)), T.forEach((j) => El(j)));
  }
  function vr(g, k, _) {
    var T, j;
    let { flushSync: V } = _ === void 0 ? {} : _,
      I =
        m.actionData != null &&
        m.navigation.formMethod != null &&
        vt(m.navigation.formMethod) &&
        m.navigation.state === "loading" &&
        ((T = g.state) == null ? void 0 : T._isRedirect) !== !0,
      F;
    k.actionData
      ? Object.keys(k.actionData).length > 0
        ? (F = k.actionData)
        : (F = null)
      : I
      ? (F = m.actionData)
      : (F = null);
    let K = k.loaderData
        ? vc(m.loaderData, k.loaderData, k.matches || [], k.errors)
        : m.loaderData,
      B = m.blockers;
    B.size > 0 && ((B = new Map(B)), B.forEach(($, re) => B.set(re, Nr)));
    let ke =
      O === !0 ||
      (m.navigation.formMethod != null &&
        vt(m.navigation.formMethod) &&
        ((j = g.state) == null ? void 0 : j._isRedirect) !== !0);
    a && ((o = a), (a = void 0)),
      he ||
        C === de.Pop ||
        (C === de.Push
          ? e.history.push(g, g.state)
          : C === de.Replace && e.history.replace(g, g.state));
    let xe;
    if (C === de.Pop) {
      let $ = G.get(m.location.pathname);
      $ && $.has(g.pathname)
        ? (xe = { currentLocation: m.location, nextLocation: g })
        : G.has(g.pathname) &&
          (xe = { currentLocation: g, nextLocation: m.location });
    } else if (H) {
      let $ = G.get(m.location.pathname);
      $
        ? $.add(g.pathname)
        : (($ = new Set([g.pathname])), G.set(m.location.pathname, $)),
        (xe = { currentLocation: m.location, nextLocation: g });
    }
    Qe(
      le({}, k, {
        actionData: F,
        loaderData: K,
        historyAction: C,
        location: g,
        initialized: !0,
        navigation: To,
        revalidation: "idle",
        restoreScrollPosition: Gu(g, k.matches || m.matches),
        preventScrollReset: ke,
        blockers: B,
      }),
      { viewTransitionOpts: xe, flushSync: V === !0 }
    ),
      (C = de.Pop),
      (O = !1),
      (H = !1),
      (he = !1),
      (Ve = !1),
      (Ee = []),
      (be = []);
  }
  async function Bu(g, k) {
    if (typeof g == "number") {
      e.history.go(g);
      return;
    }
    let _ = Pa(
        m.location,
        m.matches,
        u,
        c.v7_prependBasename,
        g,
        c.v7_relativeSplatPath,
        k == null ? void 0 : k.fromRouteId,
        k == null ? void 0 : k.relative
      ),
      {
        path: T,
        submission: j,
        error: V,
      } = sc(c.v7_normalizeFormMethod, !1, _, k),
      I = m.location,
      F = fl(m.location, T, k && k.state);
    F = le({}, F, e.history.encodeLocation(F));
    let K = k && k.replace != null ? k.replace : void 0,
      B = de.Push;
    K === !0
      ? (B = de.Replace)
      : K === !1 ||
        (j != null &&
          vt(j.formMethod) &&
          j.formAction === m.location.pathname + m.location.search &&
          (B = de.Replace));
    let ke =
        k && "preventScrollReset" in k ? k.preventScrollReset === !0 : void 0,
      xe = (k && k.unstable_flushSync) === !0,
      $ = Ju({ currentLocation: I, nextLocation: F, historyAction: B });
    if ($) {
      kl($, {
        state: "blocked",
        location: F,
        proceed() {
          kl($, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: F,
          }),
            Bu(g, k);
        },
        reset() {
          let re = new Map(m.blockers);
          re.set($, Nr), Qe({ blockers: re });
        },
      });
      return;
    }
    return await mn(B, F, {
      submission: j,
      pendingError: V,
      preventScrollReset: ke,
      replace: k && k.replace,
      enableViewTransition: k && k.unstable_viewTransition,
      flushSync: xe,
    });
  }
  function Rp() {
    if (
      (bi(),
      Qe({ revalidation: "loading" }),
      m.navigation.state !== "submitting")
    ) {
      if (m.navigation.state === "idle") {
        mn(m.historyAction, m.location, { startUninterruptedRevalidation: !0 });
        return;
      }
      mn(C || m.historyAction, m.navigation.location, {
        overrideNavigation: m.navigation,
      });
    }
  }
  async function mn(g, k, _) {
    D && D.abort(),
      (D = null),
      (C = g),
      (he = (_ && _.startUninterruptedRevalidation) === !0),
      Fp(m.location, m.matches),
      (O = (_ && _.preventScrollReset) === !0),
      (H = (_ && _.enableViewTransition) === !0);
    let T = a || o,
      j = _ && _.overrideNavigation,
      V = qt(T, k, u),
      I = (_ && _.flushSync) === !0;
    if (!V) {
      let $ = rt(404, { pathname: k.pathname }),
        { matches: re, route: ge } = gc(T);
      eo(),
        vr(
          k,
          { matches: re, loaderData: {}, errors: { [ge.id]: $ } },
          { flushSync: I }
        );
      return;
    }
    if (
      m.initialized &&
      !Ve &&
      ry(m.location, k) &&
      !(_ && _.submission && vt(_.submission.formMethod))
    ) {
      vr(k, { matches: V }, { flushSync: I });
      return;
    }
    D = new AbortController();
    let F = In(e.history, k, D.signal, _ && _.submission),
      K;
    if (_ && _.pendingError)
      K = [Yr(V).route.id, { type: ie.error, error: _.pendingError }];
    else if (_ && _.submission && vt(_.submission.formMethod)) {
      let $ = await Lp(F, k, _.submission, V, {
        replace: _.replace,
        flushSync: I,
      });
      if ($.shortCircuited) return;
      (K = $.pendingActionResult),
        (j = No(k, _.submission)),
        (I = !1),
        (F = In(e.history, F.url, F.signal));
    }
    let {
      shortCircuited: B,
      loaderData: ke,
      errors: xe,
    } = await Tp(
      F,
      k,
      V,
      j,
      _ && _.submission,
      _ && _.fetcherSubmission,
      _ && _.replace,
      _ && _.initialHydration === !0,
      I,
      K
    );
    B ||
      ((D = null),
      vr(k, le({ matches: V }, yc(K), { loaderData: ke, errors: xe })));
  }
  async function Lp(g, k, _, T, j) {
    j === void 0 && (j = {}), bi();
    let V = ay(k, _);
    Qe({ navigation: V }, { flushSync: j.flushSync === !0 });
    let I,
      F = La(T, k);
    if (!F.route.action && !F.route.lazy)
      I = {
        type: ie.error,
        error: rt(405, {
          method: g.method,
          pathname: k.pathname,
          routeId: F.route.id,
        }),
      };
    else if (((I = (await gr("action", g, [F], T))[0]), g.signal.aborted))
      return { shortCircuited: !0 };
    if (kn(I)) {
      let K;
      return (
        j && j.replace != null
          ? (K = j.replace)
          : (K =
              pc(I.response.headers.get("Location"), new URL(g.url), u) ===
              m.location.pathname + m.location.search),
        await yr(g, I, { submission: _, replace: K }),
        { shortCircuited: !0 }
      );
    }
    if (En(I)) throw rt(400, { type: "defer-action" });
    if (ot(I)) {
      let K = Yr(T, F.route.id);
      return (
        (j && j.replace) !== !0 && (C = de.Push),
        { pendingActionResult: [K.route.id, I] }
      );
    }
    return { pendingActionResult: [F.route.id, I] };
  }
  async function Tp(g, k, _, T, j, V, I, F, K, B) {
    let ke = T || No(k, j),
      xe = j || V || Ec(ke),
      $ = a || o,
      [re, ge] = cc(
        e.history,
        m,
        _,
        xe,
        k,
        c.v7_partialHydration && F === !0,
        c.unstable_skipActionErrorRevalidation,
        Ve,
        Ee,
        be,
        Ke,
        ft,
        b,
        $,
        u,
        B
      );
    if (
      (eo(
        (Y) =>
          !(_ && _.some((Oe) => Oe.route.id === Y)) ||
          (re && re.some((Oe) => Oe.route.id === Y))
      ),
      (A = ++U),
      re.length === 0 && ge.length === 0)
    ) {
      let Y = Ku();
      return (
        vr(
          k,
          le(
            {
              matches: _,
              loaderData: {},
              errors: B && ot(B[1]) ? { [B[0]]: B[1].error } : null,
            },
            yc(B),
            Y ? { fetchers: new Map(m.fetchers) } : {}
          ),
          { flushSync: K }
        ),
        { shortCircuited: !0 }
      );
    }
    if (!he && (!c.v7_partialHydration || !F)) {
      ge.forEach((Oe) => {
        let tt = m.fetchers.get(Oe.key),
          _e = Dr(void 0, tt ? tt.data : void 0);
        m.fetchers.set(Oe.key, _e);
      });
      let Y;
      B && !ot(B[1])
        ? (Y = { [B[0]]: B[1].data })
        : m.actionData &&
          (Object.keys(m.actionData).length === 0
            ? (Y = null)
            : (Y = m.actionData)),
        Qe(
          le(
            { navigation: ke },
            Y !== void 0 ? { actionData: Y } : {},
            ge.length > 0 ? { fetchers: new Map(m.fetchers) } : {}
          ),
          { flushSync: K }
        );
    }
    ge.forEach((Y) => {
      N.has(Y.key) && Ht(Y.key), Y.controller && N.set(Y.key, Y.controller);
    });
    let Sr = () => ge.forEach((Y) => Ht(Y.key));
    D && D.signal.addEventListener("abort", Sr);
    let { loaderResults: Vt, fetcherResults: On } = await Hu(
      m.matches,
      _,
      re,
      ge,
      g
    );
    if (g.signal.aborted) return { shortCircuited: !0 };
    D && D.signal.removeEventListener("abort", Sr),
      ge.forEach((Y) => N.delete(Y.key));
    let zn = wc([...Vt, ...On]);
    if (zn) {
      if (zn.idx >= re.length) {
        let Y = ge[zn.idx - re.length].key;
        b.add(Y);
      }
      return await yr(g, zn.result, { replace: I }), { shortCircuited: !0 };
    }
    let { loaderData: jn, errors: Et } = mc(m, _, re, Vt, B, ge, On, Me);
    Me.forEach((Y, Oe) => {
      Y.subscribe((tt) => {
        (tt || Y.done) && Me.delete(Oe);
      });
    }),
      c.v7_partialHydration &&
        F &&
        m.errors &&
        Object.entries(m.errors)
          .filter((Y) => {
            let [Oe] = Y;
            return !re.some((tt) => tt.route.id === Oe);
          })
          .forEach((Y) => {
            let [Oe, tt] = Y;
            Et = Object.assign(Et || {}, { [Oe]: tt });
          });
    let xl = Ku(),
      _l = Qu(A),
      Cl = xl || _l || ge.length > 0;
    return le(
      { loaderData: jn, errors: Et },
      Cl ? { fetchers: new Map(m.fetchers) } : {}
    );
  }
  function Np(g, k, _, T) {
    if (r)
      throw new Error(
        "router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback."
      );
    N.has(g) && Ht(g);
    let j = (T && T.unstable_flushSync) === !0,
      V = a || o,
      I = Pa(
        m.location,
        m.matches,
        u,
        c.v7_prependBasename,
        _,
        c.v7_relativeSplatPath,
        k,
        T == null ? void 0 : T.relative
      ),
      F = qt(V, I, u);
    if (!F) {
      wr(g, k, rt(404, { pathname: I }), { flushSync: j });
      return;
    }
    let {
      path: K,
      submission: B,
      error: ke,
    } = sc(c.v7_normalizeFormMethod, !0, I, T);
    if (ke) {
      wr(g, k, ke, { flushSync: j });
      return;
    }
    let xe = La(F, K);
    if (((O = (T && T.preventScrollReset) === !0), B && vt(B.formMethod))) {
      Dp(g, k, K, xe, F, j, B);
      return;
    }
    ft.set(g, { routeId: k, path: K }), Mp(g, k, K, xe, F, j, B);
  }
  async function Dp(g, k, _, T, j, V, I) {
    if ((bi(), ft.delete(g), !T.route.action && !T.route.lazy)) {
      let _e = rt(405, { method: I.formMethod, pathname: _, routeId: k });
      wr(g, k, _e, { flushSync: V });
      return;
    }
    let F = m.fetchers.get(g);
    Bt(g, uy(I, F), { flushSync: V });
    let K = new AbortController(),
      B = In(e.history, _, K.signal, I);
    N.set(g, K);
    let ke = U,
      $ = (await gr("action", B, [T], j))[0];
    if (B.signal.aborted) {
      N.get(g) === K && N.delete(g);
      return;
    }
    if (c.v7_fetcherPersist && Ke.has(g)) {
      if (kn($) || ot($)) {
        Bt(g, Kt(void 0));
        return;
      }
    } else {
      if (kn($))
        if ((N.delete(g), A > ke)) {
          Bt(g, Kt(void 0));
          return;
        } else
          return b.add(g), Bt(g, Dr(I)), yr(B, $, { fetcherSubmission: I });
      if (ot($)) {
        wr(g, k, $.error);
        return;
      }
    }
    if (En($)) throw rt(400, { type: "defer-action" });
    let re = m.navigation.location || m.location,
      ge = In(e.history, re, K.signal),
      Sr = a || o,
      Vt =
        m.navigation.state !== "idle"
          ? qt(Sr, m.navigation.location, u)
          : m.matches;
    W(Vt, "Didn't find any matches after fetcher action");
    let On = ++U;
    q.set(g, On);
    let zn = Dr(I, $.data);
    m.fetchers.set(g, zn);
    let [jn, Et] = cc(
      e.history,
      m,
      Vt,
      I,
      re,
      !1,
      c.unstable_skipActionErrorRevalidation,
      Ve,
      Ee,
      be,
      Ke,
      ft,
      b,
      Sr,
      u,
      [T.route.id, $]
    );
    Et.filter((_e) => _e.key !== g).forEach((_e) => {
      let Er = _e.key,
        Zu = m.fetchers.get(Er),
        Up = Dr(void 0, Zu ? Zu.data : void 0);
      m.fetchers.set(Er, Up),
        N.has(Er) && Ht(Er),
        _e.controller && N.set(Er, _e.controller);
    }),
      Qe({ fetchers: new Map(m.fetchers) });
    let xl = () => Et.forEach((_e) => Ht(_e.key));
    K.signal.addEventListener("abort", xl);
    let { loaderResults: _l, fetcherResults: Cl } = await Hu(
      m.matches,
      Vt,
      jn,
      Et,
      ge
    );
    if (K.signal.aborted) return;
    K.signal.removeEventListener("abort", xl),
      q.delete(g),
      N.delete(g),
      Et.forEach((_e) => N.delete(_e.key));
    let Y = wc([..._l, ...Cl]);
    if (Y) {
      if (Y.idx >= jn.length) {
        let _e = Et[Y.idx - jn.length].key;
        b.add(_e);
      }
      return yr(ge, Y.result);
    }
    let { loaderData: Oe, errors: tt } = mc(
      m,
      m.matches,
      jn,
      _l,
      void 0,
      Et,
      Cl,
      Me
    );
    if (m.fetchers.has(g)) {
      let _e = Kt($.data);
      m.fetchers.set(g, _e);
    }
    Qu(On),
      m.navigation.state === "loading" && On > A
        ? (W(C, "Expected pending action"),
          D && D.abort(),
          vr(m.navigation.location, {
            matches: Vt,
            loaderData: Oe,
            errors: tt,
            fetchers: new Map(m.fetchers),
          }))
        : (Qe({
            errors: tt,
            loaderData: vc(m.loaderData, Oe, Vt, tt),
            fetchers: new Map(m.fetchers),
          }),
          (Ve = !1));
  }
  async function Mp(g, k, _, T, j, V, I) {
    let F = m.fetchers.get(g);
    Bt(g, Dr(I, F ? F.data : void 0), { flushSync: V });
    let K = new AbortController(),
      B = In(e.history, _, K.signal);
    N.set(g, K);
    let ke = U,
      $ = (await gr("loader", B, [T], j))[0];
    if (
      (En($) && ($ = (await tp($, B.signal, !0)) || $),
      N.get(g) === K && N.delete(g),
      !B.signal.aborted)
    ) {
      if (Ke.has(g)) {
        Bt(g, Kt(void 0));
        return;
      }
      if (kn($))
        if (A > ke) {
          Bt(g, Kt(void 0));
          return;
        } else {
          b.add(g), await yr(B, $);
          return;
        }
      if (ot($)) {
        wr(g, k, $.error);
        return;
      }
      W(!En($), "Unhandled fetcher deferred data"), Bt(g, Kt($.data));
    }
  }
  async function yr(g, k, _) {
    let {
      submission: T,
      fetcherSubmission: j,
      replace: V,
    } = _ === void 0 ? {} : _;
    k.response.headers.has("X-Remix-Revalidate") && (Ve = !0);
    let I = k.response.headers.get("Location");
    W(I, "Expected a Location header on the redirect Response"),
      (I = pc(I, new URL(g.url), u));
    let F = fl(m.location, I, { _isRedirect: !0 });
    if (n) {
      let re = !1;
      if (k.response.headers.has("X-Remix-Reload-Document")) re = !0;
      else if (Du.test(I)) {
        const ge = e.history.createURL(I);
        re = ge.origin !== t.location.origin || Rt(ge.pathname, u) == null;
      }
      if (re) {
        V ? t.location.replace(I) : t.location.assign(I);
        return;
      }
    }
    D = null;
    let K = V === !0 ? de.Replace : de.Push,
      { formMethod: B, formAction: ke, formEncType: xe } = m.navigation;
    !T && !j && B && ke && xe && (T = Ec(m.navigation));
    let $ = T || j;
    if (Kv.has(k.response.status) && $ && vt($.formMethod))
      await mn(K, F, {
        submission: le({}, $, { formAction: I }),
        preventScrollReset: O,
      });
    else {
      let re = No(F, T);
      await mn(K, F, {
        overrideNavigation: re,
        fetcherSubmission: j,
        preventScrollReset: O,
      });
    }
  }
  async function gr(g, k, _, T) {
    try {
      let j = await qv(s, g, k, _, T, i, l);
      return await Promise.all(
        j.map((V, I) => {
          if (ly(V)) {
            let F = V.result;
            return {
              type: ie.redirect,
              response: ty(F, k, _[I].route.id, T, u, c.v7_relativeSplatPath),
            };
          }
          return ey(V);
        })
      );
    } catch (j) {
      return _.map(() => ({ type: ie.error, error: j }));
    }
  }
  async function Hu(g, k, _, T, j) {
    let [V, ...I] = await Promise.all([
      _.length ? gr("loader", j, _, k) : [],
      ...T.map((F) => {
        if (F.matches && F.match && F.controller) {
          let K = In(e.history, F.path, F.controller.signal);
          return gr("loader", K, [F.match], F.matches).then((B) => B[0]);
        } else
          return Promise.resolve({
            type: ie.error,
            error: rt(404, { pathname: F.path }),
          });
      }),
    ]);
    return (
      await Promise.all([
        Sc(
          g,
          _,
          V,
          V.map(() => j.signal),
          !1,
          m.loaderData
        ),
        Sc(
          g,
          T.map((F) => F.match),
          I,
          T.map((F) => (F.controller ? F.controller.signal : null)),
          !0
        ),
      ]),
      { loaderResults: V, fetcherResults: I }
    );
  }
  function bi() {
    (Ve = !0),
      Ee.push(...eo()),
      ft.forEach((g, k) => {
        N.has(k) && (be.push(k), Ht(k));
      });
  }
  function Bt(g, k, _) {
    _ === void 0 && (_ = {}),
      m.fetchers.set(g, k),
      Qe(
        { fetchers: new Map(m.fetchers) },
        { flushSync: (_ && _.flushSync) === !0 }
      );
  }
  function wr(g, k, _, T) {
    T === void 0 && (T = {});
    let j = Yr(m.matches, k);
    El(g),
      Qe(
        { errors: { [j.route.id]: _ }, fetchers: new Map(m.fetchers) },
        { flushSync: (T && T.flushSync) === !0 }
      );
  }
  function Vu(g) {
    return (
      c.v7_fetcherPersist &&
        (We.set(g, (We.get(g) || 0) + 1), Ke.has(g) && Ke.delete(g)),
      m.fetchers.get(g) || Qv
    );
  }
  function El(g) {
    let k = m.fetchers.get(g);
    N.has(g) && !(k && k.state === "loading" && q.has(g)) && Ht(g),
      ft.delete(g),
      q.delete(g),
      b.delete(g),
      Ke.delete(g),
      m.fetchers.delete(g);
  }
  function Op(g) {
    if (c.v7_fetcherPersist) {
      let k = (We.get(g) || 0) - 1;
      k <= 0 ? (We.delete(g), Ke.add(g)) : We.set(g, k);
    } else El(g);
    Qe({ fetchers: new Map(m.fetchers) });
  }
  function Ht(g) {
    let k = N.get(g);
    W(k, "Expected fetch controller: " + g), k.abort(), N.delete(g);
  }
  function Wu(g) {
    for (let k of g) {
      let _ = Vu(k),
        T = Kt(_.data);
      m.fetchers.set(k, T);
    }
  }
  function Ku() {
    let g = [],
      k = !1;
    for (let _ of b) {
      let T = m.fetchers.get(_);
      W(T, "Expected fetcher: " + _),
        T.state === "loading" && (b.delete(_), g.push(_), (k = !0));
    }
    return Wu(g), k;
  }
  function Qu(g) {
    let k = [];
    for (let [_, T] of q)
      if (T < g) {
        let j = m.fetchers.get(_);
        W(j, "Expected fetcher: " + _),
          j.state === "loading" && (Ht(_), q.delete(_), k.push(_));
      }
    return Wu(k), k.length > 0;
  }
  function zp(g, k) {
    let _ = m.blockers.get(g) || Nr;
    return et.get(g) !== k && et.set(g, k), _;
  }
  function Yu(g) {
    m.blockers.delete(g), et.delete(g);
  }
  function kl(g, k) {
    let _ = m.blockers.get(g) || Nr;
    W(
      (_.state === "unblocked" && k.state === "blocked") ||
        (_.state === "blocked" && k.state === "blocked") ||
        (_.state === "blocked" && k.state === "proceeding") ||
        (_.state === "blocked" && k.state === "unblocked") ||
        (_.state === "proceeding" && k.state === "unblocked"),
      "Invalid blocker state transition: " + _.state + " -> " + k.state
    );
    let T = new Map(m.blockers);
    T.set(g, k), Qe({ blockers: T });
  }
  function Ju(g) {
    let { currentLocation: k, nextLocation: _, historyAction: T } = g;
    if (et.size === 0) return;
    et.size > 1 && sr(!1, "A router only supports one blocker at a time");
    let j = Array.from(et.entries()),
      [V, I] = j[j.length - 1],
      F = m.blockers.get(V);
    if (
      !(F && F.state === "proceeding") &&
      I({ currentLocation: k, nextLocation: _, historyAction: T })
    )
      return V;
  }
  function eo(g) {
    let k = [];
    return (
      Me.forEach((_, T) => {
        (!g || g(T)) && (_.cancel(), k.push(T), Me.delete(T));
      }),
      k
    );
  }
  function jp(g, k, _) {
    if (((E = g), (w = k), (S = _ || null), !P && m.navigation === To)) {
      P = !0;
      let T = Gu(m.location, m.matches);
      T != null && Qe({ restoreScrollPosition: T });
    }
    return () => {
      (E = null), (w = null), (S = null);
    };
  }
  function Xu(g, k) {
    return (
      (S &&
        S(
          g,
          k.map((T) => Qd(T, m.loaderData))
        )) ||
      g.key
    );
  }
  function Fp(g, k) {
    if (E && w) {
      let _ = Xu(g, k);
      E[_] = w();
    }
  }
  function Gu(g, k) {
    if (E) {
      let _ = Xu(g, k),
        T = E[_];
      if (typeof T == "number") return T;
    }
    return null;
  }
  function Ip(g) {
    (i = {}), (a = _a(g, l, void 0, i));
  }
  return (
    (M = {
      get basename() {
        return u;
      },
      get future() {
        return c;
      },
      get state() {
        return m;
      },
      get routes() {
        return o;
      },
      get window() {
        return t;
      },
      initialize: _p,
      subscribe: Pp,
      enableScrollRestoration: jp,
      navigate: Bu,
      fetch: Np,
      revalidate: Rp,
      createHref: (g) => e.history.createHref(g),
      encodeLocation: (g) => e.history.encodeLocation(g),
      getFetcher: Vu,
      deleteFetcher: Op,
      dispose: Cp,
      getBlocker: zp,
      deleteBlocker: Yu,
      _internalFetchControllers: N,
      _internalActiveDeferreds: Me,
      _internalSetRoutes: Ip,
    }),
    M
  );
}
function Jv(e) {
  return (
    e != null &&
    (("formData" in e && e.formData != null) ||
      ("body" in e && e.body !== void 0))
  );
}
function Pa(e, t, n, r, l, i, o, a) {
  let u, s;
  if (o) {
    u = [];
    for (let f of t)
      if ((u.push(f), f.route.id === o)) {
        s = f;
        break;
      }
  } else (u = t), (s = t[t.length - 1]);
  let c = Lu(l || ".", Ru(u, i), Rt(e.pathname, n) || e.pathname, a === "path");
  return (
    l == null && ((c.search = e.search), (c.hash = e.hash)),
    (l == null || l === "" || l === ".") &&
      s &&
      s.route.index &&
      !Mu(c.search) &&
      (c.search = c.search ? c.search.replace(/^\?/, "?index&") : "?index"),
    r &&
      n !== "/" &&
      (c.pathname = c.pathname === "/" ? n : Ot([n, c.pathname])),
    Nn(c)
  );
}
function sc(e, t, n, r) {
  if (!r || !Jv(r)) return { path: n };
  if (r.formMethod && !oy(r.formMethod))
    return { path: n, error: rt(405, { method: r.formMethod }) };
  let l = () => ({ path: n, error: rt(400, { type: "invalid-body" }) }),
    i = r.formMethod || "get",
    o = e ? i.toUpperCase() : i.toLowerCase(),
    a = bd(n);
  if (r.body !== void 0) {
    if (r.formEncType === "text/plain") {
      if (!vt(o)) return l();
      let d =
        typeof r.body == "string"
          ? r.body
          : r.body instanceof FormData || r.body instanceof URLSearchParams
          ? Array.from(r.body.entries()).reduce((E, S) => {
              let [w, P] = S;
              return (
                "" +
                E +
                w +
                "=" +
                P +
                `
`
              );
            }, "")
          : String(r.body);
      return {
        path: n,
        submission: {
          formMethod: o,
          formAction: a,
          formEncType: r.formEncType,
          formData: void 0,
          json: void 0,
          text: d,
        },
      };
    } else if (r.formEncType === "application/json") {
      if (!vt(o)) return l();
      try {
        let d = typeof r.body == "string" ? JSON.parse(r.body) : r.body;
        return {
          path: n,
          submission: {
            formMethod: o,
            formAction: a,
            formEncType: r.formEncType,
            formData: void 0,
            json: d,
            text: void 0,
          },
        };
      } catch {
        return l();
      }
    }
  }
  W(
    typeof FormData == "function",
    "FormData is not available in this environment"
  );
  let u, s;
  if (r.formData) (u = Ra(r.formData)), (s = r.formData);
  else if (r.body instanceof FormData) (u = Ra(r.body)), (s = r.body);
  else if (r.body instanceof URLSearchParams) (u = r.body), (s = hc(u));
  else if (r.body == null) (u = new URLSearchParams()), (s = new FormData());
  else
    try {
      (u = new URLSearchParams(r.body)), (s = hc(u));
    } catch {
      return l();
    }
  let c = {
    formMethod: o,
    formAction: a,
    formEncType: (r && r.formEncType) || "application/x-www-form-urlencoded",
    formData: s,
    json: void 0,
    text: void 0,
  };
  if (vt(c.formMethod)) return { path: n, submission: c };
  let f = $t(n);
  return (
    t && f.search && Mu(f.search) && u.append("index", ""),
    (f.search = "?" + u),
    { path: Nn(f), submission: c }
  );
}
function Xv(e, t) {
  let n = e;
  if (t) {
    let r = e.findIndex((l) => l.route.id === t);
    r >= 0 && (n = e.slice(0, r));
  }
  return n;
}
function cc(e, t, n, r, l, i, o, a, u, s, c, f, d, E, S, w) {
  let P = w ? (ot(w[1]) ? w[1].error : w[1].data) : void 0,
    h = e.createURL(t.location),
    p = e.createURL(l),
    v = w && ot(w[1]) ? w[0] : void 0,
    x = v ? Xv(n, v) : n,
    L = w ? w[1].statusCode : void 0,
    M = o && L && L >= 400,
    m = x.filter((O, D) => {
      let { route: H } = O;
      if (H.lazy) return !0;
      if (H.loader == null) return !1;
      if (i)
        return typeof H.loader != "function" || H.loader.hydrate
          ? !0
          : t.loaderData[H.id] === void 0 &&
              (!t.errors || t.errors[H.id] === void 0);
      if (
        Gv(t.loaderData, t.matches[D], O) ||
        u.some((he) => he === O.route.id)
      )
        return !0;
      let G = t.matches[D],
        X = O;
      return fc(
        O,
        le(
          {
            currentUrl: h,
            currentParams: G.params,
            nextUrl: p,
            nextParams: X.params,
          },
          r,
          {
            actionResult: P,
            unstable_actionStatus: L,
            defaultShouldRevalidate: M
              ? !1
              : a ||
                h.pathname + h.search === p.pathname + p.search ||
                h.search !== p.search ||
                qd(G, X),
          }
        )
      );
    }),
    C = [];
  return (
    f.forEach((O, D) => {
      if (i || !n.some((Ve) => Ve.route.id === O.routeId) || c.has(D)) return;
      let H = qt(E, O.path, S);
      if (!H) {
        C.push({
          key: D,
          routeId: O.routeId,
          path: O.path,
          matches: null,
          match: null,
          controller: null,
        });
        return;
      }
      let G = t.fetchers.get(D),
        X = La(H, O.path),
        he = !1;
      d.has(D)
        ? (he = !1)
        : s.includes(D)
        ? (he = !0)
        : G && G.state !== "idle" && G.data === void 0
        ? (he = a)
        : (he = fc(
            X,
            le(
              {
                currentUrl: h,
                currentParams: t.matches[t.matches.length - 1].params,
                nextUrl: p,
                nextParams: n[n.length - 1].params,
              },
              r,
              {
                actionResult: P,
                unstable_actionStatus: L,
                defaultShouldRevalidate: M ? !1 : a,
              }
            )
          )),
        he &&
          C.push({
            key: D,
            routeId: O.routeId,
            path: O.path,
            matches: H,
            match: X,
            controller: new AbortController(),
          });
    }),
    [m, C]
  );
}
function Gv(e, t, n) {
  let r = !t || n.route.id !== t.route.id,
    l = e[n.route.id] === void 0;
  return r || l;
}
function qd(e, t) {
  let n = e.route.path;
  return (
    e.pathname !== t.pathname ||
    (n != null && n.endsWith("*") && e.params["*"] !== t.params["*"])
  );
}
function fc(e, t) {
  if (e.route.shouldRevalidate) {
    let n = e.route.shouldRevalidate(t);
    if (typeof n == "boolean") return n;
  }
  return t.defaultShouldRevalidate;
}
async function dc(e, t, n) {
  if (!e.lazy) return;
  let r = await e.lazy();
  if (!e.lazy) return;
  let l = n[e.id];
  W(l, "No route found in manifest");
  let i = {};
  for (let o in r) {
    let u = l[o] !== void 0 && o !== "hasErrorBoundary";
    sr(
      !u,
      'Route "' +
        l.id +
        '" has a static property "' +
        o +
        '" defined but its lazy function is also returning a value for this property. ' +
        ('The lazy route property "' + o + '" will be ignored.')
    ),
      !u && !gv.has(o) && (i[o] = r[o]);
  }
  Object.assign(l, i), Object.assign(l, le({}, t(l), { lazy: void 0 }));
}
function Zv(e) {
  return Promise.all(e.matches.map((t) => t.resolve()));
}
async function qv(e, t, n, r, l, i, o, a) {
  let u = r.reduce((f, d) => f.add(d.route.id), new Set()),
    s = new Set(),
    c = await e({
      matches: l.map((f) => {
        let d = u.has(f.route.id);
        return le({}, f, {
          shouldLoad: d,
          resolve: (S) => (
            s.add(f.route.id),
            d
              ? bv(t, n, f, i, o, S, a)
              : Promise.resolve({ type: ie.data, result: void 0 })
          ),
        });
      }),
      request: n,
      params: l[0].params,
      context: a,
    });
  return (
    l.forEach((f) =>
      W(
        s.has(f.route.id),
        '`match.resolve()` was not called for route id "' +
          f.route.id +
          '". You must call `match.resolve()` on every match passed to `dataStrategy` to ensure all routes are properly loaded.'
      )
    ),
    c.filter((f, d) => u.has(l[d].route.id))
  );
}
async function bv(e, t, n, r, l, i, o) {
  let a,
    u,
    s = (c) => {
      let f,
        d = new Promise((w, P) => (f = P));
      (u = () => f()), t.signal.addEventListener("abort", u);
      let E = (w) =>
          typeof c != "function"
            ? Promise.reject(
                new Error(
                  "You cannot call the handler for a route which defines a boolean " +
                    ('"' + e + '" [routeId: ' + n.route.id + "]")
                )
              )
            : c(
                { request: t, params: n.params, context: o },
                ...(w !== void 0 ? [w] : [])
              ),
        S;
      return (
        i
          ? (S = i((w) => E(w)))
          : (S = (async () => {
              try {
                return { type: "data", result: await E() };
              } catch (w) {
                return { type: "error", result: w };
              }
            })()),
        Promise.race([S, d])
      );
    };
  try {
    let c = n.route[e];
    if (n.route.lazy)
      if (c) {
        let f,
          [d] = await Promise.all([
            s(c).catch((E) => {
              f = E;
            }),
            dc(n.route, l, r),
          ]);
        if (f !== void 0) throw f;
        a = d;
      } else if ((await dc(n.route, l, r), (c = n.route[e]), c)) a = await s(c);
      else if (e === "action") {
        let f = new URL(t.url),
          d = f.pathname + f.search;
        throw rt(405, { method: t.method, pathname: d, routeId: n.route.id });
      } else return { type: ie.data, result: void 0 };
    else if (c) a = await s(c);
    else {
      let f = new URL(t.url),
        d = f.pathname + f.search;
      throw rt(404, { pathname: d });
    }
    W(
      a.result !== void 0,
      "You defined " +
        (e === "action" ? "an action" : "a loader") +
        " for route " +
        ('"' +
          n.route.id +
          "\" but didn't return anything from your `" +
          e +
          "` ") +
        "function. Please return a value or `null`."
    );
  } catch (c) {
    return { type: ie.error, result: c };
  } finally {
    u && t.signal.removeEventListener("abort", u);
  }
  return a;
}
async function ey(e) {
  let { result: t, type: n, status: r } = e;
  if (ep(t)) {
    let o;
    try {
      let a = t.headers.get("Content-Type");
      a && /\bapplication\/json\b/.test(a)
        ? t.body == null
          ? (o = null)
          : (o = await t.json())
        : (o = await t.text());
    } catch (a) {
      return { type: ie.error, error: a };
    }
    return n === ie.error
      ? {
          type: ie.error,
          error: new Tu(t.status, t.statusText, o),
          statusCode: t.status,
          headers: t.headers,
        }
      : { type: ie.data, data: o, statusCode: t.status, headers: t.headers };
  }
  if (n === ie.error)
    return { type: ie.error, error: t, statusCode: Nu(t) ? t.status : r };
  if (iy(t)) {
    var l, i;
    return {
      type: ie.deferred,
      deferredData: t,
      statusCode: (l = t.init) == null ? void 0 : l.status,
      headers:
        ((i = t.init) == null ? void 0 : i.headers) &&
        new Headers(t.init.headers),
    };
  }
  return { type: ie.data, data: t, statusCode: r };
}
function ty(e, t, n, r, l, i) {
  let o = e.headers.get("Location");
  if (
    (W(
      o,
      "Redirects returned/thrown from loaders/actions must have a Location header"
    ),
    !Du.test(o))
  ) {
    let a = r.slice(0, r.findIndex((u) => u.route.id === n) + 1);
    (o = Pa(new URL(t.url), a, l, !0, o, i)), e.headers.set("Location", o);
  }
  return e;
}
function pc(e, t, n) {
  if (Du.test(e)) {
    let r = e,
      l = r.startsWith("//") ? new URL(t.protocol + r) : new URL(r),
      i = Rt(l.pathname, n) != null;
    if (l.origin === t.origin && i) return l.pathname + l.search + l.hash;
  }
  return e;
}
function In(e, t, n, r) {
  let l = e.createURL(bd(t)).toString(),
    i = { signal: n };
  if (r && vt(r.formMethod)) {
    let { formMethod: o, formEncType: a } = r;
    (i.method = o.toUpperCase()),
      a === "application/json"
        ? ((i.headers = new Headers({ "Content-Type": a })),
          (i.body = JSON.stringify(r.json)))
        : a === "text/plain"
        ? (i.body = r.text)
        : a === "application/x-www-form-urlencoded" && r.formData
        ? (i.body = Ra(r.formData))
        : (i.body = r.formData);
  }
  return new Request(l, i);
}
function Ra(e) {
  let t = new URLSearchParams();
  for (let [n, r] of e.entries())
    t.append(n, typeof r == "string" ? r : r.name);
  return t;
}
function hc(e) {
  let t = new FormData();
  for (let [n, r] of e.entries()) t.append(n, r);
  return t;
}
function ny(e, t, n, r, l, i) {
  let o = {},
    a = null,
    u,
    s = !1,
    c = {},
    f = r && ot(r[1]) ? r[1].error : void 0;
  return (
    n.forEach((d, E) => {
      let S = t[E].route.id;
      if (
        (W(!kn(d), "Cannot handle redirect results in processLoaderData"),
        ot(d))
      ) {
        let w = d.error;
        f !== void 0 && ((w = f), (f = void 0)), (a = a || {});
        {
          let P = Yr(e, S);
          a[P.route.id] == null && (a[P.route.id] = w);
        }
        (o[S] = void 0),
          s || ((s = !0), (u = Nu(d.error) ? d.error.status : 500)),
          d.headers && (c[S] = d.headers);
      } else
        En(d)
          ? (l.set(S, d.deferredData),
            (o[S] = d.deferredData.data),
            d.statusCode != null &&
              d.statusCode !== 200 &&
              !s &&
              (u = d.statusCode),
            d.headers && (c[S] = d.headers))
          : ((o[S] = d.data),
            d.statusCode && d.statusCode !== 200 && !s && (u = d.statusCode),
            d.headers && (c[S] = d.headers));
    }),
    f !== void 0 && r && ((a = { [r[0]]: f }), (o[r[0]] = void 0)),
    { loaderData: o, errors: a, statusCode: u || 200, loaderHeaders: c }
  );
}
function mc(e, t, n, r, l, i, o, a) {
  let { loaderData: u, errors: s } = ny(t, n, r, l, a);
  for (let c = 0; c < i.length; c++) {
    let { key: f, match: d, controller: E } = i[c];
    W(
      o !== void 0 && o[c] !== void 0,
      "Did not find corresponding fetcher result"
    );
    let S = o[c];
    if (!(E && E.signal.aborted))
      if (ot(S)) {
        let w = Yr(e.matches, d == null ? void 0 : d.route.id);
        (s && s[w.route.id]) || (s = le({}, s, { [w.route.id]: S.error })),
          e.fetchers.delete(f);
      } else if (kn(S)) W(!1, "Unhandled fetcher revalidation redirect");
      else if (En(S)) W(!1, "Unhandled fetcher deferred data");
      else {
        let w = Kt(S.data);
        e.fetchers.set(f, w);
      }
  }
  return { loaderData: u, errors: s };
}
function vc(e, t, n, r) {
  let l = le({}, t);
  for (let i of n) {
    let o = i.route.id;
    if (
      (t.hasOwnProperty(o)
        ? t[o] !== void 0 && (l[o] = t[o])
        : e[o] !== void 0 && i.route.loader && (l[o] = e[o]),
      r && r.hasOwnProperty(o))
    )
      break;
  }
  return l;
}
function yc(e) {
  return e
    ? ot(e[1])
      ? { actionData: {} }
      : { actionData: { [e[0]]: e[1].data } }
    : {};
}
function Yr(e, t) {
  return (
    (t ? e.slice(0, e.findIndex((r) => r.route.id === t) + 1) : [...e])
      .reverse()
      .find((r) => r.route.hasErrorBoundary === !0) || e[0]
  );
}
function gc(e) {
  let t =
    e.length === 1
      ? e[0]
      : e.find((n) => n.index || !n.path || n.path === "/") || {
          id: "__shim-error-route__",
        };
  return {
    matches: [{ params: {}, pathname: "", pathnameBase: "", route: t }],
    route: t,
  };
}
function rt(e, t) {
  let { pathname: n, routeId: r, method: l, type: i } = t === void 0 ? {} : t,
    o = "Unknown Server Error",
    a = "Unknown @remix-run/router error";
  return (
    e === 400
      ? ((o = "Bad Request"),
        l && n && r
          ? (a =
              "You made a " +
              l +
              ' request to "' +
              n +
              '" but ' +
              ('did not provide a `loader` for route "' + r + '", ') +
              "so there is no way to handle the request.")
          : i === "defer-action"
          ? (a = "defer() is not supported in actions")
          : i === "invalid-body" && (a = "Unable to encode submission body"))
      : e === 403
      ? ((o = "Forbidden"),
        (a = 'Route "' + r + '" does not match URL "' + n + '"'))
      : e === 404
      ? ((o = "Not Found"), (a = 'No route matches URL "' + n + '"'))
      : e === 405 &&
        ((o = "Method Not Allowed"),
        l && n && r
          ? (a =
              "You made a " +
              l.toUpperCase() +
              ' request to "' +
              n +
              '" but ' +
              ('did not provide an `action` for route "' + r + '", ') +
              "so there is no way to handle the request.")
          : l && (a = 'Invalid request method "' + l.toUpperCase() + '"')),
    new Tu(e || 500, o, new Error(a), !0)
  );
}
function wc(e) {
  for (let t = e.length - 1; t >= 0; t--) {
    let n = e[t];
    if (kn(n)) return { result: n, idx: t };
  }
}
function bd(e) {
  let t = typeof e == "string" ? $t(e) : e;
  return Nn(le({}, t, { hash: "" }));
}
function ry(e, t) {
  return e.pathname !== t.pathname || e.search !== t.search
    ? !1
    : e.hash === ""
    ? t.hash !== ""
    : e.hash === t.hash
    ? !0
    : t.hash !== "";
}
function ly(e) {
  return ep(e.result) && Wv.has(e.result.status);
}
function En(e) {
  return e.type === ie.deferred;
}
function ot(e) {
  return e.type === ie.error;
}
function kn(e) {
  return (e && e.type) === ie.redirect;
}
function iy(e) {
  let t = e;
  return (
    t &&
    typeof t == "object" &&
    typeof t.data == "object" &&
    typeof t.subscribe == "function" &&
    typeof t.cancel == "function" &&
    typeof t.resolveData == "function"
  );
}
function ep(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.headers == "object" &&
    typeof e.body < "u"
  );
}
function oy(e) {
  return Vv.has(e.toLowerCase());
}
function vt(e) {
  return Bv.has(e.toLowerCase());
}
async function Sc(e, t, n, r, l, i) {
  for (let o = 0; o < n.length; o++) {
    let a = n[o],
      u = t[o];
    if (!u) continue;
    let s = e.find((f) => f.route.id === u.route.id),
      c = s != null && !qd(s, u) && (i && i[u.route.id]) !== void 0;
    if (En(a) && (l || c)) {
      let f = r[o];
      W(f, "Expected an AbortSignal for revalidating fetcher deferred result"),
        await tp(a, f, l).then((d) => {
          d && (n[o] = d || n[o]);
        });
    }
  }
}
async function tp(e, t, n) {
  if ((n === void 0 && (n = !1), !(await e.deferredData.resolveData(t)))) {
    if (n)
      try {
        return { type: ie.data, data: e.deferredData.unwrappedData };
      } catch (l) {
        return { type: ie.error, error: l };
      }
    return { type: ie.data, data: e.deferredData.data };
  }
}
function Mu(e) {
  return new URLSearchParams(e).getAll("index").some((t) => t === "");
}
function La(e, t) {
  let n = typeof t == "string" ? $t(t).search : t.search;
  if (e[e.length - 1].route.index && Mu(n || "")) return e[e.length - 1];
  let r = Xd(e);
  return r[r.length - 1];
}
function Ec(e) {
  let {
    formMethod: t,
    formAction: n,
    formEncType: r,
    text: l,
    formData: i,
    json: o,
  } = e;
  if (!(!t || !n || !r)) {
    if (l != null)
      return {
        formMethod: t,
        formAction: n,
        formEncType: r,
        formData: void 0,
        json: void 0,
        text: l,
      };
    if (i != null)
      return {
        formMethod: t,
        formAction: n,
        formEncType: r,
        formData: i,
        json: void 0,
        text: void 0,
      };
    if (o !== void 0)
      return {
        formMethod: t,
        formAction: n,
        formEncType: r,
        formData: void 0,
        json: o,
        text: void 0,
      };
  }
}
function No(e, t) {
  return t
    ? {
        state: "loading",
        location: e,
        formMethod: t.formMethod,
        formAction: t.formAction,
        formEncType: t.formEncType,
        formData: t.formData,
        json: t.json,
        text: t.text,
      }
    : {
        state: "loading",
        location: e,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
      };
}
function ay(e, t) {
  return {
    state: "submitting",
    location: e,
    formMethod: t.formMethod,
    formAction: t.formAction,
    formEncType: t.formEncType,
    formData: t.formData,
    json: t.json,
    text: t.text,
  };
}
function Dr(e, t) {
  return e
    ? {
        state: "loading",
        formMethod: e.formMethod,
        formAction: e.formAction,
        formEncType: e.formEncType,
        formData: e.formData,
        json: e.json,
        text: e.text,
        data: t,
      }
    : {
        state: "loading",
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
        data: t,
      };
}
function uy(e, t) {
  return {
    state: "submitting",
    formMethod: e.formMethod,
    formAction: e.formAction,
    formEncType: e.formEncType,
    formData: e.formData,
    json: e.json,
    text: e.text,
    data: t ? t.data : void 0,
  };
}
function Kt(e) {
  return {
    state: "idle",
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data: e,
  };
}
function sy(e, t) {
  try {
    let n = e.sessionStorage.getItem(Zd);
    if (n) {
      let r = JSON.parse(n);
      for (let [l, i] of Object.entries(r || {}))
        i && Array.isArray(i) && t.set(l, new Set(i || []));
    }
  } catch {}
}
function cy(e, t) {
  if (t.size > 0) {
    let n = {};
    for (let [r, l] of t) n[r] = [...l];
    try {
      e.sessionStorage.setItem(Zd, JSON.stringify(n));
    } catch (r) {
      sr(
        !1,
        "Failed to save applied view transitions in sessionStorage (" + r + ")."
      );
    }
  }
}
/**
 * React Router v6.23.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Di() {
  return (
    (Di = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Di.apply(this, arguments)
  );
}
const hr = y.createContext(null),
  gl = y.createContext(null),
  Mi = y.createContext(null),
  At = y.createContext(null),
  Ou = y.createContext(null),
  pn = y.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  np = y.createContext(null);
function zu(e, t) {
  let { relative: n } = t === void 0 ? {} : t;
  wl() || W(!1);
  let { basename: r, navigator: l } = y.useContext(At),
    { hash: i, pathname: o, search: a } = Gi(e, { relative: n }),
    u = o;
  return (
    r !== "/" && (u = o === "/" ? r : Ot([r, o])),
    l.createHref({ pathname: u, search: a, hash: i })
  );
}
function wl() {
  return y.useContext(Ou) != null;
}
function hn() {
  return wl() || W(!1), y.useContext(Ou).location;
}
function rp(e) {
  y.useContext(At).static || y.useLayoutEffect(e);
}
function fy() {
  let { isDataRoute: e } = y.useContext(pn);
  return e ? Ry() : dy();
}
function dy() {
  wl() || W(!1);
  let e = y.useContext(hr),
    { basename: t, future: n, navigator: r } = y.useContext(At),
    { matches: l } = y.useContext(pn),
    { pathname: i } = hn(),
    o = JSON.stringify(Ru(l, n.v7_relativeSplatPath)),
    a = y.useRef(!1);
  return (
    rp(() => {
      a.current = !0;
    }),
    y.useCallback(
      function (s, c) {
        if ((c === void 0 && (c = {}), !a.current)) return;
        if (typeof s == "number") {
          r.go(s);
          return;
        }
        let f = Lu(s, JSON.parse(o), i, c.relative === "path");
        e == null &&
          t !== "/" &&
          (f.pathname = f.pathname === "/" ? t : Ot([t, f.pathname])),
          (c.replace ? r.replace : r.push)(f, c.state, c);
      },
      [t, r, o, i, e]
    )
  );
}
const py = y.createContext(null);
function hy(e) {
  let t = y.useContext(pn).outlet;
  return t && y.createElement(py.Provider, { value: e }, t);
}
function Gi(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: r } = y.useContext(At),
    { matches: l } = y.useContext(pn),
    { pathname: i } = hn(),
    o = JSON.stringify(Ru(l, r.v7_relativeSplatPath));
  return y.useMemo(() => Lu(e, JSON.parse(o), i, n === "path"), [e, o, i, n]);
}
function my(e, t, n, r) {
  wl() || W(!1);
  let { navigator: l } = y.useContext(At),
    { matches: i } = y.useContext(pn),
    o = i[i.length - 1],
    a = o ? o.params : {};
  o && o.pathname;
  let u = o ? o.pathnameBase : "/";
  o && o.route;
  let s = hn(),
    c;
  c = s;
  let f = c.pathname || "/",
    d = f;
  if (u !== "/") {
    let w = u.replace(/^\//, "").split("/");
    d = "/" + f.replace(/^\//, "").split("/").slice(w.length).join("/");
  }
  let E = qt(e, { pathname: d });
  return Sy(
    E &&
      E.map((w) =>
        Object.assign({}, w, {
          params: Object.assign({}, a, w.params),
          pathname: Ot([
            u,
            l.encodeLocation
              ? l.encodeLocation(w.pathname).pathname
              : w.pathname,
          ]),
          pathnameBase:
            w.pathnameBase === "/"
              ? u
              : Ot([
                  u,
                  l.encodeLocation
                    ? l.encodeLocation(w.pathnameBase).pathname
                    : w.pathnameBase,
                ]),
        })
      ),
    i,
    n,
    r
  );
}
function vy() {
  let e = _y(),
    t = Nu(e)
      ? e.status + " " + e.statusText
      : e instanceof Error
      ? e.message
      : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    l = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" };
  return y.createElement(
    y.Fragment,
    null,
    y.createElement("h2", null, "Unexpected Application Error!"),
    y.createElement("h3", { style: { fontStyle: "italic" } }, t),
    n ? y.createElement("pre", { style: l }, n) : null,
    null
  );
}
const yy = y.createElement(vy, null);
class gy extends y.Component {
  constructor(t) {
    super(t),
      (this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error,
      });
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location ||
      (n.revalidation !== "idle" && t.revalidation === "idle")
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        };
  }
  componentDidCatch(t, n) {
    console.error(
      "React Router caught the following error during render",
      t,
      n
    );
  }
  render() {
    return this.state.error !== void 0
      ? y.createElement(
          pn.Provider,
          { value: this.props.routeContext },
          y.createElement(np.Provider, {
            value: this.state.error,
            children: this.props.component,
          })
        )
      : this.props.children;
  }
}
function wy(e) {
  let { routeContext: t, match: n, children: r } = e,
    l = y.useContext(hr);
  return (
    l &&
      l.static &&
      l.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (l.staticContext._deepestRenderedBoundaryId = n.route.id),
    y.createElement(pn.Provider, { value: t }, r)
  );
}
function Sy(e, t, n, r) {
  var l;
  if (
    (t === void 0 && (t = []),
    n === void 0 && (n = null),
    r === void 0 && (r = null),
    e == null)
  ) {
    var i;
    if ((i = n) != null && i.errors) e = n.matches;
    else return null;
  }
  let o = e,
    a = (l = n) == null ? void 0 : l.errors;
  if (a != null) {
    let c = o.findIndex(
      (f) => f.route.id && (a == null ? void 0 : a[f.route.id]) !== void 0
    );
    c >= 0 || W(!1), (o = o.slice(0, Math.min(o.length, c + 1)));
  }
  let u = !1,
    s = -1;
  if (n && r && r.v7_partialHydration)
    for (let c = 0; c < o.length; c++) {
      let f = o[c];
      if (
        ((f.route.HydrateFallback || f.route.hydrateFallbackElement) && (s = c),
        f.route.id)
      ) {
        let { loaderData: d, errors: E } = n,
          S =
            f.route.loader &&
            d[f.route.id] === void 0 &&
            (!E || E[f.route.id] === void 0);
        if (f.route.lazy || S) {
          (u = !0), s >= 0 ? (o = o.slice(0, s + 1)) : (o = [o[0]]);
          break;
        }
      }
    }
  return o.reduceRight((c, f, d) => {
    let E,
      S = !1,
      w = null,
      P = null;
    n &&
      ((E = a && f.route.id ? a[f.route.id] : void 0),
      (w = f.route.errorElement || yy),
      u &&
        (s < 0 && d === 0
          ? ((S = !0), (P = null))
          : s === d &&
            ((S = !0), (P = f.route.hydrateFallbackElement || null))));
    let h = t.concat(o.slice(0, d + 1)),
      p = () => {
        let v;
        return (
          E
            ? (v = w)
            : S
            ? (v = P)
            : f.route.Component
            ? (v = y.createElement(f.route.Component, null))
            : f.route.element
            ? (v = f.route.element)
            : (v = c),
          y.createElement(wy, {
            match: f,
            routeContext: { outlet: c, matches: h, isDataRoute: n != null },
            children: v,
          })
        );
      };
    return n && (f.route.ErrorBoundary || f.route.errorElement || d === 0)
      ? y.createElement(gy, {
          location: n.location,
          revalidation: n.revalidation,
          component: w,
          error: E,
          children: p(),
          routeContext: { outlet: null, matches: h, isDataRoute: !0 },
        })
      : p();
  }, null);
}
var lp = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      e
    );
  })(lp || {}),
  cr = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseLoaderData = "useLoaderData"),
      (e.UseActionData = "useActionData"),
      (e.UseRouteError = "useRouteError"),
      (e.UseNavigation = "useNavigation"),
      (e.UseRouteLoaderData = "useRouteLoaderData"),
      (e.UseMatches = "useMatches"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      (e.UseRouteId = "useRouteId"),
      e
    );
  })(cr || {});
function Ey(e) {
  let t = y.useContext(hr);
  return t || W(!1), t;
}
function ju(e) {
  let t = y.useContext(gl);
  return t || W(!1), t;
}
function ky(e) {
  let t = y.useContext(pn);
  return t || W(!1), t;
}
function ip(e) {
  let t = ky(),
    n = t.matches[t.matches.length - 1];
  return n.route.id || W(!1), n.route.id;
}
function op() {
  return ju(cr.UseNavigation).navigation;
}
function xy() {
  let { matches: e, loaderData: t } = ju(cr.UseMatches);
  return y.useMemo(() => e.map((n) => Qd(n, t)), [e, t]);
}
function _y() {
  var e;
  let t = y.useContext(np),
    n = ju(cr.UseRouteError),
    r = ip(cr.UseRouteError);
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[r];
}
function Cy() {
  let e = y.useContext(Mi);
  return e == null ? void 0 : e._data;
}
function Py() {
  let e = y.useContext(Mi);
  return e == null ? void 0 : e._error;
}
function Ry() {
  let { router: e } = Ey(lp.UseNavigateStable),
    t = ip(cr.UseNavigateStable),
    n = y.useRef(!1);
  return (
    rp(() => {
      n.current = !0;
    }),
    y.useCallback(
      function (l, i) {
        i === void 0 && (i = {}),
          n.current &&
            (typeof l == "number"
              ? e.navigate(l)
              : e.navigate(l, Di({ fromRouteId: t }, i)));
      },
      [e, t]
    )
  );
}
function Zg(e) {
  return hy(e.context);
}
function Ly(e) {
  let {
    basename: t = "/",
    children: n = null,
    location: r,
    navigationType: l = de.Pop,
    navigator: i,
    static: o = !1,
    future: a,
  } = e;
  wl() && W(!1);
  let u = t.replace(/^\/*/, "/"),
    s = y.useMemo(
      () => ({
        basename: u,
        navigator: i,
        static: o,
        future: Di({ v7_relativeSplatPath: !1 }, a),
      }),
      [u, a, i, o]
    );
  typeof r == "string" && (r = $t(r));
  let {
      pathname: c = "/",
      search: f = "",
      hash: d = "",
      state: E = null,
      key: S = "default",
    } = r,
    w = y.useMemo(() => {
      let P = Rt(c, u);
      return P == null
        ? null
        : {
            location: { pathname: P, search: f, hash: d, state: E, key: S },
            navigationType: l,
          };
    }, [u, c, f, d, E, S, l]);
  return w == null
    ? null
    : y.createElement(
        At.Provider,
        { value: s },
        y.createElement(Ou.Provider, { children: n, value: w })
      );
}
function Ty(e) {
  let { children: t, errorElement: n, resolve: r } = e;
  return y.createElement(
    Dy,
    { resolve: r, errorElement: n },
    y.createElement(My, null, t)
  );
}
var nt = (function (e) {
  return (
    (e[(e.pending = 0)] = "pending"),
    (e[(e.success = 1)] = "success"),
    (e[(e.error = 2)] = "error"),
    e
  );
})(nt || {});
const Ny = new Promise(() => {});
class Dy extends y.Component {
  constructor(t) {
    super(t), (this.state = { error: null });
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  componentDidCatch(t, n) {
    console.error("<Await> caught the following error during render", t, n);
  }
  render() {
    let { children: t, errorElement: n, resolve: r } = this.props,
      l = null,
      i = nt.pending;
    if (!(r instanceof Promise))
      (i = nt.success),
        (l = Promise.resolve()),
        Object.defineProperty(l, "_tracked", { get: () => !0 }),
        Object.defineProperty(l, "_data", { get: () => r });
    else if (this.state.error) {
      i = nt.error;
      let o = this.state.error;
      (l = Promise.reject().catch(() => {})),
        Object.defineProperty(l, "_tracked", { get: () => !0 }),
        Object.defineProperty(l, "_error", { get: () => o });
    } else
      r._tracked
        ? ((l = r),
          (i =
            "_error" in l ? nt.error : "_data" in l ? nt.success : nt.pending))
        : ((i = nt.pending),
          Object.defineProperty(r, "_tracked", { get: () => !0 }),
          (l = r.then(
            (o) => Object.defineProperty(r, "_data", { get: () => o }),
            (o) => Object.defineProperty(r, "_error", { get: () => o })
          )));
    if (i === nt.error && l._error instanceof Ni) throw Ny;
    if (i === nt.error && !n) throw l._error;
    if (i === nt.error)
      return y.createElement(Mi.Provider, { value: l, children: n });
    if (i === nt.success)
      return y.createElement(Mi.Provider, { value: l, children: t });
    throw l;
  }
}
function My(e) {
  let { children: t } = e,
    n = Cy(),
    r = typeof t == "function" ? t(n) : t;
  return y.createElement(y.Fragment, null, r);
}
function qg(e) {
  let t = {
    hasErrorBoundary: e.ErrorBoundary != null || e.errorElement != null,
  };
  return (
    e.Component &&
      Object.assign(t, {
        element: y.createElement(e.Component),
        Component: void 0,
      }),
    e.HydrateFallback &&
      Object.assign(t, {
        hydrateFallbackElement: y.createElement(e.HydrateFallback),
        HydrateFallback: void 0,
      }),
    e.ErrorBoundary &&
      Object.assign(t, {
        errorElement: y.createElement(e.ErrorBoundary),
        ErrorBoundary: void 0,
      }),
    t
  );
}
/**
 * React Router DOM v6.23.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function dl() {
  return (
    (dl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    dl.apply(this, arguments)
  );
}
function ap(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    l,
    i;
  for (i = 0; i < r.length; i++)
    (l = r[i]), !(t.indexOf(l) >= 0) && (n[l] = e[l]);
  return n;
}
function Oy(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function zy(e, t) {
  return e.button === 0 && (!t || t === "_self") && !Oy(e);
}
const jy = [
    "onClick",
    "relative",
    "reloadDocument",
    "replace",
    "state",
    "target",
    "to",
    "preventScrollReset",
    "unstable_viewTransition",
  ],
  Fy = [
    "aria-current",
    "caseSensitive",
    "className",
    "end",
    "style",
    "to",
    "unstable_viewTransition",
    "children",
  ],
  Iy = "6";
try {
  window.__reactRouterVersion = Iy;
} catch {}
const up = y.createContext({ isTransitioning: !1 }),
  Uy = y.createContext(new Map()),
  $y = "startTransition",
  kc = rh[$y],
  Ay = "flushSync",
  xc = mv[Ay];
function By(e) {
  kc ? kc(e) : e();
}
function Mr(e) {
  xc ? xc(e) : e();
}
let Hy = class {
  constructor() {
    (this.status = "pending"),
      (this.promise = new Promise((t, n) => {
        (this.resolve = (r) => {
          this.status === "pending" && ((this.status = "resolved"), t(r));
        }),
          (this.reject = (r) => {
            this.status === "pending" && ((this.status = "rejected"), n(r));
          });
      }));
  }
};
function e0(e) {
  let { fallbackElement: t, router: n, future: r } = e,
    [l, i] = y.useState(n.state),
    [o, a] = y.useState(),
    [u, s] = y.useState({ isTransitioning: !1 }),
    [c, f] = y.useState(),
    [d, E] = y.useState(),
    [S, w] = y.useState(),
    P = y.useRef(new Map()),
    { v7_startTransition: h } = r || {},
    p = y.useCallback(
      (m) => {
        h ? By(m) : m();
      },
      [h]
    ),
    v = y.useCallback(
      (m, C) => {
        let {
          deletedFetchers: O,
          unstable_flushSync: D,
          unstable_viewTransitionOpts: H,
        } = C;
        O.forEach((X) => P.current.delete(X)),
          m.fetchers.forEach((X, he) => {
            X.data !== void 0 && P.current.set(he, X.data);
          });
        let G =
          n.window == null ||
          n.window.document == null ||
          typeof n.window.document.startViewTransition != "function";
        if (!H || G) {
          D ? Mr(() => i(m)) : p(() => i(m));
          return;
        }
        if (D) {
          Mr(() => {
            d && (c && c.resolve(), d.skipTransition()),
              s({
                isTransitioning: !0,
                flushSync: !0,
                currentLocation: H.currentLocation,
                nextLocation: H.nextLocation,
              });
          });
          let X = n.window.document.startViewTransition(() => {
            Mr(() => i(m));
          });
          X.finished.finally(() => {
            Mr(() => {
              f(void 0), E(void 0), a(void 0), s({ isTransitioning: !1 });
            });
          }),
            Mr(() => E(X));
          return;
        }
        d
          ? (c && c.resolve(),
            d.skipTransition(),
            w({
              state: m,
              currentLocation: H.currentLocation,
              nextLocation: H.nextLocation,
            }))
          : (a(m),
            s({
              isTransitioning: !0,
              flushSync: !1,
              currentLocation: H.currentLocation,
              nextLocation: H.nextLocation,
            }));
      },
      [n.window, d, c, P, p]
    );
  y.useLayoutEffect(() => n.subscribe(v), [n, v]),
    y.useEffect(() => {
      u.isTransitioning && !u.flushSync && f(new Hy());
    }, [u]),
    y.useEffect(() => {
      if (c && o && n.window) {
        let m = o,
          C = c.promise,
          O = n.window.document.startViewTransition(async () => {
            p(() => i(m)), await C;
          });
        O.finished.finally(() => {
          f(void 0), E(void 0), a(void 0), s({ isTransitioning: !1 });
        }),
          E(O);
      }
    }, [p, o, c, n.window]),
    y.useEffect(() => {
      c && o && l.location.key === o.location.key && c.resolve();
    }, [c, d, l.location, o]),
    y.useEffect(() => {
      !u.isTransitioning &&
        S &&
        (a(S.state),
        s({
          isTransitioning: !0,
          flushSync: !1,
          currentLocation: S.currentLocation,
          nextLocation: S.nextLocation,
        }),
        w(void 0));
    }, [u.isTransitioning, S]),
    y.useEffect(() => {}, []);
  let x = y.useMemo(
      () => ({
        createHref: n.createHref,
        encodeLocation: n.encodeLocation,
        go: (m) => n.navigate(m),
        push: (m, C, O) =>
          n.navigate(m, {
            state: C,
            preventScrollReset: O == null ? void 0 : O.preventScrollReset,
          }),
        replace: (m, C, O) =>
          n.navigate(m, {
            replace: !0,
            state: C,
            preventScrollReset: O == null ? void 0 : O.preventScrollReset,
          }),
      }),
      [n]
    ),
    L = n.basename || "/",
    M = y.useMemo(
      () => ({ router: n, navigator: x, static: !1, basename: L }),
      [n, x, L]
    );
  return y.createElement(
    y.Fragment,
    null,
    y.createElement(
      hr.Provider,
      { value: M },
      y.createElement(
        gl.Provider,
        { value: l },
        y.createElement(
          Uy.Provider,
          { value: P.current },
          y.createElement(
            up.Provider,
            { value: u },
            y.createElement(
              Ly,
              {
                basename: L,
                location: l.location,
                navigationType: l.historyAction,
                navigator: x,
                future: { v7_relativeSplatPath: n.future.v7_relativeSplatPath },
              },
              l.initialized || n.future.v7_partialHydration
                ? y.createElement(Vy, {
                    routes: n.routes,
                    future: n.future,
                    state: l,
                  })
                : t
            )
          )
        )
      )
    ),
    null
  );
}
function Vy(e) {
  let { routes: t, future: n, state: r } = e;
  return my(t, void 0, r, n);
}
const Wy =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  Ky = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  sp = y.forwardRef(function (t, n) {
    let {
        onClick: r,
        relative: l,
        reloadDocument: i,
        replace: o,
        state: a,
        target: u,
        to: s,
        preventScrollReset: c,
        unstable_viewTransition: f,
      } = t,
      d = ap(t, jy),
      { basename: E } = y.useContext(At),
      S,
      w = !1;
    if (typeof s == "string" && Ky.test(s) && ((S = s), Wy))
      try {
        let v = new URL(window.location.href),
          x = s.startsWith("//") ? new URL(v.protocol + s) : new URL(s),
          L = Rt(x.pathname, E);
        x.origin === v.origin && L != null
          ? (s = L + x.search + x.hash)
          : (w = !0);
      } catch {}
    let P = zu(s, { relative: l }),
      h = Jy(s, {
        replace: o,
        state: a,
        target: u,
        preventScrollReset: c,
        relative: l,
        unstable_viewTransition: f,
      });
    function p(v) {
      r && r(v), v.defaultPrevented || h(v);
    }
    return y.createElement(
      "a",
      dl({}, d, { href: S || P, onClick: w || i ? r : p, ref: n, target: u })
    );
  }),
  Qy = y.forwardRef(function (t, n) {
    let {
        "aria-current": r = "page",
        caseSensitive: l = !1,
        className: i = "",
        end: o = !1,
        style: a,
        to: u,
        unstable_viewTransition: s,
        children: c,
      } = t,
      f = ap(t, Fy),
      d = Gi(u, { relative: f.relative }),
      E = hn(),
      S = y.useContext(gl),
      { navigator: w, basename: P } = y.useContext(At),
      h = S != null && Gy(d) && s === !0,
      p = w.encodeLocation ? w.encodeLocation(d).pathname : d.pathname,
      v = E.pathname,
      x =
        S && S.navigation && S.navigation.location
          ? S.navigation.location.pathname
          : null;
    l ||
      ((v = v.toLowerCase()),
      (x = x ? x.toLowerCase() : null),
      (p = p.toLowerCase())),
      x && P && (x = Rt(x, P) || x);
    const L = p !== "/" && p.endsWith("/") ? p.length - 1 : p.length;
    let M = v === p || (!o && v.startsWith(p) && v.charAt(L) === "/"),
      m =
        x != null &&
        (x === p || (!o && x.startsWith(p) && x.charAt(p.length) === "/")),
      C = { isActive: M, isPending: m, isTransitioning: h },
      O = M ? r : void 0,
      D;
    typeof i == "function"
      ? (D = i(C))
      : (D = [
          i,
          M ? "active" : null,
          m ? "pending" : null,
          h ? "transitioning" : null,
        ]
          .filter(Boolean)
          .join(" "));
    let H = typeof a == "function" ? a(C) : a;
    return y.createElement(
      sp,
      dl({}, f, {
        "aria-current": O,
        className: D,
        ref: n,
        style: H,
        to: u,
        unstable_viewTransition: s,
      }),
      typeof c == "function" ? c(C) : c
    );
  });
var Oi;
(function (e) {
  (e.UseScrollRestoration = "useScrollRestoration"),
    (e.UseSubmit = "useSubmit"),
    (e.UseSubmitFetcher = "useSubmitFetcher"),
    (e.UseFetcher = "useFetcher"),
    (e.useViewTransitionState = "useViewTransitionState");
})(Oi || (Oi = {}));
var Ta;
(function (e) {
  (e.UseFetcher = "useFetcher"),
    (e.UseFetchers = "useFetchers"),
    (e.UseScrollRestoration = "useScrollRestoration");
})(Ta || (Ta = {}));
function cp(e) {
  let t = y.useContext(hr);
  return t || W(!1), t;
}
function Yy(e) {
  let t = y.useContext(gl);
  return t || W(!1), t;
}
function Jy(e, t) {
  let {
      target: n,
      replace: r,
      state: l,
      preventScrollReset: i,
      relative: o,
      unstable_viewTransition: a,
    } = t === void 0 ? {} : t,
    u = fy(),
    s = hn(),
    c = Gi(e, { relative: o });
  return y.useCallback(
    (f) => {
      if (zy(f, n)) {
        f.preventDefault();
        let d = r !== void 0 ? r : Nn(s) === Nn(c);
        u(e, {
          replace: d,
          state: l,
          preventScrollReset: i,
          relative: o,
          unstable_viewTransition: a,
        });
      }
    },
    [s, u, c, r, l, n, e, i, o, a]
  );
}
const _c = "react-router-scroll-positions";
let Wl = {};
function t0(e) {
  let { getKey: t, storageKey: n } = e === void 0 ? {} : e,
    { router: r } = cp(Oi.UseScrollRestoration),
    { restoreScrollPosition: l, preventScrollReset: i } = Yy(
      Ta.UseScrollRestoration
    ),
    { basename: o } = y.useContext(At),
    a = hn(),
    u = xy(),
    s = op();
  y.useEffect(
    () => (
      (window.history.scrollRestoration = "manual"),
      () => {
        window.history.scrollRestoration = "auto";
      }
    ),
    []
  ),
    Xy(
      y.useCallback(() => {
        if (s.state === "idle") {
          let c = (t ? t(a, u) : null) || a.key;
          Wl[c] = window.scrollY;
        }
        try {
          sessionStorage.setItem(n || _c, JSON.stringify(Wl));
        } catch {}
        window.history.scrollRestoration = "auto";
      }, [n, t, s.state, a, u])
    ),
    typeof document < "u" &&
      (y.useLayoutEffect(() => {
        try {
          let c = sessionStorage.getItem(n || _c);
          c && (Wl = JSON.parse(c));
        } catch {}
      }, [n]),
      y.useLayoutEffect(() => {
        let c =
            t && o !== "/"
              ? (d, E) =>
                  t(dl({}, d, { pathname: Rt(d.pathname, o) || d.pathname }), E)
              : t,
          f =
            r == null
              ? void 0
              : r.enableScrollRestoration(Wl, () => window.scrollY, c);
        return () => f && f();
      }, [r, o, t]),
      y.useLayoutEffect(() => {
        if (l !== !1) {
          if (typeof l == "number") {
            window.scrollTo(0, l);
            return;
          }
          if (a.hash) {
            let c = document.getElementById(
              decodeURIComponent(a.hash.slice(1))
            );
            if (c) {
              c.scrollIntoView();
              return;
            }
          }
          i !== !0 && window.scrollTo(0, 0);
        }
      }, [a, l, i]));
}
function Xy(e, t) {
  let { capture: n } = {};
  y.useEffect(() => {
    let r = n != null ? { capture: n } : void 0;
    return (
      window.addEventListener("pagehide", e, r),
      () => {
        window.removeEventListener("pagehide", e, r);
      }
    );
  }, [e, n]);
}
function Gy(e, t) {
  t === void 0 && (t = {});
  let n = y.useContext(up);
  n == null && W(!1);
  let { basename: r } = cp(Oi.useViewTransitionState),
    l = Gi(e, { relative: t.relative });
  if (!n.isTransitioning) return !1;
  let i = Rt(n.currentLocation.pathname, r) || n.currentLocation.pathname,
    o = Rt(n.nextLocation.pathname, r) || n.nextLocation.pathname;
  return Ca(l.pathname, o) != null || Ca(l.pathname, i) != null;
}
var Zy = -1,
  qy = -2,
  by = -3,
  eg = -4,
  tg = -5,
  ng = -6,
  rg = -7,
  lg = "B",
  ig = "D",
  fp = "E",
  og = "M",
  ag = "N",
  dp = "P",
  ug = "R",
  sg = "S",
  cg = "Y",
  fg = "U",
  pp = class {
    constructor() {
      Pl(this, "promise");
      Pl(this, "resolve");
      Pl(this, "reject");
      this.promise = new Promise((e, t) => {
        (this.resolve = e), (this.reject = t);
      });
    }
  };
function dg() {
  const e = new TextDecoder();
  let t = "";
  return new TransformStream({
    transform(n, r) {
      const l = e.decode(n, { stream: !0 }),
        i = (t + l).split(`
`);
      t = i.pop() || "";
      for (const o of i) r.enqueue(o);
    },
    flush(n) {
      t && n.enqueue(t);
    },
  });
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Do =
  typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : void 0;
function Na(e) {
  const { hydrated: t, values: n } = this;
  if (typeof e == "number") return pt.call(this, e);
  if (!Array.isArray(e) || !e.length) throw new SyntaxError();
  const r = n.length;
  return n.push(...e), (t.length = n.length), pt.call(this, r);
}
function pt(e) {
  const { hydrated: t, values: n, deferred: r, plugins: l } = this;
  switch (e) {
    case rg:
      return;
    case tg:
      return null;
    case qy:
      return NaN;
    case ng:
      return 1 / 0;
    case by:
      return -1 / 0;
    case eg:
      return -0;
  }
  if (t[e]) return t[e];
  const i = n[e];
  if (!i || typeof i != "object") return (t[e] = i);
  if (Array.isArray(i))
    if (typeof i[0] == "string") {
      const [o, a, u] = i;
      switch (o) {
        case ig:
          return (t[e] = new Date(a));
        case fg:
          return (t[e] = new URL(a));
        case lg:
          return (t[e] = BigInt(a));
        case ug:
          return (t[e] = new RegExp(a, u));
        case cg:
          return (t[e] = Symbol.for(a));
        case sg:
          const s = new Set();
          t[e] = s;
          for (let w = 1; w < i.length; w++) s.add(pt.call(this, i[w]));
          return s;
        case og:
          const c = new Map();
          t[e] = c;
          for (let w = 1; w < i.length; w += 2)
            c.set(pt.call(this, i[w]), pt.call(this, i[w + 1]));
          return c;
        case ag:
          const f = Object.create(null);
          t[e] = f;
          for (const w in a) f[pt.call(this, Number(w))] = pt.call(this, a[w]);
          return f;
        case dp:
          if (t[a]) return (t[e] = t[a]);
          {
            const w = new pp();
            return (r[a] = w), (t[e] = w.promise);
          }
        case fp:
          const [, d, E] = i;
          let S = E && Do && Do[E] ? new Do[E](d) : new Error(d);
          return (t[e] = S), S;
        default:
          if (Array.isArray(l)) {
            const w = i.slice(1).map((P) => pt.call(this, P));
            for (const P of l) {
              const h = P(i[0], ...w);
              if (h) return (t[e] = h.value);
            }
          }
          throw new SyntaxError();
      }
    } else {
      const o = [];
      t[e] = o;
      for (let a = 0; a < i.length; a++) {
        const u = i[a];
        u !== Zy && (o[a] = pt.call(this, u));
      }
      return o;
    }
  else {
    const o = {};
    t[e] = o;
    for (const a in i) o[pt.call(this, Number(a))] = pt.call(this, i[a]);
    return o;
  }
}
async function pg(e, t) {
  const { plugins: n } = t ?? {},
    r = new pp(),
    l = e.pipeThrough(dg()).getReader(),
    i = { values: [], hydrated: [], deferred: {}, plugins: n },
    o = await hg.call(i, l);
  let a = r.promise;
  return (
    o.done
      ? r.resolve()
      : (a = mg
          .call(i, l)
          .then(r.resolve)
          .catch((u) => {
            for (const s of Object.values(i.deferred)) s.reject(u);
            r.reject(u);
          })),
    { done: a.then(() => l.closed), value: o.value }
  );
}
async function hg(e) {
  const t = await e.read();
  if (!t.value) throw new SyntaxError();
  let n;
  try {
    n = JSON.parse(t.value);
  } catch {
    throw new SyntaxError();
  }
  return { done: t.done, value: Na.call(this, n) };
}
async function mg(e) {
  let t = await e.read();
  for (; !t.done; ) {
    if (!t.value) continue;
    const n = t.value;
    switch (n[0]) {
      case dp: {
        const r = n.indexOf(":"),
          l = Number(n.slice(1, r)),
          i = this.deferred[l];
        if (!i) throw new Error(`Deferred ID ${l} not found in stream`);
        const o = n.slice(r + 1);
        let a;
        try {
          a = JSON.parse(o);
        } catch {
          throw new SyntaxError();
        }
        const u = Na.call(this, a);
        i.resolve(u);
        break;
      }
      case fp: {
        const r = n.indexOf(":"),
          l = Number(n.slice(1, r)),
          i = this.deferred[l];
        if (!i) throw new Error(`Deferred ID ${l} not found in stream`);
        const o = n.slice(r + 1);
        let a;
        try {
          a = JSON.parse(o);
        } catch {
          throw new SyntaxError();
        }
        const u = Na.call(this, a);
        i.reject(u);
        break;
      }
      default:
        throw new SyntaxError();
    }
    t = await e.read();
  }
}
/**
 * @remix-run/server-runtime v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ const hp = Symbol("SingleFetchRedirect");
/**
 * @remix-run/react v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function ye() {
  return (
    (ye = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    ye.apply(this, arguments)
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
 */ function mr(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
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
 */ async function vg(e, t) {
  if (e.id in t) return t[e.id];
  try {
    let n = await import(e.module);
    return (t[e.id] = n), n;
  } catch {
    return (
      window.__remixContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
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
 */ function yg(e, t, n) {
  let r = e
      .map((i) => {
        var o;
        let a = t[i.route.id],
          u = n.routes[i.route.id];
        return [
          u.css ? u.css.map((s) => ({ rel: "stylesheet", href: s })) : [],
          (a == null || (o = a.links) === null || o === void 0
            ? void 0
            : o.call(a)) || [],
        ];
      })
      .flat(2),
    l = xg(e, n);
  return mp(r, l);
}
async function n0(e, t) {
  var n, r;
  if ((!e.css && !t.links) || !Cg()) return;
  let l = [
    ((n = e.css) === null || n === void 0
      ? void 0
      : n.map((a) => ({ rel: "stylesheet", href: a }))) ?? [],
    ((r = t.links) === null || r === void 0 ? void 0 : r.call(t)) ?? [],
  ].flat(1);
  if (l.length === 0) return;
  let i = [];
  for (let a of l)
    !Fu(a) &&
      a.rel === "stylesheet" &&
      i.push({ ...a, rel: "preload", as: "style" });
  let o = i.filter(
    (a) =>
      (!a.media || window.matchMedia(a.media).matches) &&
      !document.querySelector(`link[rel="stylesheet"][href="${a.href}"]`)
  );
  await Promise.all(o.map(gg));
}
async function gg(e) {
  return new Promise((t) => {
    let n = document.createElement("link");
    Object.assign(n, e);
    function r() {
      document.head.contains(n) && document.head.removeChild(n);
    }
    (n.onload = () => {
      r(), t();
    }),
      (n.onerror = () => {
        r(), t();
      }),
      document.head.appendChild(n);
  });
}
function Fu(e) {
  return e != null && typeof e.page == "string";
}
function wg(e) {
  return e == null
    ? !1
    : e.href == null
    ? e.rel === "preload" &&
      typeof e.imageSrcSet == "string" &&
      typeof e.imageSizes == "string"
    : typeof e.rel == "string" && typeof e.href == "string";
}
async function Sg(e, t, n) {
  let r = await Promise.all(
    e.map(async (l) => {
      let i = await vg(t.routes[l.route.id], n);
      return i.links ? i.links() : [];
    })
  );
  return mp(
    r
      .flat(1)
      .filter(wg)
      .filter((l) => l.rel === "stylesheet" || l.rel === "preload")
      .map((l) =>
        l.rel === "stylesheet"
          ? { ...l, rel: "prefetch", as: "style" }
          : { ...l, rel: "prefetch" }
      )
  );
}
function Cc(e, t, n, r, l, i) {
  let o = vp(e),
    a = (c, f) => (n[f] ? c.route.id !== n[f].route.id : !0),
    u = (c, f) => {
      var d;
      return (
        n[f].pathname !== c.pathname ||
        (((d = n[f].route.path) === null || d === void 0
          ? void 0
          : d.endsWith("*")) &&
          n[f].params["*"] !== c.params["*"])
      );
    };
  return i === "data" && l.search !== o.search
    ? t.filter((c, f) => {
        if (!r.routes[c.route.id].hasLoader) return !1;
        if (a(c, f) || u(c, f)) return !0;
        if (c.route.shouldRevalidate) {
          var E;
          let S = c.route.shouldRevalidate({
            currentUrl: new URL(l.pathname + l.search + l.hash, window.origin),
            currentParams:
              ((E = n[0]) === null || E === void 0 ? void 0 : E.params) || {},
            nextUrl: new URL(e, window.origin),
            nextParams: c.params,
            defaultShouldRevalidate: !0,
          });
          if (typeof S == "boolean") return S;
        }
        return !0;
      })
    : t.filter((c, f) => {
        let d = r.routes[c.route.id];
        return (i === "assets" || d.hasLoader) && (a(c, f) || u(c, f));
      });
}
function Eg(e, t, n) {
  let r = vp(e);
  return Iu(
    t
      .filter((l) => n.routes[l.route.id].hasLoader)
      .map((l) => {
        let { pathname: i, search: o } = r,
          a = new URLSearchParams(o);
        return a.set("_data", l.route.id), `${i}?${a}`;
      })
  );
}
function kg(e, t) {
  return Iu(
    e
      .map((n) => {
        let r = t.routes[n.route.id],
          l = [r.module];
        return r.imports && (l = l.concat(r.imports)), l;
      })
      .flat(1)
  );
}
function xg(e, t) {
  return Iu(
    e
      .map((n) => {
        let r = t.routes[n.route.id],
          l = [r.module];
        return r.imports && (l = l.concat(r.imports)), l;
      })
      .flat(1)
  );
}
function Iu(e) {
  return [...new Set(e)];
}
function _g(e) {
  let t = {},
    n = Object.keys(e).sort();
  for (let r of n) t[r] = e[r];
  return t;
}
function mp(e, t) {
  let n = new Set(),
    r = new Set(t);
  return e.reduce((l, i) => {
    if (t && !Fu(i) && i.as === "script" && i.href && r.has(i.href)) return l;
    let a = JSON.stringify(_g(i));
    return n.has(a) || (n.add(a), l.push({ key: a, link: i })), l;
  }, []);
}
function vp(e) {
  let t = $t(e);
  return t.search === void 0 && (t.search = ""), t;
}
let Kl;
function Cg() {
  if (Kl !== void 0) return Kl;
  let e = document.createElement("link");
  return (Kl = e.relList.supports("preload")), (e = null), Kl;
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
 */ const Pg = {
    "&": "\\u0026",
    ">": "\\u003e",
    "<": "\\u003c",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029",
  },
  Rg = /[&><\u2028\u2029]/g;
function Ql(e) {
  return e.replace(Rg, (t) => Pg[t]);
}
function Pc(e) {
  return { __html: e };
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
 */ function r0(e) {
  return e.headers.get("X-Remix-Catch") != null;
}
function Lg(e) {
  return e.headers.get("X-Remix-Error") != null;
}
function Tg(e) {
  return (
    Ng(e) &&
    e.status >= 400 &&
    e.headers.get("X-Remix-Error") == null &&
    e.headers.get("X-Remix-Catch") == null &&
    e.headers.get("X-Remix-Response") == null
  );
}
function l0(e) {
  return e.headers.get("X-Remix-Redirect") != null;
}
function i0(e) {
  var t;
  return !!(
    (t = e.headers.get("Content-Type")) !== null &&
    t !== void 0 &&
    t.match(/text\/remix-deferred/)
  );
}
function Ng(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.headers == "object" &&
    typeof e.body < "u"
  );
}
function o0(e) {
  let t = e;
  return (
    t &&
    typeof t == "object" &&
    typeof t.data == "object" &&
    typeof t.subscribe == "function" &&
    typeof t.cancel == "function" &&
    typeof t.resolveData == "function"
  );
}
async function Dg(e, t, n = 0) {
  let r = new URL(e.url);
  r.searchParams.set("_data", t),
    n > 0 && (await new Promise((a) => setTimeout(a, 5 ** n * 10)));
  let l = await yp(e),
    i = window.__remixRevalidation,
    o = await fetch(r.href, l).catch((a) => {
      if (
        typeof i == "number" &&
        i === window.__remixRevalidation &&
        (a == null ? void 0 : a.name) === "TypeError" &&
        n < 3
      )
        return Dg(e, t, n + 1);
      throw a;
    });
  if (Lg(o)) {
    let a = await o.json(),
      u = new Error(a.message);
    return (u.stack = a.stack), u;
  }
  if (Tg(o)) {
    let a = await o.text(),
      u = new Error(a);
    return (u.stack = void 0), u;
  }
  return o;
}
async function yp(e) {
  let t = { signal: e.signal };
  if (e.method !== "GET") {
    t.method = e.method;
    let n = e.headers.get("Content-Type");
    n && /\bapplication\/json\b/.test(n)
      ? ((t.headers = { "Content-Type": n }),
        (t.body = JSON.stringify(await e.json())))
      : n && /\btext\/plain\b/.test(n)
      ? ((t.headers = { "Content-Type": n }), (t.body = await e.text()))
      : n && /\bapplication\/x-www-form-urlencoded\b/.test(n)
      ? (t.body = new URLSearchParams(await e.text()))
      : (t.body = await e.formData());
  }
  return t;
}
const Mg = "__deferred_promise:";
async function a0(e) {
  if (!e)
    throw new Error("parseDeferredReadableStream requires stream argument");
  let t,
    n = {};
  try {
    let r = Og(e),
      i = (await r.next()).value;
    if (!i) throw new Error("no critical data");
    let o = JSON.parse(i);
    if (typeof o == "object" && o !== null)
      for (let [a, u] of Object.entries(o))
        typeof u != "string" ||
          !u.startsWith(Mg) ||
          ((t = t || {}),
          (t[a] = new Promise((s, c) => {
            n[a] = {
              resolve: (f) => {
                s(f), delete n[a];
              },
              reject: (f) => {
                c(f), delete n[a];
              },
            };
          })));
    return (
      (async () => {
        try {
          for await (let a of r) {
            let [u, ...s] = a.split(":"),
              c = s.join(":"),
              f = JSON.parse(c);
            if (u === "data")
              for (let [d, E] of Object.entries(f)) n[d] && n[d].resolve(E);
            else if (u === "error")
              for (let [d, E] of Object.entries(f)) {
                let S = new Error(E.message);
                (S.stack = E.stack), n[d] && n[d].reject(S);
              }
          }
          for (let [a, u] of Object.entries(n))
            u.reject(new Ni(`Deferred ${a} will never be resolved`));
        } catch (a) {
          for (let u of Object.values(n)) u.reject(a);
        }
      })(),
      new Iv({ ...o, ...t })
    );
  } catch (r) {
    for (let l of Object.values(n)) l.reject(r);
    throw r;
  }
}
async function* Og(e) {
  let t = e.getReader(),
    n = [],
    r = [],
    l = !1,
    i = new TextEncoder(),
    o = new TextDecoder(),
    a = async () => {
      if (r.length > 0) return r.shift();
      for (; !l && r.length === 0; ) {
        let s = await t.read();
        if (s.done) {
          l = !0;
          break;
        }
        n.push(s.value);
        try {
          let f = o.decode(Rc(...n)).split(`

`);
          if (
            (f.length >= 2 &&
              (r.push(...f.slice(0, -1)),
              (n = [
                i.encode(
                  f.slice(-1).join(`

`)
                ),
              ])),
            r.length > 0)
          )
            break;
        } catch {
          continue;
        }
      }
      return (
        r.length > 0 ||
          (n.length > 0 &&
            ((r = o
              .decode(Rc(...n))
              .split(
                `

`
              )
              .filter((c) => c)),
            (n = []))),
        r.shift()
      );
    },
    u = await a();
  for (; u; ) yield u, (u = await a());
}
function Rc(...e) {
  let t = new Uint8Array(e.reduce((r, l) => r + l.length, 0)),
    n = 0;
  for (let r of e) t.set(r, n), (n += r.length);
  return t;
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
 */ function u0(e, t) {
  return async ({ request: n, matches: r }) =>
    n.method !== "GET" ? zg(n, r) : jg(e, t, n, r);
}
function zg(e, t) {
  return Promise.all(
    t.map(async (n) => {
      let r;
      return {
        ...(await n.resolve(async (i) => ({
          type: "data",
          result: await i(async () => {
            let a = Uu(e.url),
              u = await yp(e),
              { data: s, status: c } = await Da(a, u);
            return (r = c), Ma(s, n.route.id);
          }),
          status: r,
        }))),
        status: r,
      };
    })
  );
}
function jg(e, t, n, r) {
  let l;
  return Promise.all(
    r.map(async (i) =>
      i.resolve(async (o) => {
        let a,
          u = Fg(Uu(n.url));
        return (
          e.routes[i.route.id].hasClientLoader
            ? (a = await o(async () => {
                u.searchParams.set("_routes", i.route.id);
                let { data: s } = await Da(u);
                return Lc(s, i.route.id);
              }))
            : (a = await o(async () => {
                l ||
                  ((u = gp(
                    e,
                    t,
                    r.map((c) => c.route),
                    r.filter((c) => c.shouldLoad).map((c) => c.route),
                    u
                  )),
                  (l = Da(u).then(({ data: c }) => c)));
                let s = await l;
                return Lc(s, i.route.id);
              })),
          { type: "data", result: a }
        );
      })
    )
  );
}
function Fg(e) {
  let t = e.searchParams.getAll("index");
  e.searchParams.delete("index");
  let n = [];
  for (let r of t) r && n.push(r);
  for (let r of n) e.searchParams.append("index", r);
  return e;
}
function gp(e, t, n, r, l) {
  let i = (s) => s.filter((c) => e.routes[c].hasLoader).join(",");
  if (
    !n.some((s) => {
      var c, f;
      return (
        ((c = t[s.id]) === null || c === void 0
          ? void 0
          : c.shouldRevalidate) ||
        ((f = e.routes[s.id]) === null || f === void 0
          ? void 0
          : f.hasClientLoader)
      );
    })
  )
    return l;
  let a = i(n.map((s) => s.id)),
    u = i(
      r
        .filter((s) => {
          var c;
          return !(
            (c = e.routes[s.id]) !== null &&
            c !== void 0 &&
            c.hasClientLoader
          );
        })
        .map((s) => s.id)
    );
  return a !== u && l.searchParams.set("_routes", u), l;
}
function Uu(e) {
  let t = typeof e == "string" ? new URL(e, window.location.origin) : e;
  return (t.pathname = `${t.pathname === "/" ? "_root" : t.pathname}.data`), t;
}
async function Da(e, t) {
  let n = await fetch(e, t);
  mr(n.body, "No response body to decode");
  try {
    let r = await Ig(n.body, window);
    return { status: n.status, data: r.value };
  } catch (r) {
    throw (
      (console.error(r),
      new Error(
        `Unable to decode turbo-stream response from URL: ${e.toString()}`
      ))
    );
  }
}
function Ig(e, t) {
  return pg(e, {
    plugins: [
      (n, ...r) => {
        if (n === "SanitizedError") {
          let [l, i, o] = r,
            a = Error;
          l && l in t && typeof t[l] == "function" && (a = t[l]);
          let u = new a(i);
          return (u.stack = o), { value: u };
        }
        if (n === "ErrorResponse") {
          let [l, i, o] = r;
          return { value: new Tu(i, o, l) };
        }
        if (n === "SingleFetchRedirect") return { value: { [hp]: r[0] } };
      },
    ],
  });
}
function Lc(e, t) {
  let n = e[hp];
  return n ? Ma(n, t) : e[t] !== void 0 ? Ma(e[t], t) : null;
}
function Ma(e, t) {
  if ("error" in e) throw e.error;
  if ("redirect" in e) {
    let n = {};
    return (
      e.revalidate && (n["X-Remix-Revalidate"] = "yes"),
      e.reload && (n["X-Remix-Reload-Document"] = "yes"),
      Av(e.redirect, { status: e.status, headers: n })
    );
  } else {
    if ("data" in e) return e.data;
    throw new Error(`No response found for routeId "${t}"`);
  }
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
 */ function wp() {
  let e = y.useContext(hr);
  return (
    mr(
      e,
      "You must render this element inside a <DataRouterContext.Provider> element"
    ),
    e
  );
}
function Zi() {
  let e = y.useContext(gl);
  return (
    mr(
      e,
      "You must render this element inside a <DataRouterStateContext.Provider> element"
    ),
    e
  );
}
const Sp = y.createContext(void 0);
Sp.displayName = "Remix";
function Sl() {
  let e = y.useContext(Sp);
  return mr(e, "You must render this element inside a <Remix> element"), e;
}
function Ep(e, t) {
  let [n, r] = y.useState(!1),
    [l, i] = y.useState(!1),
    {
      onFocus: o,
      onBlur: a,
      onMouseEnter: u,
      onMouseLeave: s,
      onTouchStart: c,
    } = t,
    f = y.useRef(null);
  y.useEffect(() => {
    if ((e === "render" && i(!0), e === "viewport")) {
      let S = (P) => {
          P.forEach((h) => {
            i(h.isIntersecting);
          });
        },
        w = new IntersectionObserver(S, { threshold: 0.5 });
      return (
        f.current && w.observe(f.current),
        () => {
          w.disconnect();
        }
      );
    }
  }, [e]);
  let d = () => {
      e === "intent" && r(!0);
    },
    E = () => {
      e === "intent" && (r(!1), i(!1));
    };
  return (
    y.useEffect(() => {
      if (n) {
        let S = setTimeout(() => {
          i(!0);
        }, 100);
        return () => {
          clearTimeout(S);
        };
      }
    }, [n]),
    [
      l,
      f,
      {
        onFocus: Or(o, d),
        onBlur: Or(a, E),
        onMouseEnter: Or(u, d),
        onMouseLeave: Or(s, E),
        onTouchStart: Or(c, d),
      },
    ]
  );
}
const kp = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
let Ug = y.forwardRef(({ to: e, prefetch: t = "none", ...n }, r) => {
  let l = typeof e == "string" && kp.test(e),
    i = zu(e),
    [o, a, u] = Ep(t, n);
  return y.createElement(
    y.Fragment,
    null,
    y.createElement(Qy, ye({}, n, u, { ref: xp(r, a), to: e })),
    o && !l ? y.createElement(Au, { page: i }) : null
  );
});
Ug.displayName = "NavLink";
let $g = y.forwardRef(({ to: e, prefetch: t = "none", ...n }, r) => {
  let l = typeof e == "string" && kp.test(e),
    i = zu(e),
    [o, a, u] = Ep(t, n);
  return y.createElement(
    y.Fragment,
    null,
    y.createElement(sp, ye({}, n, u, { ref: xp(r, a), to: e })),
    o && !l ? y.createElement(Au, { page: i }) : null
  );
});
$g.displayName = "Link";
function Or(e, t) {
  return (n) => {
    e && e(n), n.defaultPrevented || t(n);
  };
}
function $u(e, t, n) {
  if (n && !ii) return [e[0]];
  if (t) {
    let r = e.findIndex((l) => t[l.route.id] !== void 0);
    return e.slice(0, r + 1);
  }
  return e;
}
function s0() {
  let { isSpaMode: e, manifest: t, routeModules: n, criticalCss: r } = Sl(),
    { errors: l, matches: i } = Zi(),
    o = $u(i, l, e),
    a = y.useMemo(() => yg(o, n, t), [o, n, t]);
  return y.createElement(
    y.Fragment,
    null,
    r
      ? y.createElement("style", { dangerouslySetInnerHTML: { __html: r } })
      : null,
    a.map(({ key: u, link: s }) =>
      Fu(s)
        ? y.createElement(Au, ye({ key: u }, s))
        : y.createElement("link", ye({ key: u }, s))
    )
  );
}
function Au({ page: e, ...t }) {
  let { router: n } = wp(),
    r = y.useMemo(() => qt(n.routes, e, n.basename), [n.routes, e, n.basename]);
  return r
    ? y.createElement(Bg, ye({ page: e, matches: r }, t))
    : (console.warn(`Tried to prefetch ${e} but no routes matched.`), null);
}
function Ag(e) {
  let { manifest: t, routeModules: n } = Sl(),
    [r, l] = y.useState([]);
  return (
    y.useEffect(() => {
      let i = !1;
      return (
        Sg(e, t, n).then((o) => {
          i || l(o);
        }),
        () => {
          i = !0;
        }
      );
    }, [e, t, n]),
    r
  );
}
function Bg({ page: e, matches: t, ...n }) {
  let r = hn(),
    { future: l, manifest: i, routeModules: o } = Sl(),
    { matches: a } = Zi(),
    u = y.useMemo(() => Cc(e, t, a, i, r, "data"), [e, t, a, i, r]),
    s = y.useMemo(() => Cc(e, t, a, i, r, "assets"), [e, t, a, i, r]),
    c = y.useMemo(() => Eg(e, u, i), [u, e, i]),
    f = y.useMemo(() => kg(s, i), [s, i]),
    d = Ag(s),
    E = null;
  if (!l.unstable_singleFetch)
    E = c.map((S) =>
      y.createElement(
        "link",
        ye({ key: S, rel: "prefetch", as: "fetch", href: S }, n)
      )
    );
  else if (u.length > 0) {
    let S = gp(
      i,
      o,
      t.map((w) => w.route),
      u.map((w) => w.route),
      Uu(e)
    );
    S.searchParams.get("_routes") !== "" &&
      (E = y.createElement(
        "link",
        ye(
          {
            key: S.pathname + S.search,
            rel: "prefetch",
            as: "fetch",
            href: S.pathname + S.search,
          },
          n
        )
      ));
  }
  return y.createElement(
    y.Fragment,
    null,
    E,
    f.map((S) =>
      y.createElement("link", ye({ key: S, rel: "modulepreload", href: S }, n))
    ),
    d.map(({ key: S, link: w }) => y.createElement("link", ye({ key: S }, w)))
  );
}
function c0() {
  let { isSpaMode: e, routeModules: t } = Sl(),
    { errors: n, matches: r, loaderData: l } = Zi(),
    i = hn(),
    o = $u(r, n, e),
    a = null;
  n && (a = n[o[o.length - 1].route.id]);
  let u = [],
    s = null,
    c = [];
  for (let f = 0; f < o.length; f++) {
    let d = o[f],
      E = d.route.id,
      S = l[E],
      w = d.params,
      P = t[E],
      h = [],
      p = {
        id: E,
        data: S,
        meta: [],
        params: d.params,
        pathname: d.pathname,
        handle: d.route.handle,
        error: a,
      };
    if (
      ((c[f] = p),
      P != null && P.meta
        ? (h =
            typeof P.meta == "function"
              ? P.meta({
                  data: S,
                  params: w,
                  location: i,
                  matches: c,
                  error: a,
                })
              : Array.isArray(P.meta)
              ? [...P.meta]
              : P.meta)
        : s && (h = [...s]),
      (h = h || []),
      !Array.isArray(h))
    )
      throw new Error(
        "The route at " +
          d.route.path +
          ` returns an invalid value. All route meta functions must return an array of meta objects.

To reference the meta function API, see https://remix.run/route/meta`
      );
    (p.meta = h), (c[f] = p), (u = [...h]), (s = u);
  }
  return y.createElement(
    y.Fragment,
    null,
    u.flat().map((f) => {
      if (!f) return null;
      if ("tagName" in f) {
        let { tagName: d, ...E } = f;
        if (!Hg(d))
          return (
            console.warn(
              `A meta object uses an invalid tagName: ${d}. Expected either 'link' or 'meta'`
            ),
            null
          );
        let S = d;
        return y.createElement(S, ye({ key: JSON.stringify(E) }, E));
      }
      if ("title" in f)
        return y.createElement("title", { key: "title" }, String(f.title));
      if (
        ("charset" in f &&
          (f.charSet ?? (f.charSet = f.charset), delete f.charset),
        "charSet" in f && f.charSet != null)
      )
        return typeof f.charSet == "string"
          ? y.createElement("meta", { key: "charSet", charSet: f.charSet })
          : null;
      if ("script:ld+json" in f)
        try {
          let d = JSON.stringify(f["script:ld+json"]);
          return y.createElement("script", {
            key: `script:ld+json:${d}`,
            type: "application/ld+json",
            dangerouslySetInnerHTML: { __html: d },
          });
        } catch {
          return null;
        }
      return y.createElement("meta", ye({ key: JSON.stringify(f) }, f));
    })
  );
}
function Hg(e) {
  return typeof e == "string" && /^(meta|link)$/.test(e);
}
function Vg(e) {
  return y.createElement(Ty, e);
}
let ii = !1;
function f0(e) {
  let {
      manifest: t,
      serverHandoffString: n,
      abortDelay: r,
      serializeError: l,
      isSpaMode: i,
      future: o,
      renderMeta: a,
    } = Sl(),
    { router: u, static: s, staticContext: c } = wp(),
    { matches: f } = Zi(),
    d = op();
  a && (a.didRenderScripts = !0);
  let E = $u(f, null, i);
  y.useEffect(() => {
    ii = !0;
  }, []);
  let S = (m, C) => {
      let O;
      return (
        l && C instanceof Error ? (O = l(C)) : (O = C),
        `${JSON.stringify(m)}:__remixContext.p(!1, ${Ql(JSON.stringify(O))})`
      );
    },
    w = (m, C, O) => {
      let D;
      try {
        D = JSON.stringify(O);
      } catch (H) {
        return S(C, H);
      }
      return `${JSON.stringify(C)}:__remixContext.p(${Ql(D)})`;
    },
    P = (m, C, O) => {
      let D;
      return (
        l && O instanceof Error ? (D = l(O)) : (D = O),
        `__remixContext.r(${JSON.stringify(m)}, ${JSON.stringify(C)}, !1, ${Ql(
          JSON.stringify(D)
        )})`
      );
    },
    h = (m, C, O) => {
      let D;
      try {
        D = JSON.stringify(O);
      } catch (H) {
        return P(m, C, H);
      }
      return `__remixContext.r(${JSON.stringify(m)}, ${JSON.stringify(C)}, ${Ql(
        D
      )})`;
    },
    p = [],
    v = y.useMemo(() => {
      var m;
      let C = o.unstable_singleFetch
          ? "window.__remixContext.stream = new ReadableStream({start(controller){window.__remixContext.streamController = controller;}}).pipeThrough(new TextEncoderStream());"
          : "",
        O = c ? `window.__remixContext = ${n};${C}` : " ",
        D = o.unstable_singleFetch || c == null ? void 0 : c.activeDeferreds;
      O += D
        ? [
            "__remixContext.p = function(v,e,p,x) {",
            "  if (typeof e !== 'undefined') {",
            `    x=new Error("Unexpected Server Error");
    x.stack=undefined;`,
            "    p=Promise.reject(x);",
            "  } else {",
            "    p=Promise.resolve(v);",
            "  }",
            "  return p;",
            "};",
            "__remixContext.n = function(i,k) {",
            "  __remixContext.t = __remixContext.t || {};",
            "  __remixContext.t[i] = __remixContext.t[i] || {};",
            "  let p = new Promise((r, e) => {__remixContext.t[i][k] = {r:(v)=>{r(v);},e:(v)=>{e(v);}};});",
            typeof r == "number"
              ? `setTimeout(() => {if(typeof p._error !== "undefined" || typeof p._data !== "undefined"){return;} __remixContext.t[i][k].e(new Error("Server timeout."))}, ${r});`
              : "",
            "  return p;",
            "};",
            "__remixContext.r = function(i,k,v,e,p,x) {",
            "  p = __remixContext.t[i][k];",
            "  if (typeof e !== 'undefined') {",
            `    x=new Error("Unexpected Server Error");
    x.stack=undefined;`,
            "    p.e(x);",
            "  } else {",
            "    p.r(v);",
            "  }",
            "};",
          ].join(`
`) +
          Object.entries(D).map(([G, X]) => {
            let he = new Set(X.pendingKeys),
              Ve = X.deferredKeys.map((Ee) => {
                if (he.has(Ee))
                  return (
                    p.push(
                      y.createElement(Tc, {
                        key: `${G} | ${Ee}`,
                        deferredData: X,
                        routeId: G,
                        dataKey: Ee,
                        scriptProps: e,
                        serializeData: h,
                        serializeError: P,
                      })
                    ),
                    `${JSON.stringify(Ee)}:__remixContext.n(${JSON.stringify(
                      G
                    )}, ${JSON.stringify(Ee)})`
                  );
                {
                  let be = X.data[Ee];
                  return typeof be._error < "u"
                    ? S(Ee, be._error)
                    : w(G, Ee, be._data);
                }
              }).join(`,
`);
            return `Object.assign(__remixContext.state.loaderData[${JSON.stringify(
              G
            )}], {${Ve}});`;
          }).join(`
`) +
          (p.length > 0 ? `__remixContext.a=${p.length};` : "")
        : "";
      let H = s
        ? `${
            (m = t.hmr) !== null && m !== void 0 && m.runtime
              ? `import ${JSON.stringify(t.hmr.runtime)};`
              : ""
          }import ${JSON.stringify(t.url)};
${E.map(
  (G, X) =>
    `import * as route${X} from ${JSON.stringify(t.routes[G.route.id].module)};`
).join(`
`)}
window.__remixRouteModules = {${E.map(
            (G, X) => `${JSON.stringify(G.route.id)}:route${X}`
          ).join(",")}};

import(${JSON.stringify(t.entry.module)});`
        : " ";
      return y.createElement(
        y.Fragment,
        null,
        y.createElement(
          "script",
          ye({}, e, {
            suppressHydrationWarning: !0,
            dangerouslySetInnerHTML: Pc(O),
            type: void 0,
          })
        ),
        y.createElement(
          "script",
          ye({}, e, {
            suppressHydrationWarning: !0,
            dangerouslySetInnerHTML: Pc(H),
            type: "module",
            async: !0,
          })
        )
      );
    }, []);
  if (!s && typeof __remixContext == "object" && __remixContext.a)
    for (let m = 0; m < __remixContext.a; m++)
      p.push(
        y.createElement(Tc, {
          key: m,
          scriptProps: e,
          serializeData: h,
          serializeError: P,
        })
      );
  let x = y.useMemo(() => {
      if (d.location) {
        let m = qt(u.routes, d.location, u.basename);
        return mr(m, `No routes match path "${d.location.pathname}"`), m;
      }
      return [];
    }, [d.location, u.routes, u.basename]),
    L = E.concat(x)
      .map((m) => {
        let C = t.routes[m.route.id];
        return (C.imports || []).concat([C.module]);
      })
      .flat(1),
    M = ii ? [] : t.entry.imports.concat(L);
  return ii
    ? null
    : y.createElement(
        y.Fragment,
        null,
        y.createElement("link", {
          rel: "modulepreload",
          href: t.url,
          crossOrigin: e.crossOrigin,
        }),
        y.createElement("link", {
          rel: "modulepreload",
          href: t.entry.module,
          crossOrigin: e.crossOrigin,
        }),
        Kg(M).map((m) =>
          y.createElement("link", {
            key: m,
            rel: "modulepreload",
            href: m,
            crossOrigin: e.crossOrigin,
          })
        ),
        v,
        p
      );
}
function Tc({
  dataKey: e,
  deferredData: t,
  routeId: n,
  scriptProps: r,
  serializeData: l,
  serializeError: i,
}) {
  return (
    typeof document > "u" &&
      t &&
      e &&
      n &&
      mr(
        t.pendingKeys.includes(e),
        `Deferred data for route ${n} with key ${e} was not pending but tried to render a script for it.`
      ),
    y.createElement(
      y.Suspense,
      {
        fallback:
          typeof document > "u" && t && e && n
            ? null
            : y.createElement(
                "script",
                ye({}, r, {
                  async: !0,
                  suppressHydrationWarning: !0,
                  dangerouslySetInnerHTML: { __html: " " },
                })
              ),
      },
      typeof document > "u" && t && e && n
        ? y.createElement(Vg, {
            resolve: t.data[e],
            errorElement: y.createElement(Wg, {
              dataKey: e,
              routeId: n,
              scriptProps: r,
              serializeError: i,
            }),
            children: (o) =>
              y.createElement(
                "script",
                ye({}, r, {
                  async: !0,
                  suppressHydrationWarning: !0,
                  dangerouslySetInnerHTML: { __html: l(n, e, o) },
                })
              ),
          })
        : y.createElement(
            "script",
            ye({}, r, {
              async: !0,
              suppressHydrationWarning: !0,
              dangerouslySetInnerHTML: { __html: " " },
            })
          )
    )
  );
}
function Wg({ dataKey: e, routeId: t, scriptProps: n, serializeError: r }) {
  let l = Py();
  return y.createElement(
    "script",
    ye({}, n, {
      suppressHydrationWarning: !0,
      dangerouslySetInnerHTML: { __html: r(t, e, l) },
    })
  );
}
function Kg(e) {
  return [...new Set(e)];
}
function xp(...e) {
  return (t) => {
    e.forEach((n) => {
      typeof n == "function" ? n(t) : n != null && (n.current = t);
    });
  };
}
export {
  t0 as A,
  Dc as B,
  Yg as C,
  $g as D,
  Tu as E,
  s0 as L,
  c0 as M,
  Zg as O,
  Sp as R,
  f0 as S,
  nh as W,
  ye as _,
  mr as a,
  _y as b,
  l0 as c,
  r0 as d,
  i0 as e,
  Dg as f,
  a0 as g,
  o0 as h,
  Nu as i,
  Ng as j,
  Av as k,
  vg as l,
  Ig as m,
  qt as n,
  Gg as o,
  n0 as p,
  Xg as q,
  y as r,
  qg as s,
  u0 as t,
  Sl as u,
  e0 as v,
  Kd as w,
  Jg as x,
  hn as y,
  xy as z,
};
