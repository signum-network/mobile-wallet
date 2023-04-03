import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../core/components/base/Text';
import React from 'react';
import {
  Account,
  AttachmentEncryptedMessage,
  Transaction,
  TransactionArbitrarySubtype,
  TransactionType,
} from '@signumjs/core';
import {Colors} from '../../../../core/theme/colors';
import {FontSizes, Sizes} from '../../../../core/theme/sizes';
import {useSelector} from 'react-redux';
import {
  selectAccounts,
  selectPasscode,
} from '../../../accounts/store/selectors';
import {
  decryptAES,
  decryptData,
  decryptMessage,
  hashSHA256,
} from '@signumjs/crypto';

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

function getPlainText(
  transaction: Transaction,
  passCode: string,
  accounts: Account[],
): string {
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
        return decryptMessage(
          encryptedMessage,
          recipientPublicKey,
          decryptionKey,
        );
      } else {
        return '[Encrypted Binary Message]';
      }
    }
    // recipient
    account = accounts.find(
      // @ts-ignore
      a => a.account === transaction.recipient && a.type === 'active',
    );
    console.log('second round', account)

    if (account) {
      const {encryptedMessage} = transaction.attachment
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
export const TransactionMessageView = ({transaction}: Props) => {
  const accounts = useSelector(selectAccounts);
  const passCode = useSelector(selectPasscode);

  const isMessage =
    transaction.type === TransactionType.Arbitrary &&
    transaction.subtype === TransactionArbitrarySubtype.Message;

  if (!isMessage) {
    return null;
  }

  if (!transaction.attachment) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Text color={Colors.WHITE} size={FontSizes.SMALL}>
        {getPlainText(transaction, passCode, accounts)}
      </Text>
    </View>
  );
};
