import {Account, SuggestedFees} from '@signumjs/core';
import {Amount} from '@signumjs/util';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {BInput, KeyboardTypes} from '../../../../core/components/base/BInput';
import {BSelect, SelectItem} from '../../../../core/components/base/BSelect';
import {
  Button as BButton,
  ButtonSizes,
  ButtonThemes,
} from '../../../../core/components/base/Button';
import {Text as BText} from '../../../../core/components/base/Text';
import {i18n} from '../../../../core/i18n';
import {Colors} from '../../../../core/theme/colors';
import {ReceiveAmountPayload} from '../../store/actions';
import {transactions} from '../../translations';
import {core} from '../../../../core/translations';
import {AmountText} from '../../../../core/components/base/Amount';
import {
  stableAmountFormat,
  stableParseSignaAmount,
} from '../../../../core/utils/amount';
import {FeeSelector} from '../FeeSelector';
import {shortenString} from '../../../../core/utils/string';
import {shortenRSAddress} from '../../../../core/utils/account';
import {BCheckbox} from '../../../../core/components/base/BCheckbox';
import {FontSizes} from '../../../../core/theme/sizes';
import {useDispatch} from 'react-redux';
import {updateActivity} from '../../../../core/store/app/actions';

interface Props {
  onSubmit: (form: ReceiveAmountPayload) => void;
  accounts: Account[];
  suggestedFees: SuggestedFees | null;
}

const styles: any = {
  wrapper: {
    height: '90%',
  },
  form: {
    display: 'flex',
    flex: 1,
  },
  col: {
    flex: 1,
  },
  row: {
    marginTop: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    flex: 3,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  totalContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  },
  feeSection: {
    marginBottom: 10,
  },
};

export const ReceiveAmountForm: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const getInitialFormData = (): ReceiveAmountPayload => ({
    amount: '',
    immutable: false,
    fee: props.suggestedFees
      ? Amount.fromPlanck(props.suggestedFees.standard).getSigna()
      : '',
    recipient: props.accounts.length > 0 ? props.accounts[0].accountRS : '',
    message: '',
  });

  const [formData, setFormData] = useState<ReceiveAmountPayload>(
    getInitialFormData(),
  );
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    const {amount, fee, recipient} = formData as ReceiveAmountPayload;
    const isEnabled = Boolean(Number(amount) && Number(fee) && recipient);
    setSubmitEnabled(isEnabled);
  }, [formData]);

  const handleFormChange = (fieldName: string) => (data: any) => {
    switch (fieldName) {
      case 'recipient':
        data = data && data.trim();
        break;
      case 'amount':
      case 'fee':
        data = stableAmountFormat(data);
        break;
    }

    const updated = {
      ...formData,
      [fieldName]: data,
    } as ReceiveAmountPayload;

    setFormData(updated);
    setFormChanged(true);
    dispatch(updateActivity());
  };

  const getAccounts = (): Array<SelectItem<string>> => {
    return props.accounts.map(({accountRS, name, account}) => ({
      value: account,
      label: name
        ? `${shortenString(name)} - ${shortenRSAddress(accountRS)}`
        : accountRS,
    }));
  };

  const handleSubmit = () => {
    submitEnabled && props.onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      ...getInitialFormData(),
    });
    setFormChanged(false);
  };

  const handleFeeChangeFromSlider = (feePlanck: number) => {
    const feeSigna = Amount.fromPlanck(feePlanck || 0).getSigna();
    // breaking a loop :rolleyes
    if (formData.fee !== feeSigna) {
      handleFormChange('fee')(feeSigna);
    }
  };

  const {immutable, recipient, amount, fee, message = ''} = formData;
  const total = stableParseSignaAmount(amount).add(stableParseSignaAmount(fee));
  const {suggestedFees} = props;

  return (
    <View style={styles.wrapper}>
      <View style={styles.form}>
        <BSelect
          value={recipient}
          items={getAccounts()}
          onChange={handleFormChange('recipient')}
          title={i18n.t(transactions.screens.receive.recipient)}
          placeholder={i18n.t(transactions.screens.send.selectAccount)}
        />
        <BInput
          value={amount}
          onChange={handleFormChange('amount')}
          keyboard={KeyboardTypes.NUMERIC}
          title={i18n.t(transactions.screens.send.amountNQT)}
          placeholder={'0'}
        />
        <BInput
          value={fee}
          onChange={handleFormChange('fee')}
          keyboard={KeyboardTypes.NUMERIC}
          title={i18n.t(transactions.screens.send.feeNQT)}
          placeholder={'0'}
        />
        {suggestedFees && (
          <View style={styles.feeSection}>
            <FeeSelector
              payloadLength={message.length}
              onFeeSelected={handleFeeChangeFromSlider}
            />
          </View>
        )}
        <BInput
          value={message}
          onChange={handleFormChange('message')}
          title={i18n.t(transactions.screens.send.message)}
          placeholder={i18n.t(core.placeholders.message)}
        />
        <BCheckbox
          label={i18n.t(transactions.screens.receive.immutable)}
          labelFontSize={FontSizes.SMALL}
          value={immutable}
          onCheck={handleFormChange('immutable')}
        />
        <View style={styles.totalContainer}>
          <View style={styles.total}>
            <BText bebasFont color={Colors.WHITE}>
              {i18n.t(transactions.screens.send.total)}
            </BText>
            <AmountText amount={total || Amount.Zero()} />
          </View>
          <View>
            <BButton
              size={ButtonSizes.SMALL}
              theme={ButtonThemes.ACCENT}
              disabled={!formChanged}
              onPress={handleReset}>
              {i18n.t(transactions.screens.receive.reset)}
            </BButton>
          </View>
        </View>
        <BButton disabled={!submitEnabled} onPress={handleSubmit}>
          {i18n.t(transactions.screens.receive.generate)}
        </BButton>
      </View>
    </View>
  );
};
