# Proto Cookie Controller

Welcome to the Proto Cookie Controller library. Initalising this library will insert a cookie consent component into the DOM, which can be used to collect user consent for cookies. It offers a range of features to support GDPR compliance and is highly customisable, enabling you to tailor the consent experience to your specific requirements.

## Features

- **Flexible Display Options:** Choose from different display types like modal, bar, and toast to best fit your website’s design and user experience.

- **Customisable Consent Options:** Configure consent options for various cookie types, such as analytics, allowing for a granular consent process.

- **Granular Callbacks:** Execute custom actions based on user consent, either globally or on a per-cookie basis. These callbacks can be configured to trigger specific functions on consent acceptance or rejection.

- **Multilingual Support:** Includes translation capabilities to ensure that the consent interface communicates effectively with a diverse user base.

- **Predefined Essential Cookies:** Define a set of essential cookies that are exempt from user consent, such as ccDismissed, ensuring that necessary website functionalities are maintained.

- **Cookie Duration Management:** Control the duration for which each type of cookie is stored, providing clear information to users and aligning with GDPR’s data minimisation principle.

- **Recommended and Default States:** Set certain cookies as recommended or default, guiding users while still leaving the final choice in their hands.

- **Consent Recording:** Generate a unique identifier (uuid) for each consent instance, enabling a record of user preferences without storing personal data.

## Getting Started

### Installation

To install the Proto Cookie Controller library, run the following command:

```bash
npm install @protodigital/cookie-controller
```

### Usage

To use the Proto Cookie Controller library, import the `CookieController` class from the library and instantiate it with the required configuration options.

```typescript
import CookieController from "@protodigital/cookie-controller";

const ccInstance = new CookieController({
  type: "bar", // modal, bar and toast
  website: {
    name: "Proto Digital",
    privacyPolicyUrl: "https://protodigital.com/privacy-policy",
  },
  translations: {
    websiteName: "Proto Digital",
  },
  requiredCookies: ["ccDismissed"],
  cookies: [
    {
      key: "analytics",
      label: "Analytics",
      description:
        "We use analytics cookies to help us understand how users interact with our website. This helps us improve the website and your experience.",
      requiredCookies: ["_ga", "_gid", "_gat"],
      duration: 30,
      recommended: true,
      default: false,
      onAccept: () => {},
      onReject: () => {},
    },
  ],
  onAccept: (uuid: string) => {},
  onReject: (uuid: string) => {},
});
```

## Supporting GDPR-Related Features

Our Cookie Controller is developed with GDPR considerations in mind and includes features that support adherence to GDPR principles. It's important to note that while this tool offers functionalities aligning with GDPR requirements, full compliance depends on how the tool is implemented within your website's broader context and architecture.

### Key Features

- **Explicit Consent Management:** The controller facilitates the collection of explicit user consent for cookies, barring the use of pre-ticked boxes or implied consent strategies.

- **Granular Consent Options:** Users can provide consent selectively for different types of cookies, such as analytical, functional, or marketing cookies, enabling a more tailored consent experience.

- **Easy Consent Withdrawal:** The tool ensures that withdrawing consent is as straightforward as giving it, allowing users to modify their preferences with ease.

- **Transparency and Information:** It provides clear information about the use of cookies, helping website owners inform users about what cookies are active, their purpose, and their duration.

- **Consent Record Keeping:** While the tool does not store personal data, it generates a unique session identifier to record consent details, which helps in maintaining an audit trail without compromising user privacy.

- **Accessibility and Usability:** Designed with accessibility in mind, ensuring that consent options are easily navigable and understandable.

### Implementation Note

For effective use, it’s essential that the Proto Cookie Controller is configured and integrated in line with your specific website requirements. The actual GDPR compliance of your website will depend on multiple factors, including how cookies are used and managed beyond just obtaining consent.

### Disclaimer

This tool is provided to assist in aligning with GDPR-related requirements for cookie management. However, it's important to consult with a legal expert in GDPR compliance for comprehensive guidance and to ensure that your website fully meets all regulatory obligations.
