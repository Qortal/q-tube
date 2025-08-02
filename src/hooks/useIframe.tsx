import { useEffect } from 'react';
import { To, useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n/i18n';
import { EnumTheme, themeAtom } from '../state/global/theme';

type Language = 'de' | 'en' | 'es' | 'fr' | 'it' | 'ja' | 'ru' | 'zh';
type Theme = 'dark' | 'light';

interface CustomWindow extends Window {
  _qdnTheme: Theme;
  _qdnLang: Language;
}
const customWindow = window as unknown as CustomWindow;

export const useIframe = () => {
  const setTheme = useSetAtom(themeAtom);
  const { i18n } = useTranslation();

  const navigate = useNavigate();
  useEffect(() => {
    const themeColorDefault = customWindow?._qdnTheme;
    if (themeColorDefault === 'dark') {
      setTheme(EnumTheme.DARK);
    } else if (themeColorDefault === 'light') {
      setTheme(EnumTheme.LIGHT);
    }

    const languageDefault = customWindow?._qdnLang;

    if (supportedLanguages?.includes(languageDefault)) {
      i18n.changeLanguage(languageDefault);
    }

    function handleNavigation(event: {
      data: {
        action: string;
        path: To;
        theme: Theme;
        language: Language;
      };
    }) {
      if (event.data?.action === 'NAVIGATE_TO_PATH' && event.data.path) {
        navigate(event.data.path); // Navigate directly to the specified path

        // Send a response back to the parent window after navigation is handled
        window.parent.postMessage(
          { action: 'NAVIGATION_SUCCESS', path: event.data.path },
          '*'
        );
      } else if (event.data?.action === 'THEME_CHANGED' && event.data.theme) {
        const themeColor = event.data.theme;
        if (themeColor === 'dark') {
          setTheme(EnumTheme.DARK);
        } else if (themeColor === 'light') {
          setTheme(EnumTheme.LIGHT);
        }
      } else if (
        event.data?.action === 'LANGUAGE_CHANGED' &&
        event.data.language
      ) {
        if (!supportedLanguages?.includes(event.data.language)) return;
        i18n.changeLanguage(event.data.language);
      }
    }

    window.addEventListener('message', handleNavigation);

    return () => {
      window.removeEventListener('message', handleNavigation);
    };
  }, [navigate, setTheme]);
  return { navigate };
};
