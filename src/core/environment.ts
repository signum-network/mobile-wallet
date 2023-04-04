import {toNumber, toString} from 'lodash';

import {
  CRYPTOCOMPARE_HOST_URL,
  DEFAULT_NODE_HOST,
  DEFAULT_PASSCODE_TIME,
  RELIABLE_NODE_HOSTS,
  BLACK_LISTED_ACCOUNT_IDS,
  TESTNET_NODE_HOSTS,
  UPDATE_POLLING_SECONDS,
  UPDATE_POLLING_PENDING_SECONDS,
  ACTIVATION_SERVICE_URL_MAINNET,
  ACTIVATION_SERVICE_URL_TESTNET,
} from '@env';

// So we check it like this
// tslint:disable-next-line: max-line-length
if (
  !DEFAULT_NODE_HOST ||
  !DEFAULT_PASSCODE_TIME ||
  !CRYPTOCOMPARE_HOST_URL ||
  !RELIABLE_NODE_HOSTS ||
  !BLACK_LISTED_ACCOUNT_IDS ||
  !UPDATE_POLLING_SECONDS ||
  !UPDATE_POLLING_PENDING_SECONDS ||
  !ACTIVATION_SERVICE_URL_MAINNET ||
  !ACTIVATION_SERVICE_URL_TESTNET
) {
  throw new Error('Incorrect .env config!');
}

const fromCsvString = (csv: string): string[] =>
  toString(csv)
    .split(';')
    .map(v => v.trim())
    .filter(v => !!v);

const defaultSettings = {
  nodeHost: toString(DEFAULT_NODE_HOST),
  reliableNodeHosts: fromCsvString(RELIABLE_NODE_HOSTS),
  testnetNodeHosts: fromCsvString(TESTNET_NODE_HOSTS),
  passcodeTime: toNumber(DEFAULT_PASSCODE_TIME),
  pollingTime: toNumber(UPDATE_POLLING_SECONDS),
  pollingTimePending: toNumber(UPDATE_POLLING_PENDING_SECONDS),
  cryptoCompareURL: toString(CRYPTOCOMPARE_HOST_URL),
  blackListedAccountIds: fromCsvString(BLACK_LISTED_ACCOUNT_IDS),
  activationServiceMainNet: toString(ACTIVATION_SERVICE_URL_MAINNET),
  activationServiceTestNet: toString(ACTIVATION_SERVICE_URL_TESTNET),
};

console.log('Environment Settings:', defaultSettings);

export {defaultSettings};
