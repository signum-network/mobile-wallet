import {Api, composeApi, ApiSettings} from '@signumjs/core';
import {defaultSettings} from '../../environment';
import {AppSettings, Reducer, UserSettings} from '../../interfaces';
import {createReducers} from '../../utils/store';
import {actionTypes} from './actionTypes';

export interface AppReduxState {
  isAppLoaded: boolean;
  appSettings: AppSettings;
  userSettings: UserSettings;
  chainApi: Api;
  activityIndicator: number;
}

// static app settings
export function getDefaultAppSettings(): AppSettings {
  return {
    passcodeTime: defaultSettings.passcodeTime,
    apiSettings: {
      nodeHost: defaultSettings.nodeHost,
      reliableNodeHosts: defaultSettings.reliableNodeHosts,
    } as ApiSettings,
  };
}

export const getInitialAppState = (): AppReduxState => {
  const appSettings = getDefaultAppSettings();
  const chainApi = composeApi(appSettings.apiSettings);
  return {
    isAppLoaded: false,
    appSettings,
    chainApi,
    userSettings: {
      agreedToTerms: false,
      currentNodeHost: defaultSettings.nodeHost,
    },
    activityIndicator: 0,
  };
};

const appLoaded: Reducer<AppReduxState, undefined> = state => {
  return {
    ...state,
    isAppLoaded: true,
  };
};

const setAppSettings: Reducer<AppReduxState, AppSettings> = (state, action) => {
  return {
    ...state,
    appSettings: {
      ...action.payload,
    },
  };
};

const setUserSettings: Reducer<AppReduxState, UserSettings> = (
  state,
  action,
) => {
  const newState: AppReduxState = {
    ...state,
    userSettings: {
      ...state.userSettings,
      ...action.payload,
    },
  };

  if (
    action.payload.currentNodeHost &&
    action.payload.currentNodeHost !== state.userSettings.currentNodeHost
  ) {
    newState.appSettings.apiSettings.nodeHost = action.payload.currentNodeHost;
    console.log('Updating Chain API', state.appSettings.apiSettings);
    newState.chainApi = composeApi(newState.appSettings.apiSettings);
  }
  return newState;
};

const updateActivity: Reducer<AppReduxState, void> = state => {
  const newState: AppReduxState = {
    ...state,
    activityIndicator: state.activityIndicator + 1,
  };
  return newState;
};

const reducers = {
  [actionTypes.appLoaded]: appLoaded,
  [actionTypes.setAppSettings]: setAppSettings,
  [actionTypes.setUserSettings]: setUserSettings,
  [actionTypes.updateActivity]: updateActivity,
};

export const app = createReducers<AppReduxState>(
  getInitialAppState(),
  reducers,
);
