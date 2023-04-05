import {SuggestedFees} from '@signumjs/core';
import {ChainInfo, Reducer} from '../../../core/interfaces';
import {createReducers} from '../../../core/utils/store';
import {actionTypes} from './actionTypes';

export interface NetworkReduxState {
  suggestedFees: SuggestedFees | null;
  chainInfo: ChainInfo | null;
}

export const networkState = (): NetworkReduxState => {
  return {
    suggestedFees: null,
    chainInfo: null,
  };
};

const getSuggestedFees: Reducer<NetworkReduxState, SuggestedFees> = (
  state,
  action,
) => {
  const suggestedFees = action.payload;

  return {
    ...state,
    suggestedFees,
  };
};
const setChainInfo: Reducer<NetworkReduxState, ChainInfo> = (state, action) => {
  const chainInfo = action.payload;

  return {
    ...state,
    chainInfo,
  };
};

const reducers = {
  [actionTypes.setSuggestedFees]: getSuggestedFees,
  [actionTypes.setChainInfo]: setChainInfo,
};

export const network = createReducers(networkState(), reducers);
