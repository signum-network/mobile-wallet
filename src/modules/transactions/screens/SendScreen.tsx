import {
  useNavigation,
  useRoute,
  useFocusEffect,
  CompositeNavigationProp,
} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Account, SuggestedFees} from '@signumjs/core';
import {Text, TextThemes} from '../../../core/components/base/Text';
import {HeaderTitle} from '../../../core/components/header/HeaderTitle';
import {i18n} from '../../../core/i18n';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {Screen} from '../../../core/layout/Screen';
import {ApplicationState} from '../../../core/store/initialState';
import {
  getAccount,
  getAlias,
  getUnstoppableAddress,
} from '../../accounts/store/actions';
import {SendForm, SendFormState} from '../components/send/SendForm';
import {
  sendMoney as sendMoneyAction,
  SendAmountPayload,
} from '../store/actions';
import {transactions} from '../translations';
import {NoActiveAccount} from '../components/send/NoActiveAccount';
import {stableParsePlanckAmount} from '../../../core/utils/amount';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  BottomTabNavigatorParamList,
  SendStackParamList,
} from '../../accounts/navigation/mainStack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {selectChainInfo} from '../../network/store/selectors';

type SendScreenNavProp = CompositeNavigationProp<
  StackNavigationProp<SendStackParamList, 'Send'>,
  BottomTabNavigationProp<BottomTabNavigatorParamList, 'SendStack'>
>;

interface SendDeeplinkParameters {
  recipient?: string;
  amountPlanck?: string;
  feePlanck?: string;
  encrypt?: boolean;
  immutable?: boolean;
  messageIsText?: boolean;
  message?: string;
}

export const SendScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<SendScreenNavProp>();
  const dispatch = useDispatch();
  const [deeplinkData, setDeeplinkData] = useState<SendFormState>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const chainInfo = useSelector(selectChainInfo);
  const addressPrefix = chainInfo ? chainInfo.addressPrefix : 'S';
  const accounts = useSelector<ApplicationState, Account[]>(
    state => state.auth.accounts || [],
  );
  const suggestedFees = useSelector<ApplicationState, SuggestedFees | null>(
    state => state.network.suggestedFees,
  );
  const [, setShouldUpdate] = useState(true);

  useEffect(() => {
    if (!route.params) {
      return;
    }

    // already filled - to avoid resetting on re-rendering
    // if(deeplinkData !== null){
    //   return;
    // }

    console.log('SendScreen - Got Deeplink Params', route.params);
    // @ts-ignore
    const payload = route.params.payload as SendDeeplinkParameters;
    // @ts-ignore
    setDeeplinkData({
      sender: null,
      address: payload.recipient || undefined,
      fee: payload.feePlanck
        ? stableParsePlanckAmount(payload.feePlanck).getSigna()
        : undefined,
      amount: payload.amountPlanck
        ? stableParsePlanckAmount(payload.amountPlanck).getSigna()
        : undefined,
      message: payload.message,
      messageIsText:
        payload.messageIsText == null ? true : payload.messageIsText,
      encrypt: payload.encrypt === true,
      immutable: payload.immutable === true,
    });
  }, [route]);

  useFocusEffect(() => {
    // force update on enter :rolleyes
    setShouldUpdate(true);
    return () => {
      setShouldUpdate(false);
    };
  });

  const handleSubmit = async (form: SendAmountPayload) => {
    try {
      setIsSubmitting(true);
      console.log('handleSubmit', form);
      await dispatch(sendMoneyAction(form));
      setDeeplinkData(undefined);
      navigation.navigate('Home', {screen: 'Accounts'});
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDeeplinkData(undefined);
  };

  const handleGetAccount = (id: string) => {
    return dispatch(getAccount(id));
  };

  const handleGetUnstoppableAddress = (id: string) => {
    return dispatch(getUnstoppableAddress(id));
  };

  const handleGetAlias = (id: string) => {
    return dispatch(getAlias(id));
  };

  const handleCameraIconPress = () => {
    navigation.navigate('ScanDeeplink');
  };

  // @ts-ignore
  const hasActiveAccounts = accounts.some(({type}) => type !== 'offline');

  return (
    <Screen>
      <FullHeightView>
        <View>
          <HeaderTitle>{i18n.t(transactions.screens.send.title)}</HeaderTitle>
          {hasActiveAccounts ? (
            <SendForm
              accounts={accounts}
              loading={isSubmitting}
              onReset={handleReset}
              onSubmit={handleSubmit}
              onGetAccount={handleGetAccount}
              onGetAlias={handleGetAlias}
              onGetUnstoppableAddress={handleGetUnstoppableAddress}
              onCameraIconPress={handleCameraIconPress}
              deepLinkProps={deeplinkData}
              suggestedFees={suggestedFees}
              addressPrefix={addressPrefix}
            />
          ) : (
            <NoActiveAccount />
          )}
          {error && <Text theme={TextThemes.DANGER}>{error}</Text>}
        </View>
      </FullHeightView>
    </Screen>
  );
};
