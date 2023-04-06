import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button} from '../../../../core/components/base/Button';
import {SwitchItem} from '../../../../core/components/base/SwitchItem';
import {i18n} from '../../../../core/i18n';
import {auth} from '../../translations';
import {AccountTypeHint} from './AccountTypeHint';
import {generateMasterKeys} from '@signumjs/crypto';
import {Address} from '@signumjs/core';
import {useDispatch, useSelector} from 'react-redux';
import {selectChainInfo} from '../../../network/store/selectors';
import {Text, TextAlign} from '../../../../core/components/base/Text';
import {BorderRadiusSizes, FontSizes} from '../../../../core/theme/sizes';
import {Colors} from '../../../../core/theme/colors';
import {BInput} from '../../../../core/components/base/BInput';
import {transactionIcons} from '../../../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/mainStack';
import {updateActivity} from '../../../../core/store/app/actions';

interface Props {
  onFinish: (passphrase: string) => void;
  seed?: string;
}

type ScanNavigationProps = StackNavigationProp<
  RootStackParamList,
  'ScanAccount'
>;

const styles = StyleSheet.create({
  mainBlock: {
    marginTop: '10%',
  },
  passphraseSwitch: {
    paddingTop: 10,
  },
  addressPreview: {
    padding: 10,
    marginTop: '10%',
    textAlign: 'center',
    borderRadius: BorderRadiusSizes.MEDIUM,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  button: {
    paddingTop: '10%',
  },
  cameraIcon: {
    marginTop: 3,
    marginRight: 2,
    width: 20,
    height: 20,
    backgroundColor: Colors.TRANSPARENT,
  },
});

export const ImportActiveAccount: React.FC<Props> = ({onFinish, seed = ''}) => {
  const navigation = useNavigation<ScanNavigationProps>();
  const [passphrase, setPassphrase] = useState('');
  const [address, setAddress] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const chainInfo = useSelector(selectChainInfo);
  const dispatch = useDispatch();
  const handleChangePassphrase = (phrase: string) => {
    setPassphrase(phrase);
    dispatch(updateActivity());
  };

  useEffect(() => {
    if (seed) {
      // hmm, thought it could be done in useState() already, but doesn'' work as expected
      setPassphrase(seed);
    }
  }, [seed]);

  useEffect(() => {
    if (passphrase.length) {
      const {publicKey} = generateMasterKeys(passphrase);
      setAddress(
        Address.fromPublicKey(
          publicKey,
          chainInfo ? chainInfo.addressPrefix : 'S',
        ).getReedSolomonAddress(),
      );
    } else {
      setAddress('');
    }
  }, [chainInfo, passphrase]);

  const handleShowPassphrase = (show: boolean) => {
    setShowPassphrase(show);
  };

  const handleFinish = () => {
    onFinish(passphrase);
  };

  const handleCameraIconPress = () => {
    navigation.navigate('ScanAccount', {scanType: 'seed'});
  };

  const InputRightIcons = (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={handleCameraIconPress}>
        <Image source={transactionIcons.camera} style={styles.cameraIcon} />
      </TouchableOpacity>
    </View>
  );
  return (
    <React.Fragment>
      <View style={styles.mainBlock}>
        <BInput
          title={i18n.t(auth.models.account.passphrase)}
          value={passphrase}
          onChange={handleChangePassphrase}
          rightIcons={InputRightIcons}
          secret={!showPassphrase}
          theme="light"
        />
        <AccountTypeHint>
          {i18n.t(auth.importAccount.activeAccountHint)}
        </AccountTypeHint>
        <View style={styles.passphraseSwitch}>
          <SwitchItem
            onChange={handleShowPassphrase}
            text={i18n.t(auth.importAccount.showPassphrase)}
            value={showPassphrase}
          />
        </View>
      </View>
      <View style={styles.addressPreview}>
        {address ? (
          <Text size={FontSizes.MEDIUM} textAlign={TextAlign.CENTER}>
            {address}
          </Text>
        ) : (
          <Text size={FontSizes.MEDIUM} color={Colors.GREY_T}>
            {i18n.t(auth.importAccount.accountPreviewLabel)}
          </Text>
        )}
      </View>
      <View style={styles.button}>
        <Button
          fullWidth={true}
          onPress={handleFinish}
          disabled={passphrase.length === 0}>
          {i18n.t(auth.importAccount.import)}
        </Button>
      </View>
    </React.Fragment>
  );
};
