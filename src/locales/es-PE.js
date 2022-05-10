import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pages from './en-US/pages';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Condiciones',
  'layout.user.link.terms': 'Terminos',
  'app.copyright.produced': 'Produced by Ant Financial Experience Department',
  'app.preview.down.block': 'Descarga esta página a tu proyecto loc',
  'app.welcome.link.fetch-blocks': 'Obtener todo el bloque',
  'app.welcome.link.block-list': 'Cree rápidamente páginas estándar basadas en el desarrollo de `bloques`',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
