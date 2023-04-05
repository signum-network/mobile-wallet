import {Transaction} from '@signumjs/core';
import React from 'react';
import {
  View,
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {Text, TextAlign} from '../../../../core/components/base/Text';
import {Colors} from '../../../../core/theme/colors';
import {LabeledTextField} from '../../../../core/components/base/LabeledTextField';
import {mapTxData, TxKeyValue} from './mapTxData';
import {mountTxTypeString} from '../../../../core/utils/mountTxTypeString';
import {FontSizes, Sizes} from '../../../../core/theme/sizes';
import {i18n} from '../../../../core/i18n';
import {auth} from '../../../accounts/translations';
import Clipboard from '@react-native-clipboard/clipboard';
import {actionIcons} from '../../../../assets/icons';
import {TransactionMessageView} from './TransactionMessageView';

interface Props {
  transaction: Transaction;
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 8,
  },
  header: {},
  transactionId: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  data: {
    height: '84%',
    backgroundColor: Colors.TRANSPARENT,
    color: Colors.WHITE,
  },
  copyIcon: {
    marginLeft: 2,
    width: 16,
    height: 16,
  },
  message: {
    marginTop: Sizes.MEDIUM,
    padding: Sizes.MEDIUM,
    borderRadius: 4,
    borderColor: Colors.WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
  },
});

export const TransactionDetails: React.FC<Props> = ({transaction}) => {
  const data = mapTxData(transaction);
  const touchedItem = (v: string = '') => {
    const value = v.trim();
    if (!value) {
      return;
    }

    Clipboard.setString(value);
    Alert.alert(i18n.t(auth.transactionDetails.copiedSuccessfully, {value}));
  };
  const TouchableLineItem: ListRenderItem<TxKeyValue> = ({item}) => (
    <TouchableOpacity onPress={() => touchedItem(item.value)}>
      <LabeledTextField
        label={item.key}
        text={item.value}
        color={Colors.WHITE}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.transactionId}
          onPress={() => touchedItem(transaction.transaction)}>
          <Text
            color={Colors.WHITE}
            textAlign={
              TextAlign.CENTER
            }>{`Id: ${transaction.transaction}`}</Text>
          <Image style={styles.copyIcon} source={actionIcons.copy} />
        </TouchableOpacity>
        <Text
          size={FontSizes.SMALL}
          color={Colors.GREY}
          textAlign={TextAlign.CENTER}>
          {mountTxTypeString(transaction.type, transaction.subtype)}
        </Text>
      </View>
      <TransactionMessageView transaction={transaction} />
      <View style={styles.data}>
        <FlatList data={data} renderItem={TouchableLineItem} />
      </View>
    </View>
  );
};
