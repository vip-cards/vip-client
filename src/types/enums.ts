export enum EUserType {
  CLIENT = "client",
  VENDOR = "vendor",
  ADMIN = "admin",
  ORG = "org",
  BRANCH = "branch",
  AGENT = "agent",
  PARENT = "parent",
  CHILD = "child",
}

export enum EOrderRequestStatus {
  PENDING = "pending",
  VENDOR_ACCEPTED = "vendor accepted",
  VENDOR_REJECTED = "vendor rejected",
  CLIENT_ACCEPTED = "client accepted",
  CLIENT_REJECTED = "client rejected",
}
