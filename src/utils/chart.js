import React from 'react';
import ReactDOMServer from 'react-dom/server';
// import ChartLegend from './legend/chart_legend';
import Dygraph from 'dygraphs';
// import { Random } from 'meteor/random';
import moment from 'moment';
// import { GpointM } from '../../../../api/gpoint';
// import Utils from '../../../../config/utils';
// import memoizeOne from 'memoize-one';
// import AgronomeetStore from '../../../client/store';
import ChartLegendModal from '../components/ChartLegendModal/ChartLegendModal';

const stackPoints = (points, cumulativeYval, seriesExtremes, fillMethod) => {
  let lastXval = null;
  let prevPoint = null;
  let nextPoint = null;
  let nextPointIdx = -1;

  // Find the next stackable point starting from the given index.
  let updateNextPoint = function(idx) {
    // If we've previously found a non-NaN point and haven't gone past it yet,
    // just use that.
    if (nextPointIdx >= idx) return;

    // We haven't found a non-NaN point yet or have moved past it,
    // look towards the right to find a non-NaN point.
    for (let j = idx; j < points.length; ++j) {
      // Clear out a previously-found point (if any) since it's no longer
      // valid, we shouldn't use it for interpolation anymore.
      nextPoint = null;
      if (!isNaN(points[j].yval) && points[j].yval !== null) {
        nextPointIdx = j;
        nextPoint = points[j];
        break;
      }
    }
  };

  for (let i = 0; i < points.length; ++i) {
    let point = points[i];
    let xval = point.xval;
    if (cumulativeYval[xval] === undefined) {
      cumulativeYval[xval] = 0;
    }

    let actualYval = point.yval;
    if (isNaN(actualYval) || actualYval === null) {
      if (fillMethod == 'none') {
        actualYval = 0;
      } else {
        // Interpolate/extend for stacking purposes if possible.
        updateNextPoint(i);
        if (prevPoint && nextPoint && fillMethod != 'none') {
          // Use linear interpolation between prevPoint and nextPoint.
          actualYval =
            prevPoint.yval +
            (nextPoint.yval - prevPoint.yval) *
              ((xval - prevPoint.xval) / (nextPoint.xval - prevPoint.xval));
        } else if (prevPoint && fillMethod == 'all') {
          actualYval = prevPoint.yval;
        } else if (nextPoint && fillMethod == 'all') {
          actualYval = nextPoint.yval;
        } else {
          actualYval = 0;
        }
      }
    } else {
      prevPoint = point;
    }

    let stackedYval = cumulativeYval[xval];
    if (lastXval != xval) {
      // If an x-value is repeated, we ignore the duplicates.
      stackedYval += actualYval;
      cumulativeYval[xval] = stackedYval;
    }
    lastXval = xval;

    point.yval_stacked = stackedYval;

    if (stackedYval > seriesExtremes[1]) {
      seriesExtremes[1] = stackedYval;
    }
    if (stackedYval < seriesExtremes[0]) {
      seriesExtremes[0] = stackedYval;
    }
  }
};

const ChartUtils = {
  getDefaultOptions: ({ dispatch = null, timezone, chart_type } /*chartOptions*/) => {
    let legend_id = Date.now(); //get random id
    return {
      drawHighlightPointCallback: function(g, name, ctx, cx, cy, color, radius) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = '#FFF';
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
      },
      legend: 'follow',
      legendFormatter: data => {
        if (dispatch) {
          dispatch({
            type: 'CHANGE_DATA',
            data: { ...data, timezone }, // chartOptions
            legend_id: legend_id
          });
        }

        //   let parseDateAsString = chartOptions
        //       ? chartOptions.comparison === 'xAxisFromDate' || chartOptions.comparison === 'xAxisFromMarker'
        //       : false;

        return ReactDOMServer.renderToString(
          <ChartLegendModal data={data} timezone={timezone} parseDateAsString={false} />
        );
      },
      highlightSeriesOpts: {},
      xRangePad: 15,
      yRangePad: 15,
      drawGapEdgePoints: true,
      highlightSeriesBackgroundAlpha: chart_type === 'multi_column' ? 1 : 0.3,
      animatedZooms: true,
      // showRangeSelector: true,
      // showInRangeSelector: true,
      // rangeSelectorPlotFillColor: '#21b97d',
      // rangeSelectorPlotFillGradientColor: '#7ac746',
      // rangeSelectorPlotStrokeColor: '#000',
      underlayCallback: (canvas, area, dygraph) => {
        var future_coords = dygraph.toDomCoords(new Date(moment().unix() * 1000).getTime(), 0);

        var splitX = future_coords[0];

        // The drawing area doesn't start at (0, 0), it starts at (area.x, area.y).
        // That's why we subtract them from splitX and splitY. This gives us the
        // actual distance from the upper-left hand corder of the graph itself.
        var leftSideWidth = splitX - area.x;
        var rightSideWidth = area.w - leftSideWidth;

        canvas.fillStyle = '#f2f2f2';
        canvas.fillRect(splitX, area.y, rightSideWidth, canvas.canvas.clientHeight);
      }
    };
  },
  barChartPlotter(e) {
    var ctx = e.drawingContext;
    var points = e.points;
    var y_bottom = e.dygraph.toDomYCoord(0);

    ctx.fillStyle = darkenColor(e.color);

    // Find the minimum separation between x-values.
    // This determines the bar width.
    var min_sep = Infinity;
    for (var i = 1; i < points.length; i++) {
      var sep = points[i].canvasx - points[i - 1].canvasx;
      if (sep < min_sep) min_sep = sep;
    }
    var bar_width = Math.floor((2.0 / 3) * min_sep);

    // Do the actual plotting.
    for (var j = 0; j < points.length; j++) {
      var p = points[j];
      var center_x = p.canvasx;

      ctx.fillRect(center_x - bar_width / 2, p.canvasy, bar_width, y_bottom - p.canvasy);

      ctx.strokeRect(center_x - bar_width / 2, p.canvasy, bar_width, y_bottom - p.canvasy);
    }
  },
  barChartPlotterY2(e) {
    var ctx = e.drawingContext;
    var points = e.points.filter(e => e.yval);
    var y_bottom = e.dygraph.toDomYCoord(0, 1);

    ctx.fillStyle = darkenColor(e.color);

    // Find the minimum separation between x-values.
    // This determines the bar width.
    var min_sep = Infinity;
    for (var i = 1; i < points.length; i++) {
      var sep = points[i].canvasx - points[i - 1].canvasx;
      if (sep < min_sep) min_sep = sep;
    }
    var bar_width = Math.floor((2.0 / 3) * min_sep);

    // Do the actual plotting.
    for (var j = 0; j < points.length; j++) {
      var p = points[j];
      var center_x = p.canvasx;

      ctx.fillRect(center_x - bar_width / 2, p.canvasy, bar_width, y_bottom - p.canvasy);

      ctx.strokeRect(center_x - bar_width / 2, p.canvasy, bar_width, y_bottom - p.canvasy);
    }
  },
  multiColumnBarPlotter(e) {
    // We need to handle all the series simultaneously.
    if (e.seriesIndex !== 0) return;

    let g = e.dygraph;
    let ctx = e.drawingContext;
    let sets = e.allSeriesPoints;
    let y_bottom = e.dygraph.toDomYCoord(0);

    // Find the minimum separation between x-values.
    // This determines the bar width.
    let min_sep = Infinity;
    for (let j = 0; j < sets.length; j++) {
      let points = sets[j];
      for (let i = 1; i < points.length; i++) {
        let sep = points[i].canvasx - points[i - 1].canvasx;
        if (sep < min_sep) min_sep = sep;
      }
    }
    let bar_width = Math.floor((2.0 / 3) * min_sep);
    let fillColors = [];
    let strokeColors = g.getColors();

    if (sets.length === 1) {
      let color = strokeColors[0];
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      for (let count = 0; count < sets[0].length; count++) {
        let p = sets[0][count];
        let center_x = p.canvasx;
        let x_left = center_x - bar_width / 2;

        ctx.fillRect(x_left, p.canvasy, bar_width / sets.length, y_bottom - p.canvasy);

        ctx.strokeRect(x_left, p.canvasy, bar_width / sets.length, y_bottom - p.canvasy);
      }
    } else {
      for (let x = 0; x < strokeColors.length; x++) {
        fillColors.push(darkenColor(strokeColors[x]));
      }

      for (let q = 0; q < sets.length; q++) {
        ctx.fillStyle = fillColors[q];
        ctx.strokeStyle = strokeColors[q];
        for (let w = 0; w < sets[q].length; w++) {
          let p = sets[q][w];
          let center_x = p.canvasx;
          let x_left = center_x - (bar_width / 2) * (1 - q / (sets.length - 1));

          ctx.fillRect(x_left, p.canvasy, bar_width / sets.length, y_bottom - p.canvasy);

          ctx.strokeRect(x_left, p.canvasy, bar_width / sets.length, y_bottom - p.canvasy);
        }
      }
    }
  },
  //extracting and reducing the Dygraph.stackPoints_ function
  stackedBarChartPlotter(e) {
    const calcYNormal_ = (axis, value, logscale) => {
      if (logscale) {
        var x = 1.0 - (Math.log10(value) - Math.log10(axis.minyval)) * axis.ylogscale;
        return isFinite(x) ? x : NaN; // shim for v8 issue; see pull request 276
      } else {
        return 1.0 - (value - axis.minyval) * axis.yscale;
      }
    };
    // We need to handle all the series simultaneously.
    if (e.seriesIndex !== 0) return;

    let g = e.dygraph;
    let ctx = e.drawingContext;
    let sets = e.allSeriesPoints;
    let y_bottom = e.dygraph.toDomYCoord(0);

    let setNames = g.getLabels().slice(1); // remove x-axis

    let points = e.points;
    let minIdx = Infinity;

    let fillColors = [];
    let strokeColors = g.getColors();
    for (let i = 0; i < strokeColors.length; i++) {
      fillColors.push(strokeColors[i]);
    }

    let seriesExtremes = [];

    let tmpExtremes = [];
    tmpExtremes[0] = Infinity;
    tmpExtremes[1] = -Infinity;
    for (let j = 0; j < sets.length; j++) {
      seriesExtremes.push(tmpExtremes);
    }

    // Find the minimum separation between x-values.
    // This determines the bar width.
    points = sets[0];

    let min_sep = Infinity;
    for (let i = 1; i < points.length; i++) {
      let sep = points[i].canvasx - points[i - 1].canvasx;
      if (sep < min_sep) min_sep = sep;
    }
    let bar_width = Math.floor((2.0 / 3) * min_sep);

    // set up cumulative records
    let cumulativeYval = [];
    let packed = g.gatherDatasets_(g.rolledSeries_, null);
    let extremes = packed.extremes;
    let seriesName;

    for (let j = sets.length - 1; j >= 0; j--) {
      points = sets[j];
      seriesName = setNames[j];

      //  stack the data
      stackPoints(
        points,
        cumulativeYval,
        seriesExtremes[j],
        g.getBooleanOption('stackedGraphNaNFill')
      );

      extremes[seriesName] = seriesExtremes[j];
    }

    // There is currently no way to update the axes height from inside the plotter...
    // Will have to wait until update can be made to underlying dygraphs lib
    // Preferring to do issue or pull request to main library on github instead of modifying here
    // g.computeYAxisRanges_(extremes);
    // g.layout_.setYAxes(g.axes_);
    let axis;
    let logscale;
    let connectSeparated;

    // Do the actual plotting.
    for (let j = 0; j < sets.length; j++) {
      seriesName = setNames[j];
      connectSeparated = g.getOption('connectSeparatedPoints', seriesName);
      logscale = g.attributes_.getForSeries('logscale', seriesName);

      axis = g.axisPropertiesForSeries(seriesName);

      points = sets[j];

      for (let i = 0; i < points.length; i++) {
        let point = points[i];

        let yval = point.yval;

        point.y_stacked = calcYNormal_(axis, point.yval_stacked, logscale);

        if (yval !== null && !isNaN(yval)) {
          yval = point.yval_stacked;
        }
        if (yval === null) {
          yval = NaN;
          if (!connectSeparated) {
            point.yval = NaN;
          }
        }
        point.y = calcYNormal_(axis, yval, logscale);

        point.canvasx = g.plotter_.area.w * point.x + g.plotter_.area.x;
        point.canvasy = g.plotter_.area.h * point.y + g.plotter_.area.y;

        let center_x = point.canvasx;

        ctx.fillStyle = fillColors[j];
        ctx.strokeStyle = fillColors[j];

        ctx.fillRect(center_x - bar_width / 2, point.canvasy, bar_width, y_bottom - point.canvasy);

        ctx.strokeRect(
          center_x - bar_width / 2,
          point.canvasy,
          bar_width,
          y_bottom - point.canvasy
        );
      }
    }
  },
  customBarPlotter(e) {
    // We need to handle all the series simultaneously.
    if (e.seriesIndex !== 0) return;

    let current_series = e.dygraph.user_attrs_.series;
    let current_serie = current_series[e.singleSeriesName];
    let current_bar_series = Object.values(current_series).map(e => e.isBar);

    var g = e.dygraph;
    var ctx = e.drawingContext;

    // filter series with isBar TODO
    var sets = e.allSeriesPoints;

    var y_bottom = e.dygraph.toDomYCoord(0);

    // Find the minimum separation between x-values.
    // This determines the bar width.
    var min_sep = Infinity;
    for (var j = 0; j < sets.length; j++) {
      var points = sets[j];
      for (var i = 1; i < points.length; i++) {
        var sep = points[i].canvasx - points[i - 1].canvasx;
        if (sep < min_sep) min_sep = sep;
      }
    }
    var bar_width = Math.floor((2.0 / 3) * min_sep);

    var fillColors = [];
    var strokeColors = g.getColors();
    for (var x = 0; x < strokeColors.length; x++) {
      fillColors.push(darkenColor(strokeColors[x]));
    }

    for (var q = 0; q < sets.length; q++) {
      if (current_bar_series[q]) {
        ctx.fillStyle = fillColors[q];
        ctx.strokeStyle = strokeColors[q];
      } else {
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = 'transparent';
      }
      for (var w = 0; w < sets[q].length; w++) {
        // e.dygraph.user_attrs_.series !!!
        // check if isBar is true finding it from e.singleSeriesName or e.setName

        if (current_serie && current_serie.isBar) {
          var p = sets[q][w];
          var center_x = p.canvasx;
          var x_left = center_x - (bar_width / 2) * (1 - q / (sets.length - 1));

          ctx.fillRect(x_left, p.canvasy, bar_width / sets.length, y_bottom - p.canvasy);

          ctx.strokeRect(x_left, p.canvasy, bar_width / sets.length, y_bottom - p.canvasy);
        }
      }
    }
  },
  // Usage:

  // x0,y0: the line's starting point
  // x1,y1: the line's ending point
  // width: the distance the arrowhead perpendicularly extends away from the line
  // height: the distance the arrowhead extends backward from the endpoint
  // arrowStart: true/false directing to draw arrowhead at the line's starting point
  // arrowEnd: true/false directing to draw arrowhead at the line's ending point

  // drawLineWithArrows(x0, y0, x1, y1, aWidth, aLength, arrowStart, arrowEnd) {
  //   // drawLineWithArrows(50,50,150,50,5,8,true,true);
  //   var dx = x1 - x0;
  //   var dy = y1 - y0;
  //   var angle = Math.atan2(dy, dx);
  //   var length = Math.sqrt(dx * dx + dy * dy);
  //   //
  //   ctx.translate(x0, y0);
  //   ctx.rotate(angle);
  //   ctx.beginPath();
  //   ctx.moveTo(0, 0);
  //   ctx.lineTo(length, 0);
  //   if (arrowStart) {
  //     ctx.moveTo(aLength, -aWidth);
  //     ctx.lineTo(0, 0);
  //     ctx.lineTo(aLength, aWidth);
  //   }
  //   if (arrowEnd) {
  //     ctx.moveTo(length - aLength, -aWidth);
  //     ctx.lineTo(length, 0);
  //     ctx.lineTo(length - aLength, aWidth);
  //   }
  //   //
  //   ctx.stroke();
  //   ctx.setTransform(1, 0, 0, 1, 0, 0);
  // },
  // timeShift(gpoints, time_shift) {
  //     return gpoints.map((elem, index) => {
  //         if (!time_shift) return elem;
  //         return {
  //             ...elem,
  //             serie:
  //                 elem.serie &&
  //                 elem.serie.map(point => {
  //                     return [
  //                         moment(point[0])
  //                             .add(time_shift[index])
  //                             .toDate(),
  //                         point[1]
  //                     ];
  //                 }),
  //             series:
  //                 elem.series &&
  //                 elem.series.map(point => {
  //                     point[0] = moment(point[0])
  //                         .add(time_shift[index])
  //                         .toDate();

  //                     return [...point];
  //                 }),
  //             serieImages:
  //                 elem.serieImages &&
  //                 elem.serieImages.map(point => {
  //                     return [
  //                         moment(point[0])
  //                             .add(time_shift[index])
  //                             .toDate(),
  //                         point[1]
  //                     ];
  //                 }),
  //             serieText:
  //                 elem.serieText &&
  //                 elem.serieText.map(point => {
  //                     return [
  //                         moment(point[0])
  //                             .add(time_shift[index])
  //                             .toDate(),
  //                         point[1]
  //                     ];
  //                 })
  //         };
  //     });
  // },
  defaultChart: {
    title: '',
    desc: '',
    chart_type: '',
    addToHome: null,
    comparison: 'none',
    data_config: 'default',
    custom_choice: null,
    chart_settings: {
      legendType: 'always',
      xlabel: '',
      ylabel: ''
    },
    series: []
  },
  zoomOutOnRange: {
    activate: function(g) {
      // Save the initial y-axis range for later.
      const initialValueRange = g.getOption('valueRange');
      return {
        dblclick: e => {
          e.dygraph.updateOptions({
            dateWindow: null, // zoom all the way out
            valueRange: initialValueRange // zoom to a specific y-axis range.
          });
          e.preventDefault(); // prevent the default zoom out action.
        }
      };
    }
  },
  getTimezoneFormattedLabel: (x, granularity, timezone) => {
    if (granularity >= 23) {
      return moment(x)
        .tz(timezone)
        .format('MMM YYYY');
    }
    if (granularity < 23 && granularity >= 20) {
      return moment(x)
        .tz(timezone)
        .format('DD MMM');
    }
    if (granularity < 20 && granularity >= 19) {
      return moment(x)
        .tz(timezone)
        .format('DD MMM HH:mm');
    }
    if (granularity < 19 && granularity >= 12) {
      return moment(x)
        .tz(timezone)
        .format('HH:mm');
    }
    if (granularity < 12 && granularity >= 7) {
      return moment(x)
        .tz(timezone)
        .format('HH:mm:ss');
    }
    if (granularity < 7) {
      return moment(x)
        .tz(timezone)
        .format('HH:mm:ss:SSS');
    }

    return moment(x)
      .tz(timezone)
      .format();
  }
};

const darkenColor = colorStr => {
  var color = Dygraph.toRGB_(colorStr);
  color.r = Math.floor((255 + color.r) / 2);
  color.g = Math.floor((255 + color.g) / 2);
  color.b = Math.floor((255 + color.b) / 2);
  return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
};

export default ChartUtils;
