declare class CookieController {
    userOptions: CookieControllerOptionsT;
    state: CookieStateT;
    constructor(options?: CookieControllerOptionsT);
    private initalise;
    private registerEvents;
    private setDynamicAttributes;
    private setStaticAttributes;
    private getCookieHelper;
    private onCookieChange;
    private onConsentChange;
    destroy(): void;
    accept(): void;
    reject(): void;
    rejectAccept(mode?: "accept" | "reject"): void;
    dismiss(): void;
    showDetails(): void;
    onSave(): void;
    getCookieConsent(key: string): boolean | undefined;
    throwError(message: string): void;
    set alertState(state: boolean);
    set detailsState(state: boolean);
    set cookieState(state: CookieStateT);
    get options(): {
        mode: string;
        onConsentChange: ((data: ConsentChangeT) => void) | null;
        versioning: {
            current: string;
            onNewVersion?: ((oldVersion: string, newVersion: string) => void) | undefined;
        } | null;
    };
    get alertState(): boolean;
    get detailsState(): boolean;
    get cookieState(): CookieStateT;
    get details(): Element | null;
    get alert(): Element | null;
    get cookieConfig(): HTMLInputElement[];
    get actionDismiss(): NodeListOf<Element>;
    get actionAccept(): NodeListOf<Element>;
    get actionReject(): NodeListOf<Element>;
    get actionDetails(): NodeListOf<Element>;
    get actionSave(): NodeListOf<Element>;
}
interface CookieControllerOptionsT {
    onConsentChange?: (data: ConsentChangeT) => void;
    versioning?: {
        current: string;
        onNewVersion?: (oldVersion: string, newVersion: string) => void;
    };
}
interface ConsentChangeT {
    type: "cookie" | "accept" | "reject" | "save" | "onload";
    uuid: string;
    version?: string;
    cookie?: {
        key: string;
        value: boolean;
    };
    cookies: Record<string, boolean>;
}
interface CookieStateT {
    uuid: string;
    version?: string;
    interacted: boolean;
    cookies: Record<string, boolean>;
}

export { CookieController as default };
