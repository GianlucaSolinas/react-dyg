import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dygraph from 'dygraphs';
import useStyles from './Chart.styles';
import getChartOptions from './options';
import getSimpleOptions from './simple_options';

const Chart = ({ data, advanced }) => {
  const classes = useStyles();

  const [chart, setChart] = useState(null);
  const [hiddenGraph, hideGraph] = useState(true);

  let graphContainer = useRef(null);
  let labelsDiv = useRef(null);

  useEffect(() => {
    if (graphContainer && data.length) {
      setChart(
        new Dygraph(
          graphContainer.current,
          data,
          advanced ? { ...getChartOptions({ labelsDiv }) } : { ...getSimpleOptions({ labelsDiv }) }
        )
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
        />
        <div className={classes[legendClass]} ref={labelsDiv} style={chart ? {} : { opacity: 0 }} />
      </div>
      {hiddenGraph && <div>Data is not available or the serie is empty</div>}
    </div>
  );
};

Chart.propTypes = {
  data: PropTypes.array,
  advanced: PropTypes.object
};

export default Chart;
