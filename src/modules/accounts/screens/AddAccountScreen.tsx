import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, ButtonThemes} from '../../../core/components/base/Button';
import {Text, TextThemes} from '../../../core/components/base/Text';
import {i18n} from '../../../core/i18n';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {Screen} from '../../../core/layout/Screen';
import {Colors} from '../../../core/theme/colors';
import {Sizes} from '../../../core/theme/sizes';
import {auth} from '../translations';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/mainStack';
import {HeaderWithBackButton} from '../../../core/layout/HeaderWithBackButton';
import {useNavigation} from '@react-navigation/native';

type AddAccountNavProp = StackNavigationProp<RootStackParamList, 'AddAccount'>;

const styles = StyleSheet.create({
  hintView: {
    paddingTop: Sizes.SMALL,
    marginVertical: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    paddingHorizontal: 8,
  },
});

export const AddAccountScreen = () => {
  const navigation = useNavigation<AddAccountNavProp>();

  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  const handleImportAccount = () => {
    navigation.navigate('ImportAccount', {});
  };

  return (
    <Screen>
      <FullHeightView withoutPaddings style={{backgroundColor: Colors.WHITE}}>
        <HeaderWithBackButton title={i18n.t(auth.addAccount.title)} />
        <View style={styles.center}>
          <View style={styles.hintView}>
            <Text theme={TextThemes.HEADER}>
              {i18n.t(auth.addAccount.hint)}
            </Text>
          </View>
          <View style={styles.buttons}>
            <Button theme={ButtonThemes.ACCENT} onPress={handleCreateAccount}>
              {i18n.t(auth.addAccount.createAccount)}
            </Button>
            <Button theme={ButtonThemes.ACCENT} onPress={handleImportAccount}>
              {i18n.t(auth.addAccount.importAccount)}
            </Button>
          </View>
        </View>
      </FullHeightView>
    </Screen>
  );
};
