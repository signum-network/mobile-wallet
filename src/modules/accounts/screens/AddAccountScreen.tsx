import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, ButtonThemes} from '../../../core/components/base/Button';
import {Text, TextAlign, TextThemes} from '../../../core/components/base/Text';
import {i18n} from '../../../core/i18n';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {Screen} from '../../../core/layout/Screen';
import {Colors} from '../../../core/theme/colors';
import {FontSizes, Sizes} from '../../../core/theme/sizes';
import {auth} from '../translations';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/mainStack';
import {HeaderWithBackButton} from '../../../core/layout/HeaderWithBackButton';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectAccounts} from '../store/selectors';

type AddAccountNavProp = StackNavigationProp<RootStackParamList, 'AddAccount'>;

const styles = StyleSheet.create({
  hintView: {
    paddingTop: Sizes.SMALL,
    paddingHorizontal: Sizes.LARGER,
    marginVertical: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    paddingHorizontal: 8,
  },
  background: {
    backgroundColor: Colors.WHITE,
  },
});

export const AddAccountScreen = () => {
  const navigation = useNavigation<AddAccountNavProp>();
  const accounts = useSelector(selectAccounts);
  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  const handleImportAccount = () => {
    navigation.navigate('ImportAccount', {});
  };
  const canAddMoreAccounts = accounts.length < 10;

  return (
    <Screen style={styles.background}>
      <FullHeightView withoutPaddings style={styles.background}>
        <HeaderWithBackButton title={i18n.t(auth.addAccount.title)} />
        <View style={styles.center}>
          {canAddMoreAccounts ? (
            <>
              <View style={styles.hintView}>
                <Text theme={TextThemes.HEADER}>
                  {i18n.t(auth.addAccount.hint)}
                </Text>
              </View>
              <View style={styles.buttons}>
                <Button
                  theme={ButtonThemes.ACCENT}
                  onPress={handleCreateAccount}>
                  {i18n.t(auth.addAccount.createAccount)}
                </Button>
                <Button
                  theme={ButtonThemes.ACCENT}
                  onPress={handleImportAccount}>
                  {i18n.t(auth.addAccount.importAccount)}
                </Button>
              </View>
            </>
          ) : (
            <View style={styles.hintView}>
              <Text size={FontSizes.LARGE} textAlign={TextAlign.CENTER}>
                {i18n.t(auth.addAccount.limitReached)}
              </Text>
              <Text
                size={FontSizes.SMALLER}
                textAlign={TextAlign.CENTER}
                color={Colors.GREY_DARK}>
                {i18n.t(auth.addAccount.limitReachedHint)}
              </Text>
            </View>
          )}
        </View>
      </FullHeightView>
    </Screen>
  );
};
