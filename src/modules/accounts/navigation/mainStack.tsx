import {NavigatorScreenParams} from '@react-navigation/native';
import {Transaction} from '@signumjs/core';
import {DeeplinkParts} from '@signumjs/util';
import {AppReduxState} from '../../../core/store/app/reducer';
import {AuthReduxState} from '../store/reducer';

export type RootStackParamList = {
  Accounts: undefined;
  AddAccount: undefined;
  CreateAccount: undefined;
  ImportAccount: {
    address?: string;
    seed?: string;
  };
  Settings: undefined;
  TransactionDetails: {
    transaction: Transaction;
  };
  AccountDetails: {
    account?: string;
  };
  ScanAccount: {
    scanType: 'address' | 'seed';
  };
};

export type SendStackParamList = {
  Send: {
    accountRS?: string;
    payload?: DeeplinkParts;
  };
  ScanDeeplink: undefined;
};

export type ReceiveStackParamList = {
  Receive: {
    accountRS?: string;
  };
  ViewQRCode: {
    form?: any;
  };
};

export type BottomTabNavigatorParamList = {
  Home: NavigatorScreenParams<RootStackParamList>;
  SendStack: NavigatorScreenParams<SendStackParamList>;
  ReceiveStack: NavigatorScreenParams<ReceiveStackParamList>;
  Settings: {
    auth: AuthReduxState;
    app: AppReduxState;
  };
};
