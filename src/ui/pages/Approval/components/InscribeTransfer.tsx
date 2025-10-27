import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { InscribeOrder, RawTxInfo, TokenBalance, TokenInfo, TxType } from '@/shared/types';
import {
  Button,
  Card,
  Column,
  Content,
  Footer,
  Header,
  Icon,
  Input,
  Layout,
  Row,
  Text,
  Tooltip
} from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { Loading } from '@/ui/components/ActionComponent/Loading';
import { BRC20Ticker } from '@/ui/components/BRC20Ticker';
import { BtcUsd } from '@/ui/components/BtcUsd';
import { Empty } from '@/ui/components/Empty';
import { FeeRateBar } from '@/ui/components/FeeRateBar';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import { OutputValueBar } from '@/ui/components/OutputValueBar';
import { RBFBar } from '@/ui/components/RBFBar';
import { TickUsdWithoutPrice, TokenType } from '@/ui/components/TickUsd';
import WebsiteBar from '@/ui/components/WebsiteBar';
import { useI18n } from '@/ui/hooks/useI18n';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useBTCUnit, useNetworkType } from '@/ui/state/settings/hooks';
import {
  useFetchUtxosCallback,
  usePrepareSendBypassHeadOffsetsCallback,
  usePushBitcoinTxCallback
} from '@/ui/state/transactions/hooks';
import { fontSizes } from '@/ui/theme/font';
import { spacing } from '@/ui/theme/spacing';
import { amountToSatoshis, satoshisToAmount, useApproval, useLocationState, useWallet } from '@/ui/utils';
import { getAddressUtxoDust } from '@/ui/utils/bitcoin-utils';

import { useNavigate } from '../../MainRoute';
import SignPsbt from './SignPsbt';

interface Props {
  params: {
    data: {
      ticker: string;
      amount: string;
    };
    session: {
      origin: string;
      icon: string;
      name: string;
    };
  };
}

enum Step {
  STEP1,
  STEP2,
  STEP3,
  STEP4
}

interface ContextData {
  step: Step;
  ticker: string;
  session?: any;
  tokenBalance?: TokenBalance;
  order?: InscribeOrder;
  rawTxInfo?: RawTxInfo;
  amount?: string;
  isApproval: boolean;
  tokenInfo?: TokenInfo;
  amountEditable?: boolean;
}

interface UpdateContextDataParams {
  step?: Step;
  ticket?: string;
  session?: any;
  tokenBalance?: TokenBalance;
  order?: InscribeOrder;
  rawTxInfo?: RawTxInfo;
  amount?: string;
  tokenInfo?: TokenInfo;
  amountEditable?: boolean;
}

export default function InscribeTransfer({ params: { data, session } }: Props) {
  const [contextData, setContextData] = useState<ContextData>({
    step: Step.STEP1,
    ticker: data.ticker,
    amount: data.amount,
    session,
    isApproval: true
  });
  const updateContextData = useCallback(
    (params: UpdateContextDataParams) => {
      setContextData(Object.assign({}, contextData, params));
    },
    [contextData, setContextData]
  );

  if (contextData.step === Step.STEP1) {
    return <InscribeTransferStep contextData={contextData} updateContextData={updateContextData} />;
  } else if (contextData.step === Step.STEP2) {
    return <InscribeConfirmStep contextData={contextData} updateContextData={updateContextData} />;
  } else if (contextData.step === Step.STEP3) {
    return <InscribeSignStep contextData={contextData} updateContextData={updateContextData} />;
  } else {
    return <InscribeResultStep contextData={contextData} updateContextData={updateContextData} />;
  }
}

interface LocationState {
  ticker: string;
}

export function InscribeTransferScreen() {
  const { ticker } = useLocationState<LocationState>();

  const [contextData, setContextData] = useState<ContextData>({
    step: Step.STEP1,
    ticker: ticker,
    isApproval: false
  });
  const updateContextData = useCallback(
    (params: UpdateContextDataParams) => {
      setContextData(Object.assign({}, contextData, params));
    },
    [contextData, setContextData]
  );

  if (contextData.step === Step.STEP1) {
    return <InscribeTransferStep contextData={contextData} updateContextData={updateContextData} />;
  } else if (contextData.step === Step.STEP2) {
    return <InscribeConfirmStep contextData={contextData} updateContextData={updateContextData} />;
  } else if (contextData.step === Step.STEP3) {
    return <InscribeSignStep contextData={contextData} updateContextData={updateContextData} />;
  } else {
    return <InscribeResultStep contextData={contextData} updateContextData={updateContextData} />;
  }
}

interface StepProps {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}

function InscribeTransferStep({ contextData, updateContextData }: StepProps) {
  const networkType = useNetworkType();
  const [getApproval, resolveApproval, rejectApproval] = useApproval();
  const { t } = useI18n();

  const handleCancel = () => {
    rejectApproval(t('user_rejected_the_request'));
  };

  const wallet = useWallet();
  const account = useCurrentAccount();
  const [feeRate, setFeeRate] = useState(5);
  const [inputAmount, setInputAmount] = useState('');

  const tools = useTools();
  const prepareSendBypassHeadOffsets = usePrepareSendBypassHeadOffsetsCallback();

  const fetchUtxos = useFetchUtxosCallback();

  const [inputError, setInputError] = useState('');
  const [outputValueError, setOutputValueError] = useState('');

  const [disabled, setDisabled] = useState(true);

  const [inputDisabled, setInputDisabled] = useState(false);

  const defaultOutputValue = 546; //getAddressUtxoDust(account.address);

  const [outputValue, setOutputValue] = useState<number>(defaultOutputValue);

  const [enableRBF, setEnableRBF] = useState(false);

  useEffect(() => {
    if (contextData.amount) {
      setInputAmount(contextData.amount.toString());
      setInputDisabled(!contextData.amountEditable);
    }
  }, []);

  useEffect(() => {
    setInputError('');
    setOutputValueError('');
    setDisabled(true);
    if (inputAmount.split('.').length > 1) {
      const decimal = inputAmount.split('.')[1].length;
      const token_decimal = contextData.tokenInfo?.decimal || 0;
      if (decimal > token_decimal) {
        setInputError(`${t('this_token_only_supports_up_to')} ${token_decimal} ${t('decimal_places')}.`);
        return;
      }
    }

    if (!inputAmount) {
      return;
    }

    const amount = new BigNumber(inputAmount);
    if (!amount) {
      return;
    }

    if (!contextData.tokenBalance) {
      return;
    }

    if (amount.lte(0)) {
      return;
    }

    if (amount.gt(contextData.tokenBalance.availableBalanceSafe)) {
      setInputError(t('insufficient_balance'));
      return;
    }

    if (feeRate <= 0) {
      return;
    }

    const dust = getAddressUtxoDust(account.address);
    if (outputValue < dust) {
      setOutputValueError(`${t('output_value_must_be_at_least')} ${dust}`);
      return;
    }

    if (!outputValue) {
      return;
    }

    setDisabled(false);
  }, [inputAmount, feeRate, outputValue, contextData.tokenBalance]);

  useEffect(() => {
    fetchUtxos();
    wallet
      .getBRC20Summary(account.address, contextData.ticker)
      .then((v) => {
        updateContextData({ tokenBalance: v.tokenBalance, tokenInfo: v.tokenInfo });
      })
      .catch((e) => {
        tools.toastError(e.message);
      });
  }, []);

  const onClickInscribe = async () => {
    try {
      tools.showLoading(true);
      const amount = inputAmount;
      const order = await wallet.inscribeBRC20Transfer(
        account.address,
        contextData.ticker,
        amount,
        feeRate,
        outputValue
      );

      const rawTxInfo = await prepareSendBypassHeadOffsets({
        toAddressInfo: { address: order.payAddress, domain: '' },
        toAmount: order.totalFee,
        feeRate: feeRate
      });

      updateContextData({ order, amount, rawTxInfo, step: Step.STEP2 });
    } catch (e) {
      console.log(e);
      tools.toastError((e as Error).message);
    } finally {
      tools.showLoading(false);
    }
  };

  const { tokenBalance } = contextData;

  return (
    <Layout>
      {contextData.isApproval ? (
        <Header>
          <WebsiteBar session={contextData.session} />
        </Header>
      ) : (
        <Header
          onBack={() => {
            window.history.go(-1);
          }}
        />
      )}
      <Content>
        <Column full>
          <Column gap="lg" full>
            <Text text={t('inscribe_transfer')} preset="title-bold" textCenter my="lg" />

            <Column>
              <Row justifyBetween itemsCenter>
                <Text text={t('available')} color="textDim" />
                <TickUsdWithoutPrice tick={contextData.ticker} balance={inputAmount} type={TokenType.BRC20} />
                {tokenBalance ? (
                  <Column>
                    {tokenBalance.availableBalanceUnSafe != '0' ? (
                      <Row justifyCenter>
                        <Text
                          text={`${tokenBalance.availableBalanceSafe}  `}
                          textCenter
                          size="xs"
                          digital
                          onClick={() => {
                            setInputAmount(tokenBalance.availableBalanceSafe);
                          }}
                        />
                        <Tooltip
                          title={`${tokenBalance.availableBalanceUnSafe} ${tokenBalance.ticker} ${t(
                            'is_unconfirmed_please_wait_for_confirmation'
                          )} `}
                          overlayStyle={{
                            fontSize: fontSizes.xs
                          }}>
                          <div>
                            <Row>
                              <Text
                                text={` + ${tokenBalance.availableBalanceUnSafe}`}
                                textCenter
                                color="textDim"
                                size="xs"
                                digital
                              />
                              <Icon icon="circle-question" color="textDim" />
                            </Row>
                          </div>
                        </Tooltip>

                        <BRC20Ticker tick={tokenBalance.ticker} displayName={tokenBalance.displayName} preset="sm" />
                      </Row>
                    ) : (
                      <Row
                        itemsCenter
                        onClick={() => {
                          setInputAmount(tokenBalance.availableBalanceSafe);
                        }}>
                        <Text text={`${tokenBalance.availableBalanceSafe}`} digital textCenter size="xs" />

                        <BRC20Ticker tick={tokenBalance.ticker} displayName={tokenBalance.displayName} preset="sm" />
                      </Row>
                    )}
                  </Column>
                ) : (
                  <Text text={t('loading')} />
                )}
              </Row>

              <Input
                preset="amount"
                placeholder={t('amount')}
                value={inputAmount}
                autoFocus={true}
                enableBrc20Decimal={true}
                onAmountInputChange={(amount) => {
                  setInputAmount(amount);
                }}
                disabled={inputDisabled}
              />
              {inputError && <Text text={inputError} color="error" />}
            </Column>

            <Column mt="lg">
              <Text text={t('output_value')} color="textDim" />

              <OutputValueBar
                defaultValue={defaultOutputValue}
                minValue={defaultOutputValue}
                onChange={(val) => {
                  setOutputValue(val);
                }}
              />
              {outputValueError && <Text text={outputValueError} color="error" />}
            </Column>

            <Column>
              <Text text={t('fee_rate')} color="textDim" />
              <FeeRateBar
                onChange={(val) => {
                  setFeeRate(val);
                }}
              />
            </Column>

            <Column mt="lg">
              <RBFBar
                onChange={(val) => {
                  setEnableRBF(val);
                }}
              />
            </Column>
          </Column>
        </Column>
      </Content>

      {contextData.isApproval ? (
        <Footer>
          <Row full>
            <Button text={t('cancel')} preset="default" onClick={handleCancel} full />
            <Button text={t('next')} preset="primary" onClick={onClickInscribe} full disabled={disabled} />
          </Row>
        </Footer>
      ) : (
        <Footer>
          <Row full>
            <Button text={t('next')} preset="primary" onClick={onClickInscribe} full disabled={disabled} />
          </Row>
        </Footer>
      )}
    </Layout>
  );
}

function InscribeConfirmStep({ contextData, updateContextData }: StepProps) {
  const { order, tokenBalance, amount, rawTxInfo, session } = contextData;
  const btcUnit = useBTCUnit();
  const { t } = useI18n();

  if (!order || !tokenBalance || !rawTxInfo) {
    return <Empty />;
  }

  const fee = rawTxInfo.fee || 0;
  const networkFee = useMemo(() => satoshisToAmount(fee), [fee]);
  const outputValue = useMemo(() => satoshisToAmount(order.outputValue), [order.outputValue]);
  const minerFee = useMemo(() => satoshisToAmount(order.minerFee + fee), [order.minerFee]);
  const originServiceFee = useMemo(() => satoshisToAmount(order.originServiceFee), [order.originServiceFee]);
  const serviceFee = useMemo(() => satoshisToAmount(order.serviceFee), [order.serviceFee]);
  const totalFee = useMemo(() => satoshisToAmount(order.totalFee + fee), [order.totalFee]);

  return (
    <Layout>
      {contextData.isApproval ? (
        <Header>
          <WebsiteBar session={contextData.session} />
        </Header>
      ) : (
        <Header
          onBack={() => {
            updateContextData({
              step: Step.STEP1,
              amountEditable: true
            });
          }}
        />
      )}
      <Content>
        <Column full>
          <Column gap="lg" full>
            <Text text={t('inscribe_transfer')} preset="title-bold" textCenter mt="lg" />

            <Column justifyCenter style={{ height: 250 }}>
              <Row itemsCenter justifyCenter>
                <Text text={`${amount}`} preset="title-bold" size="xxl" textCenter wrap digital />
                <BRC20Ticker tick={tokenBalance.ticker} displayName={tokenBalance.displayName} preset="lg" />
              </Row>
              <Row itemsCenter justifyCenter>
                <TickUsdWithoutPrice tick={tokenBalance.ticker} balance={amount + ''} type={TokenType.BRC20} />
              </Row>
              <Column mt="xxl">
                <Text text={t('preview')} preset="sub-bold" />
                <Card preset="style2">
                  <Text
                    text={`{"p":"brc-20","op":"transfer","tick":"${tokenBalance.ticker}","amt":"${amount}"}`}
                    size="xs"
                    wrap
                  />
                </Card>
              </Column>
            </Column>

            <Column>
              <Row justifyBetween>
                <Text text={t('payment_network_fee')} color="textDim" />
                <Text text={`${networkFee} ${btcUnit}`} />
              </Row>

              <Row justifyBetween>
                <Text text={t('inscription_output_value')} color="textDim" />
                <Text text={`${outputValue} ${btcUnit}`} />
              </Row>

              <Row justifyBetween>
                <Text text={t('inscription_network_fee')} color="textDim" />
                <Text text={`${minerFee} ${btcUnit}`} />
              </Row>

              <Row justifyBetween>
                <Text text={t('service_fee')} color="textDim" />
                {originServiceFee != serviceFee ? (
                  <Column>
                    <Text
                      text={`${originServiceFee} ${btcUnit}`}
                      style={{ textDecorationLine: 'line-through' }}
                      color="textDim"
                    />
                    <Text text={`${serviceFee} ${btcUnit}`} />
                  </Column>
                ) : (
                  <Text text={`${serviceFee} ${btcUnit}`} />
                )}
              </Row>
              <Row justifyBetween>
                <Text text={t('total')} color="gold" />
                <Text text={`${totalFee} ${btcUnit}`} color="gold" />
              </Row>
              <Row justifyBetween>
                <div></div>
                <BtcUsd sats={amountToSatoshis(totalFee)} />
              </Row>
            </Column>
          </Column>
        </Column>
      </Content>
      {contextData.isApproval ? (
        <Footer>
          <Row full>
            <Button
              text={t('back')}
              preset="default"
              onClick={() => {
                updateContextData({
                  step: Step.STEP1,
                  amountEditable: true
                });
              }}
              full
            />
            <Button
              text={t('next')}
              preset="primary"
              onClick={() => {
                updateContextData({
                  step: Step.STEP3
                });
                // onClickConfirm();
              }}
              full
            />
          </Row>
        </Footer>
      ) : (
        <Footer>
          <Row full>
            <Button
              text={t('next')}
              preset="primary"
              onClick={() => {
                updateContextData({
                  step: Step.STEP3
                });
                // onClickConfirm();
              }}
              full
            />
          </Row>
        </Footer>
      )}
    </Layout>
  );
}

function InscribeSignStep({
  contextData,
  updateContextData
}: {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}) {
  const pushBitcoinTx = usePushBitcoinTxCallback();
  const navigate = useNavigate();
  return (
    <SignPsbt
      header={
        contextData.isApproval ? (
          <Header>
            <WebsiteBar session={contextData.session} />
          </Header>
        ) : (
          <Header
            onBack={() => {
              updateContextData({
                step: Step.STEP2
              });
            }}
          />
        )
      }
      params={{
        data: {
          psbtHex: contextData.rawTxInfo!.psbtHex,
          type: TxType.SEND_BITCOIN,
          options: {
            autoFinalized: true
          }
        }
      }}
      handleConfirm={(res) => {
        pushBitcoinTx((res ?? contextData.rawTxInfo!).rawtx).then(({ success, txid, error }) => {
          if (success) {
            updateContextData({
              step: Step.STEP4
            });
          } else {
            navigate('TxFailScreen', { error });
          }
        });
      }}
    />
  );
}

function InscribeResultStep({
  contextData,
  updateContextData
}: {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}) {
  if (!contextData.order || !contextData.tokenBalance) {
    return <Empty />;
  }

  const { tokenBalance, order } = contextData;
  const tools = useTools();
  const wallet = useWallet();
  const currentAccount = useCurrentAccount();
  const [getApproval, resolveApproval, rejectApproval] = useApproval();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>();
  const { t } = useI18n();
  const checkResult = async () => {
    const result = await wallet.getInscribeResult(order.orderId);
    if (!result) {
      setTimeout(() => {
        checkResult();
      }, 2000);
      return;
    }
    tools.showLoading(false);
    setResult(result);
  };

  useEffect(() => {
    checkResult();
  }, []);

  const onClickConfirm = () => {
    tools.showLoading(true);
    wallet
      .getBRC20Summary(currentAccount.address, tokenBalance.ticker)
      .then((v) => {
        if (contextData.isApproval) {
          resolveApproval({
            inscriptionId: result.inscriptionId,
            inscriptionNumber: result.inscriptionNumber,
            ticker: tokenBalance.ticker,
            amount: result.amount
          });
        } else {
          navigate('BRC20SendScreen', {
            tokenBalance: v.tokenBalance,
            selectedInscriptionIds: [result.inscriptionId],
            selectedAmount: result.amount,
            tokenInfo: v.tokenInfo
          });
        }
      })
      .finally(() => {
        tools.showLoading(false);
      });
  };

  if (!result) {
    return (
      <Layout>
        {contextData.isApproval ? (
          <Header>
            <WebsiteBar session={contextData.session} />
          </Header>
        ) : (
          <Header />
        )}
        <Content style={{ gap: spacing.small }}>
          <Column justifyCenter mt="xxl" gap="xl">
            <Row justifyCenter>
              <Icon icon="success" size={50} style={{ alignSelf: 'center' }} />
            </Row>

            <Text preset="title" text={t('payment_sent')} textCenter />
            <Text preset="sub" text={t('your_transaction_has_been_successfully_sent')} color="textDim" textCenter />

            <Column justifyCenter itemsCenter>
              <Column mt="lg">
                <Loading text={t('inscribing')} />
              </Column>
            </Column>
          </Column>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      {contextData.isApproval ? (
        <Header>
          <WebsiteBar session={contextData.session} />
        </Header>
      ) : (
        <Header />
      )}
      <Content style={{ gap: spacing.small }}>
        <Column justifyCenter mt="xxl" gap="xl">
          <Text text={t('inscribe_success')} preset="title-bold" textCenter />
          <Column justifyCenter itemsCenter style={{ width: '100%', alignItems: 'center' }}>
            <div style={{ width: '120px' }}>
              <InscriptionPreview data={result.inscription} preset="medium" />
            </div>

            <Column mt="lg">
              <Text text={t('the_transferable_and_available_balance_of_brc20_wi')} textCenter />
            </Column>
          </Column>
        </Column>
      </Content>
      {contextData.isApproval ? (
        <Footer>
          <Row full>
            <Button
              text={t('done')}
              preset="primary"
              onClick={() => {
                onClickConfirm();
              }}
              full
            />
          </Row>
        </Footer>
      ) : (
        <Footer>
          <Row full>
            <Button
              text={t('done')}
              preset="primary"
              onClick={() => {
                onClickConfirm();
              }}
              full
            />
          </Row>
        </Footer>
      )}
    </Layout>
  );
}
