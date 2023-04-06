import * as React from 'react';
import {View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Colors} from '../../theme/colors';
import {fonts} from '../../theme/fonts';
import {FontSizes} from '../../theme/sizes';
import {Text as BText} from './Text';
import {isIOS} from '../../utils/platform';

interface Props {
  value: any;
  items: Array<SelectItem<any>>;
  title?: string;
  rightElement?: React.ReactNode;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface SelectItem<T> {
  value: T;
  label: string;
}

const styles: any = {
  picker: {
    fontFamily: fonts.roboto,
    color: Colors.WHITE,
  },
  pickerItem: {
    fontSize: FontSizes.MEDIUM,
  },
};

export const BSelect: React.FC<Props> = props => {
  const {items, value, title, placeholder = '', disabled = false} = props;

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>
      {title && (
        <BText size={FontSizes.SMALLER} color={Colors.WHITE}>
          {title}
        </BText>
      )}
      <Picker
        onValueChange={props.onChange}
        style={styles.picker}
        selectedValue={value}
        enabled={!disabled}
        prompt={placeholder}
        dropdownIconColor={Colors.WHITE}
        dropdownIconRippleColor={Colors.WHITE}
        selectionColor={Colors.WHITE_TT}>
        {items.map(i => (
          <Picker.Item
            key={i.value}
            fontFamily={fonts.roboto}
            color={isIOS ? Colors.WHITE : Colors.BLUE_DARKER}
            style={styles.pickerItem}
            label={i.label}
            value={i.value}
          />
        ))}
      </Picker>
    </View>
  );
};
