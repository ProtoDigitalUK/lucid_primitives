const attributes = {
  modal: "data-cookie-modal",
  groups: "data-cookie-groups",

  policy: "data-cookie-policy",
  essential: "data-cookie-essential",

  close: "data-cookie-close",
  acceptAll: "data-cookie-accept-all",
  acceptRecommended: "data-cookie-accept-recommended",
  reject: "data-cookie-reject",
  details: "data-cookie-details",
};
const cookieController = "CookieController";

export default class CookieController {
  userOptions: CookieControllerOptionsT = {};
  constructor(options?: CookieControllerOptionsT) {
    if (options) this.userOptions = options;

    this.hasRequiredMarkup();
  }

  // ----------------
  // Public methods
  acceptRecommended() {}
  acceptAll() {}

  // ----------------
  // Error handling
  hasRequiredMarkup() {
    if (!this.modalEle)
      this.throwError(`Missing modal element "${attributes.modal}"`);
    if (!this.groupEle)
      this.throwError(`Missing group element "${attributes.groups}"`);
    if (!this.closeEles.length)
      this.throwError(`Missing close elements "${attributes.close}"`);
    if (!this.acceptAllEles.length && !this.acceptRecommendedEles.length)
      this.throwError(
        `Missing accept all or accept recommended elements "${attributes.acceptAll}" or "${attributes.acceptRecommended}"`
      );
    if (!this.rejectEles.length)
      this.throwError(`Missing reject elements "${attributes.reject}"`);
    if (!this.detailsEles.length)
      this.throwError(`Missing details elements "${attributes.details}"`);
  }
  throwError(message: string) {
    throw new Error(`[CookieController] ${message}`);
  }

  // ----------------
  // getters
  get options() {
    return {
      policyUrl: this.userOptions.policyUrl || null,
      essentialCookies: [
        cookieController,
        ...(this.userOptions.essentialCookies || []),
      ],
      cookieCategories: this.userOptions.cookieCategories || [],
      onConsentChange: () => {},
      versioning: {
        current: "",
        onNewVersion: () => {},
      },
    };
  }
  // Elements
  get modalEle() {
    return document.querySelector(`[${attributes.modal}]`);
  }
  get groupEle() {
    return document.querySelector(`[${attributes.groups}]`);
  }
  get policyEles() {
    return document.querySelectorAll(`[${attributes.policy}]`);
  }
  get essentialEles() {
    return document.querySelectorAll(`[${attributes.essential}]`);
  }
  get closeEles() {
    return document.querySelectorAll(`[${attributes.close}]`);
  }
  get acceptAllEles() {
    return document.querySelectorAll(`[${attributes.acceptAll}]`);
  }
  get acceptRecommendedEles() {
    return document.querySelectorAll(`[${attributes.acceptRecommended}]`);
  }
  get rejectEles() {
    return document.querySelectorAll(`[${attributes.reject}]`);
  }
  get detailsEles() {
    return document.querySelectorAll(`[${attributes.details}]`);
  }
}

// ----------------
// Types

interface CookieControllerOptionsT {
  policyUrl?: string;
  essentialCookies?: Array<string>;
  cookieCategories?: Array<{
    label: string;
    cookies: Array<CookieConfigT>;
  }>;
  onConsentChange?: (data: ConsetChangeT) => void;
  versioning?: {
    current: string;
    onNewVersion?: (oldVersion: string, newVersion: string) => void;
  };
}

interface ConsetChangeT {
  accepted: boolean;
  uuid: string;
}

interface CookieConfigT {
  key: string;
  label: string;
  description: string;
  cookies: Array<string>;
  duration: number;
  recommended: boolean;
  defaultState: boolean;
  onAccept: () => void;
  onRevoke: () => void;
}
