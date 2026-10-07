export type LegalDocumentId = "privacy" | "terms";

export type LegalSection = {
  readonly heading: string;
  readonly paragraphs: readonly string[];
};

export type LegalDocument = {
  readonly id: LegalDocumentId;
  readonly title: string;
  readonly meta: string;
  readonly sections: readonly LegalSection[];
};

export const PRIVACY_POLICY: LegalDocument = {
  id: "privacy",
  title: "Privacy Policy",
  meta: "Last updated [CONFIRM: last updated date]",
  sections: [
    {
      heading: "Who we are and who is responsible",
      paragraphs: [
        "Sprint is a mobile app that a gym gives to its members. It answers questions from the gym's own records, records check ins, and lets members view and pay their balance.",
        "The company behind Sprint is [CONFIRM: legal entity name], of [CONFIRM: registered address]. Contact us at [CONFIRM: contact email].",
        "The gym and Sprint both handle your personal data. The gym owns the records Sprint shows you, such as attendance, balance and expiry. Sprint runs the app and hosts the data. Our exact roles as controller and processor are [CONFIRM: controller and processor roles].",
      ],
    },
    {
      heading: "What personal data we collect",
      paragraphs: [
        "Your name and phone number.",
        "Your tier: Basic or Premium.",
        "Your balance and expiry, which come from Flutterwave payment records.",
        "Your check ins: the date and time, and whether the check in was made in the app or recorded by staff.",
        "Your payments: the amount, the status (pending, successful or failed), and the gateway reference.",
        "Your questions: the text of every question you ask, whether it was answered, and which record answered it.",
        "Card details are handled by Flutterwave, not by Sprint.",
      ],
    },
    {
      heading: "Why we use your data and our lawful basis",
      paragraphs: [
        "To run Sprint under your gym membership: answering your questions, showing your balance and expiry, and recording your check ins. Lawful basis: contract.",
        "To take your subscription payment through Flutterwave and record it. Lawful basis: contract.",
        "To log every question and its answer source, every check in and every payment event, so version two of Sprint can be built. Lawful basis: legitimate interests.",
        "Where the law requires consent, for example for a member under 18, we ask for it first. You can withdraw consent at any time. Lawful basis: consent.",
      ],
    },
    {
      heading: "Who we share your data with",
      paragraphs: [
        "Flutterwave, which processes your payments and handles card details.",
        "Your gym. Staff record check ins when your phone is unavailable. The owner approves shared record changes and views payment status.",
        "Our service providers: a hosted language model that turns your question into an answer from the record, a hosted vector database that searches shared records, and our hosting and database providers. Their names are [CONFIRM: service provider names].",
        "We do not sell your personal data.",
      ],
    },
    {
      heading: "Transfers outside Nigeria",
      paragraphs: [
        "Our records do not yet state where the app and its data are stored: [CONFIRM: hosting locations]. The language model, the vector database and Flutterwave may process data outside Nigeria: [CONFIRM: service provider locations].",
        "Where personal data is transferred outside Nigeria, we will only transfer it if the destination provides an adequate level of protection under the Nigeria Data Protection Act 2023, or if another exception in that Act applies. [CONFIRM: transfer safeguards]",
      ],
    },
    {
      heading: "How long we keep your data",
      paragraphs: [
        "We keep your personal data for as long as needed for the purposes in this policy. Question logs, check ins and payment records are kept to prepare for version two of Sprint. Our retention periods are [CONFIRM: retention periods].",
      ],
    },
    {
      heading: "How we protect your data",
      paragraphs: [
        "The app only shows you your own records. It refuses to answer questions about any other member.",
        "Your private records are never added to the search index. They are only fetched by your member id.",
        "Staff and the owner use a separate internal tool with its own login and permissions. The owner must approve a shared record change before members see it.",
        "The other technical and organisational measures we use are [CONFIRM: technical safeguards].",
      ],
    },
    {
      heading: "Your rights under the Nigeria Data Protection Act 2023",
      paragraphs: [
        "You have the right to: be informed about how we use your data; access your data and receive a copy; correct anything that is wrong; ask us to erase it; restrict how we use it; withdraw consent at any time; object, including to direct marketing; not be subject to a decision based only on automated processing without human review; and data portability where the regulations provide for it.",
        "To use any of these rights, contact us at [CONFIRM: contact email].",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "Sprint is for gym members aged 18 or over. A person under 18 may only use Sprint with the consent of a parent or guardian.",
      ],
    },
    {
      heading: "Data breaches",
      paragraphs: [
        "If a personal data breach is likely to put people at high risk, we will notify the Nigeria Data Protection Commission within 72 hours of becoming aware of it.",
        "We will tell affected members promptly when the risk is high.",
      ],
    },
    {
      heading: "How to complain",
      paragraphs: [
        "Contact us first at [CONFIRM: contact email] and we will look into your complaint.",
        "You may also complain to the Nigeria Data Protection Commission (NDPC).",
        "Our Data Protection Officer contact is [CONFIRM: Data Protection Officer contact].",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this policy at any time. The date at the top of this page shows the current version.",
        "Last updated [CONFIRM: last updated date].",
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDocument = {
  id: "terms",
  title: "Terms of Service",
  meta: "Effective date [CONFIRM: effective date]",
  sections: [
    {
      heading: "Who can use Sprint",
      paragraphs: [
        "Sprint is a mobile app for members of one gym. Only gym members can use it, and you need an account issued through your gym.",
        "These terms are between you and [CONFIRM: legal entity name]. Our registered address is [CONFIRM: registered address].",
      ],
    },
    {
      heading: "Accounts and passwords",
      paragraphs: [
        "Your account is for your membership only.",
        "Choose a password of at least 8 characters and keep it secret. You are responsible for everything that happens under your account.",
        "Tell us at [CONFIRM: contact email] if you think someone else knows your password.",
      ],
    },
    {
      heading: "What the service does",
      paragraphs: [
        "Sprint answers questions from your gym's own records: the timetable, prices, rules, guest policy, your attendance, your balance and your expiry.",
        "Every answer shows the record it used and when that record was last confirmed.",
        "If no record answers your question, the app says so and names the closest record it has.",
        "Answers only repeat what the record says. They are not medical or fitness safety advice, and the app refuses questions in those categories.",
        "The app never answers questions about any member other than you.",
        "Training plans and trainer guidance are for Premium members.",
      ],
    },
    {
      heading: "Payments and refunds",
      paragraphs: [
        "You pay your gym subscription in the app through Flutterwave. Card details are handled by Flutterwave, not by Sprint.",
        "The gym holds the merchant account. Your money goes to the gym's account. Sprint never holds your funds.",
        "Your balance and expiry always come from Flutterwave's transaction and subscription data.",
        "Refunds are handled by the gym under its own policy: [CONFIRM: refund policy].",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "Use Sprint for your own membership only. Do not try to read another member's records.",
        "Do not share your login, disrupt the service, scrape it, or use Sprint to break the law.",
        "Follow your gym's rules.",
      ],
    },
    {
      heading: "Content and intellectual property",
      paragraphs: [
        "Your questions belong to you. The gym's records belong to the gym.",
        "The Sprint app, including its software and design, belongs to [CONFIRM: legal entity name] or its licensors. All rights not given to you stay with us.",
      ],
    },
    {
      heading: "Availability and changes",
      paragraphs: [
        "We do not promise Sprint will always be available.",
        "We may add, change or remove features at any time.",
        "Shared records change when the gym drafts a change and the owner approves it, so answers can change with them.",
      ],
    },
    {
      heading: "Suspension and termination",
      paragraphs: [
        "You can stop using Sprint at any time.",
        "We may suspend or restrict your account if you break these terms, if payment is late, or if needed for security.",
        "On payment lapse your access drops to Basic immediately. After seven days of continued non payment your account is restricted. Seven days is our current setting and may change.",
      ],
    },
    {
      heading: "Limits of liability",
      paragraphs: [
        "We provide Sprint as it is. Where the law allows, we are not responsible for indirect or consequential loss, loss of profit, or loss of data.",
        "Nothing in these terms limits our responsibility for death or personal injury caused by negligence, for fraud, or for anything else that Nigerian law does not allow to be limited.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "Any dispute is governed by the laws of Nigeria. The courts (or arbitration seat) are [CONFIRM: court or arbitration seat].",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "Contact us at [CONFIRM: contact email], or write to [CONFIRM: legal entity name], [CONFIRM: registered address].",
      ],
    },
  ],
};
