import React from 'react';
import PropTypes from 'prop-types';
import { create } from 'jss';
import globalPlugin from 'jss-global';
import camelCase from 'jss-plugin-camel-case';

import Chart from './components/Chart/Chart';

const jss = create();
jss.use(globalPlugin(), camelCase());

// const datatest = [
//   [new Date(1591563163000), 15],
//   [new Date(1591674163000), 20],
//   [new Date(1591685163000), 25],
//   [new Date(1591796163000), 30]
// ];

const App = ({ data, advanced = null }) => <Chart data={data} advanced={advanced} />;

App.propTypes = {
  data: PropTypes.array,
  advanced: PropTypes.object
};

export default App;
