import * as React from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from 'react-native';
import {Colors} from '../../theme/colors';
import {fonts} from '../../theme/fonts';
import {FontSizes, Sizes} from '../../theme/sizes';
import {Text as BText} from './Text';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onEndEditing?: (
    value: NativeSyntheticEvent<TextInputEndEditingEventData>,
  ) => void;
  keyboard?: KeyboardTypes;
  title?: string;
  placeholder?: string;
  rightIcons?: React.ReactElement;
  editable?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  theme?: 'light' | 'normal';
  secret? : boolean;
}

export enum KeyboardTypes {
  DEFAULT = 'default',
  EMAIL = 'email-address',
  NUMERIC = 'numeric',
  PHONE = 'phone-pad',
}

export const BInput = (props: Props) => {
  const {
    editable,
    title,
    value,
    onChange,
    placeholder,
    keyboard,
    onEndEditing,
    rightIcons,
    autoCapitalize,
    theme = 'normal',
    secret = false,
  } = props;
  const styles: any = {
    wrapper: {
      borderColor: Colors.BLUE,
      borderWidth: 1,
      borderRadius: 4,
      padding: Sizes.MEDIUM,
      backgroundColor: theme === 'normal' ? Colors.BLACK_T : Colors.GREY_T,
      marginBottom: Sizes.MEDIUM,
      flexDirection: 'row',
    },
    input: {
      fontFamily: fonts.roboto,
      letterSpacing: -1,
      fontSize: FontSizes.MEDIUM,
      fontWeight: '500',
      backgroundColor: Colors.TRANSPARENT,
      // color: theme === 'normal' ? Colors.GREY_TT : Colors.GREY_T,
      height: 25,
      padding: 0,
      width: '100%',
      flex: 1,
    },
    end: {
      marginLeft: 'auto',
    },
  };

  const inputStyle = {
    ...styles.input,
    color:
      props.editable || props.editable === undefined
        ? Colors.WHITE
        : Colors.GREY,
  };

  return (
    <View>
      {title ? (
        <BText
          color={theme === 'normal' ? Colors.WHITE : Colors.BLUE}
          size={FontSizes.SMALLER}>
          {title}
        </BText>
      ) : null}
      <View style={styles.wrapper}>
        <TextInput
          editable={editable}
          onEndEditing={onEndEditing}
          value={value}
          onChangeText={onChange}
          style={inputStyle}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
          keyboardType={keyboard}
          returnKeyType={'done'}
          placeholder={placeholder}
          placeholderTextColor={
            theme === 'normal' ? Colors.GREY : Colors.GREY_DARK
          }
          secureTextEntry={secret}
        />
        <View style={styles.end}>{rightIcons}</View>
      </View>
    </View>
  );
};
