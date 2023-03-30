import {SuggestedFees} from '@signumjs/core';
import {createAction, createActionFn} from '../../../core/utils/store';
import {actionTypes} from './actionTypes';
import {selectChainApi} from '../../../core/store/app/selectors';
import {ChainInfo} from '../../../core/interfaces';

const actions = {
  setSuggestedFees: createAction(actionTypes.setSuggestedFees),
  setChainInfo: createAction<ChainInfo>(actionTypes.setChainInfo),
};

export const getSuggestedFees = createActionFn<
  void,
  Promise<SuggestedFees | undefined>
>(async (dispatch, getState) => {
  const chainApi = selectChainApi(getState());
  try {
    const suggestedFees = await chainApi.network.getSuggestedFees();
    dispatch(actions.setSuggestedFees(suggestedFees));
    return suggestedFees;
    // tslint:disable-next-line: no-empty
  } catch (e) {}
});
export const getChainInfo = createActionFn<
  void,
  Promise<ChainInfo | undefined>
>(async (dispatch, getState) => {
  const chainApi = selectChainApi(getState());
  try {
    const [network, blockchain] = await Promise.all([
      chainApi.network.getNetworkInfo(),
      chainApi.network.getBlockchainStatus(),
    ]);
    const chainInfo: ChainInfo = {
      networkName: network.networkName,
      addressPrefix: network.addressPrefix,
      symbol: network.valueSuffix,
      version: blockchain.version,
    };
    dispatch(actions.setChainInfo(chainInfo));
    return chainInfo;
  } catch (e: any) {
    console.error('getChainInfo failed', e.message);
  }
});
