// browser/page-router.js
async function loadPage(path) {
  dispatchEvent(new Event("before:route"));
  const dom = mkdom(await getHTML(path));
  document.title = $("title", dom)?.textContent;
  const new_styles = swapStyles($$("style"), $$("style", dom));
  new_styles.forEach((style) => $("head").appendChild(style));
  $("body").classList = $("body2", dom).classList;
  for (const query of ["header", "main", "footer"]) {
    const a = $("body >" + query);
    const b = $("body2 >" + query, dom);
    if (a && b) {
      if (a.outerHTML != b.outerHTML)
        a.replaceWith(b);
    } else if (a) {
      a.remove();
    } else {
      const fn = query == "footer" ? "append" : "prepend";
      document.body[fn](b);
    }
  }
  const paths = swapStyles($$("link"), $$("link", dom));
  loadCSS(paths, () => {
    scrollTo(0, 0);
    setSelected(path);
    dispatchEvent(new Event("route"));
  });
}
function onclick(root, fn) {
  root.addEventListener("click", (e) => {
    const el = e.target.closest("[href]");
    const path = el?.getAttribute("href");
    const target = el?.getAttribute("target");
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !path || path[0] == "#" || path.includes("//") || path.startsWith("mailto:") || target == "_blank")
      return;
    if (path != location.pathname)
      fn(path);
    e.preventDefault();
  });
}
function setSelected(path, className = "selected") {
  $$("." + className).forEach((el) => el.classList.remove(className));
  $$(`[href="${path}"]`).forEach((el) => el.classList.add(className));
}
var $ = function(query, root = document) {
  return root.querySelector(query);
};
var $$ = function(query, root = document) {
  return [...root.querySelectorAll(query)];
};
var hasStyle = function(sheet, sheets) {
  return sheets.find((el) => el.getAttribute("href") == sheet.getAttribute("href"));
};
var swapStyles = function(orig, styles) {
  orig.forEach((el, i) => el.disabled = !hasStyle(el, styles));
  return styles.filter((el) => !hasStyle(el, orig));
};
async function getHTML(path) {
  if (!cache[path]) {
    const resp = await fetch(path);
    cache[path] = await resp.text();
  }
  return cache[path];
}
var mkdom = function(html) {
  html = html.replace(/<(\/?)body/g, "<$1body2");
  const tmpl = document.createElement("template");
  tmpl.innerHTML = html.trim();
  return tmpl.content;
};
var loadCSS = function(paths, fn) {
  let loaded = 0;
  !paths[0] ? fn() : paths.forEach((el, i) => {
    loadSheet(el.href, () => {
      if (++loaded == paths.length)
        fn();
    });
  });
};
var loadSheet = function(path, fn) {
  const el = document.createElement("link");
  el.rel = "stylesheet";
  el.href = path;
  $("head").appendChild(el);
  el.onload = fn;
};
var is_browser = typeof window == "object";
if (is_browser) {
  history.pushState({ path: location.pathname }, 0);
  onclick(document, async (path) => {
    await loadPage(path);
    history.pushState({ path }, 0, path);
  });
  setSelected(location.pathname);
  addEventListener("popstate", (e) => {
    const { path } = e.state || {};
    if (path)
      loadPage(path);
  });
}
var cache = {};
export {
  setSelected,
  onclick,
  loadPage
};
