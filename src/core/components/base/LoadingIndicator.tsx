import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, ColorValue} from 'react-native';
import {Colors} from '../../theme/colors';

interface Props {
  style?: any;
  color?: ColorValue;
  size?: number | 'small' | 'large';
  show: boolean;
  showDelay?: number;
}

export const LoadingIndicator = ({
  style = {},
  color = Colors.WHITE,
  show,
  size = 'small',
}: Props) => {
  return show ? (
    <ActivityIndicator style={style} color={color} size={size} />
  ) : null;
};
