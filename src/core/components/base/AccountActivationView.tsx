import {Account} from '@signumjs/core';
import {Alert, StyleSheet, View} from 'react-native';
import {BorderRadiusSizes, FontSizes, Sizes} from '../../theme/sizes';
import {Colors} from '../../theme/colors';
import {useDispatch} from 'react-redux';
import {useState} from 'react';
import {Button} from './Button';
import {i18n} from '../../i18n';
import {core} from '../../translations';
import {activateAccount} from '../../../modules/accounts/store/actions';
import {Text, TextAlign} from './Text';

const styles = StyleSheet.create({
  root: {},
  box: {
    borderStyle: 'solid',
    borderRadius: BorderRadiusSizes.MEDIUM,
    borderColor: Colors.BLUE,
    padding: Sizes.LARGE,
  },
});

interface Props {
  account: Account;
}

export const AccountActivationView = ({account}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleButtonPress = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        activateAccount({
          accountId: account.account,
          // @ts-ignore
          publicKey: account.keys.publicKey,
        }),
      );
      Alert.alert(
        i18n.t(core.components.accountActivationView.activationSuccess),
      );
    } catch (e: any) {
      Alert.alert(
        i18n.t(core.components.accountActivationView.activationFailure),
        e.message,
        [
          {
            text: i18n.t(core.actions.cancel),
            style: 'cancel',
          },
          {
            text: i18n.t(core.actions.retry),
            onPress: handleButtonPress,
          },
        ],
        {cancelable: true},
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (account.publicKey) {
    return null;
  }

  return (
    <View style={styles.root}>
      <View style={styles.box}>
        <Button
          onPress={handleButtonPress}
          disabled={isLoading}
          loading={isLoading}>
          {i18n.t(core.components.accountActivationView.activate)}
        </Button>
        <Text
          textAlign={TextAlign.JUSTIFY}
          size={FontSizes.SMALL}
          color={Colors.WHITE}>
          {i18n.t(core.components.accountActivationView.activationHint)}
        </Text>
      </View>
    </View>
  );
};
