"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => CookieController
});
module.exports = __toCommonJS(src_exports);
var import_uuid = require("uuid");
var attributes = {
  details: "data-cookie-details",
  alert: "data-cookie-alert",
  cookieConfig: "data-cookie-config",
  action: {
    attribute: "data-cookie-action",
    value: {
      dismiss: "dismiss",
      accept: "accept",
      reject: "reject",
      details: "details",
      save: "save"
    }
  }
};
var ids = {
  details: "cookie-details",
  alert: "cookie-alert"
};
var cookieController = "CookieController";
var CookieController = class {
  userOptions = {};
  state = {
    uuid: "",
    interacted: false,
    cookies: {}
  };
  constructor(options) {
    if (options)
      this.userOptions = options;
    this.initalise();
  }
  // ----------------
  // Private methods
  initalise() {
    this.state = this.cookieState;
    this.registerEvents();
    this.setStaticAttributes();
    this.setDynamicAttributes();
    if (!this.state.interacted) {
      this.alertState = true;
    }
    if (this.state.version && this.options.versioning?.current) {
      if (this.state.version !== this.options.versioning.current) {
        if (this.options.versioning.onNewVersion) {
          this.options.versioning.onNewVersion(
            this.state.version,
            this.options.versioning.current
          );
        }
      }
      this.state.version = this.options.versioning.current;
      this.cookieState = this.state;
    }
    this.onConsentChange("onload");
  }
  registerEvents() {
    this.accept = this.accept.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.reject = this.reject.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCookieChange = this.onCookieChange.bind(this);
    this.actionDismiss.forEach(
      (element) => element.addEventListener("click", this.dismiss)
    );
    this.actionAccept.forEach(
      (element) => element.addEventListener("click", this.accept)
    );
    this.actionReject.forEach(
      (element) => element.addEventListener("click", this.reject)
    );
    this.actionDetails.forEach(
      (element) => element.addEventListener("click", this.showDetails)
    );
    this.actionSave.forEach(
      (element) => element.addEventListener("click", this.onSave)
    );
    this.cookieConfig.forEach((element) => {
      element.addEventListener("change", this.onCookieChange);
    });
  }
  setDynamicAttributes() {
    const detailsState = this.detailsState;
    this.details?.setAttribute("aria-hidden", detailsState ? "false" : "true");
    this.alert?.setAttribute("aria-hidden", detailsState ? "true" : "false");
    this.actionDetails.forEach((element) => {
      element.setAttribute("aria-expanded", detailsState ? "true" : "false");
    });
  }
  setStaticAttributes() {
    if (!this.details?.hasAttribute("id"))
      this.details?.setAttribute("id", ids.details);
    if (!this.alert?.hasAttribute("id"))
      this.alert?.setAttribute("id", ids.alert);
    const detailId = this.details?.getAttribute("id");
    this.details?.setAttribute("role", "dialog");
    this.details?.setAttribute("aria-modal", "true");
    this.alert?.setAttribute("aria-live", "polite");
    this.alert?.setAttribute("role", "alert");
    this.actionDetails.forEach((element) => {
      element.setAttribute("aria-controls", detailId);
      element.setAttribute("aria-haspopup", "dialog");
    });
  }
  getCookieHelper(key) {
    const cookie = document.cookie.split(";").find((cookie2) => cookie2.trim().startsWith(`${key}=`));
    if (cookie) {
      const cookieValue = cookie.split("=")[1];
      return cookieValue;
    }
  }
  onCookieChange(e) {
    if (this.options.mode !== "onChange")
      return;
    const target = e.target;
    const key = target.getAttribute(attributes.cookieConfig);
    if (!key)
      return;
    const value = target.checked;
    this.state.cookies[key] = value;
    this.cookieState = this.state;
    this.onConsentChange("cookie", {
      key,
      value
    });
  }
  onConsentChange(type, cookie) {
    if (this.options.onConsentChange) {
      this.options.onConsentChange({
        type,
        uuid: this.state.uuid,
        version: this.state.version,
        cookies: this.state.cookies,
        cookie
      });
    }
  }
  // ----------------
  // Public methods
  destroy() {
    this.actionDismiss.forEach(
      (element) => element.removeEventListener("click", this.dismiss)
    );
    this.actionAccept.forEach(
      (element) => element.removeEventListener("click", this.accept)
    );
    this.actionReject.forEach(
      (element) => element.removeEventListener("click", this.reject)
    );
    this.actionDetails.forEach(
      (element) => element.removeEventListener("click", this.showDetails)
    );
    this.actionSave.forEach(
      (element) => element.removeEventListener("click", this.onSave)
    );
    this.cookieConfig.forEach((element) => {
      element.removeEventListener("change", this.onCookieChange);
    });
  }
  accept() {
    this.rejectAccept("accept");
  }
  reject() {
    this.rejectAccept("reject");
  }
  rejectAccept(mode = "accept") {
    this.cookieConfig.forEach((element) => {
      const key = element.getAttribute(attributes.cookieConfig);
      this.state.cookies[key] = mode === "accept" ? true : false;
    });
    this.onConsentChange(mode);
    this.dismiss();
  }
  dismiss() {
    this.detailsState = false;
    this.alertState = false;
    this.state.interacted = true;
    this.cookieState = this.state;
  }
  showDetails() {
    this.cookieConfig.forEach((element) => {
      const key = element.getAttribute(attributes.cookieConfig);
      const value = this.state.cookies[key];
      element.checked = value ? true : false;
    });
    this.detailsState = !this.detailsState;
    this.state.interacted = true;
    this.cookieState = this.state;
  }
  onSave() {
    this.cookieConfig.forEach((element) => {
      const key = element.getAttribute(attributes.cookieConfig);
      const value = element.checked;
      this.state.cookies[key] = value;
    });
    this.onConsentChange("save");
    this.dismiss();
  }
  getCookieConsent(key) {
    return this.state.cookies[key];
  }
  // ----------------
  // Error handling
  throwError(message) {
    throw new Error(`[CookieController] ${message}`);
  }
  // ----------------
  // Setters
  set alertState(state) {
    this.alert?.setAttribute("data-cookie-alert", state ? "true" : "false");
    this.setDynamicAttributes();
  }
  set detailsState(state) {
    if (this.alertState)
      this.alertState = false;
    this.details?.setAttribute("data-cookie-details", state ? "true" : "false");
    this.setDynamicAttributes();
  }
  set cookieState(state) {
    if (!state.uuid)
      state.uuid = (0, import_uuid.v4)();
    const cookieValue = JSON.stringify(state);
    document.cookie = `${cookieController}=${cookieValue};path=/;SameSite=Strict`;
    this.state = state;
  }
  // ----------------
  // getters
  get options() {
    return {
      mode: this.actionSave.length > 0 ? "onSave" : "onChange",
      onConsentChange: this.userOptions.onConsentChange || null,
      versioning: this.userOptions.versioning || null
    };
  }
  // State
  get alertState() {
    return this.alert?.getAttribute("data-cookie-alert") == "true" ? true : false;
  }
  get detailsState() {
    return this.details?.getAttribute("data-cookie-details") == "true" ? true : false;
  }
  get cookieState() {
    const defaultCookies = {};
    this.cookieConfig.forEach((element) => {
      const key = element.getAttribute(attributes.cookieConfig);
      defaultCookies[key] = false;
    });
    try {
      const value = this.getCookieHelper(cookieController);
      if (value) {
        return JSON.parse(value);
      }
      return {
        uuid: "",
        version: this.options.versioning?.current || void 0,
        interacted: false,
        cookies: defaultCookies
      };
    } catch (error) {
      return {
        uuid: "",
        version: this.options.versioning?.current || void 0,
        interacted: false,
        cookies: defaultCookies
      };
    }
  }
  // Elements
  get details() {
    return document.querySelector(`[${attributes.details}]`);
  }
  get alert() {
    return document.querySelector(`[${attributes.alert}]`);
  }
  get cookieConfig() {
    const eles = document.querySelectorAll(
      `[${attributes.cookieConfig}]`
    );
    return Array.from(eles).filter(
      (ele) => ele.getAttribute("type") === "checkbox"
    );
  }
  get actionDismiss() {
    return document.querySelectorAll(
      `[${attributes.action.attribute}="${attributes.action.value.dismiss}"]`
    );
  }
  get actionAccept() {
    return document.querySelectorAll(
      `[${attributes.action.attribute}="${attributes.action.value.accept}"]`
    );
  }
  get actionReject() {
    return document.querySelectorAll(
      `[${attributes.action.attribute}="${attributes.action.value.reject}"]`
    );
  }
  get actionDetails() {
    return document.querySelectorAll(
      `[${attributes.action.attribute}="${attributes.action.value.details}"]`
    );
  }
  get actionSave() {
    return document.querySelectorAll(
      `[${attributes.action.attribute}="${attributes.action.value.save}"]`
    );
  }
};
//# sourceMappingURL=index.cjs.map