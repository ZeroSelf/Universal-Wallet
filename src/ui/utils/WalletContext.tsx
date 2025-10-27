import { createContext, ReactNode, useContext } from 'react';

import { AccountAsset } from '@/background/controller/wallet';
import { ContactBookItem } from '@/background/service/contactBook';
import { ConnectedSite } from '@/background/service/permission';
import { AddressFlagType, ChainType } from '@/shared/constant';
import {
    Account,
    AddressAlkanesTokenSummary,
    AddressCAT20TokenSummary,
    AddressCAT20UtxoSummary,
    AddressCAT721CollectionSummary,
    AddressRunesTokenSummary,
    AddressSummary,
    AddressTokenSummary,
    AlkanesBalance,
    AlkanesCollection,
    AlkanesInfo,
    AppInfo,
    AppSummary,
    BabylonAddressSummary,
    BitcoinBalance,
    BitcoinBalanceV2,
    BRC20HistoryItem,
    BtcChannelItem,
    CAT20Balance,
    CAT20MergeOrder,
    CAT721Balance,
    CoinPrice,
    CosmosBalance,
    CosmosSignDataType,
    DecodedPsbt,
    FeeSummary,
    InscribeOrder,
    Inscription,
    InscriptionSummary,
    NetworkType,
    RuneBalance,
    SignPsbtOptions,
    TickPriceItem,
    TokenBalance,
    TokenTransfer,
    TxHistoryItem,
    UserToSignInput,
    UTXO,
    UTXO_Detail,
    VersionDetail,
    WalletConfig,
    WalletKeyring,
    WebsiteResult
} from '@/shared/types';
import { BabylonConfigV2 } from '@unisat/babylon-service/types';
import { ContactBookStore } from '@unisat/contact-book';
import { ToSignInput } from '@unisat/keyring-service/types';
import { UnspentOutput } from '@unisat/tx-helpers/types';
import { AddressType } from '@unisat/wallet-types';

export interface WalletController {
  openapi: {
    [key: string]: (...params: any) => Promise<any>;
  };

  boot(password: string): Promise<void>;
  isBooted(): Promise<boolean>;

  getApproval(): Promise<any>;
  resolveApproval(data?: any, data2?: any): Promise<void>;
  rejectApproval(data?: any, data2?: any, data3?: any): Promise<void>;

  hasVault(): Promise<boolean>;

  verifyPassword(password: string): Promise<void>;
  changePassword: (password: string, newPassword: string) => Promise<void>;

  unlock(password: string): Promise<void>;
  isUnlocked(): Promise<boolean>;

  lockWallet(): Promise<void>;
  setPopupOpen(isOpen: boolean): void;
  isReady(): Promise<boolean>;

  getIsFirstOpen(): Promise<boolean>;
  updateIsFirstOpen(): Promise<void>;

  getAddressBalanceV2(address: string): Promise<BitcoinBalanceV2>;
  getAddressBalance(address: string): Promise<BitcoinBalance>;
  getAddressCacheBalance(address: string): Promise<BitcoinBalance>;
  getMultiAddressAssets(addresses: string): Promise<AddressSummary[]>;
  findGroupAssets(
    groups: { type: number; address_arr: string[]; pubkey_arr: string[] }[]
  ): Promise<{ type: number; address_arr: string[]; pubkey_arr: string[]; satoshis_arr: number[] }[]>;

  getAddressInscriptions(
    address: string,
    cursor: number,
    size: number
  ): Promise<{ list: Inscription[]; total: number }>;

  getAddressHistory: (params: {
    address: string;
    start: number;
    limit: number;
  }) => Promise<{ start: number; total: number; detail: TxHistoryItem[] }>;
  getAddressCacheHistory: (address: string) => Promise<TxHistoryItem[]>;

  listChainAssets: (address: string) => Promise<AccountAsset[]>;

  getLocale(): Promise<string>;
  setLocale(locale: string): Promise<void>;

  getCurrency(): Promise<string>;
  setCurrency(currency: string): Promise<void>;

  clearKeyrings(): Promise<void>;
  getPrivateKey(password: string, account: { address: string; type: string }): Promise<{ hex: string; wif: string }>;
  getMnemonics(
    password: string,
    keyring: WalletKeyring
  ): Promise<{
    hdPath: string;
    mnemonic: string;
    passphrase: string;
  }>;
  createKeyringWithPrivateKey(data: string, addressType: AddressType, alianName?: string): Promise<Account[]>;
  getPreMnemonics(): Promise<any>;
  generatePreMnemonic(): Promise<string>;
  removePreMnemonics(): void;
  createKeyringWithMnemonics(
    mnemonic: string,
    hdPath: string,
    passphrase: string,
    addressType: AddressType,
    accountCount: number
  ): Promise<{ address: string; type: string }[]>;
  createKeyringWithKeystone(
    urType: string,
    urCbor: string,
    addressType: AddressType,
    hdPath: string,
    accountCount: number,
    filterPubkey?: string[],
    connectionType?: 'USB' | 'QR'
  ): Promise<{ address: string; type: string }[]>;
  createTmpKeyringWithPrivateKey(privateKey: string, addressType: AddressType): Promise<WalletKeyring>;
  createTmpKeyringWithKeystone(
    urType: string,
    urCbor: string,
    addressType: AddressType,
    hdPath: string,
    accountCount?: number
  ): Promise<WalletKeyring>;

  createKeyringWithColdWallet(
    xpub: string,
    addressType: AddressType,
    alianName?: string,
    hdPath?: string,
    accountCount?: number
  ): Promise<WalletKeyring>;

  deriveAccountsFromXpub(
    xpub: string,
    addressType: AddressType,
    hdPath?: string,
    accountCount?: number
  ): Promise<{ pubkey: string; address: string }[]>;

  createTmpKeyringWithMnemonics(
    mnemonic: string,
    hdPath: string,
    passphrase: string,
    addressType: AddressType,
    accountCount?: number
  ): Promise<WalletKeyring>;
  removeKeyring(keyring: WalletKeyring): Promise<WalletKeyring>;
  removeAccount(account: Account): Promise<boolean>;
  deriveNewAccountFromMnemonic(keyring: WalletKeyring, alianName?: string): Promise<string[]>;
  getAccountsCount(): Promise<number>;
  getAllAlianName: () => (ContactBookItem | undefined)[];
  getContactsByMap: () => ContactBookStore;

  getCurrentAccount(): Promise<Account>;
  getAccounts(): Promise<Account[]>;
  getNextAlianName: (keyring: WalletKeyring) => Promise<string>;

  getCurrentKeyringAccounts(): Promise<Account[]>;

  signPsbtWithHex(psbtHex: string, toSignInputs: ToSignInput[], autoFinalized: boolean): Promise<string>;

  sendBTC(data: {
    to: string;
    amount: number;
    btcUtxos: UnspentOutput[];
    feeRate: number;
    enableRBF: boolean;
    memo?: string;
    memos?: string[];
  }): Promise<{
    psbtHex: string;
    rawtx: string;
    fee: number;
  }>;

  sendAllBTC(data: { to: string; btcUtxos: UnspentOutput[]; feeRate: number; enableRBF: boolean }): Promise<{
    psbtHex: string;
    rawtx: string;
    fee: number;
  }>;

  sendOrdinalsInscription(data: {
    to: string;
    inscriptionId: string;
    feeRate: number;
    outputValue?: number;
    enableRBF: boolean;
    btcUtxos: UnspentOutput[];
  }): Promise<{
    psbtHex: string;
    rawtx: string;
    fee: number;
  }>;

  sendOrdinalsInscriptions(data: {
    to: string;
    inscriptionIds: string[];
    feeRate: number;
    enableRBF: boolean;
    btcUtxos: UnspentOutput[];
  }): Promise<{
    psbtHex: string;
    rawtx: string;
    fee: number;
  }>;

  splitOrdinalsInscription(data: {
    inscriptionId: string;
    feeRate: number;
    outputValue: number;
    enableRBF: boolean;
    btcUtxos: UnspentOutput[];
  }): Promise<{
    psbtHex: string;
    rawtx: string;
    fee: number;
    splitedCount: number;
  }>;

  pushTx(rawtx: string): Promise<string>;

  queryDomainInfo(domain: string): Promise<Inscription>;

  getInscriptionSummary(): Promise<InscriptionSummary>;
  getAppSummary(): Promise<AppSummary>;
  getBTCUtxos(): Promise<UnspentOutput[]>;
  getAssetUtxosInscriptions(inscriptionId: string): Promise<UnspentOutput[]>;

  getNetworkType(): Promise<NetworkType>;
  setNetworkType(type: NetworkType): Promise<void>;

  getChainType(): Promise<ChainType>;
  setChainType(type: ChainType): Promise<void>;

  getConnectedSites(): Promise<ConnectedSite[]>;
  removeConnectedSite(origin: string): Promise<void>;
  getCurrentConnectedSite(id: string): Promise<ConnectedSite>;

  getCurrentKeyring(): Promise<WalletKeyring>;
  getKeyrings(): Promise<WalletKeyring[]>;
  changeKeyring(keyring: WalletKeyring, accountIndex?: number): Promise<void>;
  getAllAddresses(keyring: WalletKeyring, index: number): Promise<string[]>;

  setKeyringAlianName(keyring: WalletKeyring, name: string): Promise<WalletKeyring>;
  changeAddressType(addressType: AddressType): Promise<void>;

  setAccountAlianName(account: Account, name: string): Promise<Account>;
  getFeeSummary(): Promise<FeeSummary>;
  getCoinPrice(): Promise<CoinPrice>;
  getBrc20sPrice(ticks: string[]): Promise<{ [tick: string]: TickPriceItem }>;
  getRunesPrice(ticks: string[]): Promise<{ [tick: string]: TickPriceItem }>;
  getCAT20sPrice(tokenIds: string[]): Promise<{ [tokenId: string]: TickPriceItem }>;
  getAlkanesPrice(alkaneid: string[]): Promise<{ [tick: string]: TickPriceItem }>;

  setEditingKeyring(keyringIndex: number): Promise<void>;
  getEditingKeyring(): Promise<WalletKeyring>;

  setEditingAccount(account: Account): Promise<void>;
  getEditingAccount(): Promise<Account>;

  inscribeBRC20Transfer(
    address: string,
    tick: string,
    amount: string,
    feeRate: number,
    outputValue: number
  ): Promise<InscribeOrder>;
  getInscribeResult(orderId: string): Promise<TokenTransfer>;

  decodePsbt(psbtHex: string, website: string): Promise<DecodedPsbt>;

  decodeContracts(contracts: any[], account: any): Promise<any[]>;

  getAllInscriptionList(
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; total: number; list: Inscription[] }>;

  getBRC20List(
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; total: number; list: TokenBalance[] }>;

  getBRC20ProgList(
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; total: number; list: TokenBalance[] }>;

  getBRC20TransferableList(
    address: string,
    ticker: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; total: number; list: TokenTransfer[] }>;

  getOrdinalsInscriptions(
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; total: number; list: Inscription[] }>;

  getBRC20Summary(address: string, ticker: string): Promise<AddressTokenSummary>;

  expireUICachedData(address: string): Promise<void>;

  getWalletConfig(): Promise<WalletConfig>;

  getSkippedVersion(): Promise<string>;
  setSkippedVersion(version: string): Promise<void>;

  getInscriptionUtxoDetail(inscriptionId: string): Promise<UTXO_Detail>;
  getUtxoByInscriptionId(inscriptionId: string): Promise<UTXO>;
  getInscriptionInfo(inscriptionId: string): Promise<Inscription>;

  checkWebsite(website: string): Promise<WebsiteResult>;

  readTab(tabName: string): Promise<void>;
  readApp(appid: number): Promise<void>;

  formatOptionsToSignInputs(psbtHex: string, options?: SignPsbtOptions): Promise<ToSignInput[]>;

  getAddressSummary(address: string): Promise<AddressSummary>;

  getShowSafeNotice(): Promise<boolean>;
  setShowSafeNotice(show: boolean): Promise<void>;

  // address flag
  addAddressFlag(account: Account, flag: AddressFlagType): Promise<Account>;
  removeAddressFlag(account: Account, flag: AddressFlagType): Promise<Account>;

  getVersionDetail(version: string): Promise<VersionDetail>;

  genSignPsbtUr(psbtHex: string): Promise<{ type: string; cbor: string }>;
  parseSignPsbtUr(type: string, cbor: string, isFinalize?: boolean): Promise<{ psbtHex: string; rawtx?: string }>;
  genSignMsgUr(text: string, msgType?: string): Promise<{ type: string; cbor: string; requestId: string }>;
  parseSignMsgUr(type: string, cbor: string, msgType: string): Promise<{ signature: string }>;
  getKeystoneConnectionType(): Promise<'USB' | 'QR'>;
  genSignCosmosUr(cosmosSignRequest: {
    requestId?: string;
    signData: string;
    dataType: CosmosSignDataType;
    path: string;
    chainId?: string;
    accountNumber?: string;
    address?: string;
  }): Promise<{ type: string; cbor: string; requestId: string }>;
  parseCosmosSignUr(type: string, cbor: string): Promise<any>;

  cosmosSignData(
    chainId: string,
    signBytesHex: string
  ): Promise<{
    publicKey: string;
    signature: string;
  }>;

  getEnableSignData(): Promise<boolean>;
  setEnableSignData(enable: boolean): Promise<void>;

  getRunesList(
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; total: number; list: RuneBalance[] }>;

  getAssetUtxosRunes(rune: string): Promise<UnspentOutput[]>;

  getAddressRunesTokenSummary(address: string, runeid: string): Promise<AddressRunesTokenSummary>;

  sendRunes(data: {
    to: string;
    runeid: string;
    runeAmount: string;
    feeRate: number;
    enableRBF: boolean;
    btcUtxos?: UnspentOutput[];
    assetUtxos?: UnspentOutput[];
    outputValue?: number;
  }): Promise<{
    psbtHex: string;
    rawtx: string;
    fee: number;
  }>;

  setAutoLockTimeId(timeId: number): Promise<void>;
  getAutoLockTimeId(): Promise<number>;

  getDeveloperMode(): Promise<boolean>;
  setDeveloperMode(developerMode: boolean): Promise<void>;

  getCAT20List(
    version: 'v1' | 'v2',
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; total: number; list: CAT20Balance[] }>;

  getAddressCAT20TokenSummary(
    version: 'v1' | 'v2',
    address: string,
    tokenId: string
  ): Promise<AddressCAT20TokenSummary>;

  getAddressCAT20UtxoSummary(version: 'v1' | 'v2', address: string, tokenId: string): Promise<AddressCAT20UtxoSummary>;

  transferCAT20Step1(
    version: 'v1' | 'v2',
    to: string,
    tokenId: string,
    tokenAmount: string,
    feeRate: number
  ): Promise<{ id: string; commitTx: string; toSignInputs: UserToSignInput[]; feeRate: number }>;
  transferCAT20Step2(
    version: 'v1' | 'v2',
    transferId: string,
    commitTx: string,
    toSignInputs: UserToSignInput[]
  ): Promise<{ revealTx: string; toSignInputs: UserToSignInput[] }>;
  transferCAT20Step3(
    version: 'v1' | 'v2',
    transferId: string,
    revealTx: string,
    toSignInputs: UserToSignInput[]
  ): Promise<{ txid: string }>;

  mergeCAT20Prepare(
    version: 'v1' | 'v2',
    tokenId: string,
    utxoCount: number,
    feeRate: number
  ): Promise<CAT20MergeOrder>;
  transferCAT20Step1ByMerge(
    version: 'v1' | 'v2',
    mergeId: string
  ): Promise<{ id: string; commitTx: string; toSignInputs: UserToSignInput[]; feeRate: number }>;
  getMergeCAT20Status(version: 'v1' | 'v2', mergeId: string): Promise<any>;

  getAppList(): Promise<{ tab: string; items: AppInfo[] }[]>;
  getBannerList(): Promise<{ id: string; img: string; link: string }[]>;
  getBlockActiveInfo(): Promise<{ allTransactions: number; allAddrs: number }>;

  getCAT721List(
    version: 'v1' | 'v2',
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; total: number; list: CAT721Balance[] }>;

  getAddressCAT721CollectionSummary(
    version: 'v1' | 'v2',
    address: string,
    collectionId: string
  ): Promise<AddressCAT721CollectionSummary>;

  transferCAT721Step1(
    version: 'v1' | 'v2',
    to: string,
    collectionId: string,
    localId: string,
    feeRate: number
  ): Promise<{ id: string; commitTx: string; toSignInputs: UserToSignInput[]; feeRate: number }>;
  transferCAT721Step2(
    version: 'v1' | 'v2',
    transferId: string,
    commitTx: string,
    toSignInputs: UserToSignInput[]
  ): Promise<{ revealTx: string; toSignInputs: UserToSignInput[] }>;
  transferCAT721Step3(
    version: 'v1' | 'v2',
    transferId: string,
    revealTx: string,
    toSignInputs: UserToSignInput[]
  ): Promise<{ txid: string }>;

  getBuyCoinChannelList(coin: string): Promise<BtcChannelItem[]>;
  createBuyCoinPaymentUrl(coin: string, address: string, channel: string): Promise<string>;

  getBabylonAddress(address: string): Promise<string>;

  getBabylonAddressSummary(chainId: string, babylonConfig?: BabylonConfigV2): Promise<BabylonAddressSummary>;

  createSendTokenStep1(
    chainId: string,
    tokenBalance: CosmosBalance,
    to: string,
    memo: string,
    {
      gasLimit,
      gasPrice,
      gasAdjustment
    }: {
      gasLimit: number;
      gasPrice: string;
      gasAdjustment?: number;
    }
  ): Promise<string>;
  createSendTokenStep2(chainId: string, signature: string): Promise<string>;

  simulateBabylonGas(
    chainId: string,
    recipient: string,
    amount: { denom: string; amount: string },
    memo: string
  ): Promise<number>;

  getBabylonConfig(): Promise<BabylonConfigV2>;

  getContactByAddress(address: string): Promise<ContactBookItem | undefined>;
  getContactByAddressAndChain(address: string, chain: ChainType): Promise<ContactBookItem | undefined>;
  updateContact(data: ContactBookItem): Promise<void>;
  removeContact(address: string, chain?: ChainType): Promise<void>;
  listContacts(): Promise<ContactBookItem[]>;
  saveContactsOrder(contacts: ContactBookItem[]): Promise<void>;

  singleStepTransferBRC20Step1(params: {
    userAddress: string;
    userPubkey: string;
    receiver: string;
    ticker: string;
    amount: string;
    feeRate: number;
  }): Promise<{
    orderId: string;
    psbtHex: string;
    toSignInputs: UserToSignInput[];
  }>;

  singleStepTransferBRC20Step2(params: {
    orderId: string;
    commitTx: string;
    toSignInputs: UserToSignInput[];
  }): Promise<{
    psbtHex: string;
    toSignInputs: UserToSignInput[];
  }>;

  singleStepTransferBRC20Step3(params: {
    orderId: string;
    revealTx: string;
    toSignInputs: UserToSignInput[];
  }): Promise<{ txid: string }>;

  setLastActiveTime(): void;

  getOpenInSidePanel(): Promise<boolean>;
  setOpenInSidePanel(openInSidePanel: boolean): Promise<void>;

  sendCoinBypassHeadOffsets(
    tos: { address: string; satoshis: number }[],
    feeRate: number
  ): Promise<{
    psbtHex: string;
    rawtx: string;
    fee: number;
  }>;

  getAlkanesList(
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; total: number; list: AlkanesBalance[] }>;

  getAssetUtxosAlkanes(rune: string): Promise<UnspentOutput[]>;

  getAddressAlkanesTokenSummary(
    address: string,
    alkaneid: string,
    fetchAvailable: boolean
  ): Promise<AddressAlkanesTokenSummary>;

  createAlkanesSendTx(params: {
    userAddress: string;
    userPubkey: string;
    receiver: string;
    alkaneid: string;
    amount: string;
    feeRate: number;
  }): Promise<{
    psbtHex: string;
    toSignInputs: UserToSignInput[];
  }>;

  signAlkanesSendTx(params: { commitTx: string; toSignInputs: ToSignInput[] }): Promise<{ txid: string }>;

  sendAlkanes(params: {
    to: string;
    alkaneid: string;
    amount: string;
    feeRate: number;
    enableRBF: boolean;
  }): Promise<string>;

  getAlkanesCollectionList(
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ list: AlkanesCollection[]; total: number }>;
  getAlkanesCollectionItems(
    address: string,
    collectionId: string,
    currentPage: number,
    pageSize: number
  ): Promise<{ currentPage: number; pageSize: number; list: AlkanesInfo[]; total: number }>;

  getBRC20RecentHistory(address: string, ticker: string): Promise<BRC20HistoryItem[]>;

  // Simplicity methods
  getSimplicityTokensList(
    address: string,
    cursor: number,
    size: number
  ): Promise<{
    list: any[];
    total: number;
    hasMore: boolean;
  }>;
  getSimplicityTokenSummary(address: string, ticker: string): Promise<any>;
  getSimplicityTokenHistory(address: string, ticker: string): Promise<any[]>;
  getSimplicitysPrice(ticks: string[]): Promise<{ [key: string]: { curPrice: number; changePercent: number } }>;
  sendSimplicityToken(params: {
    to: string;
    ticker: string;
    amount: number;
    feeRate: number;
    enableRBF: boolean;
    btcUtxos?: UnspentOutput[];
  }): Promise<{
    psbtHex: string;
    rawtx: string;
    fee: number;
  }>;
}

const WalletContext = createContext<{
  wallet: WalletController;
} | null>(null);

const WalletProvider = ({ children, wallet }: { children?: ReactNode; wallet: WalletController }) => (
  <WalletContext.Provider value={{ wallet }}>{children}</WalletContext.Provider>
);

const useWallet = () => {
  const { wallet } = useContext(WalletContext) as {
    wallet: WalletController;
  };

  return wallet;
};

export { useWallet, WalletProvider };

