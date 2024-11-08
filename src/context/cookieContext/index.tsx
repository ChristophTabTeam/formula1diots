import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import { CookieConsentContext } from './context';
import { initializeAnalytics } from '../../firebase/firebaseConfig';

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [consentGiven, setConsentGiven] = useState<boolean>(false);
    const [bannerVisible, setBannerVisible] = useState<boolean>(true);

    useEffect(() => {
        // Check for consent cookie when component mounts
        const storedConsent = Cookies.get("cookieConsent");
        const hasConsent = storedConsent === "true";
        setConsentGiven(hasConsent);
        setBannerVisible(storedConsent === undefined); // Show banner only if no cookie

        // Initialize Google Analytics if consent was previously given
        if (hasConsent) {
            initializeAnalytics();
        }
    }, []);

    const setConsent = (consent: boolean) => {
        Cookies.set("cookieConsent", consent.toString(), { expires: 365, sameSite: 'Lax' }); // Set cookie with consent status
        setConsentGiven(consent);
        setBannerVisible(false); // Hide banner after consent or decline

        // Initialize Google Analytics only if user accepted cookies
        if (consent) {
            initializeAnalytics();
        }
    };

    return (
        <CookieConsentContext.Provider value={{ consentGiven, setConsent, bannerVisible, setBannerVisible }}>
            {children}
        </CookieConsentContext.Provider>
    );
};
