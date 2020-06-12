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

const ChartUtils = {
  getDefaultOptions: (timezone /*chartOptions*/) => {
    // let legend_id = 12345678; //get random id
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
        //   AgronomeetStore.dispatch({
        //       type: 'CHANGE_DATA',
        //       data: { data, timezone, chartOptions },
        //       legend_id: legend_id
        //   });

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
      highlightSeriesBackgroundAlpha: 0.3,
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

    var g = e.dygraph;
    var ctx = e.drawingContext;
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
      ctx.fillStyle = fillColors[q];
      ctx.strokeStyle = strokeColors[q];
      for (var w = 0; w < sets[q].length; w++) {
        var p = sets[q][w];
        var center_x = p.canvasx;
        var x_left = center_x - (bar_width / 2) * (1 - q / (sets.length - 1));

        ctx.fillRect(x_left, p.canvasy, bar_width / sets.length, y_bottom - p.canvasy);

        ctx.strokeRect(x_left, p.canvasy, bar_width / sets.length, y_bottom - p.canvasy);
      }
    }
  },
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
