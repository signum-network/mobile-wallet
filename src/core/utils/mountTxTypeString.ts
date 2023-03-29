import {startCase, toNumber} from 'lodash';
import {getTransactionSubtypeTranslationKey} from './getTransactionTypeTranslationKey';

export const mountTxTypeString = (
  txType: number | string,
  txSubType: number | string,
): string =>
  startCase(
    getTransactionSubtypeTranslationKey(toNumber(txType), toNumber(txSubType)),
  );
