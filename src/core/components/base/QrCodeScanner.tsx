import React, {useEffect, useMemo, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {StyleSheet, View} from 'react-native';
import {Text, TextAlign} from './Text';
import {FontSizes} from '../../theme/sizes';
import {i18n} from '../../i18n';
import {core} from '../../translations';
import {Colors} from '../../theme/colors';

const DefaultStyle = StyleSheet.create({
  root: {
    height: '100%',
  },
  error: {
    marginTop: '50%',
  },
});

interface Props {
  onScanned: (result: string) => void;
  style?: any;
}

export const QrCodeScanner = ({onScanned = () => {}, style = {}}: Props) => {
  const [hasPermission, setHasPermission] = useState(false);
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes[0].value) {
        onScanned(codes[0].value);
      }
    },
  });
  const device = useCameraDevice('back');

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const errorMessage = useMemo(() => {
    if (!device) {
      return i18n.t(core.components.qrCodeScanner.errorNoDevice);
    }
    if (!hasPermission) {
      return i18n.t(core.components.qrCodeScanner.errorNoPermission);
    }
    return null;
  }, [device, hasPermission]);

  if (errorMessage) {
    return (
      <View style={DefaultStyle.error}>
        <Text
          size={FontSizes.MEDIUM}
          color={Colors.WHITE}
          textAlign={TextAlign.CENTER}>
          {errorMessage}
        </Text>
      </View>
    );
  }

  return (
    <Camera
      style={[DefaultStyle.root, style]}
      device={device!}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
};
