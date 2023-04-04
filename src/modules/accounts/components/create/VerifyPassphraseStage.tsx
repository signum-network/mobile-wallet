import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button} from '../../../../core/components/base/Button';
import {Text, TextThemes} from '../../../../core/components/base/Text';
import {BInput} from '../../../../core/components/base/BInput';
import {i18n} from '../../../../core/i18n';
import {auth} from '../../translations';
import {flexGrowStyle} from '../../../../core/utils/styles';

interface Props {
  phrase: string[];
  onFinish: () => void;
}

const getRandomIndex = (length: number): number => {
  return Math.floor(Math.random() * length);
};

export const VerifyPassphraseStage = ({phrase, onFinish}: Props) => {
  const [word, setWord] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(getRandomIndex(phrase.length));
  }, [phrase]);

  return (
    <React.Fragment>
      <View style={flexGrowStyle}>
        <Text theme={TextThemes.HEADER}>
          {i18n.t(auth.createAccount.verifyPhrase)}
        </Text>
      </View>
      <View style={flexGrowStyle}>
        <BInput
          value={word}
          onChange={setWord}
          placeholder={`${i18n.t(auth.createAccount.enterWord)}: ${index + 1}`}
          title={`${i18n.t(auth.createAccount.enterWord)}: ${index + 1}`}
          theme="light"
        />
      </View>
      <View>
        <Button onPress={onFinish} disabled={word !== phrase[index]}>
          {i18n.t(auth.createAccount.finalize)}
        </Button>
      </View>
    </React.Fragment>
  );
};
