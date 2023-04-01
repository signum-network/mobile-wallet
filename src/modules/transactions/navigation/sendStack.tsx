import {
  createStackNavigator,
} from '@react-navigation/stack';
import * as React from 'react';
import {defaultStackOptions} from '../../../core/navigation/defaultStackOptions';
import {routes} from '../../../core/navigation/routes';
import {ScanDeeplinkQRCodeScreen} from '../screens/ScanDeeplinkQRCodeScreen';
import {SendScreen} from '../screens/SendScreen';

const Stack = createStackNavigator();

export const sendStack = () => (
  <Stack.Navigator
    initialRouteName={routes.send}
    screenOptions={defaultStackOptions}>
    <Stack.Screen name={routes.send} component={SendScreen} />
    <Stack.Screen name={routes.scan} component={ScanDeeplinkQRCodeScreen} />
  </Stack.Navigator>
);
