import {
  getRecipientsAmount,
  isMultiOutSameTransaction,
  isMultiOutTransaction,
  Transaction,
} from '@signumjs/core';
import {Amount, ChainTime} from '@signumjs/util';
import React, {useMemo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {transactionIcons} from '../../../../assets/icons';
import {Text, TextAlign} from '../../../../core/components/base/Text';
import {Colors} from '../../../../core/theme/colors';
import {
  defaultSideOffset,
  FontSizes,
  Sizes,
} from '../../../../core/theme/sizes';
import {trimAddressPrefix} from '../../../../core/utils/account';
import {AmountText} from '../../../../core/components/base/Amount';
import {mountTxTypeString} from '../../../../core/utils/mountTxTypeString';

interface Props {
  transaction: Transaction;
  account: string;
  onPress: (transaction: Transaction) => void;
}

const styles: any = {
  view: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    paddingVertical: Sizes.SMALL,
  },
  iconView: {
    width: 40,
    marginLeft: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    marginRight: 0,
    paddingRight: defaultSideOffset,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  hintView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '100%',
  },
  icon: {
    width: 24,
    height: 24,
  },
  incomingAmount: {
    marginRight: Sizes.MEDIUM,
    flexDirection: 'row',
  },
  outcomingAmount: {
    marginRight: Sizes.MEDIUM,
    flexDirection: 'row',
  },
  account: {
    flexWrap: 'wrap',
    right: 0,
  },
};

function isMultiOutPayment(transaction: Transaction): boolean {
  return (
    isMultiOutSameTransaction(transaction) || isMultiOutTransaction(transaction)
  );
}

export const TransactionListItem = ({account, transaction, onPress}: Props) => {
  const isOwnAccount = (accountId: string | undefined): boolean =>
    !!(accountId && accountId === account);
  const isAmountNegative = isOwnAccount(transaction.sender);

  const amount = useMemo(() => {
    let result: Amount;
    if (isAmountNegative) {
      result = Amount.fromPlanck(transaction.amountNQT || '0').multiply(-1);
    } else {
      result = isMultiOutPayment(transaction)
        ? getRecipientsAmount(account, transaction)
        : Amount.fromPlanck(transaction.amountNQT || '0');
    }
    return result;
  }, [account, isAmountNegative, transaction]);

  const txTypeString = useMemo(() => {
    return mountTxTypeString(transaction.type, transaction.subtype);
  }, [transaction.type, transaction.subtype]);

  const handlePress = () => {
    onPress(transaction);
  };

  const {
    transaction: transactionId = '',
    timestamp = 0,
    recipientRS = '',
    senderRS = '',
    confirmations,
  } = transaction;
  const isPending = confirmations === undefined;
  let accountRS = trimAddressPrefix(isAmountNegative ? recipientRS : senderRS);

  if (isOwnAccount(transaction.sender) && isMultiOutPayment(transaction)) {
    accountRS = 'Multi-out Payment';
  }

  const date = ChainTime.fromChainTimestamp(timestamp)
    .getDate()
    .toLocaleString();
  return (
    <TouchableOpacity
      style={[styles.view, {opacity: isPending ? 0.75 : 1}]}
      onPress={handlePress}>
      <View style={styles.iconView}>
        <Image
          source={isPending ? transactionIcons.waiting : transactionIcons.done}
          style={styles.icon}
        />
      </View>
      <View style={styles.mainView}>
        <View style={styles.hintView}>
          <View>
            <Text color={Colors.WHITE} size={FontSizes.SMALLER}>
              {transactionId}
            </Text>
            <Text color={Colors.GREY} size={FontSizes.SMALLEST}>
              {txTypeString}
            </Text>
          </View>
          <View>
            <Text
              color={Colors.WHITE}
              size={FontSizes.SMALLER}
              textAlign={TextAlign.RIGHT}>
              {date}
            </Text>
          </View>
        </View>
        <View style={styles.dataView}>
          <View style={styles.view}>
            <AmountText
              color={isAmountNegative ? Colors.RED : Colors.GREEN}
              size={FontSizes.MEDIUM}
              amount={amount}
            />
          </View>
          <View style={styles.account}>
            <Text color={Colors.WHITE} bebasFont size={FontSizes.SMALL}>
              {accountRS}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
