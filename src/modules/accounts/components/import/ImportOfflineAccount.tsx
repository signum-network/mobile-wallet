import React from 'react';
import {View} from 'react-native';
import {Button} from '../../../../core/components/base/Button';
import {Input} from '../../../../core/components/base/Input';
import {i18n} from '../../../../core/i18n';
import {flexGrowStyle} from '../../../../core/utils/styles';
import {auth} from '../../translations';
import {AccountTypeHint} from './AccountTypeHint';
import {formatWithMask} from 'react-native-mask-input';

const AddressMask = [
  'S',
  '-',
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  '-',
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  '-',
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  '-',
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
  /[a-zA-Z0-9]/,
];
function formatAddress(text: string): string {
  // S-ABCD-ABCD-ABCD-ABCDE
  if (text.length < 2) {
    return 'S-';
  }
  return formatWithMask({
    mask: AddressMask,
    text,
  }).masked.toUpperCase();
}

interface Props {
  onFinish: (address: string) => void;
}

interface State {
  address: string;
}

export class ImportOfflineAccount extends React.PureComponent<Props, State> {
  state: State = {
    address: 'S-',
  };

  handleChangeAddress = (address: string) => {
    this.setState({address: formatAddress(address)});
  };

  handleFinish = () => {
    this.props.onFinish(this.state.address);
  };

  render() {
    const {address} = this.state;

    return (
      <React.Fragment>
        <View style={flexGrowStyle}>
          <Input
            hint={i18n.t(auth.models.account.address)}
            value={address}
            autoCapitalize={'characters'}
            onChangeText={this.handleChangeAddress}
          />
          <AccountTypeHint>
            {i18n.t(auth.importAccount.passiveAccountHint)}
          </AccountTypeHint>
        </View>
        <View style={{paddingTop: '10%'}}>
          <Button fullWidth={true} onPress={this.handleFinish}>
            {i18n.t(auth.importAccount.import)}
          </Button>
        </View>
      </React.Fragment>
    );
  }
}
