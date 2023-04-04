import React from 'react';

import {Alert, StyleSheet, TouchableOpacity, View, Image} from 'react-native';

import {i18n} from '../../../core/i18n';
import {Colors} from '../../../core/theme/colors';
import {Screen} from '../../../core/layout/Screen';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {actionIcons} from '../../../assets/icons';
import {HeaderTitle} from '../../../core/components/header/HeaderTitle';
import {
  getDeeplinkInfo,
  SupportedDeeplinkActions,
} from '../../../core/utils/deeplink';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {transactions} from '../translations';
import {SendStackParamList} from '../../accounts/navigation/mainStack';
import {QrCodeScanner} from '../../../core/components/base/QrCodeScanner';
import {DeeplinkParts} from '@signumjs/util';
import {Address} from '@signumjs/core';

type ScanQRCodeScreenNavProp = StackNavigationProp<
  SendStackParamList,
  'ScanDeeplink'
>;

const styles = StyleSheet.create({
  topView: {
    backgroundColor: Colors.BLUE_DARKER,
    flexDirection: 'row',
  },
  backButton: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    left: 10,
    top: 10,
  },
  title: {flex: 1, alignItems: 'center', margin: 10},
  buttonTouchable: {
    padding: 16,
  },
  camera: {
    height: '100%',
  },
});

// accepts account info also...for better ux, but faking deeplink then
function tryParseAccountAddress(scanResult: string): DeeplinkParts | null {
  try {
    const address = Address.create(scanResult);
    // @ts-ignore
    return {
      action: SupportedDeeplinkActions.Pay,
      decodedPayload: {
        recipient: address.getNumericId(),
      },
    };
  } catch (e: any) {
    console.log('tryParseAccountAddress', e);
  }
  return null;
}

export const ScanDeeplinkQRCodeScreen = () => {
  const navigation = useNavigation<ScanQRCodeScreenNavProp>();

  const handleOnScanned = (scanResult: string) => {
    try {
      let info = tryParseAccountAddress(scanResult);
      if (!info) {
        info = getDeeplinkInfo(scanResult);
      }
      const {action, decodedPayload} = info;
      if (action !== SupportedDeeplinkActions.Pay) {
        return Alert.alert(`Unsupported Deeplink Action: ${action}`);
      }
      // @ts-ignore
      navigation.navigate('Send', {payload: decodedPayload});
    } catch (e) {
      return Alert.alert('Unknown QR Code');
    }
  };

  return (
    <Screen>
      <FullHeightView withoutPaddings>
        <View style={styles.topView}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image
              source={actionIcons.chevronLeft}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          <View style={styles.title}>
            <HeaderTitle>{i18n.t(transactions.screens.scan.title)}</HeaderTitle>
          </View>
        </View>
        <QrCodeScanner onScanned={handleOnScanned} />
      </FullHeightView>
    </Screen>
  );
};
