import {I18n} from 'i18n-js';
import {findBestLanguageTag} from 'react-native-localize';
import en from '../translations/en.json';
import ru from '../translations/ru.json';
import de from '../translations/de.json';
import pt from '../translations/pt.json';
import es from '../translations/es.json';
import uk from '../translations/uk.json';
import zh from '../translations/zh.json';

const fallback = {languageTag: 'en', isRTL: false};
const {languageTag} =
  findBestLanguageTag(['en-US', 'en', 'ru', 'de', 'pt', 'es', 'zh', 'uk']) ||
  fallback;

export const i18n = new I18n();

i18n.store({en, ru, de, pt, es, uk, zh});
i18n.locale = languageTag;
i18n.enableFallback = true;
