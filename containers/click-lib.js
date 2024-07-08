"use strict";
var x = 0,
  y = 0;
function r(n, s="main") {
  var e = new XMLHttpRequest();
  e.open(
    "GET",
    "/click?name=" +
      encodeURI(n) +
      "&cursor_x=" +
      x +
      "&cursor_y=" +
      y +
      "&time=" +
      Date.now() +
      "&namespace=" +
      encodeURI(s)
  ),
    e.send();
}
document.addEventListener("load", function () {
  document.onmousemove = function (n) {
    (x = n.clientX), (y = n.clientY);
  };

  document.onclick = function (n) {
    (x = n.clientX), (y = n.clientY);
  };
});
