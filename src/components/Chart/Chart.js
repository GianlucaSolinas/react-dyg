import React, { useState, useRef, useEffect, useReducer } from 'react';
import { chartPropTypes } from '@utils/proptypes';
import useStyles from './Chart.styles';

import Dygraph from 'dygraphs';
import getChartOptions from '@utils/options';
import ChartLegend from '@components/ChartLegend/ChartLegend';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_DATA':
      return { ...state, data: { ...action.data }, legend_id: action.legend_id };
    case 'ACTIVATE':
      return { ...state, active: true };
    case 'DEACTIVATE':
      return { ...state, active: false, legend_id: null };
    default:
      throw { ...state };
  }
};

const Chart = ({ data, options }) => {
  const classes = useStyles();

  const [chart, setChart] = useState(null);
  const [hiddenGraph, hideGraph] = useState(true);
  const [loading, setLoading] = useState(true);

  const [state, dispatch] = useReducer(reducer, { data: {} });

  let graphContainer = useRef(null);
  let labelsDiv = useRef(null);

  useEffect(() => {
    if (graphContainer && data.length) {
      setLoading(true);
      setChart(
        new Dygraph(graphContainer.current, data, {
          ...getChartOptions({ labelsDiv, ...options, chart, dispatch })
        })
      );

      if (chart) {
        setLoading(false);
        hideGraph(false);
      }
    } else {
      setLoading(false);
      hideGraph(true);
    }

    return () => {};
  }, [graphContainer.current, labelsDiv.current]);

  let legendClass = 'legend_hover';

  return (
    <div>
      {loading && <div>Loading...</div>}
      <div className={classes.container} /*className="chart_container_graph"*/>
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
      {!hiddenGraph && (
        <ChartLegend
          data={state.data}
          legend_id={Date.now()}
          dispatch={dispatch}
          chartOptions={options}
        />
      )}
      {!loading && hiddenGraph && (
        <div className={classes.infopanel}>
          <span className={classes.infoicon}>
            <i className="fas fa-info-circle" />
          </span>
          No data available for the selected range.
        </div>
      )}
    </div>
  );
};

Chart.propTypes = {
  ...chartPropTypes
};

export default Chart;
