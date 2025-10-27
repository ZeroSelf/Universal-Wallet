import { useCallback } from 'react';

import { useApproval, useWallet } from '@/ui/utils';
import { AddressType } from '@unisat/wallet-types';

import { AppState } from '..';
import { useAppDispatch, useAppSelector } from '../hooks';
import { TabOption, globalActions } from './reducer';

export function useGlobalState(): AppState['global'] {
  return useAppSelector((state) => state.global);
}

export function useTab() {
  const globalState = useGlobalState();
  return globalState.tab;
}

export function useSetTabCallback() {
  const dispatch = useAppDispatch();
  return useCallback(
    (tab: TabOption) => {
      dispatch(
        globalActions.update({
          tab
        })
      );
    },
    [dispatch]
  );
}

export function useBooted() {
  const globalState = useGlobalState();
  return globalState.isBooted;
}

export function useIsUnlocked() {
  const globalState = useGlobalState();
  return globalState.isUnlocked;
}

export function useIsReady() {
  const globalState = useGlobalState();
  return globalState.isReady;
}

export function useUnlockCallback() {
  const dispatch = useAppDispatch();
  const wallet = useWallet();
  const [, resolveApproval] = useApproval();
  return useCallback(
    async (password: string) => {
      await wallet.unlock(password);
      dispatch(globalActions.update({ isUnlocked: true }));
      resolveApproval();
    },
    [dispatch, wallet]
  );
}

export function useCreateAccountCallback() {
  const dispatch = useAppDispatch();
  const wallet = useWallet();
  return useCallback(
    async (mnemonics: string, hdPath: string, passphrase: string, addressType: AddressType, accountCount: number) => {
      await wallet.createKeyringWithMnemonics(mnemonics, hdPath, passphrase, addressType, accountCount);
      dispatch(globalActions.update({ isUnlocked: true }));
    },
    [dispatch, wallet]
  );
}

export function useImportAccountsFromKeystoneCallback() {
  const dispatch = useAppDispatch();
  const wallet = useWallet();
  return useCallback(
    async (
      urType: string,
      urCbor: string,
      addressType: AddressType,
      accountCount: number,
      hdPath: string,
      filterPubkey?: string[],
      connectionType: 'USB' | 'QR' = 'USB'
    ) => {
      await wallet.createKeyringWithKeystone(
        urType,
        urCbor,
        addressType,
        hdPath,
        accountCount,
        filterPubkey,
        connectionType
      );
      dispatch(globalActions.update({ isUnlocked: true }));
    },
    [dispatch, wallet]
  );
}

export function useCreateColdWalletCallback() {
  const dispatch = useAppDispatch();
  const wallet = useWallet();
  return useCallback(
    async (xpub: string, addressType: AddressType, alianName?: string, hdPath?: string, accountCount?: number) => {
      await wallet.createKeyringWithColdWallet(xpub, addressType, alianName, hdPath, accountCount);
      dispatch(globalActions.update({ isUnlocked: true }));
    },
    [dispatch, wallet]
  );
}
