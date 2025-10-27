import { useCallback, useState } from 'react';

import { Button, Column, Content, Text } from '@/ui/components';
import { useI18n } from '@/ui/hooks/useI18n';
import { colors } from '@/ui/theme/colors';
import { fontSizes } from '@/ui/theme/font';
import { LoadingOutlined } from '@ant-design/icons';
import Base, { convertMulitAccountToCryptoAccount, CryptoMultiAccounts } from '@keystonehq/hw-app-base';

import KeystonePopover from '../Popover';
import { createKeystoneTransport, handleKeystoneUSBError } from './utils';

const EXPECTED_HD_PATH = ['m/44\'/0\'/0\'', 'm/49\'/0\'/0\'', 'm/84\'/0\'/0\'', 'm/86\'/0\'/0\''];

// import { Curve, DerivationAlgorithm } from '@keystonehq/keystone-sdk';
// reduced from @keystonehq/keystone-sdk to avoid increasing package size
enum Curve {
  secp256k1 = 0,
  ed25519 = 1
}
enum DerivationAlgorithm {
  slip10 = 0,
  bip32ed25519 = 1
}

export default function KeystoneFetchKey({
  onSucceed,
  isCancelledRef,
  size
}: {
  onSucceed: (data: { type: string; cbor: string }) => void;
  isCancelledRef: React.MutableRefObject<boolean>;
  size?: number;
}) {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const onError = useCallback((e: any) => {
    console.error(e);
    setError(t(handleKeystoneUSBError(e)));
    setIsError(true);
  }, []);

  const onClick = useCallback(async () => {
    try {
      setLoading(true);
      const transport = await createKeystoneTransport();
      const base = new Base(transport as any);
      const accounts: CryptoMultiAccounts[] = [];
      for (const path of EXPECTED_HD_PATH) {
        if (isCancelledRef.current) {
          return [];
        }
        const res = await base.getURAccount(path, Curve.secp256k1, DerivationAlgorithm.slip10);
        accounts.push(res);
      }
      const urCryptoAccount = convertMulitAccountToCryptoAccount(accounts);
      onSucceed({ type: urCryptoAccount.getRegistryType().getType(), cbor: urCryptoAccount.toCBOR() });
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const onCloseError = useCallback(() => {
    setIsError(false);
    setError('');
  }, []);

  return (
    <Content itemsCenter justifyCenter>
      <Column style={{ minHeight: size }} itemsCenter justifyCenter>
        {loading && (
          <LoadingOutlined
            style={{
              fontSize: fontSizes.xxxl,
              color: colors.blue
            }}
          />
        )}
      </Column>
      <Column style={{ minWidth: 300 }} itemsCenter justifyCenter>
        <Button preset="defaultV2" style={{ color: colors.white, marginTop: '2px' }} onClick={onClick}>
          <Text text={t('connect')} color="white" />
        </Button>
      </Column>
      {isError && <KeystonePopover msg={error} onClose={onCloseError} onConfirm={onCloseError} />}
    </Content>
  );
}
