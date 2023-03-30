import {ApplicationState} from '../../../core/store/initialState';
import {SuggestedFees} from '@signumjs/core';
import {ChainInfo} from '../../../core/interfaces';

export const selectSuggestedFees = (
  state: ApplicationState,
): SuggestedFees | null => state.network.suggestedFees;
export const selectChainInfo = (state: ApplicationState): ChainInfo | null =>
  state.network.chainInfo;
