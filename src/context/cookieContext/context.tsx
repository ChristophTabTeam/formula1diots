import { createContext } from "react";

interface CookieContextProps {
    consentGiven: boolean;
    setConsent: (consent: boolean) => void;
    bannerVisible: boolean;
    setBannerVisible: (visible: boolean) => void;
}

export const CookieConsentContext = createContext<CookieContextProps | undefined>(undefined);
