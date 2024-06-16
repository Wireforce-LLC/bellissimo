const o = (e, r) => (
  (e = e.replace(
    new RegExp(
      "((?<![\\p{Uppercase_Letter}\\d])[\\p{Uppercase_Letter}\\d](?![\\p{Uppercase_Letter}\\d]))",
      "gu"
    ),
    (p) => p.toLowerCase()
  )),
  e.replace(
    new RegExp(
      "(\\p{Uppercase_Letter}+)(\\p{Uppercase_Letter}\\p{Lowercase_Letter}+)",
      "gu"
    ),
    (p, t, a) => t + r + a.toLowerCase()
  )
);
function c(
  e,
  { separator: r = "_", preserveConsecutiveUppercase: p = !1 } = {}
) {
  if (!(typeof e == "string" && typeof r == "string"))
    throw new TypeError(
      "The `text` and `separator` arguments should be of type `string`"
    );
  if (e.length < 2) return p ? e : e.toLowerCase();
  const t = `$1${r}$2`,
    a = e.replace(
      new RegExp("([\\p{Lowercase_Letter}\\d])(\\p{Uppercase_Letter})", "gu"),
      t
    );
  return p
    ? o(a, r)
    : a
        .replace(
          new RegExp(
            "(\\p{Uppercase_Letter})(\\p{Uppercase_Letter}\\p{Lowercase_Letter}+)",
            "gu"
          ),
          t
        )
        .toLowerCase();
}
function s(e) {
  if (typeof e != "string") throw new TypeError("Expected a string");
  return (
    (e = c(e)),
    (e = e
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()),
    (e = e.charAt(0).toUpperCase() + e.slice(1)),
    e
  );
}
export { s as h };
