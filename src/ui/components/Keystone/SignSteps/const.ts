export const CONTENT_MAX_WIDTH = 306;

export enum KeystoneStep {
  INITIAL = 1,
  SCAN = 2,
}

export const KeystoneConnectionType = {
  USB: "USB",
  QR: "QR",
} as const;

export type KeystoneConnectionType =
  | (typeof KeystoneConnectionType)[keyof typeof KeystoneConnectionType]
  | undefined;
