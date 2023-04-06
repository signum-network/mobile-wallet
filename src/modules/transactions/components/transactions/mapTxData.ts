import {Transaction} from '@signumjs/core';
import {Amount, ChainTime} from '@signumjs/util';
import {startCase, toNumber} from 'lodash';
import {formatAttachmentData} from './formatAttachmentData';
import {formatDistributionData} from './formatDistributionData';
import {SmartContractPublicKey} from '../../../../core/utils/constants';

export interface TxDataMappingContext {
  symbol: string;
}

export interface TxKeyValue {
  key: string;
  value: string;
}

const ExcludeList: string[] = [
  'attachmentBytes',
  'ecBlockHeight',
  'ecBlockId',
  'blockTimestamp',
  'subtype',
  'transaction',
  'type',
];

const KeyValueMappers = {
  feeNQT: ({value}: TxKeyValue, context: TxDataMappingContext): TxKeyValue => ({
    key: `Fee (${context.symbol})`,
    value: `${Amount.fromPlanck(value).getSigna()}`,
  }),
  amountNQT: (
    {value}: TxKeyValue,
    context: TxDataMappingContext,
  ): TxKeyValue => ({
    key: `Amount (${context.symbol})`,
    value: Amount.fromPlanck(value).getSigna(),
  }),
  timestamp: ({key, value}: TxKeyValue): TxKeyValue => ({
    key,
    value: `${value} - ${ChainTime.fromChainTimestamp(toNumber(value))
      .getDate()
      .toISOString()}`,
  }),
  attachment: ({value}: TxKeyValue): TxKeyValue => ({
    key: 'Payload',
    value: formatAttachmentData(value),
  }),
  distribution: ({value}: TxKeyValue): TxKeyValue => ({
    key: 'Distribution',
    value: formatDistributionData(value),
  }),
  senderPublicKey: ({value}: TxKeyValue): TxKeyValue => ({
    key: 'Sender Public Key',
    value: value === SmartContractPublicKey ? 'Smart Contract' : value,
  }),
};

// @ts-ignore
const mapKeyValueTuple = (
  txKeyValue: TxKeyValue,
  tx: Transaction,
  context: TxDataMappingContext,
): TxKeyValue => {
  // @ts-ignore
  const mapperFn = KeyValueMappers[txKeyValue.key];
  const tuple = mapperFn ? mapperFn(txKeyValue, context) : txKeyValue;
  tuple.key = startCase(tuple.key);
  return tuple;
};

const compareKeyValueFn = (a: TxKeyValue, b: TxKeyValue): number => {
  if (a.key < b.key) {
    return -1;
  }
  if (a.key > b.key) {
    return 1;
  }
  return 0;
};

export function mapTxData(
  transaction: Transaction,
  context: TxDataMappingContext,
): TxKeyValue[] {
  return (
    Object.keys(transaction)
      .filter(key => ExcludeList.indexOf(key) === -1)
      // @ts-ignore
      .map(key => {
        // @ts-ignore
        const value = transaction[key];
        return mapKeyValueTuple(
          {
            key,
            value:
              typeof value === 'object'
                ? JSON.stringify(value, null, '\t')
                : value.toString(),
          },
          transaction,
          context,
        );
      })
      .sort(compareKeyValueFn)
  );
}
