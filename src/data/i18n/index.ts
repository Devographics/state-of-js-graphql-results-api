import { Locale } from '../../types'

import { default as enCommon } from './common/yml/en-US.yml'
import { default as enCSS } from './state-of-css/yml/en-US.yml'
import { default as enJS } from './state-of-js/yml/en-US.yml'
import { default as enHomepage } from './homepage/yml/en-US.yml'

import { default as itCommon } from './common/yml/it-IT.yml';
import { default as itCSS } from './state-of-css/yml/it-IT.yml';
import { default as itJS } from './state-of-js/yml/it-IT.yml';

import { default as zhCommon } from './common/yml/zh-Hans.yml';
import { default as zhCSS } from './state-of-css/yml/zh-Hans.yml';
import { default as zhJS } from './state-of-js/yml/zh-Hans.yml';

const locales: Locale[] = [
    {
        id: 'en',
        locale: 'en_US',
        label: 'English',
        stringFiles: [enCommon, enCSS, enJS, enHomepage],
    },
    {
      id: 'it',
      locale: 'it_IT',
      label: 'Italiano',
      stringFiles: [itCommon, itCSS, itJS],
    },
    {
      id: 'zh',
      locale: 'zh_ZH',
      label: '中文',
      stringFiles: [zhCommon, zhCSS, zhJS],
    },
]

export default locales
