/* eslint-disable quotes */

/* constants pool */
import { t } from '@unisat/i18n';
import { KeyringType } from '@unisat/keyring-service/types';
import { AddressType, ChainType, NetworkType } from '@unisat/wallet-types';

import { RestoreWalletType } from '../types';

export { ChainType } from '@unisat/wallet-types';

export const KEYRING_CLASS = {
  PRIVATE_KEY: 'Simple Key Pair',
  MNEMONIC: 'HD Key Tree',
  KEYSTONE: 'Keystone'
};

export const KEYRING_TYPE_TEXT = {
  [KeyringType.HdKeyring]: 'Created by Mnemonic',
  [KeyringType.SimpleKeyring]: 'Imported by Private Key',
  [KeyringType.KeystoneKeyring]: 'Import from Keystone',
  [KeyringType.ColdWalletKeyring]: 'Cold Wallet'
};
export const BRAND_ALIAN_TYPE_TEXT = {
  [KeyringType.HdKeyring]: 'Account',
  [KeyringType.SimpleKeyring]: 'Private Key',
  [KeyringType.KeystoneKeyring]: 'Account',
  [KeyringType.ColdWalletKeyring]: 'Account'
};

export const KEYRING_TYPES: {
  [key: string]: {
    name: string;
    tag: string;
    alianName: string;
  };
} = {
  'HD Key Tree': {
    name: 'HD Key Tree',
    tag: 'HD',
    alianName: 'HD Wallet'
  },
  'Simple Key Pair': {
    name: 'Simple Key Pair',
    tag: 'IMPORT',
    alianName: 'Single Wallet'
  },
  Keystone: {
    name: 'Keystone',
    tag: 'KEYSTONE',
    alianName: 'Keystone'
  },
  'Cold Wallet': {
    name: 'Cold Wallet',
    tag: 'COLD',
    alianName: 'Cold Wallet'
  }
};

export const IS_CHROME = /Chrome\//i.test(navigator.userAgent);

export const IS_FIREFOX = /Firefox\//i.test(navigator.userAgent);

export const IS_LINUX = /linux/i.test(navigator.userAgent);

let chromeVersion: number | null = null;

if (IS_CHROME) {
  const matches = navigator.userAgent.match(/Chrome\/(\d+[^.\s])/);
  if (matches && matches.length >= 2) {
    chromeVersion = Number(matches[1]);
  }
}

export const IS_AFTER_CHROME91 = IS_CHROME ? chromeVersion && chromeVersion >= 91 : false;

export const GAS_LEVEL_TEXT = {
  slow: 'Standard',
  normal: 'Fast',
  fast: 'Instant',
  custom: 'Custom'
};

export const IS_WINDOWS = /windows/i.test(navigator.userAgent);

export const LANGS = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'zh_TW',
    label: '繁體中文 / 简体中文'
  },
  {
    value: 'ja',
    label: '日本語'
  },
  {
    value: 'es',
    label: 'Español'
  },
  {
    value: 'fr',
    label: 'Français'
  },
  {
    value: 'ru',
    label: 'Русский'
  }
];

export const ADDRESS_TYPES: {
  value: AddressType;
  label: string;
  name: string;
  hdPath: string;
  displayIndex: number;
  isUnisatLegacy?: boolean;
}[] = [
  {
    value: AddressType.P2PKH,
    label: 'P2PKH',
    name: 'Legacy (P2PKH)',
    hdPath: "m/44'/0'/0'/0",
    displayIndex: 3,
    isUnisatLegacy: false
  },
  {
    value: AddressType.P2WPKH,
    label: 'P2WPKH',
    name: 'Native Segwit (P2WPKH)',
    hdPath: "m/84'/0'/0'/0",
    displayIndex: 0,
    isUnisatLegacy: false
  },
  {
    value: AddressType.P2TR,
    label: 'P2TR',
    name: 'Taproot (P2TR)',
    hdPath: "m/86'/0'/0'/0",
    displayIndex: 2,
    isUnisatLegacy: false
  },
  {
    value: AddressType.P2SH_P2WPKH,
    label: 'P2SH-P2WPKH',
    name: 'Nested Segwit (P2SH-P2WPKH)',
    hdPath: "m/49'/0'/0'/0",
    displayIndex: 1,
    isUnisatLegacy: false
  },
  {
    value: AddressType.M44_P2WPKH,
    label: 'P2WPKH',
    name: 'Native SegWit (P2WPKH)',
    hdPath: "m/44'/0'/0'/0",
    displayIndex: 4,
    isUnisatLegacy: true
  },
  {
    value: AddressType.M44_P2TR,
    label: 'P2TR',
    name: 'Taproot (P2TR)',
    hdPath: "m/44'/0'/0'/0",
    displayIndex: 5,
    isUnisatLegacy: true
  }
];

export const OW_HD_PATH = "m/86'/0'/0'";

export const getRestoreWallets = (): { value: RestoreWalletType; name: string; addressTypes: AddressType[] }[] => [
  {
    value: RestoreWalletType.UNISAT,
    name: 'UniSat Wallet',
    addressTypes: [
      AddressType.P2WPKH,
      AddressType.P2SH_P2WPKH,
      AddressType.P2TR,
      AddressType.P2PKH,
      AddressType.M44_P2WPKH,
      AddressType.M44_P2TR
    ]
  },
  {
    value: RestoreWalletType.SPARROW,
    name: 'Sparrow Wallet',
    addressTypes: [AddressType.P2PKH, AddressType.P2WPKH, AddressType.P2SH_P2WPKH, AddressType.P2TR]
  },
  {
    value: RestoreWalletType.XVERSE,
    name: 'Xverse Wallet',
    addressTypes: [AddressType.P2SH_P2WPKH, AddressType.P2TR]
  },
  {
    value: RestoreWalletType.OW,
    name: 'Ordinals Wallet',
    addressTypes: [AddressType.P2TR]
  },
  {
    value: RestoreWalletType.OTHERS,
    name: t('other_wallet'),
    addressTypes: [
      AddressType.P2PKH,
      AddressType.P2WPKH,
      AddressType.P2SH_P2WPKH,
      AddressType.P2TR,
      AddressType.M44_P2WPKH,
      AddressType.M44_P2TR
    ]
  }
];

export const NETWORK_TYPES = [
  { value: NetworkType.MAINNET, label: 'LIVENET', name: 'livenet', validNames: [0, 'livenet', 'mainnet'] },
  { value: NetworkType.TESTNET, label: 'TESTNET', name: 'testnet', validNames: ['testnet'] }
];

export type TypeChain = {
  enum: ChainType;
  label: string;
  iconLabel: string;
  icon: string;
  unit: string;
  networkType: NetworkType;
  endpoints: string[];
  mempoolSpaceUrl: string;
  unisatUrl: string;
  ordinalsUrl: string;
  unisatExplorerUrl: string;
  okxExplorerUrl: string;
  isViewTxHistoryInternally?: boolean;
  disable?: boolean;
  isFractal?: boolean;
  showPrice: boolean;
  defaultExplorer: 'mempool-space' | 'unisat-explorer';
  enableBrc20SingleStep?: boolean;
  enableBrc20Prog?: boolean;
};

export const CHAINS_MAP: { [key: string]: TypeChain } = {
  [ChainType.BITCOIN_MAINNET]: {
    enum: ChainType.BITCOIN_MAINNET,
    label: 'Bitcoin',
    iconLabel: 'Bitcoin',
    icon: './images/artifacts/bitcoin-mainnet.svg',
    unit: 'BTC',
    networkType: NetworkType.MAINNET,
    endpoints: ['https://wallet-api.unisat.io'],
    mempoolSpaceUrl: 'https://mempool.space',
    unisatUrl: 'https://unisat.io',
    ordinalsUrl: 'https://ordinals.com',
    unisatExplorerUrl: 'https://uniscan.cc',
    okxExplorerUrl: '',
    showPrice: true,
    defaultExplorer: 'mempool-space',
    enableBrc20Prog: true
  },
  [ChainType.BITCOIN_TESTNET]: {
    enum: ChainType.BITCOIN_TESTNET,
    label: 'Bitcoin Testnet',
    iconLabel: 'Bitcoin',
    icon: './images/artifacts/bitcoin-testnet.svg',
    unit: 'tBTC',
    networkType: NetworkType.TESTNET,
    endpoints: ['https://wallet-api-testnet.unisat.io'],
    mempoolSpaceUrl: 'https://mempool.space/testnet',
    unisatUrl: 'https://testnet.unisat.io',
    ordinalsUrl: 'https://testnet.ordinals.com',
    unisatExplorerUrl: '',
    okxExplorerUrl: '',
    showPrice: false,
    defaultExplorer: 'mempool-space'
  },
  [ChainType.BITCOIN_TESTNET4]: {
    enum: ChainType.BITCOIN_TESTNET4,
    label: 'Bitcoin Testnet4 (Beta)',
    iconLabel: 'Bitcoin',
    icon: './images/artifacts/bitcoin-testnet.svg',
    unit: 'tBTC',
    networkType: NetworkType.TESTNET,
    endpoints: ['https://wallet-api-testnet4.unisat.io'],
    mempoolSpaceUrl: 'https://mempool.space/testnet4',
    unisatUrl: 'https://testnet4.unisat.io',
    ordinalsUrl: 'https://testnet4.ordinals.com',
    unisatExplorerUrl: '',
    okxExplorerUrl: '',
    showPrice: false,
    defaultExplorer: 'mempool-space'
  },
  [ChainType.BITCOIN_SIGNET]: {
    enum: ChainType.BITCOIN_SIGNET,
    label: 'Bitcoin Signet',
    iconLabel: 'Bitcoin',
    icon: './images/artifacts/bitcoin-signet.svg',
    unit: 'sBTC',
    networkType: NetworkType.TESTNET,
    endpoints: ['https://wallet-api-signet.unisat.io'],
    mempoolSpaceUrl: 'https://mempool.space/signet',
    unisatUrl: 'https://signet.unisat.io',
    ordinalsUrl: 'https://signet.ordinals.com',
    unisatExplorerUrl: 'https://uniscan.cc/signet',
    okxExplorerUrl: '',
    showPrice: false,
    defaultExplorer: 'unisat-explorer',
    enableBrc20Prog: true
  },
  [ChainType.FRACTAL_BITCOIN_MAINNET]: {
    enum: ChainType.FRACTAL_BITCOIN_MAINNET,
    label: 'Fractal Bitcoin',
    iconLabel: 'Fractal',
    icon: './images/artifacts/fractal-mainnet.svg',
    unit: 'FB',
    networkType: NetworkType.MAINNET,
    endpoints: ['https://wallet-api-fractal.unisat.io'],
    mempoolSpaceUrl: 'https://mempool.fractalbitcoin.io',
    unisatUrl: 'https://fractal.unisat.io',
    ordinalsUrl: 'https://ordinals.fractalbitcoin.io',
    unisatExplorerUrl: 'https://uniscan.cc/fractal',
    okxExplorerUrl: '',
    isViewTxHistoryInternally: false,
    disable: false,
    isFractal: true,
    showPrice: true,
    defaultExplorer: 'unisat-explorer',
    enableBrc20SingleStep: true
  },
  [ChainType.FRACTAL_BITCOIN_TESTNET]: {
    enum: ChainType.FRACTAL_BITCOIN_TESTNET,
    label: 'Fractal Bitcoin Testnet',
    iconLabel: 'Fractal',
    icon: './images/artifacts/fractal-testnet.svg',
    unit: 'tFB',
    networkType: NetworkType.MAINNET,
    endpoints: ['https://wallet-api-fractal-testnet.unisat.io'],
    mempoolSpaceUrl: 'https://mempool-testnet.fractalbitcoin.io',
    unisatUrl: 'https://fractal-testnet.unisat.io',
    ordinalsUrl: 'https://ordinals-testnet.fractalbitcoin.io',
    unisatExplorerUrl: 'https://uniscan.cc/fractal-testnet',
    okxExplorerUrl: '',
    isViewTxHistoryInternally: false,
    isFractal: true,
    showPrice: false,
    defaultExplorer: 'unisat-explorer',
    enableBrc20SingleStep: true
  }
};

export const CHAINS = Object.values(CHAINS_MAP);

export type TypeChainGroup = {
  type: 'single' | 'list';
  chain?: TypeChain;
  label?: string;
  icon?: string;
  items?: TypeChain[];
};

export const CHAIN_GROUPS: TypeChainGroup[] = [
  {
    type: 'single',
    chain: CHAINS_MAP[ChainType.BITCOIN_MAINNET]
  },
  {
    type: 'list',
    label: 'Bitcoin Testnet',
    icon: './images/artifacts/bitcoin-testnet-all.svg',
    items: [
      CHAINS_MAP[ChainType.BITCOIN_TESTNET],
      CHAINS_MAP[ChainType.BITCOIN_TESTNET4],
      CHAINS_MAP[ChainType.BITCOIN_SIGNET]
    ]
  },
  {
    type: 'single',
    chain: CHAINS_MAP[ChainType.FRACTAL_BITCOIN_MAINNET]
  },
  {
    type: 'single',
    chain: CHAINS_MAP[ChainType.FRACTAL_BITCOIN_TESTNET]
  }
];

export const MINIMUM_GAS_LIMIT = 21000;

export enum WATCH_ADDRESS_CONNECT_TYPE {
  WalletConnect = 'WalletConnect'
}

export const WALLETCONNECT_STATUS_MAP = {
  PENDING: 1,
  CONNECTED: 2,
  WAITING: 3,
  SIBMITTED: 4,
  REJECTED: 5,
  FAILD: 6
};

export const INTERNAL_REQUEST_ORIGIN = 'https://unisat.io';

export const INTERNAL_REQUEST_SESSION = {
  name: 'UniSat Wallet',
  origin: INTERNAL_REQUEST_ORIGIN,
  icon: './images/logo/logo@128x.png'
};

export const EVENTS = {
  broadcastToUI: 'broadcastToUI',
  broadcastToBackground: 'broadcastToBackground',
  SIGN_FINISHED: 'SIGN_FINISHED',
  WALLETCONNECT: {
    STATUS_CHANGED: 'WALLETCONNECT_STATUS_CHANGED',
    INIT: 'WALLETCONNECT_INIT',
    INITED: 'WALLETCONNECT_INITED'
  }
};

export const COIN_NAME = 'BTC';
export const COIN_SYMBOL = 'BTC';

export const COIN_DUST = 1000;

export const TO_LOCALE_STRING_CONFIG = {
  minimumFractionDigits: 8
};

export const SAFE_DOMAIN_CONFIRMATION = 3;

export const GITHUB_URL = 'https://github.com/unisat-wallet/extension';
export const DISCORD_URL = 'https://discord.com/invite/EMskB2sMz8';
export const TWITTER_URL = 'https://twitter.com/unisat_wallet';
export const TELEGRAM_URL = 'https://t.me/unisat_wallet';
export const WEBSITE_URL = 'https://unisat.io';
export const FEEDBACK_URL = 'https://feedback.unisat.io';
export const EMAIL_URL = 'contact@unisat.io';
export const DOCS_URL = ' https://docs.unisat.io/dev/unisat-developer-center ';
export const MEDIUM_URL = 'https://unisat-wallet.medium.com/';
export const UPDATE_URL = 'https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo';
export const REVIEW_URL =
  'https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo/reviews';
export const TERMS_OF_SERVICE_URL = 'https://unisat.io/terms-of-service.html';
export const PRIVACY_POLICY_URL = 'https://unisat.io/privacy-policy.html';

export const CHANNEL = process.env.channel!;
export const VERSION = process.env.release!;
export const MANIFEST_VERSION = process.env.manifest!;

export enum AddressFlagType {
  Is_Enable_Atomicals = 0b1, // deprecated
  CONFIRMED_UTXO_MODE = 0b10,
  DISABLE_AUTO_SWITCH_CONFIRMED = 0b100,
  DISABLE_ARC20 = 0b1000
}

export const UNCONFIRMED_HEIGHT = 4194303;

export enum PaymentChannelType {
  MoonPay = 'moonpay',
  AlchemyPay = 'alchemypay',
  Transak = 'transak'
}

export const PAYMENT_CHANNELS = {
  moonpay: {
    name: 'MoonPay',
    img: './images/artifacts/moonpay.png'
  },
  alchemypay: {
    name: 'Alchemy Pay',
    img: './images/artifacts/alchemypay.png'
  },

  transak: {
    name: 'Transak',
    img: './images/artifacts/transak.png'
  }
};

export enum HardwareWalletType {
  Keystone = 'keystone',
  Ledger = 'ledger',
  Trezor = 'trezor'
}

export const HARDWARE_WALLETS = {
  [HardwareWalletType.Keystone]: {
    name: 'Keystone',
    img: './images/artifacts/keystone.png'
  },
  [HardwareWalletType.Ledger]: {
    name: 'Ledger',
    img: './images/artifacts/ledger.png'
  },
  [HardwareWalletType.Trezor]: {
    name: 'Trezor',
    img: './images/artifacts/trezor.png'
  }
};

export const AUTO_LOCK_TIMES = [
  { id: 0, time: 30000 },
  { id: 1, time: 60000 },
  { id: 2, time: 180000 },
  { id: 3, time: 300000 },
  { id: 4, time: 600000 },
  { id: 5, time: 1800000 },
  { id: 6, time: 3600000 },
  { id: 7, time: 14400000 }
];

export const getAutoLockTimes = () => [
  { id: 0, time: 30000, label: `30${t('seconds')}` },
  { id: 1, time: 60000, label: `1${t('minute')}` },
  { id: 2, time: 180000, label: `3${t('minutes')}` },
  { id: 3, time: 300000, label: `5${t('minutes')}` },
  { id: 4, time: 600000, label: `10${t('minutes')}` },
  { id: 5, time: 1800000, label: `30${t('minutes')}` },
  { id: 6, time: 3600000, label: `1${t('hour')}` },
  { id: 7, time: 14400000, label: `4${t('hours')}` }
];

export const DEFAULT_LOCKTIME_ID = 5;

export const MIN_TRANSACTION_FEE_SATS = 206;
