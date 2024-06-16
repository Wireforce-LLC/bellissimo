import { x as t } from "./components-Be_8OGgv.js";
import { c as a, D as s, L as i } from "./DashboardLayout-CHVXsdWb.js";
import { L as o } from "./LoadingActivity-D2AtNIzl.js";
function n({ children: e, className: r }) {
  return t.jsx("div", {
    className: a("bg-gray-50 bg-opacity-75 rounded-lg p-2", r),
    children: e,
  });
}
const l = () => [
  { title: "Bellissimo" },
  {
    name: "description",
    content: "Welcome to Paper Analytics! This is your dashboard",
  },
];
function p() {
  return t.jsx(s, {
    currentLeftActiveBarItem: i.THREADS,
    children: t.jsx(n, {
      className: "py-12",
      children: t.jsx(o, { text: "Redirecting" }),
    }),
  });
}
export { p as default, l as meta };
