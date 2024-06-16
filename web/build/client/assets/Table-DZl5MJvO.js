import { r as d, x as e } from "./components-Be_8OGgv.js";
import { c as x, _ as a, s as c } from "./DashboardLayout-CHVXsdWb.js";
import { L as m } from "./LoadingActivity-D2AtNIzl.js";
function u({ title: s, isBigModal: r, children: n, onClose: l }) {
  return (
    d.useEffect(() => {
      const t = (o) => {
        o.key === "Escape" && l();
      };
      return (
        window.addEventListener("keydown", t),
        () => {
          window.removeEventListener("keydown", t);
        }
      );
    }, []),
    e.jsx("div", {
      className:
        "w-full h-full bg-black bg-opacity-55 fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center",
      children: e.jsx("div", {
        className: x(
          "bg-white border max-h-[80%] overflow-y-auto block border-black",
          {
            "w-[80%] h-[80%]": r,
            "md:max-w-[70%] min-w-[100px] md:min-w-[300px] lg:min-w-[40%]": !r,
          }
        ),
        children: e.jsxs("div", {
          className: "w-full h-[calc(100%-32px)]",
          children: [
            e.jsxs("div", {
              className:
                "w-full h-[32px] bg-[#f8f9fa] p-2 flex flex-row justify-between items-center border-b border-b-[#dee2e6] pb-2",
              children: [
                e.jsx("span", {
                  className: "text-xs font-medium",
                  children: s,
                }),
                e.jsx("button", {
                  className: "w-4 h-4 hover:bg-gray-100",
                  onClick: l,
                  children: e.jsx("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    className: "w-4 h-4",
                    children: e.jsx("path", {
                      d: "M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z",
                    }),
                  }),
                }),
              ],
            }),
            e.jsx("div", { className: "p-2 h-full w-full", children: n }),
          ],
        }),
      }),
    })
  );
}
function b({ children: s }) {
  return (
    s &&
    e.jsx("span", {
      className: "text-xs font-medium text-red-500",
      children: s,
    })
  );
}
function w({ headers: s, data: r, onSelectedItem: n }) {
  const l = d.useCallback((t) => t, []);
  return r
    ? e.jsxs("table", {
        className: "w-full bg-white",
        children: [
          e.jsx("thead", {
            children: e.jsx("tr", {
              className:
                "bg-gray-300 border-b divide-x divide-zinc-200 border-zinc-200 sticky top-0 bg-white",
              children:
                s == null
                  ? void 0
                  : s.map((t) =>
                      e.jsx("th", {
                        scope: "col",
                        className:
                          "px-3 py-1.5 text-xs text-black bg-gray-50 text-left font-medium",
                        children: t,
                      })
                    ),
            }),
          }),
          e.jsxs("tbody", {
            children: [
              a.isArray(r) &&
                r.map((t, o) =>
                  e.jsx("tr", {
                    className:
                      "border-b z-0 divide-x divide-zinc-200 border-zinc-200 cursor-pointer hover:bg-gray-100 hover:bg-opacity-25",
                    children: Object.values(t || []).map((i) =>
                      i
                        ? e.jsx("td", {
                            className: "px-3 py-1.5 text-xs font-normal",
                            children: a.isBoolean(i)
                              ? i
                                ? "Yes"
                                : "No"
                              : l(i),
                          })
                        : e.jsx("td", {
                            className:
                              "px-3 py-1.5 text-xs text-[#adb5bd] text-opacity-75",
                            children: e.jsx("div", {
                              className: "text-wrap w-full block",
                              children: c("const.nonValue"),
                            }),
                          })
                    ),
                  })
                ),
              !a.isArray(r) &&
                e.jsx(b, {
                  children:
                    "The data set you are using to build the table is not supported. This table only supports drawing lists",
                }),
            ],
          }),
        ],
      })
    : e.jsx("div", {
        className: "w-full bg-white py-12 border-b border-b-gray-100",
        children: e.jsx(m, { text: c("const.loadingData") }),
      });
}
export { u as M, w as T };
