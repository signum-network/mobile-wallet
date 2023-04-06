import {Api} from '@signumjs/core';
import {ApplicationState} from '../initialState';

export const selectCurrentNode = (state: ApplicationState): string =>
  state.app.userSettings.currentNodeHost ||
  state.app.appSettings.apiSettings.nodeHost;

export const selectAgreedToTerms = (state: ApplicationState): boolean =>
  state.app.userSettings.agreedToTerms || false;
export const selectChainApi = (state: ApplicationState): Api => {
  return state.app.chainApi;
};

export const selectActivity = (state: ApplicationState): number => {
  return state.app.activityIndicator;
};
