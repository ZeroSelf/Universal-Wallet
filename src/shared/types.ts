import { AddressType, ChainType } from '@unisat/wallet-types';

import { PaymentChannelType } from './constant';

export { AddressType } from '@unisat/wallet-types';

export enum NetworkType {
  MAINNET,
  TESTNET
}

export enum RestoreWalletType {
  UNISAT = 1,
  SPARROW = 2,
  XVERSE = 3,
  OW = 4,
  OTHERS = 5
}

/**
 * Sign data type
 * @enum {number}
 * @readonly
 * @enum {number}
 * @readonly
 */
export enum CosmosSignDataType {
  COSMOS_AMINO = 1,
  COSMOS_DIRECT = 2
}

export interface Chain {
  name: string;
  logo: string;
  enum: ChainType;
  network: string;
}

export interface BitcoinBalance {
  confirm_amount: string;
  pending_amount: string;
  amount: string;
  confirm_btc_amount: string;
  pending_btc_amount: string;
  btc_amount: string;
  confirm_inscription_amount: string;
  pending_inscription_amount: string;
  inscription_amount: string;
  usd_value: string;
}

export interface AddressAssets {
  total_btc: string;
  satoshis?: number;
  total_inscription: number;
}

export interface TxHistoryInOutItem {
  address: string;
  value: number;
  inscriptions: { inscriptionId: string }[];
  runes: { spacedRune: string; symbol: string; divisibility: number; amount: string }[];
  brc20: { ticker: string; amount: string }[];
}

export interface TxHistoryItem {
  txid: string;
  confirmations: number;
  height: number;
  timestamp: number;
  size: number;
  feeRate: number;
  fee: number;
  outputValue: number;
  vin: TxHistoryInOutItem[];
  vout: TxHistoryInOutItem[];
  types: string[];
  methods: string[];
}

export interface Inscription {
  inscriptionId: string;
  inscriptionNumber: number;
  address: string;
  outputValue: number;
  preview: string;
  content: string;
  contentType: string;
  contentLength: number;
  timestamp: number;
  genesisTransaction: string;
  location: string;
  output: string;
  offset: number;
  contentBody: string;
  utxoHeight: number;
  utxoConfirmation: number;
  brc20?: {
    op: string;
    tick: string;
    lim: string;
    amt: string;
    decimal: string;
  };
  multipleNFT?: boolean;
  sameOffset?: boolean;
  children?: string[];
  parents?: string[];
}

export interface Atomical {
  atomicalId: string;
  atomicalNumber: number;
  type: 'FT' | 'NFT';
  ticker?: string;
  atomicalValue: number;

  // mint info
  address: string;
  outputValue: number;
  preview: string;
  content: string;
  contentType: string;
  contentLength: number;
  timestamp: number;
  genesisTransaction: string;
  location: string;
  output: string;
  offset: number;
  contentBody: string;
  utxoHeight: number;
  utxoConfirmation: number;
}

export interface InscriptionMintedItem {
  title: string;
  desc: string;
  inscriptions: Inscription[];
}

export interface InscriptionSummary {
  mintedList: InscriptionMintedItem[];
}

export interface AppInfo {
  logo: string;
  title: string;
  desc: string;
  route?: string;
  url: string;
  time: number;
  id: number;
  tag?: string;
  readtime?: number;
  new?: boolean;
  tagColor?: string;
}

export interface AppSummary {
  apps: AppInfo[];
  readTabTime?: number;
}

export interface FeeSummary {
  list: {
    title: string;
    desc: string;
    feeRate: number;
  }[];
}

export interface CoinPrice {
  btc: number;
  fb: number;
}

export interface UTXO {
  txid: string;
  vout: number;
  satoshis: number;
  scriptPk: string;
  addressType: AddressType;
  inscriptions: {
    inscriptionId: string;
    inscriptionNumber?: number;
    offset: number;
  }[];
  atomicals: {
    // deprecated
    atomicalId: string;
    atomicalNumber: number;
    type: 'NFT' | 'FT';
    ticker?: string;
    atomicalValue?: number;
  }[];

  runes: {
    runeid: string;
    rune: string;
    amount: string;
  }[];
}

export interface UTXO_Detail {
  txId: string;
  outputIndex: number;
  satoshis: number;
  scriptPk: string;
  addressType: AddressType;
  inscriptions: Inscription[];
}

export enum TxType {
  SIGN_TX,
  SEND_BITCOIN,
  SEND_ORDINALS_INSCRIPTION,
  SEND_ATOMICALS_INSCRIPTION, // deprecated
  SEND_RUNES,
  SEND_ALKANES
}

interface BaseUserToSignInput {
  index: number;
  sighashTypes: number[] | undefined;
  useTweakedSigner?: boolean;
  disableTweakSigner?: boolean;
  tapLeafHashToSign?: string;
}

export interface AddressUserToSignInput extends BaseUserToSignInput {
  address: string;
}

export interface PublicKeyUserToSignInput extends BaseUserToSignInput {
  publicKey: string;
}

export type UserToSignInput = AddressUserToSignInput | PublicKeyUserToSignInput;

export interface SignPsbtOptions {
  autoFinalized: boolean;
  toSignInputs?: UserToSignInput[];
  contracts?: any[];
}

export interface ToSignInput {
  index: number;
  publicKey: string;
  sighashTypes?: number[];
  tapLeafHashToSign?: Buffer;
}

export type WalletKeyring = {
  key: string;
  index: number;
  type: string;
  addressType: AddressType;
  accounts: Account[];
  alianName: string;
  hdPath: string;
};

export interface Account {
  type: string;
  pubkey: string;
  address: string;
  brandName?: string;
  alianName?: string;
  displayBrandName?: string;
  index?: number;
  balance?: number;
  key: string;
  flag: number;
}

export interface InscribeOrder {
  orderId: string;
  payAddress: string;
  totalFee: number;
  minerFee: number;
  originServiceFee: number;
  serviceFee: number;
  outputValue: number;
}

export interface TokenBalance {
  availableBalance: string;
  overallBalance: string;
  ticker: string;
  transferableBalance: string;
  availableBalanceSafe: string;
  availableBalanceUnSafe: string;
  selfMint: boolean;
  displayName?: string;
  tag?: string;
  swapBalance?: string;
  progBalance?: string;
}

export interface Arc20Balance {
  ticker: string;
  balance: number;
  confirmedBalance: number;
  unconfirmedBalance: number;
}

export interface TokenInfo {
  totalSupply: string;
  totalMinted: string;
  decimal: number;
  holder: string;
  inscriptionId: string;
  selfMint?: boolean;
  holdersCount: number;
  historyCount: number;
  logo: string;
}

export enum TokenInscriptionType {
  INSCRIBE_TRANSFER,
  INSCRIBE_MINT
}

export interface TokenTransfer {
  ticker: string;
  amount: string;
  inscriptionId: string;
  inscriptionNumber: number;
  timestamp: number;
  confirmations: number;
  satoshi: number;
}

export interface AddressTokenSummary {
  tokenInfo: TokenInfo;
  tokenBalance: TokenBalance;
  historyList: TokenTransfer[];
  transferableList: TokenTransfer[];
}

export enum RiskType {
  SIGHASH_NONE,
  SCAMMER_ADDRESS,
  NETWORK_NOT_MATCHED,
  INSCRIPTION_BURNING,
  ATOMICALS_DISABLE, // deprecated
  ATOMICALS_NFT_BURNING, // deprecated
  ATOMICALS_FT_BURNING, // deprecated
  MULTIPLE_ASSETS,
  LOW_FEE_RATE,
  HIGH_FEE_RATE,
  SPLITTING_INSCRIPTIONS,
  MERGING_INSCRIPTIONS,
  CHANGING_INSCRIPTION,
  RUNES_BURNING,
  RUNES_MULTIPLE_ASSETS,
  INDEXER_API_DOWN,
  ATOMICALS_API_DOWN, // deprecated
  RUNES_API_DOWN,
  ALKANES_BURNING,
  ALKANES_MULTIPLE_ASSETS,
  UTXO_INDEXING
}

export interface Risk {
  type: RiskType;
  level: 'danger' | 'warning' | 'critical';
  title: string;
  desc: string;
}

export interface DecodedPsbt {
  inputInfos: {
    txid: string;
    vout: number;
    address: string;
    value: number;
    inscriptions: Inscription[];
    sighashType: number;
    runes: RuneBalance[];
    alkanes: AlkanesBalance[];
    contract?: ContractResult;
  }[];
  outputInfos: {
    address: string;
    value: number;
    inscriptions: Inscription[];
    runes: RuneBalance[];
    alkanes: AlkanesBalance[];
    contract?: ContractResult;
  }[];
  inscriptions: { [key: string]: Inscription };
  feeRate: number;
  fee: number;
  features: {
    rbf: boolean;
  };
  risks: Risk[];
  isScammer: boolean;
  recommendedFeeRate: number;
  shouldWarnFeeRate: boolean;
}

export interface ToAddressInfo {
  address: string;
  domain?: string;
  inscription?: Inscription;
}

export interface RawTxInfo {
  psbtHex: string;
  rawtx: string;
  toAddressInfo?: ToAddressInfo;
  fee?: number;
}

export interface WalletConfig {
  version: string;
  moonPayEnabled: boolean;
  statusMessage: string;
  endpoint: string;
  chainTip: string;
  disableUtxoTools: boolean;
}

export enum WebsiteState {
  CHECKING,
  SCAMMER,
  SAFE
}

export interface AddressSummary {
  address: string;
  totalSatoshis: number;
  btcSatoshis: number;
  assetSatoshis: number;
  inscriptionCount: number;
  brc20Count: number;
  brc20Count5Byte: number;
  brc20Count6Byte: number;
  runesCount: number;
  loading?: boolean;
}

export interface VersionDetail {
  version: string;
  title: string;
  changelogs: string[];
  notice: string;
}

export interface RuneBalance {
  amount: string;
  runeid: string;
  rune: string;
  spacedRune: string;
  symbol: string;
  divisibility: number;
}

export interface RuneInfo {
  runeid: string;
  rune: string;
  spacedRune: string;
  number: number;
  height: number;
  txidx: number;
  timestamp: number;
  divisibility: number;
  symbol: string;
  etching: string;
  premine: string;
  terms: {
    amount: string;
    cap: string;
    heightStart: number;
    heightEnd: number;
    offsetStart: number;
    offsetEnd: number;
  };
  mints: string;
  burned: string;
  holders: number;
  transactions: number;
  mintable: boolean;
  remaining: string;
  start: number;
  end: number;
  supply: string;
  parent?: string;
  logo?: string;
}

export interface AddressRunesTokenSummary {
  runeInfo: RuneInfo;
  runeBalance: RuneBalance;
  runeLogo?: Inscription;
}

export interface BtcChannelItem {
  channel: PaymentChannelType;
  quote: number;
  payType: string[];
}

export type TickPriceItem = {
  curPrice: number;
  changePercent: number;
};

export interface CAT20Balance {
  tokenId: string;
  amount: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface CAT20TokenInfo {
  tokenId: string;
  name: string;
  symbol: string;
  max: string;
  premine: string;
  limit: number;
  logo?: string;
}

export interface AddressCAT20TokenSummary {
  cat20Info: CAT20TokenInfo;
  cat20Balance: CAT20Balance;
}

export interface AddressCAT20UtxoSummary {
  availableTokenAmounts: string[];
  availableUtxoCount: number;
  totalUtxoCount: number;
}

export interface CAT20MergeOrder {
  id: string;
  batchIndex: number;
  batchCount: number;
  ct: number;
}

export interface WebsiteResult {
  isScammer: boolean;
  warning: string;
  allowQuickMultiSign: boolean;
}

export interface CAT721Balance {
  collectionId: string;
  name: string;
  count: number;
  previewLocalIds: string[];
  contentType: string;
}

export interface CAT721CollectionInfo {
  collectionId: string;
  name: string;
  symbol: string;
  max: string;
  premine: string;
  description: string;
  contentType: string;
}

export interface AddressCAT721CollectionSummary {
  collectionInfo: CAT721CollectionInfo;
  localIds: string[];
}

export interface BitcoinBalanceV2 {
  availableBalance: number;
  unavailableBalance: number;
  totalBalance: number;
}

export interface BabylonStakingStatusV2 {
  active_tvl: number;
  active_delegations: number;
  active_stakers: number;
  active_finality_providers: number;
  total_finality_providers: number;
}

export interface CosmosBalance {
  denom: string;
  amount: string;
}

export interface BabylonAddressSummary {
  address: string;
  balance: CosmosBalance;
  rewardBalance: number;
  stakedBalance: number;
}

export interface BabylonTxInfo {
  toAddress: string;
  balance: CosmosBalance;
  unitBalance: CosmosBalance;
  memo: string;
  txFee: CosmosBalance;
  gasLimit: number;
  gasPrice: string;
  gasAdjustment?: number;
}

export interface ContractResult {
  id: string;
  name: string;
  description: string;
  address: string;
  script: string;
  isOwned: boolean;
}

export interface RequestMethodSendBitcoinParams {
  sendBitcoinParams: {
    toAddress: string;
    satoshis: number;
    feeRate?: number;
    memo?: string;
    memos?: string[];
  };
  type: TxType;
}

export interface RequestMethodSendInscriptionParams {
  sendInscriptionParams: {
    toAddress: string;
    inscriptionId: string;
    feeRate: number | undefined;
  };
  type: TxType;
}

export interface RequestMethodSignPsbtParams {
  sendInscriptionParams: {
    toAddress: string;
    inscriptionId: string;
    feeRate: number | undefined;
  };
  type: TxType;
}

export interface RequestMethodSendRunesParams {
  sendRunesParams: {
    toAddress: string;
    runeid: string;
    amount: string;
    feeRate: number | undefined;
  };
  type: TxType;
}

export interface RequestMethodSignMessageParams {
  text: string;
  type: string;
}

export interface RequestMethodSignMessagesParams {
  messages: {
    text: string;
    type: string;
  }[];
}

export interface RequestMethodGetInscriptionsParams {
  cursor: number;
  size: number;
}

export interface RequestMethodSignPsbtParams {
  psbtHex: string;
  type: TxType;
  options?: any;
}

export interface RequestMethodSignPsbtsParams {
  psbtHexs: string[];
  options?: any;
}

export interface RequestMethodInscribeTransferParams {
  ticker: string;
  amount: string;
}

export interface RequestMethodGetBitcoinUtxosParams {
  cursor: number;
  size: number;
}

export interface RequestMethodGetAvailableUtxosParams {
  cursor: number;
  size: number;
}

export interface AlkanesBalance {
  amount: string;
  alkaneid: string;
  name: string;
  symbol: string;
  divisibility: number;
  available: string;
}

export interface AlkanesInfo {
  alkaneid: string;
  name: string;
  symbol: string;
  spacers?: number;
  divisibility?: number;
  height?: number;
  totalSupply: string;
  cap: number;
  minted: number;
  mintable: boolean;
  perMint: string;
  holders: number;
  timestamp?: number;
  type?: string;
  maxSupply?: string;
  premine?: string;
  aligned?: boolean;
  nftData?: {
    collectionId: string;
    attributes?: any;
    contentType?: string;
    image?: string;
    contentUrl?: string;
  };
  logo?: string;
  collectionData?: {
    holders: number;
  };
}

export interface AddressAlkanesTokenSummary {
  tokenInfo: AlkanesInfo;
  tokenBalance: AlkanesBalance;
  tradeUrl?: string;
  mintUrl?: string;
}

export interface AlkanesCollection {
  alkaneid: string;
  name: string;
  count: number;
  image: string;
}

export enum CAT_VERSION {
  V1 = 'v1',
  V2 = 'v2'
}

export interface BRC20HistoryItem {
  type: string;
  from: string;
  to: string;
  amount: string;
  txid: string;
  blocktime: number;
}

export interface SimplicityAddressBalance {
  pkscript: string;
  ticker: string;
  wallet: string;
  overall_balance: string;
  available_balance: string;
  block_height: number;
}

export interface SimplicityBrc20Info {
  ticker: string;
  decimals: number;
  max_supply: string;
  limit_per_mint: string;
  actual_deploy_txid_for_api: string;
  deploy_tx_id: string;
  deploy_block_height: number;
  deploy_timestamp: string;
  creator_address: string;
  remaining_supply: string;
  current_supply: string;
  holders: number;
}

export interface SimplicityOp {
  id: number;
  tx_id: string;
  txid: string | null;
  op: 'deploy' | 'mint' | 'transfer';
  ticker: string;
  amount_str: string | null;
  block_height: number;
  block_hash: string;
  tx_index: number;
  timestamp: string;
  from_address: string | null;
  to_address: string | null;
  valid: boolean;
}

// Types pour l'API BIP32 Simplicity
export interface SimplicityUTXO {
  txid: string;
  vout: number;
  amount: number;
  scriptPubKey: string;
  derivationPath: string;
  publicKey: string;
  masterFingerprint: string;
}

export interface SimplicityTransferPSBTRequest {
  sender: string;
  receiver: string;
  amount: number;
  feeRate: number;
  utxos: SimplicityUTXO[];
  ticker: string;
  changeDerivationPath: string;
  changePublicKey: string;
}

export interface SimplicityTransferResult {
  psbtBase64: string;
  estimatedFee: number;
  changeAmount: number;
  txBytes: number;
  txVBytes: number;
  fee: number;
}
