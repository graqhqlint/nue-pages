var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __require = (id) => {
  return import.meta.require(id);
};

// browser/mount.js
async function importAll(reload_path) {
  const comps = document.querySelector('[name="nue:components"]')?.getAttribute("content");
  if (!comps)
    return [];
  const arr = [];
  for (let path of comps.split(" ")) {
    if (path == reload_path)
      path += `?${++remounts}`;
    const { lib } = await import(path);
    if (lib)
      arr.push(...lib);
  }
  return arr;
}
async function mountAll(reload_path) {
  const els = document.querySelectorAll("[island]");
  const lib = els[0] ? await importAll(reload_path) : [];
  if (!lib[0])
    return;
  const { createApp } = await import("./nue.js");
  for (const node of [...els]) {
    const name = node.getAttribute("island");
    const next = node.nextElementSibling;
    const data = next?.type == "application/json" ? JSON.parse(next.textContent) : {};
    const comp = lib.find((a) => a.name == name);
    if (comp) {
      const app = createApp(comp, data, lib).mount(node);
      apps.push(app);
    } else {
      console.error("Component not defined:", name);
    }
  }
}
async function unmountAll() {
  apps.forEach((app) => app.unmount());
  apps = [];
}
var apps = [];
var remounts = 0;
addEventListener("route", mountAll);
addEventListener("DOMContentLoaded", mountAll);
export {
  unmountAll,
  mountAll
};
