import React, { useState, useRef, useEffect } from 'react';
import { chartPropTypes } from '@utils/proptypes';
import useStyles from './Chart.styles';

import Dygraph from 'dygraphs';
import getChartOptions from '@utils/options';

const Chart = ({ data, options }) => {
  const classes = useStyles();

  const [chart, setChart] = useState(null);
  const [hiddenGraph, hideGraph] = useState(true);

  let graphContainer = useRef(null);
  let labelsDiv = useRef(null);

  useEffect(() => {
    if (graphContainer && data.length) {
      setChart(
        new Dygraph(graphContainer.current, data, { ...getChartOptions({ labelsDiv, ...options }) })
      );

      if (chart) {
        hideGraph(false);
      }
    } else {
      hideGraph(true);
    }

    return () => {};
  }, [graphContainer.current, labelsDiv.current]);

  let legendClass = 'legend_hover';

  return (
    <div className={classes.container}>
      <div className="chart_container_graph">
        <div
          ref={graphContainer}
          style={{
            height: chart ? '400px' : '0',
            opacity: hiddenGraph ? 0 : 1,
            margin: '0 auto',
            width: 'auto'
          }}
          className={classes.graphStyles}
        />
        <div className={classes[legendClass]} ref={labelsDiv} style={chart ? {} : { opacity: 0 }} />
      </div>
      {hiddenGraph && <div>No data available for any serie</div>}
    </div>
  );
};

Chart.propTypes = {
  ...chartPropTypes
};

export default Chart;
