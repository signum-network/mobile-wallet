import React, {useEffect, useState} from 'react';

import {Alert, StyleSheet, TouchableOpacity, View, Image} from 'react-native';

import {i18n} from '../../../core/i18n';
import {Colors} from '../../../core/theme/colors';
import {auth, transactions} from '../translations';
import {Screen} from '../../../core/layout/Screen';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {actionIcons} from '../../../assets/icons';
import {HeaderTitle} from '../../../core/components/header/HeaderTitle';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/mainStack';
import {Address} from '@signumjs/core';
import {QrCodeScanner} from '../../../core/components/base/QrCodeScanner';

type ScanAccountNavProp = StackNavigationProp<
  RootStackParamList,
  'ScanAccount'
>;

type RouteProps = RouteProp<RootStackParamList, 'ScanAccount'>;

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

export const ScanAccountQRCodeScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<ScanAccountNavProp>();
  const scanType = route.params.scanType;
  const title =
    scanType === 'address'
      ? i18n.t(auth.scanAccount.scanAddress)
      : i18n.t(auth.scanAccount.scanRecoveryPhrase);
  const processAddressScanResult = (scannedValue: string) => {
    try {
      const address = Address.create(scannedValue).getNumericId();
      navigation.navigate('ImportAccount', {address});
    } catch (e: any) {
      return Alert.alert('Invalid Address QR Code');
    }
  };

  const processSeedScanResult = (seed: string) => {
    navigation.navigate('ImportAccount', {seed});
  };

  const handleScannedCode = (scanResult: string) => {
    if (scanType === 'address') {
      processAddressScanResult(scanResult);
    } else if (scanType === 'seed') {
      processSeedScanResult(scanResult);
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
            <HeaderTitle>{title}</HeaderTitle>
          </View>
        </View>
        <View>
          <QrCodeScanner onScanned={handleScannedCode} />
        </View>
      </FullHeightView>
    </Screen>
  );
};
