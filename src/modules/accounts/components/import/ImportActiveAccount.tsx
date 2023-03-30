import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../../../core/components/base/Button';
import {Input} from '../../../../core/components/base/Input';
import {SwitchItem} from '../../../../core/components/base/SwitchItem';
import {i18n} from '../../../../core/i18n';
import {auth} from '../../translations';
import {AccountTypeHint} from './AccountTypeHint';
import {generateMasterKeys} from '@signumjs/crypto';
import {Address} from '@signumjs/core';
import {useSelector} from 'react-redux';
import {selectChainInfo} from '../../../network/store/selectors';
import {Text, TextAlign} from '../../../../core/components/base/Text';
import {BorderRadiusSizes, FontSizes} from '../../../../core/theme/sizes';
import {Colors} from '../../../../core/theme/colors';

interface Props {
  onFinish: (passphrase: string) => void;
}

const styles = StyleSheet.create({
  mainBlock: {
    flexGrow: 1,
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
});

export const ImportActiveAccount: React.FC<Props> = ({onFinish}) => {
  const [passphrase, setPassphrase] = useState('');
  const [address, setAddress] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const chainInfo = useSelector(selectChainInfo);
  const handleChangePassphrase = (phrase: string) => {
    setPassphrase(phrase);
    if (phrase.length) {
      const {publicKey} = generateMasterKeys(phrase);
      setAddress(
        Address.fromPublicKey(
          publicKey,
          chainInfo ? chainInfo.addressPrefix : 'S',
        ).getReedSolomonAddress(),
      );
    } else {
      setAddress('');
    }
  };

  const handleShowPassphrase = (show: boolean) => {
    setShowPassphrase(show);
  };

  const handleFinish = () => {
    onFinish(passphrase);
  };

  return (
    <React.Fragment>
      <View style={styles.mainBlock}>
        <Input
          secure={!showPassphrase}
          hint={i18n.t(auth.models.account.passphrase)}
          value={passphrase}
          onChangeText={handleChangePassphrase}
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
