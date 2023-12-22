import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../../../core/components/base/Button';
import {
  Text,
  TextAlign,
  TextThemes,
} from '../../../../core/components/base/Text';
import {i18n} from '../../../../core/i18n';
import {flexGrowStyle} from '../../../../core/utils/styles';
import {auth} from '../../translations';
import QRCode from 'react-qr-code';
import {Colors} from '../../../../core/theme/colors';
import {generateMasterKeys} from '@signumjs/crypto';
import {useSelector} from 'react-redux';
import {selectChainInfo} from '../../../network/store/selectors';
import {Address} from '@signumjs/core';
import {LogoWatermark} from '../../../../core/components/base/LogoWatermark';

interface Props {
  phrase: string[];
  onFinish: () => void;
}

const styles = StyleSheet.create({
  words: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  qrCode: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const ShowPassphraseStage = ({phrase, onFinish}: Props) => {
  const chainInfo = useSelector(selectChainInfo);

  const addressPrefx = chainInfo ? chainInfo.addressPrefix : 'S';

  const qrCodeValue = phrase.join(' ');

  const account = useMemo(() => {
    const {publicKey} = generateMasterKeys(qrCodeValue);
    return Address.fromPublicKey(publicKey, addressPrefx);
  }, [qrCodeValue, addressPrefx]);

  return (
    <React.Fragment>
      <View style={flexGrowStyle}>
        <Text theme={TextThemes.HEADER}>
          {i18n.t(auth.createAccount.notePassphrase)}
        </Text>
      </View>
      <LogoWatermark invert={true} />
      <View style={styles.words}>
        <Text theme={TextThemes.ACCENT} textAlign={TextAlign.CENTER}>
          {account && account.getReedSolomonAddress()}
        </Text>
      </View>
      <View style={styles.qrCode}>
        <View style={{backgroundColor: Colors.WHITE, padding: 6}}>
          <QRCode
            size={200}
            value={qrCodeValue}
            bgColor={Colors.WHITE}
            fgColor={Colors.BLUE_DARKER}
          />
        </View>
      </View>
      <View style={styles.words}>
        <Text theme={TextThemes.ACCENT} textAlign={TextAlign.CENTER}>
          {qrCodeValue}
        </Text>
      </View>
      <View>
        <Text theme={TextThemes.HINT} textAlign={TextAlign.JUSTIFY}>
          {i18n.t(auth.createAccount.notePassphraseHint)}
        </Text>
        <Text theme={TextThemes.DANGER} textAlign={TextAlign.JUSTIFY}>
          {i18n.t(auth.createAccount.notePassphraseHint2)}
        </Text>
        <Button onPress={onFinish}>{i18n.t(auth.createAccount.notedIt)}</Button>
      </View>
    </React.Fragment>
  );
};
