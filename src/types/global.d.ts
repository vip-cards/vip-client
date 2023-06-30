declare interface ILocalizedString {
  en: string;
  ar: string;
}

declare interface IImage {
  ETag: string;
  ServerSideEncryption: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}

declare interface ICustomResponse<T> {
  success: boolean;
  code: number;
  error?: string;
  data?: {
    records?: T[];
    record?: T;
  };

  counts?: number;
}

declare enum EUserType {
  CLIENT = "client",
  VENDOR = "vendor",
  ADMIN = "admin",
  ORG = "org",
  BRANCH = "branch",
  AGENT = "agent",
  PARENT = "parent",
  CHILD = "child",
}
