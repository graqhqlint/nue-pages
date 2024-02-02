// /Users/jackbereson/.bun/install/global/node_modules/nuemark/src/browser/nuemark.js
function $(query, root = document) {
  return root.querySelector(query);
}
function $$(query, root = document) {
  return [...root.querySelectorAll(query)];
}
var toggleClass = function(all, item, name = "selected") {
  all.forEach((el) => {
    if (el == item)
      el.classList.add(name);
    else
      el.classList.remove(name);
  });
};

class Tabs extends HTMLElement {
  constructor() {
    super();
    const links = $$("nav a", this);
    const items = $$("li", this);
    function toggle(i2) {
      toggleClass(links, links[i2]);
      toggleClass(items, items[i2]);
    }
    links.forEach((link, i2) => {
      link.onclick = (e) => {
        history.replaceState({}, 0, link.getAttribute("href"));
        e.preventDefault();
        toggle(i2);
      };
    });
    const i = links.findIndex((el) => el.getAttribute("href") == location.hash);
    toggle(i != -1 ? i : 0);
  }
}
customElements.define("nuemark-tabs", Tabs, { extends: "section" });
export {
  $$,
  $
};
