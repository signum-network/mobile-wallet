import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {SwitchItem} from '../../../core/components/base/SwitchItem';
import {i18n} from '../../../core/i18n';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {Screen} from '../../../core/layout/Screen';
import {Colors} from '../../../core/theme/colors';
import {Sizes} from '../../../core/theme/sizes';
import {ImportActiveAccount} from '../components/import/ImportActiveAccount';
import {ImportOfflineAccount} from '../components/import/ImportOfflineAccount';
import {
  addAccount,
  createActiveAccount,
  createOfflineAccount,
  hydrateAccount,
} from '../store/actions';
import {auth} from '../translations';
import {HeaderWithBackButton} from '../../../core/layout/HeaderWithBackButton';
import {RootStackParamList} from '../navigation/mainStack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Account} from '@signumjs/core';

type ImportAccountRouteProps = RouteProp<RootStackParamList, 'ImportAccount'>;
type ImportAccountNavProp = StackNavigationProp<
  RootStackParamList,
  'ImportAccount'
>;

const styles = StyleSheet.create({
  switchView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: Sizes.LARGE,
    paddingTop: '25%',
  },
  centeredText: {
    marginTop: '50%',
  },
  background: {
    backgroundColor: Colors.WHITE,
  },
});

export const ImportAccountScreen = () => {
  const [isActive, setIsActive] = useState(false);
  const {params} = useRoute<ImportAccountRouteProps>();
  const dispatch = useDispatch();
  const navigation = useNavigation<ImportAccountNavProp>();
  const {address, seed} = params;

  const importAccount = async (
    passphraseOrAddress: string,
    type: 'active' | 'offline',
  ) => {
    try {
      let account: Account;
      if (type === 'active') {
        account = dispatch(createActiveAccount(passphraseOrAddress));
      } else if (type === 'offline') {
        account = dispatch(createOfflineAccount(passphraseOrAddress));
      }
      await dispatch(addAccount(account!));
      dispatch(hydrateAccount({account: account!})).then(); // async
      navigation.navigate('Accounts');
    } catch (error) {
      Alert.alert((error as any).message);
    }
  };

  const handleImportActiveAccount = async (passphrase: string) =>
    importAccount(passphrase, 'active');
  const handleImportOfflineAccount = async (addr: string) =>
    importAccount(addr, 'offline');

  return (
    <Screen style={styles.background}>
      <FullHeightView withoutPaddings style={styles.background}>
        <HeaderWithBackButton title={i18n.t(auth.addAccount.title)} />
        <ScrollView>
          <View style={styles.switchView}>
            <View>
              <SwitchItem
                onChange={setIsActive}
                text={i18n.t(auth.importAccount.activeAccount)}
                value={isActive}
              />
            </View>
            <View>
              {isActive ? (
                <ImportActiveAccount
                  onFinish={handleImportActiveAccount}
                  seed={seed}
                />
              ) : (
                <ImportOfflineAccount
                  onFinish={handleImportOfflineAccount}
                  address={address}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </FullHeightView>
    </Screen>
  );
};
