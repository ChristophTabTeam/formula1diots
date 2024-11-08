import React, { useState } from "react";
import { useCookieConsent } from "../context/cookieContext/useCookieConsent";
import { initializeAnalytics } from "../firebase/firebaseConfig";

const CookieBanner: React.FC = () => {
  const { setConsent, bannerVisible } = useCookieConsent();
  const [moreInfo, setMoreInfo] = useState(false);

  const handleAccept = () => {
    setConsent(true);
    initializeAnalytics(); // Initialize analytics on acceptance
  };

  const handleDecline = () => {
    setConsent(false); // Declining sets banner visibility to false
  };

  const handleMoreInfo = () => {
    setMoreInfo(!moreInfo);
  };

  if (!bannerVisible) return null; // Hide banner if user has made a choice

  return (
    <div className="cookie-banner-wrapper">
      <div className={`cookie-banner ${moreInfo ? "more-info" : ""}`}>
        <p className="display-6 f1-regular">Cookie Consent</p>
        {moreInfo ? (
          <div className="cookie-more-info-wrapper">
            <h2 className="display-6 f1-regular">Why Do We Use Cookies?</h2>
            <h3>Necessary Cookies</h3>
            <p>
              These cookies are essential for the website to function properly.
              They enable basic functionalities such as page navigation and
              access to secure areas. Without these cookies, the website may not
              function as intended.
            </p>
            <h3>Performance Cookies</h3>
            <p>
              These cookies collect anonymous information about how visitors use
              our website, including which pages are visited most frequently and
              if visitors receive error messages. This data helps us improve the
              performance and usability of our website.
            </p>
            <h3>Functional Cookies</h3>
            <p>
              These cookies allow the website to remember your choices, such as
              your preferred language or location, and offer enhanced,
              personalized features.
            </p>
            <h3>Marketing Cookies</h3>
            <p>
              Marketing cookies help us deliver targeted content and
              advertisements that may be relevant to you. These cookies store
              information about your visit to our website and may combine it
              with other data sources to build your profile.
            </p>
            <h3>Google Analytics</h3>
            <p>
              We use Google Analytics to analyze visitor behavior on our
              website. Google Analytics collects information anonymously and
              reports website trends without identifying individual visitors.
              For more information, please refer to{" "}
              <a
                href="https://policies.google.com/privacy"
                className="hyperlink"
              >
                Google's Privacy Policy
              </a>
              .
            </p>
            <h2 className="display-6 f1-regular">Your Choices</h2>
            <h3>Accept</h3>
            <p>
              By clicking "Accept," you agree to the use of all the cookies
              described above. This allows us to provide you with an optimal
              user experience.
            </p>
            <h3>Reject</h3>
            <p>
              By clicking "Reject," we will only use the necessary cookies to
              ensure the core functionality of our website. This choice will not
              impact your ability to use the website but may limit some features
              and personalization options.
            </p>
            <h2>More Information</h2>
            <p>
              For further information on how we use your data and how you can
              change your cookie preferences at any time, please see our{" "}
              <a href="/privacy-policy" className="hyperlink">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        ) : (
          <p>
            We use cookies and similar technologies to enhance your experience
            on our website, analyze site performance, and show you personalized
            content and advertisements. You have the option to choose which
            cookies you wish to accept. Please read the information on our{" "}
            <a href="/privacy-policy" className="hyperlink">
              Privacy Policy
            </a>{" "}
            page carefully or select more info below to make an informed
            decision:
          </p>
        )}
        <div className="btn-wrapper cookie">
          <button onClick={handleAccept} className="cookie-accept">
            Accept
          </button>
          <button onClick={handleDecline} className="cookie-decline">
            Decline
          </button>
          <button onClick={handleMoreInfo} className="cookie-more-info">
            <span className="icon-16pt">info</span>
            {moreInfo ? "Close" : "More Info"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
