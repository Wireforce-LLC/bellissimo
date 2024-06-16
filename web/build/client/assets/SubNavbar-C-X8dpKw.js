import { x as e } from "./components-Be_8OGgv.js";
import { s as l } from "./DashboardLayout-CHVXsdWb.js";
function i({ title: t, createActionLabel: r, onCreateAction: s }) {
  return e.jsx("div", {
    className: "w-full bg-white",
    children: e.jsx("div", {
      className:
        "w-full h-[38px] bg-white font-medium flex items-center border-b border-b-zinc-200",
      children: e.jsxs("div", {
        className:
          "md:px-4 px-4 w-full flex flex-row justify-between items-center",
        children: [
          e.jsx("span", {
            className: "text-xs text-gray-800  h-fit",
            children: t || "Untitled",
          }),
          s &&
            e.jsxs("button", {
              onClick: s,
              className:
                "text-xs flex flex-row items-center gap-1.5 text-[#54b046] px-2 py-1 rounded-sm bg-[#e7f2e9]",
              children: [
                e.jsx("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 16 16",
                  fill: "currentColor",
                  className: "w-4 h-4",
                  children: e.jsx("path", {
                    d: "M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z",
                  }),
                }),
                r || l("dashboard.actions.create"),
              ],
            }),
        ],
      }),
    }),
  });
}
export { i as S };
