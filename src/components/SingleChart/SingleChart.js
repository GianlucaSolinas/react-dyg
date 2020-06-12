import React, { useState, useRef, useEffect } from 'react';
import useStyles from './SingleChart.styles';
import classnames from 'classnames';

import Dygraph from 'dygraphs';
import getSimpleOptions from '@utils/simple_options';
import { chartPropTypes } from '@utils/proptypes';

const SingleChart = ({ data, options }) => {
  const classes = useStyles();

  const [chart, setChart] = useState(null);
  const [hiddenGraph, hideGraph] = useState(true);

  let graphContainer = useRef(null);
  let labelsDiv = useRef(null);

  useEffect(() => {
    if (graphContainer && data.length) {
      setChart(
        new Dygraph(graphContainer.current, data, {
          ...getSimpleOptions({ labelsDiv, ...options })
        })
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
    <div className={classnames(classes.container)}>
      <div className="chart_container_graph">
        <div
          className={classes.graphStyles}
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

SingleChart.propTypes = {
  ...chartPropTypes
};

export default SingleChart;
