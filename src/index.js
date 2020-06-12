import { create } from 'jss';
import globalPlugin from 'jss-global';
import camelCase from 'jss-plugin-camel-case';
import composePlugin from 'jss-plugin-compose';

import Chart from './components/Chart/Chart';
import SingleChart from './components/SingleChart/SingleChart';

const jss = create();
jss.use(globalPlugin(), composePlugin(), camelCase());

export { Chart, SingleChart };
