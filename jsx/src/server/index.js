import * as jahiaComponents from './components';
import * as jahiaTemplates from './templates';
import * as jahiaViews from './views';
import {registerJahiaComponents} from '@jahia/js-server-engine';

registerJahiaComponents(jahiaComponents);
registerJahiaComponents(jahiaTemplates);
registerJahiaComponents(jahiaViews);
