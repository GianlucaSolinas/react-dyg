import ChartUtils from '@utils/chart';
import moment from 'moment';
import Dygraph from 'dygraphs';

const getSimpleOptions = ({
  labelsDiv,
  chart_type,
  title,
  labels = ['Date', 'value'],
  dispatch,
  seriesOptions = [],
  ...rest
}) => {
  return {
    ...ChartUtils.getDefaultOptions({ chart_type }),
    labels: labels || ['Date', 'value'],
    labelsDiv: labelsDiv.current,
    labelsUTC: true,
    connectSeparatedPoints: true,
    ...(title && { title: title, titleHeight: 25 }),
    ...(chart_type === 'column' && { plotter: ChartUtils.barChartPlotter }),
    ...(chart_type === 'multi_column' && { plotter: ChartUtils.multiColumnBarPlotter }),
    ...rest,
    //   pointClickCallback: (event, p) => {
    //     if (this.props.disabled) return;
    //     if (this.props.onTimeValid) {
    //       /* check if the point is already annotated */
    //       if (p.annotation) return;

    //       var ann = {
    //         series: p.name,
    //         xval: p.xval,
    //         shortText: 'START',
    //         tickHeight: 20,
    //         text: ' :' + p.yval,
    //         cssClass: 'graph_annotation'
    //       };
    //       var anns = chart.annotations();

    //       /* only one annotation admitted */
    //       if (anns.length > 0) {
    //         anns = [];
    //       } else {
    //         anns.push(ann);
    //       }
    //       chart.setAnnotations(anns);
    //       this.addOrUpdateNonValidityPeriod(p.xval, anns.length);
    //     }
    //   },
    axes: {
      x: {
        valueFormatter: function(x) {
          // if (timezone_present) {
          //   return moment(x)
          //     .tz(timezone_present)
          //     .format('DD/MM/YYYY HH:mm Z');
          // } else {
          return moment(x).format('DD/MM/YYYY HH:mm Z');
          // }
        },
        axisLabelFormatter: (x, granularity, opts /*dygraph*/) => {
          //   // if (timezone) {
          //   //   return ChartUtils.getTimezoneFormattedLabel(x, granularity, timezone);
          //   // } else {

          return Dygraph.dateAxisLabelFormatter(x, granularity, opts);
          //   // }
        }
      },
      y: {
        valueFormatter: (x, opts, seriesName, dygraph, row, col) => {
          let serie = seriesOptions.find(({ title }) => seriesName === title);

          if (serie) {
            return `${parseFloat(x.toPrecision(2))} ${serie.symbol}`;
          } else {
            return parseFloat(x.toPrecision(2));
          }
        }
        // valueRange: [minValueRangeY, maxValueRangeY]
      },
      y2: {
        valueFormatter: (x, opts, seriesName, dygraph, row, col) => {
          let serie = seriesOptions.find(({ title }) => seriesName === title);

          if (serie) {
            return `${parseFloat(x.toPrecision(2))} ${serie.symbol}`;
          } else {
            return parseFloat(x.toPrecision(2));
          }
        },
        // valueRange: [minValueRangeY2, maxValueRangeY2],
        independentTicks: true
      }
    }
    // ...(timezone && {
    //   title: `TIMEZONE: UTC ${moment.tz(timezone).format('Z')}`,
    //   titleHeight: 25
    // })
  };
};

export default getSimpleOptions;
