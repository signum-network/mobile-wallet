import {Account} from '@signumjs/core';
import {PassPhraseGenerator} from '@signumjs/crypto';
import React, {useState} from 'react';
import {Alert, View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {i18n} from '../../../core/i18n';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {Screen} from '../../../core/layout/Screen';
import {Colors} from '../../../core/theme/colors';
import {SeedGeneratorStage} from '../components/create/SeedGeneratorStage';
import {StepCounter} from '../components/create/StepCounter';
import {
  activateAccount,
  addAccount,
  createActiveAccount,
  hydrateAccount,
} from '../store/actions';
import {auth} from '../translations';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/mainStack';
import {HeaderWithBackButton} from '../../../core/layout/HeaderWithBackButton';
import {useNavigation} from '@react-navigation/native';
import {ShowPassphraseStage} from '../components/create/ShowPassphraseStage';
import {VerifyPassphraseStage} from '../components/create/VerifyPassphraseStage';

type CreateAccountNavProp = StackNavigationProp<
  RootStackParamList,
  'CreateAccount'
>;

interface State {
  stage: Stages;
  seed: any[];
  phrase: string[];
  account: Account | null;
}

enum Stages {
  GENERATE_SEED = 0,
  NOTE_PASSPHRASE,
  ENTER_PASSPHRASE,
}

const getDefaultState = (): State => ({
  stage: Stages.GENERATE_SEED,
  seed: [],
  phrase: [],
  account: null,
});

const styles = StyleSheet.create({
  center: {
    minHeight: '80%',
    padding: 10,
  },
});

const passPhraseGenerator: PassPhraseGenerator = new PassPhraseGenerator();

export const CreateAccountScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<CreateAccountNavProp>();
  const [state, setState] = useState(getDefaultState());

  const createAccount = async () => {
    const {phrase} = state;

    try {
      const joinedPhrase = phrase.join(' ');
      const account = await dispatch(createActiveAccount(joinedPhrase));
      await dispatch(
        activateAccount({
          accountId: account.account,
          // @ts-ignore
          publicKey: account.keys.publicKey,
        }),
      );
      await dispatch(addAccount(account));
      await dispatch(hydrateAccount({account}));
    } catch (error: any) {
      // This error shouldn't be possible, but still
      setState(getDefaultState());
      Alert.alert(error.message);
    }
    navigation.navigate('Accounts');
  };

  const handlePhraseNoted = () => {
    setState({
      ...state,
      stage: Stages.ENTER_PASSPHRASE,
    });
  };

  const handleSeedGenerated = async (seed: string[]) => {
    const phrase = await passPhraseGenerator.generatePassPhrase(seed);
    setState({
      ...state,
      phrase,
      stage: Stages.NOTE_PASSPHRASE,
    });
  };

  const renderStage = () => {
    const {stage, phrase} = state;

    switch (stage) {
      case Stages.GENERATE_SEED:
        return <SeedGeneratorStage onSeedGenerated={handleSeedGenerated} />;
      case Stages.NOTE_PASSPHRASE:
        return (
          <ShowPassphraseStage phrase={phrase} onFinish={handlePhraseNoted} />
        );
      case Stages.ENTER_PASSPHRASE:
        return (
          <VerifyPassphraseStage phrase={phrase} onFinish={createAccount} />
        );
    }

    return null;
  };

  return (
    <Screen>
      <FullHeightView style={{backgroundColor: Colors.WHITE}} withoutPaddings>
        <HeaderWithBackButton title={i18n.t(auth.createAccount.title)} />
        <View style={styles.center}>
          <StepCounter stage={state.stage + 1} maxStages={3} />
          {renderStage()}
        </View>
      </FullHeightView>
    </Screen>
  );
};
