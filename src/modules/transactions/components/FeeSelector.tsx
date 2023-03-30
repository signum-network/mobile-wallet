import {useSelector} from 'react-redux';
import {selectSuggestedFees} from '../../network/store/selectors';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {BorderRadiusSizes, FontSizes} from '../../../core/theme/sizes';
import {Colors} from '../../../core/theme/colors';
import React, {useCallback, useEffect, useState} from 'react';
import {i18n} from '../../../core/i18n';
import {Text, TextAlign} from '../../../core/components/base/Text';
import {transactions} from '../translations';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeItem: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    height: 24,
    width: 72,
    borderRadius: BorderRadiusSizes.SMALL,
    backgroundColor: Colors.GREY_DARK,
  },
  feeItemSelected: {
    backgroundColor: Colors.GREEN,
  },
});

interface Props {
  payloadLength: number;
  transactionType?: number;
  transactionSubtype?: number;
  onFeeSelected: (feePlanck: number) => void;
}

// TODO: later consider other transaction types
function calculateFee(
  minimumFee: number,
  baseFee: number,
  payload: number,
): number {
  const MinimumTransactionPayloadSize = 184;
  const feePlanck =
    Math.ceil((payload + 1) / MinimumTransactionPayloadSize) * baseFee;
  return Math.max(minimumFee, feePlanck);
}

export const FeeSelector = ({onFeeSelected, payloadLength}: Props) => {
  const fees = useSelector(selectSuggestedFees);
  const [selected, setSelected] = useState('standard');

  const getFee = useCallback(() => {
    if (!fees) {
      return;
    }
    // @ts-ignore
    const amount = fees[selected];
    if (!amount) {
      return;
    }
    return calculateFee(fees.minimum, amount, payloadLength);
  }, [selected, fees, payloadLength]);

  useEffect(() => {
    const feePlanck = getFee();
    if (feePlanck) {
      onFeeSelected(feePlanck);
    }
  }, [getFee, onFeeSelected, payloadLength]);

  const handleSelected = (type: string) => () => {
    setSelected(type);
  };

  if (!fees) {
    return null;
  }

  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={handleSelected('cheap')}>
        <View
          style={
            selected === 'cheap'
              ? [styles.feeItem, styles.feeItemSelected]
              : styles.feeItem
          }>
          <Text
            textAlign={TextAlign.CENTER}
            size={FontSizes.SMALLER}
            color={selected === 'cheap' ? Colors.GREY_DARK : Colors.WHITE}>
            {i18n.t(transactions.screens.fee.cheap)}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSelected('standard')}>
        <View
          style={
            selected === 'standard'
              ? [styles.feeItem, styles.feeItemSelected]
              : styles.feeItem
          }>
          <Text
            textAlign={TextAlign.CENTER}
            size={FontSizes.SMALLER}
            color={selected === 'standard' ? Colors.GREY_DARK : Colors.WHITE}>
            {i18n.t(transactions.screens.fee.standard)}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSelected('priority')}>
        <View
          style={
            selected === 'priority'
              ? [styles.feeItem, styles.feeItemSelected]
              : styles.feeItem
          }>
          <Text
            textAlign={TextAlign.CENTER}
            size={FontSizes.SMALLER}
            color={selected === 'priority' ? Colors.GREY_DARK : Colors.WHITE}>
            {i18n.t(transactions.screens.fee.priority)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
