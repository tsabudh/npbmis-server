export const PROJECT_SUBMITTABLE = ["DRAFT", "REJECTED"];
export const PROJECT_VERIFIABLE = ["SUBMITTED"];
export const PROJECT_APPROVABLE = ["VERIFIED"];
export const PROJECT_EVALUABLE = ["APPROVED"];
export const PROJECT_REJECTABLE = ["SUBMITTED", "VERIFIED", "APPROVED"];

export const PROJECT_STATE = ["NEW_OR_UPCOMING", "ONGOING"];
export const PROJECT_APPROVAL_STATUS = [
  "DRAFT",
  "SUBMITTED",
  "VERIFIED",
  "APPROVED",
  "REJECTED",
  "EVALUATED",
];

export const PROJECT_BUDGET_CYCLE_TYPE = ["ANNUAL", "TERM_BASED"];
export const PROJECT_PRIORITY_CODES = ["P1", "P2"];
export const PROJECT_CLIMATE_CODES = ["1", "2", "3"]; // Climate code निम्न मानहरू मध्ये एक हुनुपर्छ: 1: अति सान्दर्भिक, 2: सान्दर्भिक, 3:तटस्थ
export const PROJECT_GENDER_CODES = ["1", "2", "3"]; //लिङ्ग कोड निम्न मानहरू मध्ये एक हुनुपर्छ: १ (निर्दिष्ट), २ (प्रत्यक्ष), वा ३ (तटस्थ)।
export const PROJECT_NATURE = [
  "LOCAL_LEVEL_PRIDE_PROJECT",
  "GAME_CHANGER_PROJECT",
  "GENERAL",
];

export const PROJECT_FUNDING_SOURCE = [
  "SELF",
  "PROVINCE_GOVERNMENT",
  "CENTRAL_GOVERNMENT",
];
export const PROJECT_FUNDING_POLICY = [
  "CO-FINANCING",
  "SPECIAL_GRANT",
  "CONDITIONAL_GRANT",
  "OTHER",
];

export const PROJECT_SELECTED_BY = ["MUNICIPAL_EXECUTIVE", "WARD_COMMITTEE"];

export const PROJECT_INCEPTION_STATUS = ["IDENTIFICATION", "EVALUATION"];

export const SDG_CODES = {
  1: { code: "१", name: "गरिबीको अन्त्य" },
  2: { code: "२", name: "शुन्य भोकमरी" },
  3: { code: "३", name: "स्वस्थ जीवन" },
  4: { code: "४", name: "गुणस्तरीय शिक्षा" },
  5: { code: "५", name: "लैंगिक समानता" },
  6: { code: "६", name: "स्वच्छ पानी र सरसफाई" },
  7: { code: "७", name: "आधुनिक उर्जामा पहुँच" },
  8: { code: "८", name: "समावेशी आर्थिक वृद्धि र मर्यादित काम" },
  9: { code: "९", name: "उद्योग नविन खोज र पूर्वाधार" },
  10: { code: "१०", name: "असमानता न्यूनीकरण" },
  11: { code: "११", name: "दिगो शहर र बस्ती" },
  12: { code: "१२", name: "दिगो उपभोग र उत्पादन" },
  13: { code: "१३", name: "जलवायु परिवर्तन" },
  14: { code: "१४", name: "सामुद्रिक स्रोतको उपयोग" },
  15: { code: "१५", name: "भूसतह स्रोतको उपयोग" },
  16: { code: "१६", name: "शान्ति, न्याय र सबल संस्था" },
  17: { code: "१७", name: "दिगो विकासको लागि साझेदारी" },
};
