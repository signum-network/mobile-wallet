import {Account, Address, Alias, SuggestedFees} from '@signumjs/core';
import {Amount} from '@signumjs/util';
import React, {createRef} from 'react';
import {
  Image,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import SwipeButton from 'rn-swipe-button';
import {actionIcons, transactionIcons} from '../../../../assets/icons';
import {BInput, KeyboardTypes} from '../../../../core/components/base/BInput';
import {BSelect, SelectItem} from '../../../../core/components/base/BSelect';
import {
  Text,
  Text as BText,
  TextAlign,
} from '../../../../core/components/base/Text';
import {i18n} from '../../../../core/i18n';
import {Colors} from '../../../../core/theme/colors';
import {SendAmountPayload} from '../../store/actions';
import {
  Recipient,
  RecipientType,
  RecipientValidationStatus,
} from '../../store/utils';
import {transactions} from '../../translations';
import {AccountStatusPill} from './AccountStatusPill';
import {
  isValidReedSolomonAddress,
  shortenRSAddress,
} from '../../../../core/utils/account';
import {BCheckbox} from '../../../../core/components/base/BCheckbox';
import {FontSizes, Sizes} from '../../../../core/theme/sizes';
import {AmountText} from '../../../../core/components/base/Amount';
import {DangerBox} from './DangerBox';
import {
  AccountBalances,
  getBalancesFromAccount,
  ZeroAcountBalances,
} from '../../../../core/utils/balance/getBalancesFromAccount';
import {
  Button,
  ButtonSizes,
  ButtonThemes,
} from '../../../../core/components/base/Button';
import {
  stableAmountFormat,
  stableParseSignaAmount,
} from '../../../../core/utils/amount';
import {core} from '../../../../core/translations';
import {SmartContractPublicKey} from '../../../../core/utils/constants';
import {shortenString} from '../../../../core/utils/string';
import {FeeSelector} from '../FeeSelector';
import {DescriptorData} from '@signumjs/standards';
import {updateActivity} from '../../../../core/store/app/actions';
import {connect} from 'react-redux';

interface Props {
  loading: boolean;
  onReset: () => void;
  onSubmit: (form: SendAmountPayload) => void;
  onCameraIconPress: () => void;
  onGetAccount: (id: string) => Promise<Account>;
  onGetAlias: (id: string) => Promise<Alias>;
  onGetUnstoppableAddress: (id: string) => Promise<string | null>;
  accounts: Account[];
  suggestedFees: SuggestedFees | null;
  deepLinkProps?: SendFormState;
  addressPrefix: string;
  updateActivity: () => void;
}

export interface SendFormState {
  sender: null | Account;
  amount?: string;
  address?: string;
  fee?: string;
  message?: string;
  messageIsText: boolean;
  encrypt: boolean;
  immutable: boolean;
  recipient: Recipient;
  recipientType?: string;
  showSubmitButton?: boolean;
  addMessage?: boolean;
  confirmedRisk?: boolean;
  balances: AccountBalances;
  dirty?: boolean;
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  feeSection: {
    marginBottom: 10,
  },
  headerSection: {},
  bottomSection: {},
  form: {
    display: 'flex',
  },
  scan: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  cameraIcon: {
    marginTop: 3,
    marginRight: 2,
    width: 20,
    height: 20,
    backgroundColor: Colors.TRANSPARENT,
  },
  totalSection: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  total: {
    // flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  chevron: {
    width: 25,
    height: 25,
    marginTop: 3,
    transform: [{rotate: '-90deg'}],
  },
  balance: {
    marginTop: 3,
    marginRight: 5,
  },
  sendIcon: {
    fontSize: FontSizes.SMALL,
    width: 8,
    height: 8,
    color: Colors.RED,
  },
});

const subBalanceStyles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Sizes.MEDIUM,
  },
});

const Balances: React.FC<{balances?: AccountBalances}> = ({
  balances = ZeroAcountBalances,
}) => (
  <View style={subBalanceStyles.root}>
    <Text color={Colors.GREY} size={FontSizes.SMALLER}>
      {i18n.t(core.balances.total)}
    </Text>
    <AmountText
      color={Colors.GREY}
      size={FontSizes.SMALL}
      amount={balances.totalBalance}
    />
    {balances.lockedBalance.greater(Amount.Zero()) && (
      <>
        <Text color={Colors.GREY} size={FontSizes.SMALLER}>
          {i18n.t(core.balances.locked)}
        </Text>
        <AmountText
          color={Colors.GREY}
          size={FontSizes.SMALLER}
          amount={balances.lockedBalance}
        />
      </>
    )}
    {balances.committedBalance.greater(Amount.Zero()) && (
      <>
        <Text color={Colors.GREY} size={FontSizes.SMALLER}>
          Committed:
        </Text>
        <AmountText
          color={Colors.GREY}
          size={FontSizes.SMALLER}
          amount={balances.committedBalance}
        />
      </>
    )}
  </View>
);

function isUnstoppableDomain(recipient: string): boolean {
  return /.+\.(zil|crypto|888|x|coin|wallet|bitcoin|nft|dao|blockchain)$/.test(
    recipient.toLowerCase(),
  );
}

class _SendForm extends React.Component<Props, SendFormState> {
  private scrollViewRef = createRef<ScrollView>();
  constructor(props: any) {
    super(props);
    this.state = this.getInitialState(props.deepLinkProps);
  }

  getAccounts = (): Array<SelectItem<string>> => {
    return (
      this.props.accounts
        // @ts-ignore
        .filter(({type}) => type === 'active')
        .map(({accountRS, name, account}) => ({
          value: account,
          label: name
            ? `${shortenString(name)} - ${shortenRSAddress(accountRS)}`
            : accountRS,
        }))
    );
  };

  getAccount = (accountId: string): Account | null => {
    return (
      this.props.accounts.find(({account}) => account === accountId) || null
    );
  };

  getInitialState = (deeplinkProps?: SendFormState) => {
    const accounts = this.getAccounts();
    const sender =
      accounts.length >= 1 ? this.getAccount(accounts[0].value) : null;
    const balances = getBalancesFromAccount(sender);
    return {
      sender,
      amount: (deeplinkProps && deeplinkProps.amount) || '0',
      fee:
        (deeplinkProps && deeplinkProps.fee) ||
        (this.props.suggestedFees &&
          Amount.fromPlanck(this.props.suggestedFees.standard).getSigna()) ||
        '0',
      message: (deeplinkProps && deeplinkProps.message) || undefined,
      messageIsText:
        deeplinkProps && deeplinkProps.messageIsText !== undefined
          ? deeplinkProps.messageIsText
          : true,
      encrypt: (deeplinkProps && deeplinkProps.encrypt) || false,
      immutable: (deeplinkProps && deeplinkProps.immutable) || false,
      recipient: new Recipient(
        (deeplinkProps && deeplinkProps.address) || '',
        (deeplinkProps && deeplinkProps.address) || '',
      ),
      addMessage: (deeplinkProps && !!deeplinkProps.message) || false,
      confirmedRisk: false,
      dirty: !!deeplinkProps,
      balances,
    };
  };

  private async fetchAccountIdFromAlias(
    aliasName: string,
  ): Promise<string | null> {
    const alias = await this.props.onGetAlias(aliasName);
    if (!alias) {
      return null;
    }

    const {aliasURI} = alias;

    // SRC44
    try {
      const descriptor = DescriptorData.parse(aliasURI);
      return descriptor.account || null;
    } catch (e: any) {
      // ignore
    }

    // Try Legacy Alias
    const matches = /^acct:(burst|s|ts)?-(.+)@(burst|signum)$/i.exec(aliasURI);
    if (!matches || matches.length < 2) {
      return null;
    }
    const unwrappedAddress =
      `${this.props.addressPrefix}-${matches[2]}`.toUpperCase();
    return Address.fromReedSolomonAddress(unwrappedAddress).getNumericId();
  }

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    if (nextProps.deepLinkProps !== this.props.deepLinkProps) {
      this.setState(
        this.getInitialState(nextProps.deepLinkProps),
        () =>
          this.state.recipient &&
          this.applyRecipientType(this.state.recipient.addressRaw),
      );
    }
  };

  applyRecipientType(recipient: string): void {
    const r = recipient.trim();
    let type: RecipientType;

    if (r.length === 0) {
      type = RecipientType.UNKNOWN;
    } else if (isValidReedSolomonAddress(r)) {
      type = RecipientType.ADDRESS;
    } else if (isUnstoppableDomain(r)) {
      type = RecipientType.UNSTOPPABLE;
    } else if (/^\d+$/.test(r)) {
      type = RecipientType.ID;
    } else {
      type = RecipientType.ALIAS;
    }

    this.setState(
      {
        recipient: {
          addressRaw: r,
          addressRS: '',
          status: RecipientValidationStatus.UNKNOWN,
          type,
        },
      },
      () => {
        this.validateRecipient(r, type);
      },
    );
  }

  async validateRecipient(
    recipient: string,
    type: RecipientType,
  ): Promise<void> {
    let formattedAddress: string | null = recipient;

    switch (type) {
      case RecipientType.ALIAS:
        try {
          formattedAddress = await this.fetchAccountIdFromAlias(
            formattedAddress,
          );
        } catch (e) {
          this.setState({
            recipient: {
              ...this.state.recipient,
              status: RecipientValidationStatus.INVALID,
            },
          });
        }
        break;
      case RecipientType.ADDRESS:
        try {
          formattedAddress =
            Address.fromReedSolomonAddress(recipient).getNumericId();
        } catch (e) {
          formattedAddress = recipient;
        }
        break;
      case RecipientType.UNSTOPPABLE:
        try {
          formattedAddress = await this.props.onGetUnstoppableAddress(
            recipient,
          );
          if (formattedAddress === null) {
            this.setState({
              recipient: {
                ...this.state.recipient,
                status: RecipientValidationStatus.INVALID,
              },
            });
          }
        } catch (e) {
          this.setState({
            recipient: {
              ...this.state.recipient,
              status: RecipientValidationStatus.UNSTOPPABLE_OUTAGE,
            },
          });
        }
        break;
      case RecipientType.ID:
        break;
      default:
        formattedAddress = null;
    }

    if (!formattedAddress) {
      return;
    }

    try {
      // this method throws if nothing comes back
      const {accountRS, publicKey} = await this.props.onGetAccount(
        formattedAddress || '',
      );

      let type = this.state.recipient.type;
      if (publicKey === SmartContractPublicKey) {
        type = RecipientType.CONTRACT;
      }

      this.setState({
        confirmedRisk: true,
        recipient: {
          ...this.state.recipient,
          type,
          addressRS: accountRS,
          status: RecipientValidationStatus.VALID,
        },
      });
    } catch (e) {
      let addressRS = recipient;
      try {
        addressRS =
          this.state.recipient.type === RecipientType.UNSTOPPABLE
            ? recipient
            : Address.create(recipient).getReedSolomonAddress();
      } catch (e) {
        // no op
      }

      this.setState({
        confirmedRisk: false,
        recipient: {
          ...this.state.recipient,
          addressRS,
          status: RecipientValidationStatus.INVALID,
        },
      });
    }
  }

  hasSufficientBalance = (): boolean => {
    const {amount, balances} = this.state;
    const parsedAmount = stableParseSignaAmount(amount);
    return balances.availableBalance.greaterOrEqual(parsedAmount);
  };

  isSubmitEnabled = () => {
    const {sender, recipient, amount, fee, confirmedRisk} = this.state;
    const {loading} = this.props;

    return Boolean(
      Number(amount) &&
        Number(fee) &&
        sender &&
        isValidReedSolomonAddress(recipient?.addressRS) &&
        !loading &&
        confirmedRisk &&
        this.hasSufficientBalance(),
    );
  };

  markAsDirty = (): void => {
    this.setState({dirty: true});
    this.props.updateActivity();
  };

  handleChangeFromAccount = (sender: string) => {
    const account = this.getAccount(sender);
    console.log('changeAccount', account, sender);
    const balances = getBalancesFromAccount(account);
    this.setState({sender: account, balances});
  };

  handleChangeAddress = (address: string) => {
    this.setState({
      recipient: {
        ...this.state.recipient,
        addressRaw: address,
      },
    });
    this.markAsDirty();
  };

  handleAddressBlur = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>,
  ) => {
    this.applyRecipientType(e.nativeEvent.text);
  };

  handleAmountChange = (amount: string) => {
    this.setState({amount: stableAmountFormat(amount)});
    this.markAsDirty();
  };

  handleFeeChange = (feeSigna: string) => {
    this.setState({
      fee: stableAmountFormat(feeSigna),
    });
    this.markAsDirty();
  };

  handleMessageChange = (message: string) => {
    this.setState({message});
    this.markAsDirty();
  };

  setEncryptMessage(encrypt: boolean): void {
    this.setState({encrypt});
    this.markAsDirty();
  }

  setAddMessage(addMessage: boolean): void {
    this.setState({addMessage});
    this.markAsDirty();
  }

  handleFeeSelectorChange = (fee: number) => {
    this.setState({fee: Amount.fromPlanck(fee).getSigna()});
    this.markAsDirty();
  };

  setConfirmedRisk = (confirmedRisk: boolean) => {
    this.setState({confirmedRisk});
  };

  onSpendAll = () => {
    const {sender, fee, balances} = this.state;
    if (!sender) {
      return;
    }

    const maxAmount = balances.availableBalance.subtract(
      Amount.fromSigna(fee || 0),
    );
    this.handleAmountChange(
      maxAmount.less(Amount.Zero()) ? '0' : maxAmount.getSigna(),
    );
  };

  handleSubmit = () => {
    if (!this.isSubmitEnabled()) {
      return;
    }

    const {
      recipient,
      amount,
      fee,
      sender,
      message,
      messageIsText,
      encrypt,
      immutable,
    } = this.state;
    const address = recipient.addressRS;
    this.handleReset();
    this.props.onSubmit({
      address,
      amount: amount || '',
      fee: fee || '',
      // @ts-ignore
      sender,
      message,
      messageIsText,
      immutable,
      encrypt,
    });
  };

  handleReset = () => {
    this.setState(this.getInitialState());
    this.props.onReset();
  };

  shouldShowAliasWarning = (): boolean => {
    const {type, status} = this.state.recipient;
    return (
      type === RecipientType.ALIAS &&
      status === RecipientValidationStatus.INVALID
    );
  };

  shouldConfirmRisk = (): boolean => {
    const {recipient, confirmedRisk} = this.state;
    return (
      !confirmedRisk &&
      recipient.type !== RecipientType.UNKNOWN &&
      recipient.type !== RecipientType.ALIAS &&
      recipient.status === RecipientValidationStatus.INVALID
    );
  };

  isResetEnabled = (): boolean => {
    return !this.props.loading && !!this.state.dirty;
  };

  getTotal = (): Amount => {
    const {amount, fee} = this.state;
    return stableParseSignaAmount(amount).add(stableParseSignaAmount(fee));
  };

  render() {
    const {
      addMessage,
      amount,
      balances,
      confirmedRisk,
      encrypt,
      fee,
      message,
      recipient,
      sender,
    } = this.state;
    const {suggestedFees} = this.props;
    const total = this.getTotal();
    const isResetEnabled = this.isResetEnabled();
    const isSubmitEnabled = this.isSubmitEnabled();
    const swipeButtonTitle = isSubmitEnabled
      ? i18n.t(transactions.screens.send.button.enabled)
      : i18n.t(transactions.screens.send.button.disabled);

    const SenderRightElement = (
      <View style={{flexDirection: 'row'}}>
        {this.state.sender && (
          <View style={styles.balance}>
            <AmountText
              amount={this.state.balances.availableBalance}
              color={Colors.GREY_LIGHT}
            />
          </View>
        )}
        <Image source={actionIcons.chevron} style={styles.chevron} />
      </View>
    );

    const RecipientRightIcons = (
      <View style={{flexDirection: 'row'}}>
        {recipient.addressRaw !== this.props.addressPrefix + '-' && (
          <AccountStatusPill
            address={recipient.addressRS}
            type={recipient.type}
            status={recipient.status}
          />
        )}
        <TouchableOpacity onPress={this.props.onCameraIconPress}>
          <Image source={transactionIcons.camera} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>
    );

    const AmountRightIcons = (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.onSpendAll}>
          <Image source={transactionIcons.sendAll} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>
    );

    const isSubmitSwipeVisible =
      !this.shouldShowAliasWarning() &&
      !this.shouldConfirmRisk() &&
      this.hasSufficientBalance();

    return (
      <View style={styles.root}>
        <View style={styles.headerSection}>
          <BSelect
            value={sender?.account}
            items={this.getAccounts()}
            onChange={this.handleChangeFromAccount}
            title={i18n.t(transactions.screens.send.from)}
            placeholder={i18n.t(transactions.screens.send.selectAccount)}
            rightElement={SenderRightElement}
          />
          <Balances balances={balances} />
        </View>
        <View style={styles.form}>
          <BInput
            // autoCapitalize='characters'
            value={recipient.addressRaw}
            onChange={this.handleChangeAddress}
            onEndEditing={this.handleAddressBlur}
            editable={!this.state.immutable}
            title={i18n.t(transactions.screens.send.to)}
            placeholder={i18n.t(transactions.screens.send.toHint)}
            rightIcons={RecipientRightIcons}
          />
          <BInput
            value={amount || '0'}
            onChange={this.handleAmountChange}
            keyboard={KeyboardTypes.NUMERIC}
            editable={!this.state.immutable}
            title={i18n.t(transactions.screens.send.amountNQT)}
            placeholder={'0'}
            rightIcons={AmountRightIcons}
          />
          <BInput
            value={fee || '0'}
            onChange={this.handleFeeChange}
            keyboard={KeyboardTypes.NUMERIC}
            editable={!this.state.immutable}
            title={i18n.t(transactions.screens.send.feeNQT)}
            placeholder={'0'}
          />
          {suggestedFees && (
            <View style={styles.feeSection}>
              <FeeSelector
                payloadLength={message?.length || 0}
                onFeeSelected={this.handleFeeSelectorChange}
              />
            </View>
          )}

          <BCheckbox
            disabled={this.state.immutable}
            labelFontSize={FontSizes.SMALL}
            label={i18n.t(transactions.screens.send.addMessage)}
            value={addMessage || false}
            onCheck={checked => this.setAddMessage(checked)}
          />

          {addMessage && (
            <>
              <BInput
                editable={!this.state.immutable}
                value={message || ''}
                onChange={this.handleMessageChange}
                title={i18n.t(transactions.screens.send.message)}
                rowCount={3}
              />

              <BCheckbox
                disabled={this.state.immutable}
                labelFontSize={FontSizes.SMALL}
                label={i18n.t(transactions.screens.send.encrypt)}
                value={encrypt || false}
                onCheck={checked => this.setEncryptMessage(checked)}
              />
            </>
          )}
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.totalSection}>
            <View style={styles.total}>
              <BText bebasFont color={Colors.WHITE}>
                {i18n.t(transactions.screens.send.total)}
              </BText>
              <AmountText amount={total} />
            </View>
            <View>
              <Button
                theme={ButtonThemes.ACCENT}
                size={ButtonSizes.SMALL}
                disabled={!isResetEnabled}
                onPress={this.handleReset}>
                {i18n.t(transactions.screens.send.reset)}
              </Button>
            </View>
          </View>
          {!this.hasSufficientBalance() && (
            <DangerBox>
              <BText
                bebasFont
                color={Colors.WHITE}
                textAlign={TextAlign.CENTER}>
                {i18n.t(transactions.screens.send.insufficientFunds)}
              </BText>
            </DangerBox>
          )}

          {this.shouldShowAliasWarning() && (
            <DangerBox>
              <BText
                bebasFont
                color={Colors.WHITE}
                textAlign={TextAlign.CENTER}>
                {i18n.t(transactions.screens.send.invalidAlias)}
              </BText>
            </DangerBox>
          )}

          {this.shouldConfirmRisk() && (
            <DangerBox>
              <View style={{width: '90%'}}>
                <BCheckbox
                  label={i18n.t(transactions.screens.send.confirmRisk, {
                    address: recipient?.addressRS,
                  })}
                  labelFontSize={FontSizes.SMALL}
                  value={confirmedRisk || false}
                  onCheck={this.setConfirmedRisk}
                />
              </View>
            </DangerBox>
          )}

          {isSubmitSwipeVisible && (
            <SwipeButton
              disabledRailBackgroundColor={Colors.PINK}
              disabledThumbIconBackgroundColor={Colors.GREY}
              disabledThumbIconBorderColor={Colors.BLUE_DARKER}
              disabledThumb={Colors.BLUE_DARKER}
              thumbIconBackgroundColor={Colors.WHITE}
              thumbIconImageSource={actionIcons.send}
              onSwipeSuccess={this.handleSubmit}
              shouldResetAfterSuccess={true}
              title={swipeButtonTitle}
              railBackgroundColor={Colors.GREEN_LIGHT}
              railBorderColor={Colors.BLUE_DARKER}
              railFillBackgroundColor={Colors.BLUE_DARKER}
              railFillBorderColor={Colors.BLUE_DARKER}
              titleColor={Colors.BLACK}
              disabled={!isSubmitEnabled}
            />
          )}
        </View>
      </View>
    );
  }
}

// Old school workaround to trigger user activity
function mapDispatchToProps(dispatch: any) {
  return {
    updateActivity: () => dispatch(updateActivity()),
  };
}

export const SendForm = connect(null, mapDispatchToProps)(_SendForm);
