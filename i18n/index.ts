import { ARABIC_UI_TEXT } from './ar';
import { ENGLISH_UI_TEXT } from './en';
// FIX: The Translation type should be imported from the types file where it is defined and exported.
import type { Translation } from '../types';

export const translations: { [key: string]: Translation } = {
  ar: ARABIC_UI_TEXT,
  en: ENGLISH_UI_TEXT,
};
