import ChartUtils from '@utils/chart';
import moment from 'moment';
import Dygraph from 'dygraphs';

const getSimpleOptions = ({ labelsDiv }) => {
  return {
    ...ChartUtils.getDefaultOptions(),
    labels: ['Date', 'value'],
    labelsDiv: labelsDiv.current,
    labelsUTC: true,
    connectSeparatedPoints: true,
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
      }
    }
    // ...(timezone && {
    //   title: `TIMEZONE: UTC ${moment.tz(timezone).format('Z')}`,
    //   titleHeight: 25
    // })
  };
};

export default getSimpleOptions;
