export const API = Object.freeze({
  AUTH: {
    LOGIN: "login",
    RECOVERY: "recovery",
    RESET: "resetPassword",
  },
  ADMINS: {
    GET: "admin/get",
  },
  SERVICES: {
    GET: "service/get",
    CREATE: "service/create",
    LSIT: "service/list",
    UPDATE: "service/update",
    REMOVE: "service/remove",
  },
  AGENTS: {
    GET: "get",
    LIST: "list",
    CREATE: "create",
    IMG: "image",
    ADD_TO_NETWORK: "", //need to edit
    UPDATE: "update",
  },
  CLIENTS: {
    GET: "client/get",
    CREATE: "client/create",
  },
  BANNERS: {
    LIST: "banner/list",
  },
  JOINS: {
    CREATE: "join/create",
  },
  ADS: {
    GET: "ad/get",
    LIST: "ad/list",
    CREATE: "ad/create",
    IMG: "ad/image",
  },
  PAGES: {
    GET: "page/get",
    LIST: "page/list",
  },
});
