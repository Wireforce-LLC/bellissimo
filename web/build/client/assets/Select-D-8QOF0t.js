import { x as r } from "./components-Be_8OGgv.js";
import { c as d, _ as u } from "./DashboardLayout-CHVXsdWb.js";
function b({ children: t, variant: o = "primary", onPress: s, disabled: a }) {
  return r.jsx("button", {
    onClick: s,
    disabled: a,
    className: d(
      "w-full disabled:text-[#52af59] disabled:cursor-not-allowed disabled:bg-[#e7f2e9] focus:outline focus:outline-gray-500 focus:outline-offset-2 px-2.5 py-1.5 font-medium text-xs text-white bg-[#52af59]",
      {
        "bg-red-500 text-white font-medium disabled:bg-red-300 disabled:text-white":
          o == "delete",
      }
    ),
    children: t,
  });
}
function p({
  className: t,
  type: o,
  placeholder: s,
  isDisabled: a,
  label: i,
  isRequired: n,
  name: l,
  onChangeValue: e,
  value: c,
}) {
  return r.jsxs("div", {
    "data-role": "input-group",
    className: "w-full",
    children: [
      i
        ? r.jsx("label", {
            className: "text-xs text-gray-500 mb-[5px] block",
            children: i,
          })
        : void 0,
      r.jsx("input", {
        type: o || "text",
        value: c,
        name: l,
        required: n,
        disabled: u.isBoolean(a) ? a : !1,
        onChange: (x) => {
          e && e(x.target.value);
        },
        placeholder: s,
        className: d(
          "w-full h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
          t
        ),
      }),
    ],
  });
}
function g({
  isDisabled: t,
  label: o,
  isRequired: s,
  name: a,
  onChangeValue: i,
  value: n,
  values: l,
}) {
  return r.jsxs("div", {
    "data-role": "input-group",
    className: "w-full",
    children: [
      o
        ? r.jsx("label", {
            className: "text-xs text-gray-500 mb-[5px] block",
            children: o,
          })
        : void 0,
      r.jsx("select", {
        value: n,
        name: a,
        required: s,
        disabled: u.isBoolean(t) ? t : !1,
        onChange: (e) => {
          i && i(e.target.value);
        },
        className:
          "w-full h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
        children:
          l == null
            ? void 0
            : l.map((e) =>
                r.jsx("option", { value: e.value, children: e.name }, e.value)
              ),
      }),
    ],
  });
}
export { b as B, p as I, g as S };
