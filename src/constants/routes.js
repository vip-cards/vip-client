export const ROUTES = Object.freeze({
  ACCOUNT: "account",
  LOGIN: "/login",
  LOGOUT: "/logout",
  FORGOT_PASSWORD: "/forgot-password",

  SUBAGENTS: { LIST: "/sub-agents", CREATE: "/sub-agent/create" },

  REQUESTS: "requests",
  REQUESTS_VIEWS: {
    INCOMING: "incoming",
    OUTGOING: "outgoing",
  },

  CHAT: "chat",
  LOCATION: "location",

  ADS: {
    MAIN: "ads",
    LIST: "/ads/list",
    CREATE: "/ads/create",
  },
  BLOCKED: "blocked",
  /* org specified */
});
