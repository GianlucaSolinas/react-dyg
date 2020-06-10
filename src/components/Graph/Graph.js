import React from 'react';
import PropTypes from 'prop-types';

import useStyles from './Graph.styles';

const Graph = ({ chart, onChartRef, onLegendRef, hiddenGraph }) => {
  let chartStyle = {
    height: chart ? '400px' : '0',
    opacity: hiddenGraph ? 0 : 1,
    margin: '0 auto',
    width: 'auto'
  };

  let legendClass = 'legend_hover';
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className="chart_container_graph">
        <div ref={onChartRef} style={chartStyle} />
        <div className={legendClass} ref={onLegendRef} style={chart ? {} : { opacity: 0 }} />
      </div>
    </div>
  );
};

Graph.propTypes = {
  chart: PropTypes.object,
  onChartRef: PropTypes.func,
  onLegendRef: PropTypes.func,
  hiddenGraph: PropTypes.bool
};

export default Graph;
