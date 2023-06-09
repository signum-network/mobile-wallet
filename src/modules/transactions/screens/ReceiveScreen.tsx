import React from 'react';
import {ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {HeaderTitle} from '../../../core/components/header/HeaderTitle';
import {i18n} from '../../../core/i18n';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {Screen} from '../../../core/layout/Screen';
import {ReceiveAmountForm} from '../components/receive/ReceiveAmountForm';
import {ReceiveAmountPayload} from '../store/actions';
import {transactions} from '../translations';
import {useNavigation} from '@react-navigation/native';
import {selectAccounts} from '../../accounts/store/selectors';
import {selectSuggestedFees} from '../../network/store/selectors';
import {NoAccount} from '../components/receive/NoAccount';
import {StackNavigationProp} from '@react-navigation/stack';
import {ReceiveStackParamList} from '../../accounts/navigation/mainStack';

type ReceiveScreenNavProp = StackNavigationProp<
  ReceiveStackParamList,
  'Receive'
>;

export const ReceiveScreen = () => {
  const navigation = useNavigation<ReceiveScreenNavProp>();
  const accounts = useSelector(selectAccounts);
  const suggestedFees = useSelector(selectSuggestedFees);

  const handleSubmit = (form: ReceiveAmountPayload) => {
    navigation.navigate('ViewQRCode', {form});
  };

  return (
    <Screen>
      <FullHeightView>
        <HeaderTitle>{i18n.t(transactions.screens.receive.title)}</HeaderTitle>
        <ScrollView>
          {accounts.length > 0 ? (
            <ReceiveAmountForm
              accounts={accounts}
              onSubmit={handleSubmit}
              suggestedFees={suggestedFees}
            />
          ) : (
            <NoAccount />
          )}
        </ScrollView>
      </FullHeightView>
    </Screen>
  );
};
