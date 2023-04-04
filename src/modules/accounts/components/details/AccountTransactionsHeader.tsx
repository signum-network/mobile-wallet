import {Account} from '@signumjs/core';
import {Amount} from '@signumjs/util';
import {toNumber} from 'lodash';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, TextAlign} from '../../../../core/components/base/Text';
import {i18n} from '../../../../core/i18n';
import {Colors} from '../../../../core/theme/colors';
import {
  defaultSideOffset,
  FontSizes,
  Sizes,
} from '../../../../core/theme/sizes';
import {core} from '../../../../core/translations';
import {amountToString} from '../../../../core/utils/numbers';
import {PriceInfoReduxState} from '../../../price-api/store/reducer';
import {AmountText} from '../../../../core/components/base/Amount';
import {getBalancesFromAccount} from '../../../../core/utils/balance/getBalancesFromAccount';
import QRCode from 'react-native-qrcode-svg';
import {AccountActivationView} from '../../../../core/components/base/AccountActivationView';

interface Props {
  account: Account;
  priceApi?: PriceInfoReduxState;
}

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: defaultSideOffset,
    marginBottom: Sizes.MEDIUM,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  qrCode: {
    paddingHorizontal: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const subBalanceStyles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const SubBalance: React.FC<{amount: Amount; text: string}> = ({
  amount,
  text,
}) => (
  <View style={subBalanceStyles.root}>
    <View style={subBalanceStyles.content}>
      <Text color={Colors.GREY} size={FontSizes.SMALL}>
        {text}:
      </Text>
      <AmountText
        color={Colors.GREY}
        size={FontSizes.SMALL}
        amount={amount}
        showSymbol={false}
      />
    </View>
  </View>
);

export const AccountTransactionsHeader: React.FC<Props> = props => {
  const {account, priceApi} = props;
  const priceInBTC =
    priceApi && priceApi.priceInfo && priceApi.priceInfo.price_btc;

  const balances = getBalancesFromAccount(account);

  const totalBalanceBTC =
    priceApi && priceApi.priceInfo
      ? toNumber(priceInBTC) * toNumber(balances.totalBalance.getSigna())
      : 0;

  const hasLockedAmount = balances.lockedBalance.greater(Amount.Zero());
  const hasCommittedAmount = balances.committedBalance.greater(Amount.Zero());

  return (
    <View>
      <View style={styles.view}>
        <View style={styles.qrCode}>
          <QRCode
            size={100}
            value={account.accountRS}
            backgroundColor={Colors.WHITE}
            color={Colors.BLUE_DARKER}
            quietZone={8}
          />
          <Text
            size={FontSizes.SMALLEST}
            textAlign={TextAlign.CENTER}
            color={Colors.GREY_LIGHT}>
            {account.accountRS}
          </Text>
        </View>
        <View>
          <AmountText amount={balances.totalBalance} size={FontSizes.LARGE} />
          {(hasLockedAmount || hasCommittedAmount) && (
            <SubBalance
              text={i18n.t(core.balances.available)}
              amount={balances.availableBalance}
            />
          )}
          {hasLockedAmount && (
            <SubBalance
              text={i18n.t(core.balances.locked)}
              amount={balances.lockedBalance}
            />
          )}
          {hasCommittedAmount && (
            <SubBalance
              text={i18n.t(core.balances.committed)}
              amount={balances.committedBalance}
            />
          )}
        </View>
        {priceInBTC ? (
          <Text textAlign={TextAlign.CENTER} color={Colors.WHITE} bebasFont>
            {i18n.t(core.currency.BTC.value, {
              value: amountToString(totalBalanceBTC),
            })}
          </Text>
        ) : null}
      </View>
      <AccountActivationView account={account} />
    </View>
  );
};
