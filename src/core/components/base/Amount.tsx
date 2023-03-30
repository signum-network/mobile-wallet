import {Amount} from '@signumjs/util';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from './Text';
import {FontSizes} from '../../theme/sizes';
import {Colors} from '../../theme/colors';
import {useSelector} from 'react-redux';
import {selectChainInfo} from '../../../modules/network/store/selectors';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: 0,
    padding: 0,
  },
  amount: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 0,
    padding: 0,
  },
  symbol: {position: 'absolute', top: -10 * 0.3, margin: 0, padding: 0},
});

interface Props {
  amount?: Amount;
  size?: number;
  color?: string;
  style?: any;
  showSymbol?: boolean;
}

export const AmountText: React.FC<Props> = ({
  amount = Amount.Zero(),
  size = FontSizes.MEDIUM,
  color = Colors.WHITE,
  style = {},
  showSymbol = true,
}) => {
  const [integer = '0', fraction = '0'] = amount.getSigna().split('.');
  const chainInfo = useSelector(selectChainInfo);

  let symbol = chainInfo ? chainInfo.symbol : 'SIGNA';
  return (
    <View style={[styles.root, style]}>
      {showSymbol && (
        <View style={styles.symbol}>
          <Text color={color} size={size * 0.3}>
            {symbol}
          </Text>
        </View>
      )}
      <View style={styles.amount}>
        <View>
          <Text color={color} size={size}>{`${integer}.`}</Text>
        </View>
        <View style={{bottom: 4 * 0.6}}>
          <Text color={color} size={size * 0.6}>
            {fraction}
          </Text>
        </View>
      </View>
    </View>
  );
};
