import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ChainType } from '@/shared/constant';
import { Icon, Row, Tooltip } from '@/ui/components';
import { BtcUsd } from '@/ui/components/BtcUsd';
import { RefreshButton } from '@/ui/components/RefreshButton';
import { getSpecialLocale, useI18n } from '@/ui/hooks/useI18n';
import { useUtxoTools } from '@/ui/hooks/useUtxoTools';
import { AppState } from '@/ui/state';
import { useFetchBalanceCallback } from '@/ui/state/accounts/hooks';
import { accountActions } from '@/ui/state/accounts/reducer';
import { useBTCUnit, useChain } from '@/ui/state/settings/hooks';
import { uiActions } from '@/ui/state/ui/reducer';
import { satoshisToAmount } from '@/ui/utils';

import styles from './BalanceCard.module.less';
import { BalanceCardProps } from './interface';

const DEBOUNCE_DELAY = 1000;

const tooltipStyle = {
  maxWidth: '328px',
  borderRadius: '8px',
  background: '#1D1E23',
  width: '328px',
  padding: '12px 16px',
  color: '#FFF',
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Inter-Regular',
  boxShadow: '0px 12px 20px 0px rgba(0, 0, 0, 0.25)',
  marginLeft: '-50px'
};

export function BalanceCard({ accountBalance, disableUtxoTools = true, enableRefresh = false }: BalanceCardProps) {
  const { t } = useI18n();
  const btcUnit = useBTCUnit();
  const chain = useChain();
  const [isExpanded, setIsExpanded] = useState(true);
  const dispatch = useDispatch();
  const isBalanceHidden = useSelector((state: AppState) => state.ui.isBalanceHidden);
  const isBtcMainnet = chain.enum === ChainType.BITCOIN_MAINNET;

  const [isSpecialLocale, setIsSpecialLocale] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBalance = useFetchBalanceCallback();

  useEffect(() => {
    getSpecialLocale().then(({ isSpecialLocale }) => {
      setIsSpecialLocale(isSpecialLocale);
    });
  }, []);

  const { openUtxoTools } = useUtxoTools(chain);

  const backgroundImage = chain.isFractal
    ? './images/artifacts/balance-bg-fb.png'
    : './images/artifacts/balance-bg-btc.png';

  const totalAmount = satoshisToAmount(accountBalance.totalBalance);
  const availableAmount = satoshisToAmount(accountBalance.availableBalance);
  const unavailableAmount = satoshisToAmount(accountBalance.unavailableBalance);

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleBalanceVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(uiActions.setBalanceHidden(!isBalanceHidden));
  };

  const refreshBalance = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        dispatch(accountActions.expireBalance());
        fetchBalance();
        debounceTimerRef.current = null;
      }, DEBOUNCE_DELAY);
    },
    [dispatch, fetchBalance]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Passive refresh every 10 seconds
  useEffect(() => {
    if (!enableRefresh) return;

    const intervalId = setInterval(() => {
      dispatch(accountActions.expireBalance());
      fetchBalance();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [dispatch, fetchBalance, enableRefresh]);

  const EyeIcon = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <Icon icon={isBalanceHidden ? 'balance-eyes-closed' : 'balance-eyes'} size={16} />
    </div>
  );

  const handleUnlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disableUtxoTools) return;
    openUtxoTools();
  };

  return (
    <div
      className={classNames(styles.container, isExpanded ? styles.expanded : styles.collapsed)}
      onClick={handleExpandToggle}
      style={{ margin: '0 auto' }}>
      <div className={styles.decorativeLineOne} />
      <div className={styles.decorativeLineTwo} />
      <img className={styles.decorativeImage} src={backgroundImage} alt="Balance background" />

      <div className={styles.header}>
        {t('total_balance')}
        <div style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
          <EyeIcon onClick={toggleBalanceVisibility} />
          {enableRefresh && <RefreshButton onClick={refreshBalance as any} hideText />}
        </div>
      </div>

      <div className={styles.balanceWrapper}>
        <div className={styles.balanceContent}>
          <span className={styles.balanceNumber}>{isBalanceHidden ? '*****' : totalAmount.split('.')[0]}</span>
          {!isBalanceHidden && (
            <>
              <span
                className={chain.enum === ChainType.FRACTAL_BITCOIN_MAINNET ? styles.fb_decimal : styles.decimal}
                style={{ color: isBtcMainnet ? '#000' : 'rgba(0, 0, 0, 0.45)' }}>
                .{totalAmount.split('.')[1]}
              </span>
              <span className={chain.enum === ChainType.FRACTAL_BITCOIN_MAINNET ? styles.fb_unit : styles.unit}>
                {btcUnit}
              </span>
            </>
          )}
          {isBalanceHidden && (
            <span className={chain.enum === ChainType.FRACTAL_BITCOIN_MAINNET ? styles.fb_unit : styles.unit}>
              {btcUnit}
            </span>
          )}
        </div>
        <Icon icon="balance-right" size={10} containerStyle={{ transform: `rotate(${isExpanded ? 270 : 90}deg)` }} />
      </div>

      <div className={styles.usdValue}>
        <BtcUsd sats={accountBalance.totalBalance} color="black_muted" size="sm" isHidden={isBalanceHidden} />
      </div>

      {/* Expandable details */}
      <div className={styles.detailsWrapper}>
        <Row itemsCenter fullY mx="md" justifyCenter={disableUtxoTools}>
          <div className={styles.column}>
            <span className={styles.label}>{t('available')}</span>
            <div className={styles.detailsAmount}>
              <span>{isBalanceHidden ? '*****' : availableAmount.split('.')[0]}</span>
              {!isBalanceHidden && <span className={styles.detailsDecimal}>.{availableAmount.split('.')[1]}</span>}
              <span>{btcUnit}</span>
            </div>
          </div>

          {disableUtxoTools ? <div className={styles.divider} /> : null}

          <Row itemsCenter gap="zero">
            {disableUtxoTools == false ? <div className={styles.divider} /> : null}
            <div className={styles.column}>
              <Tooltip
                overlayStyle={{
                  maxWidth: '328px',
                  padding: 0
                }}
                autoAdjustOverflow={false}
                arrowPointAtCenter={true}
                align={{
                  points: ['bc', 'tc'],
                  offset: [10, 0],
                  overflow: {
                    adjustX: true,
                    adjustY: true
                  }
                }}
                overlayInnerStyle={tooltipStyle}
                title={t('unavailable_tooltip')}
                placement="top"
                destroyTooltipOnHide={true}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                  <span className={styles.label}>{t('unavailable')}</span>

                  <span className={styles.questionIconWrapper}>
                    <Icon icon="balance-question" style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  </span>
                </div>
              </Tooltip>
              <div className={styles.detailsAmount}>
                <span>{isBalanceHidden ? '*****' : unavailableAmount.split('.')[0]}</span>
                {!isBalanceHidden && <span className={styles.detailsDecimal}>.{unavailableAmount.split('.')[1]}</span>}
                <span>{btcUnit}</span>
              </div>
            </div>

            {disableUtxoTools == false && (
              <Row>
                <div onClick={handleUnlock}>
                  <div className={classNames(styles.unlockButton, { [styles.disabled]: disableUtxoTools })}>
                    <span
                      style={{
                        marginRight: isSpecialLocale ? '0' : '2px',
                        fontSize: isSpecialLocale ? '8px' : '12px'
                      }}>
                      {t('unlock')}
                    </span>
                    {!isSpecialLocale && <Icon icon="balance-unlock-right" size={14} />}
                  </div>
                </div>
              </Row>
            )}
          </Row>
        </Row>
      </div>
    </div>
  );
}
