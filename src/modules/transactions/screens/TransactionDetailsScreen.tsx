import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {actionIcons} from '../../../assets/icons';
import {HeaderTitle} from '../../../core/components/header/HeaderTitle';
import {i18n} from '../../../core/i18n';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {Screen} from '../../../core/layout/Screen';
import {Colors} from '../../../core/theme/colors';
import {RootStackParamList} from '../../accounts/navigation/mainStack';
import {auth} from '../../accounts/translations';
import {TransactionDetails} from '../components/transactions/TransactionDetails';

type TransactionDetailsRouteProps = RouteProp<
  RootStackParamList,
  'TransactionDetails'
>;

export const TransactionDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<TransactionDetailsRouteProps>();

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Screen style={{backgroundColor: Colors.BLUE}}>
      <FullHeightView withoutPaddings>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              position: 'absolute',
              zIndex: 1,
              left: 10,
              top: 10,
            }}
            onPress={goBack}>
            <Image
              source={actionIcons.chevronLeft}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          <View style={{flex: 1, alignItems: 'center', margin: 10}}>
            <HeaderTitle>
              {i18n.t(auth.transactionDetails.headerTitle)}
            </HeaderTitle>
          </View>
        </View>
        <View>
          <TransactionDetails transaction={route.params.transaction} />
        </View>
      </FullHeightView>
    </Screen>
  );
};
