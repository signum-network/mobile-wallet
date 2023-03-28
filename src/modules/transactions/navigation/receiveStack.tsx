import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {defaultStackOptions} from '../../../core/navigation/defaultStackOptions';
import {routes} from '../../../core/navigation/routes';
import {ReceiveScreen} from '../screens/ReceiveScreen';
import {ViewQRCodeScreen} from '../screens/ViewQRCodeScreen';

const Stack = createStackNavigator();

export const receiveStack = () => (
  <Stack.Navigator
    initialRouteName={routes.receive}
    screenOptions={defaultStackOptions}>
    <Stack.Screen name={routes.receive} component={ReceiveScreen} />
    <Stack.Screen name={routes.viewQRCode} component={ViewQRCodeScreen} />
  </Stack.Navigator>
);
