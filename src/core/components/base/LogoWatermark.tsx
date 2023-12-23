import {Image, StyleSheet, View} from 'react-native';
import {logos} from '../../../assets/icons';
import React from 'react';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  image: {
    // @ts-ignore
    ...StyleSheet.absoluteFill,
    top: -128,
    left: -160,
    transform: [
      {translateX: -512},
      {translateY: -512},
      {scale: 0.33},
      {translateX: 512},
      {translateY: 512},
    ],
  },
});

interface Props {
  invert?: boolean;
}

export const LogoWatermark = ({invert = false}: Props) => (
  <View style={styles.root}>
    {invert ? (
      <Image source={logos.iconnodeinverted} style={styles.image} />
    ) : (
      <Image source={logos.iconnode} style={styles.image} />
    )}
  </View>
);
