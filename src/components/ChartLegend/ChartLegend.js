import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import useStyles from './ChartLegend.styles';
// import FullscreenLoader from '../../loader/fullscreenLoader';
// import Utils from '../../../../../config/utils';

const memoize = {
  add: function(id, data) {
    this[id] = data;
  },
  get: function(id) {
    return this[id];
  },
  setLastPoints: function(id, index, date, value) {
    this[`${id}_last_${index}`] = { date: date, value: value };
  },
  getLastPoints: function(id, index) {
    return this[`${id}_last_${index}`] || { date: '', value: '--' };
  }
};

const ChartLegend = ({ data = {}, legend_id, timezone, chartOptions = {}, dispatch }) => {
  const classes = useStyles();

  if (!data.x && memoize.get(legend_id)) {
    data = memoize.get(legend_id);
  }

  let parseDateAsString =
    chartOptions.comparison === 'xAxisFromDate' || chartOptions.comparison === 'xAxisFromMarker';
  let markerDate = null;

  const onLabelChange = (label, index) => {
    let old_label = null;

    let new_labels = data.dygraph.getLabels().map((el, idx) => {
      // dygraph.getlabels returns ['Date', ...labels]
      if (index === idx - 1) {
        old_label = `${el}`;
        el = `${label}`;
      }
      return el;
    });

    let old_series = data.dygraph.getOption('series');

    let new_series = Object.keys(old_series).reduce((acc, key) => {
      if (key === old_label) {
        acc[label] = { ...old_series[key] };
      } else {
        acc[key] = { ...old_series[key] };
      }
      return acc;
    }, {});

    delete new_series[old_label];

    data.dygraph.updateOptions({
      labels: new_labels,
      series: new_series
    });
  };

  // keep last legend data, so when the mouse leaves the chart, last shown data remains
  memoize.add(legend_id, data);

  if (chartOptions.comparison === 'xAxisFromDate') {
    markerDate = moment.tz(chartOptions.markerFromDate, timezone).format('DD/MM/YYYY HH:mm');
  }

  return (
    <div className={classes.container}>
      {data.series /*&& !Utils.isObjetEmpty(chartOptions)*/ ? (
        <Points
          data={data}
          legend_id={legend_id}
          timezone={timezone}
          chartOptions={chartOptions}
          parseDateAsString={parseDateAsString}
          markerDate={markerDate}
          onLabelChange={onLabelChange}
          dispatch={dispatch}
        />
      ) : (
        // <FullscreenLoader text="Loading chart" />
        <div>Hover cursor inside chart to show data</div>
      )}
    </div>
  );
};

ChartLegend.propTypes = {
  data: PropTypes.object,
  legend_id: PropTypes.number,
  timezone: PropTypes.any,
  chartOptions: PropTypes.object,
  dispatch: PropTypes.func
};

const Points = ({
  data,
  legend_id,
  timezone,
  // chartOptions,
  parseDateAsString,
  // markerDate,
  onLabelChange
  // dispatch
}) => {
  // const classes = useStyles();

  const { dygraph } = data;
  const [lockedSerie, setLocked] = useState(null);

  const visibility = dygraph.visibility();

  const toggleLock = (serieIndex, x, label) => {
    dygraph.setVisibility(serieIndex, true);

    if (serieIndex === lockedSerie) {
      setLocked(null);
      dygraph.clearSelection();
    } else {
      setLocked(serieIndex);
      dygraph.setSelection(x, label, true);
    }
  };

  useEffect(() => {
    return () => {
      setLocked(null);
    };
  }, [dygraph]);

  // after zoom out, clearSelection is called (by dygraph itself) so we need to set lockedSerie to null
  if (!dygraph.isSeriesLocked() && lockedSerie !== null) {
    setLocked(null);
  }

  return (
    <div className="form_row_margin">
      {/* <div className={classes.chart_title}>
        <div className="txt_right">
          <small
            className="icon-hover icon-margin"
            onClick={() => dispatch({ type: 'DEACTIVATE' })}
          >
            CLOSE
          </small>
        </div>
        <h3>{chartOptions.title}</h3>
        {markerDate && (
          <div className={classes.dayzero}>
            <small>Day zero: {markerDate}</small>
          </div>
        )}
      </div> */}
      <div>
        {checkSameValue(data.series).map((v, index) => {
          let style = { color: v.color };

          // let linkToSerie = chartOptions.dataseries.find(el => {
          //   return el.title === v.label || el.serieLabel === v.label;
          // });
          let linkToSerie = null;

          let isHighlighted = v.isHighlighted;

          const isVisible = visibility[index];
          const isLocked = lockedSerie === index;

          if (v.yHTML === undefined) {
            let nearestPoint = memoize.getLastPoints(legend_id, index);

            if (!nearestPoint) {
              return '';
            }

            return (
              <ValueRenderer
                key={index}
                {...{
                  index,
                  isHighlighted,
                  isVisible,
                  style,
                  v,
                  parseDateAsString,
                  data: { ...nearestPoint, label: v.label },
                  timezone,
                  dygraph,
                  isLocked,
                  toggleLock,
                  x: parseDateAsString
                    ? data.x
                    : moment.tz(nearestPoint.date, 'DD/MM/YYYY HH:mm Z', timezone).unix(),
                  linkToSerie,
                  onLabelChange
                }}
              />
            );
          } else {
            memoize.setLastPoints(legend_id, index, data.xHTML, v.yHTML);

            return (
              <ValueRenderer
                key={index}
                {...{
                  index,
                  isHighlighted,
                  isVisible,
                  style,
                  v,
                  parseDateAsString,
                  data: { date: data.xHTML, value: v.yHTML, label: v.label },
                  timezone,
                  dygraph,
                  isLocked,
                  toggleLock,
                  x: parseDateAsString ? data.x : data.x,
                  linkToSerie,
                  onLabelChange
                }}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

Points.propTypes = {
  data: PropTypes.object,
  legend_id: PropTypes.number,
  timezone: PropTypes.any,
  chartOptions: PropTypes.object,
  dispatch: PropTypes.func,
  parseDateAsString: PropTypes.any,
  markerDate: PropTypes.any,
  onLabelChange: PropTypes.any
};

const ValueRenderer = ({
  index,
  isHighlighted,
  style,
  isVisible,
  parseDateAsString,
  data,
  timezone,
  dygraph,
  isLocked,
  toggleLock,
  x,
  linkToSerie
  // onLabelChange,
}) => {
  const classes = useStyles();

  const [edit, toggleEdit] = useState(false);
  const [label, editLabel] = useState(data.label);

  useEffect(() => {
    editLabel(data.label);

    return () => {
      toggleEdit(false);
    };
  }, [data]);

  const changeLabel = () => {
    // Meteor.call('Dataserie.changeLabel', linkToSerie._id, label, (err, res) => {
    //   onLabelChange(label, index);
    //   toggleEdit(false);
    // });
  };

  const readonly = false;

  return (
    <div key={index} className={classNames(classes.chart_row, { highlighted: isHighlighted })}>
      <div style={style} className={classes.chart_label}>
        {edit ? (
          <div>
            <input
              ref={ref => ref && ref.focus()}
              type="text"
              defaultValue={label}
              className="form_input form_input--small"
              onChange={e => editLabel(e.target.value)}
            />
            <i
              className="fas fa-times icon-hover icon-margin inline_block"
              style={{ color: 'red' }}
              onClick={() => {
                editLabel(data.label);
                toggleEdit(false);
              }}
            />
            <i
              className="fas fa-check icon-hover icon-margin inline_block"
              style={{ color: 'green' }}
              onClick={changeLabel}
            />
          </div>
        ) : (
          <span
          // className="icon-hover"
          // onClick={() => {
          //   if (!readonly) {
          //     toggleEdit(true);
          //   }
          // }}
          // title="Click to edit name"
          >
            {label}
          </span>
        )}
      </div>
      {isVisible && (
        <div className={classes.value_container}>
          <div className={classes.chart_date}>
            {parseDateAsString
              ? data.date
              : moment.tz(data.date, 'DD/MM/YYYY HH:mm Z', timezone).isValid()
              ? moment.tz(data.date, 'DD/MM/YYYY HH:mm Z', timezone).format('DD/MM/YYYY HH:mm')
              : ''}
          </div>
          <div className={classes.chart_value}>{data.value}</div>
        </div>
      )}
      <div className={classes.actions_container}>
        {!readonly && (
          <div
            className={classes.action_container}
            onClick={() => {
              if (isLocked) toggleLock(index);
              dygraph.setVisibility(index, !isVisible);
            }}
          >
            <i
              className={classNames('fas fa-lg icon-hover icon-margin inline_block', {
                'fa-eye': isVisible,
                'fa-eye-slash': !isVisible
              })}
              title={isVisible ? 'Hide' : 'Show'}
            />
            <div className={classes.action_text}>{isVisible ? 'HIDE' : 'SHOW'}</div>
          </div>
        )}

        {isVisible && !readonly && (
          <div
            className={classes.action_container}
            onClick={() => toggleLock(index, dygraph.getRowForX(moment(x)), data.label)}
          >
            <i
              className={classNames('fas fa-lg icon-hover icon-margin inline_block', {
                'fa-lock': isLocked,
                'fa-lock-open': !isLocked
              })}
              title={isLocked ? 'Unlock' : 'Lock'}
            />
            <div className={classes.action_text}>{isLocked ? 'UNLOCK' : 'LOCK'}</div>
          </div>
        )}
        {linkToSerie && (
          <i
            className={classNames('fas icon-hover icon-margin inline_block fa-external-link-alt')}
            // onClick={() => Utils.goToSerie(linkToSerie._id)}
            title="Go to serie"
          />
        )}
      </div>
    </div>
  );
};

ValueRenderer.propTypes = {
  index: PropTypes.any,
  isHighlighted: PropTypes.bool,
  style: PropTypes.object,
  isVisible: PropTypes.bool,
  parseDateAsString: PropTypes.bool,
  data: PropTypes.obj,
  timezone: PropTypes.any,
  dygraph: PropTypes.any,
  isLocked: PropTypes.bool,
  toggleLock: PropTypes.func,
  x: PropTypes.any,
  linkToSerie: PropTypes.any
};

// const getNearestPoint = (currentDate, data, index) => {
//   if (currentDate) {
//     let closest = Infinity;

//     let allData = data.dygraph.file_;

//     return allData
//       .filter(elem => {
//         // get dates where this serie is not null
//         let elemDate = moment(elem[0]);

//         return (
//           elem[index + 1] !== null && Math.abs(currentDate.diff(elemDate)) <= 1000 * 60 * 60 * 24
//         );
//       })
//       .reduce((a, b) => {
//         let elemDate = moment(b[0]);
//         // show most recent values
//         let date = data.x ? moment(data.x) : moment();

//         let diff = Math.abs(date.diff(elemDate));

//         if (diff < closest) {
//           let val = b[index + 1] % 1 === 0 ? b[index + 1] : Number(b[index + 1]).toFixed(2);
//           a = { date: data.dygraph.user_attrs_.axes.x.valueFormatter(b[0]), value: val };
//           closest = diff;
//         }
//         return a;
//       }, {});
//   } else {
//     return {};
//   }
// };

const checkSameValue = arr => {
  let highlighted = arr.find(v => v.isHighlighted);

  if (!highlighted) return arr;

  return arr.map(el => {
    if (Number(el.y) && Number(highlighted.y)) {
      if (Number(el.y) === Number(highlighted.y)) {
        el.isHighlighted = true;
      }
    }
    return el;
  });
};

export default ChartLegend;
