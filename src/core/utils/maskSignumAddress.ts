import {formatWithMask} from 'react-native-mask-input';

export function maskSignumAddress(text: string, prefix: string = 'S'): string {
  const AddressMask = [
    prefix,
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
  // S-ABCD-ABCD-ABCD-ABCDE
  if (text.length < 2) {
    return prefix + '-';
  }
  return formatWithMask({
    mask: AddressMask,
    text,
  }).masked.toUpperCase();
}
