import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button} from '../../../../core/components/base/Button';
import {i18n} from '../../../../core/i18n';
import {auth} from '../../translations';
import {AccountTypeHint} from './AccountTypeHint';
import {maskSignumAddress} from '../../../../core/utils/maskSignumAddress';
import {useSelector} from 'react-redux';
import {selectChainInfo} from '../../../network/store/selectors';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/mainStack';
import {Address} from '@signumjs/core';
import {transactionIcons} from '../../../../assets/icons';
import {Colors} from '../../../../core/theme/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {BInput} from '../../../../core/components/base/BInput';

const styles = StyleSheet.create({
  cameraIcon: {
    marginTop: 3,
    marginRight: 2,
    width: 20,
    height: 20,
    backgroundColor: Colors.TRANSPARENT,
  },
});

type ScanNavigationProps = StackNavigationProp<
  RootStackParamList,
  'ScanAccount'
>;
interface Props {
  onFinish: (address: string) => void;
  address?: string;
}

export const ImportOfflineAccount = ({onFinish, address}: Props) => {
  const navigation = useNavigation<ScanNavigationProps>();
  const chainInfo = useSelector(selectChainInfo);

  const addressPrefix = chainInfo ? chainInfo.addressPrefix : 'S';

  const [rsAddress, setRsAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);

  useEffect(() => {
    if (!address) {
      setRsAddress(`${addressPrefix}-`);
      return;
    }

    try {
      const addr = Address.create(address, addressPrefix);
      setRsAddress(addr.getReedSolomonAddress(true));
      setIsValidAddress(true);
    } catch (e: any) {
      setRsAddress(`${addressPrefix}-`);
      setIsValidAddress(false);
      console.warn(
        'Invalid parameter - Expected accountId, accountAddress, or publickey - got:',
        address,
      );
    }
  }, [address, addressPrefix]);

  const handleChangeAddress = (addr: string) => {
    try {
      const masked = maskSignumAddress(addr);
      setRsAddress(masked);
      if (/-\w{4}-\w{4}-\w{4}-\w{5}$/.test(masked)) {
        Address.create(masked); // if not throws all fine
        setIsValidAddress(true);
      }
    } catch (e: any) {
      console.warn('Invalid RS Address');
      setIsValidAddress(false);
    }
  };

  const handleFinish = () => {
    onFinish(rsAddress);
  };

  const handleCameraIconPress = () => {
    navigation.navigate('ScanAccount', {scanType: 'address'});
  };

  const InputRightIcons = (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={handleCameraIconPress}>
        <Image source={transactionIcons.camera} style={styles.cameraIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={{paddingTop: '10%'}}>
        <BInput
          title={i18n.t(auth.models.account.address)}
          value={rsAddress}
          autoCapitalize={'characters'}
          onChange={handleChangeAddress}
          rightIcons={InputRightIcons}
          theme="light"
        />
        <AccountTypeHint>
          {i18n.t(auth.importAccount.passiveAccountHint)}
        </AccountTypeHint>
      </View>
      <View style={{paddingTop: '10%'}}>
        <Button
          fullWidth={true}
          onPress={handleFinish}
          disabled={!isValidAddress}>
          {i18n.t(auth.importAccount.import)}
        </Button>
      </View>
    </>
  );
};
