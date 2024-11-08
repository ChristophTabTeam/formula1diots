import React from "react";

const PrivacyPolicy: React.FC = () => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <h1>Privacy Policy</h1>
      <p>Effective Date: {formatDate(new Date("11.08.2024"))}</p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to Formula1diots, accessible at{" "}
        <a href="https://formulaidiots.de" className="hyperlink">
          formulaidiots.de
        </a>
        . Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your personal data when you use our website
        and related services.
      </p>

      <h2>2. Data Controller and Hosting Information</h2>
      <p>
        Formula1diots is hosted on Firebase by Google, with servers located in
        Frankfurt, Germany. Firebase provides a secure infrastructure, and your
        data is managed under European data protection regulations.
      </p>

      <h2>3. Data Collection and Usage</h2>

      <h3 style={{ fontFamily: "sans-serif" }}>3.1 Google Analytics</h3>
      <p>
        We use Google Analytics to analyze user activity and improve our
        service. This tool collects data such as IP addresses, user
        interactions, and session duration. The data is anonymized and helps us
        understand user behavior to enhance the experience on Formula1diots.
        Google Analytics uses cookies, which you can manage through your browser
        settings.
      </p>

      <h3 style={{ fontFamily: "sans-serif" }}>3.2 User Account Information</h3>
      <p>
        When you sign up or log in to Formula1diots, we collect information such
        as your username, email address, and password. This data is essential to
        provide secure access to your account and is not shared with third
        parties without your consent. Firebase Authentication is used to manage
        the login process and stores data securely within the Firebase
        infrastructure.
      </p>

      <h3 style={{ fontFamily: "sans-serif" }}>3.3 Data Storage</h3>
      <p>
        Race results and other related data that you and your friends enter are
        stored on Firebase. Firebase complies with data protection regulations,
        and all data is securely stored and managed on servers located in
        Frankfurt.
      </p>

      <h2>4. Cookies and Tracking Technologies</h2>
      <p>
        Formula1diots uses cookies for Google Analytics and essential
        functionalities. These cookies help us understand how you interact with
        our website, which in turn improves your experience. You can control
        cookie settings in your browser, and we encourage you to adjust them to
        your comfort.
      </p>

      <h2>5. Data Sharing and Disclosure</h2>
      <p>
        Formula1diots does not sell or share personal data with third parties.
        Data is only accessible by our team as necessary to maintain and improve
        the website. Google, as our service provider through Firebase and Google
        Analytics, may also have limited access to data under strict data
        protection agreements.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We take the security of your data seriously. Formula1diots uses
        encryption and other technical measures to protect your data against
        unauthorized access, alteration, and loss. Firebase provides a secure
        infrastructure with multiple layers of security to keep your information
        safe.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal data. You
        may also withdraw consent for data processing by adjusting your Google
        Analytics and cookie settings.
      </p>

      <h2>8. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes
        in our practices or legal requirements. We encourage you to review this
        page periodically for the latest information on our privacy practices.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
