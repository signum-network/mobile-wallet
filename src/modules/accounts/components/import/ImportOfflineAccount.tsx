import React, {useState} from 'react';
import {View} from 'react-native';
import {Button} from '../../../../core/components/base/Button';
import {Input} from '../../../../core/components/base/Input';
import {i18n} from '../../../../core/i18n';
import {flexGrowStyle} from '../../../../core/utils/styles';
import {auth} from '../../translations';
import {AccountTypeHint} from './AccountTypeHint';
import {maskSignumAddress} from '../../../../core/utils/maskSignumAddress';
import {useSelector} from 'react-redux';
import {selectChainInfo} from '../../../network/store/selectors';

interface Props {
  onFinish: (address: string) => void;
}

export const ImportOfflineAccount = ({onFinish}: Props) => {
  const chainInfo = useSelector(selectChainInfo);
  const [address, setAddress] = useState(
    `${chainInfo ? chainInfo.addressPrefix : 'S'}-`,
  );

  const handleChangeAddress = (addr: string) => {
    setAddress(maskSignumAddress(addr));
  };

  const handleFinish = () => {
    onFinish(address);
  };

  return (
    <React.Fragment>
      <View style={flexGrowStyle}>
        <Input
          hint={i18n.t(auth.models.account.address)}
          value={address}
          autoCapitalize={'characters'}
          onChangeText={handleChangeAddress}
        />
        <AccountTypeHint>
          {i18n.t(auth.importAccount.passiveAccountHint)}
        </AccountTypeHint>
      </View>
      <View style={{paddingTop: '10%'}}>
        <Button fullWidth={true} onPress={handleFinish}>
          {i18n.t(auth.importAccount.import)}
        </Button>
      </View>
    </React.Fragment>
  );
};
