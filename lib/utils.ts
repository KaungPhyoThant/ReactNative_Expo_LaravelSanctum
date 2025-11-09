import { type ClassValue, clsx } from 'clsx';
import { Platform } from 'react-native';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const isIos = Platform.OS === 'ios';
const iosVersion = isIos ? parseFloat(String(Platform.Version)) : 0;
export const isIos26OrHigher = isIos && iosVersion >= 26;
