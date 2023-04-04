import {StyleSheet, View} from 'react-native';
import {Text, TextAlign} from '../../../../core/components/base/Text';
import React, {memo, useEffect, useState} from 'react';
import {Account, Api, Transaction} from '@signumjs/core';
import {Colors} from '../../../../core/theme/colors';
import {FontSizes, Sizes} from '../../../../core/theme/sizes';
import {useSelector} from 'react-redux';
import {
  selectAccounts,
  selectPasscode,
} from '../../../accounts/store/selectors';
import {decryptAES, decryptMessage, hashSHA256} from '@signumjs/crypto';
import {selectChainApi} from '../../../../core/store/app/selectors';
import {transactions} from '../../translations';
import {i18n} from '../../../../core/i18n';

const styles = StyleSheet.create({
  root: {
    marginVertical: Sizes.MEDIUM,
    padding: Sizes.MEDIUM,
    borderRadius: 4,
    borderColor: Colors.WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
  },
});

async function getPlainText(
  transaction: Transaction,
  passCode: string,
  accounts: Account[],
  chainApi: Api,
): Promise<string> {
  const {attachment} = transaction;
  if (attachment.message) {
    return attachment.message;
  }
  try {
    let account = accounts.find(
      // @ts-ignore
      a => a.account === transaction.sender && a.type === 'active',
    );

    if (account) {
      const {encryptedMessage, recipientPublicKey} = attachment;

      // sender
      const decryptionKey = decryptAES(
        // @ts-ignore
        account.keys.agreementPrivateKey,
        hashSHA256(passCode),
      );
      console.log('sender', decryptionKey, attachment);
      if (encryptedMessage.isText) {
        let publicKey = recipientPublicKey;
        if (!publicKey) {
          console.log('No recipient pubkey found, fetching...');
          // in case that recipient pub key is not available
          const recipient = await chainApi.account.getAccount({
            accountId: transaction.recipient!,
            includeCommittedAmount: false,
            includeEstimatedCommitment: false,
          });
          publicKey = recipient.publicKey;
        }
        return publicKey
          ? decryptMessage(encryptedMessage, publicKey, decryptionKey)
          : '[Encrypted Message]';
      } else {
        return '[Encrypted Binary Message]';
      }
    }
    // recipient
    account = accounts.find(
      // @ts-ignore
      a => a.account === transaction.recipient && a.type === 'active',
    );
    console.log('second round', account);

    if (account) {
      const {encryptedMessage} = transaction.attachment;
      const decryptionKey = decryptAES(
        // @ts-ignore
        account.keys.agreementPrivateKey,
        hashSHA256(passCode),
      );
      console.log('receiver', decryptionKey, attachment);
      if (encryptedMessage.isText) {
        return decryptMessage(
          encryptedMessage,
          transaction.senderPublicKey,
          decryptionKey,
        );
      } else {
        return '[Encrypted Binary Message]';
      }
    }

    return '[Encrypted Message]';
  } catch (e: any) {
    console.error(e.message);
    return '';
  }
}

interface Props {
  transaction: Transaction;
}

function hasMessage(tx: Transaction): boolean {
  return (
    tx.attachment && (tx.attachment.message || tx.attachment.encryptedMessage)
  );
}
export const TransactionMessageView = ({transaction}: Props) => {
  const accounts = useSelector(selectAccounts);
  const passCode = useSelector(selectPasscode);
  const chainApi = useSelector(selectChainApi);
  const gotMessage = hasMessage(transaction);
  const [plainText, setPlainText] = useState<string | null>(null);

  const shouldRenderMessage = gotMessage;

  useEffect(() => {
    if (shouldRenderMessage) {
      if (transaction && passCode && accounts && chainApi) {
        getPlainText(transaction, passCode, accounts, chainApi)
          .then(setPlainText)
          .catch(console.error);
      }
    }
  }, [accounts, chainApi, passCode, shouldRenderMessage, transaction]);

  if (!shouldRenderMessage) {
    return null;
  }

  const isLoading = plainText === null;

  return (
    <View style={styles.root}>
      <Text
        color={isLoading ? Colors.GREY_LIGHT : Colors.WHITE}
        size={FontSizes.SMALL}
        textAlign={isLoading ? TextAlign.CENTER : TextAlign.LEFT}>
        {plainText || i18n.t(transactions.screens.details.loading)}
      </Text>
    </View>
  );
};
