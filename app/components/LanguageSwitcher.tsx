'use client';

import { useChangeLocale, useCurrentLocale, useI18n } from '../../locales/client';
// 如果没有配置路径别名 '@', 则使用相对路径，例如: import { useChangeLocale, useCurrentLocale } from '../locales/client';

export function LanguageSwitcher() {
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();
  const t = useI18n();

  return (
    <div className="flex items-center gap-2">
      {currentLocale === 'en' ? (
        <button
          onClick={() => changeLocale('zh')}
          className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {t('switchToChinese', { count: 1 })}
        </button>
      ) : (
        <button
          onClick={() => changeLocale('en')}
          className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {t('switchToEnglish', { count: 1 })}
        </button>
      )}
    </div>
  );
} 