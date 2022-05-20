import component from './es-ES/component';
import globalHeader from './es-ES/globalHeader';
import menu from './es-ES/menu';
import pages from './es-ES/pages';
import pwa from './es-ES/pwa';
import settingDrawer from './es-ES/settingDrawer';
import settings from './es-ES/settings';
export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'Ayuda',
  'layout.user.link.privacy': 'Condiciones',
  'layout.user.link.terms': 'Terminos',
  'app.copyright.produced': 'Producido por Tony Ojeda',
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
