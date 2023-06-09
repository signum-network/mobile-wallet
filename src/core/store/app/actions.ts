import {
  loadAccounts,
  loadPasscode,
} from '../../../modules/accounts/store/actions';
import {
  getChainInfo,
  getSuggestedFees,
} from '../../../modules/network/store/actions';
import {AppSettings, UserSettings} from '../../interfaces';
import {fetchAppSettings} from '../../utils/keychain';
import {createAction, createActionFn} from '../../utils/store';
import {actionTypes} from './actionTypes';
import {
  fetchUserSettings,
  resetUserSettings,
  updateUserSettings,
} from '../../utils/storage';
import {asyncTryRun} from '../../utils/asyncTryRun';

const actions = {
  appLoaded: createAction<void>(actionTypes.appLoaded),
  updateActivity: createAction<void>(actionTypes.updateActivity),
  setAppSettings: createAction<AppSettings>(actionTypes.setAppSettings),
  setUserSettings: createAction<UserSettings>(actionTypes.setUserSettings),
};

export const loadApp = createActionFn<void, Promise<void>>(async dispatch => {
  await Promise.all([
    dispatch(loadAccounts()),
    dispatch(loadPasscode()),
    dispatch(loadAppSettings()),
    dispatch(loadUserSettings()),
  ]);
  // dispatch(loadHistoricalPriceApiData());
  await Promise.all([dispatch(getChainInfo()), dispatch(getSuggestedFees())]);
  dispatch(actions.appLoaded());
});

export const loadAppSettings = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) =>
    asyncTryRun('loadAppSettings', async () => {
      const settings = await fetchAppSettings();
      console.log('loaded App Settings:', settings);
      dispatch(actions.setAppSettings(settings));
    }),
);

export const loadUserSettings = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) =>
    asyncTryRun('loadUserSettings', async () => {
      const settings = await fetchUserSettings();
      console.log('Loaded user Settings', settings);
      dispatch(actions.setUserSettings(settings));
    }),
);

export const resetAppState = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) =>
    asyncTryRun('resetAppState', async () => {
      const settings = await resetUserSettings();
      console.log('Reset App State', settings);
      dispatch(actions.setUserSettings(settings));
    }),
);

export const setNode = createActionFn<string, Promise<void>>(
  async (dispatch, _getState, node) => {
    await asyncTryRun('setNode', async () => {
      const partialSettings = {currentNodeHost: node};
      await updateUserSettings(partialSettings);
      dispatch(actions.setUserSettings(partialSettings));
      dispatch(getChainInfo()); // can run async
      console.log('setNode:', node);
    });
  },
);

export const agreeToTerms = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {
    await asyncTryRun('agreeToTerms', async () => {
      const partialSettings: UserSettings = {agreedToTerms: true};
      await updateUserSettings(partialSettings);
      dispatch(actions.setUserSettings(partialSettings));
    });
  },
);
export const updateActivity = createActionFn<void, void>(dispatch => {
  dispatch(actions.updateActivity());
});
