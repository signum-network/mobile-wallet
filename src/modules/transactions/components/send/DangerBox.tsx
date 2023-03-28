import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Sizes} from '../../../../core/theme/sizes';
import {Colors} from '../../../../core/theme/colors';
import {ChildrenProps} from '../../../../typings/children-props';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: Sizes.MEDIUM,
    backgroundColor: Colors.RED,
    padding: Sizes.MEDIUM,
    borderRadius: 4,
    borderColor: Colors.WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  row: {
    width: '90%',
  },
});

export const DangerBox: React.FC<ChildrenProps> = ({children}) => (
  <View style={styles.root}>
    <View>{children}</View>
  </View>
);
