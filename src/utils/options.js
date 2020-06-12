import ChartUtils from '@utils/chart';
import moment from 'moment';
import Dygraph from 'dygraphs';

const getChartOptions = ({ labelsDiv }) => {
  return {
    ...ChartUtils.getDefaultOptions(),
    labelsDiv: labelsDiv.current,
    labels: ['Date', 'value'],
    // series: series_options,
    // dateWindow: dateWindow
    //   ? dateWindow
    //   : this.props.rangeDates
    //   ? [this.props.rangeDates.from.getTime(), this.props.rangeDates.to.getTime()]
    //   : null,
    // visibility: visibleOnChart,
    // plotter: isMultiBar ? ChartUtils.multiColumnBarPlotter : null,
    // plugins: plugins,
    axes: {
      x: {
        valueFormatter: x => {
          // if (xAsNumbers) {
          //   return `${moment(x)
          //     .startOf('day')
          //     .diff(moment(firstadate * 1000), 'days')} days ${
          //     moment(x).hours() ? `${moment(x).hours()} hrs` : ''
          //   }`;
          // }
          // if (format_comparison) {
          //   return moment(x).format('DD/MM HH:mm Z');
          // }
          // if (timezone) {
          //   return moment(x)
          //     .tz(timezone)
          //     .format('DD/MM/YYYY HH:mm Z');
          // } else {
          return moment(x).format('DD/MM/YYYY HH:mm Z');
          // }
        },
        axisLabelFormatter: (x, granularity, opts /*dygraph*/) => {
          //   // if (xAsNumbers) {
          //   //   return `${moment(x)
          //   //     .startOf('day')
          //   //     .diff(moment(firstadate * 1000), 'days')} ${
          //   //     moment(x).hours() ? `days ${moment(x).hours()} hrs` : ''
          //   //   }`;
          //   // }

          //   // if (format_comparison) {
          //   //   return Dygraph.dateAxisLabelFormatter(x, granularity, opts)
          //   //     .replace(`;${moment().year()}`, '')
          //   //     .replace(`;${moment().year() + 1}`, '');
          //   // }

          //   // if (timezone) {
          //   //   return ChartUtils.getTimezoneFormattedLabel(x, granularity, timezone);
          //   // } else {

          return Dygraph.dateAxisLabelFormatter(x, granularity, opts);
          //   // }
        }
      },
      y: {
        // valueRange: [minValueRangeY, maxValueRangeY]
      },
      y2: {
        // valueRange: [minValueRangeY2, maxValueRangeY2],
        independentTicks: true
      }
    }
    // highlightCallback: (event, x, points, row, seriesName) => {
    //   // need to "move" the legend according to current highlighted serie (TODO: find a way to do this using patch-package)
    //   points = points.filter(el => {
    //     return el.name === seriesName;
    //   });

    //   if (points && points.length) {
    //     var area = chart.plotter_.area;

    //     var labelsDivWidth = this.labelsDiv.offsetWidth;
    //     var yAxisLabelWidth = chart.getOptionForAxis('axisLabelWidth', 'y');
    //     var leftLegend = points[0].x * area.w + 50;
    //     var topLegend = points[0].y * area.h - 50;

    //     if (leftLegend + labelsDivWidth + 1 > area.w) {
    //       leftLegend = leftLegend - 2 * 50 - labelsDivWidth - (yAxisLabelWidth - area.x);
    //     }

    //     this.labelsDiv.style.left = yAxisLabelWidth + leftLegend + 'px';
    //     this.labelsDiv.style.top = topLegend + 'px';
    //   }

    //   if (this.props.serieImages[seriesName]) {
    //     if (this.props.serieImages[seriesName][parseInt(x / 1000)]) {
    //       let images = this.props.serieImages[seriesName][parseInt(x / 1000)];

    //       if (images && images[0] && images[0].path) {
    //         chart.setAnnotations([
    //           {
    //             series: seriesName,
    //             x: x,
    //             cssClass: 'image_annotation',
    //             // shortText: 'IMG'
    //             icon: images[0] && images[0].path,
    //             width: 50,
    //             height: 50,
    //             tickHeight: 30,
    //             text: `${images.length} image${images.length > 1 ? 's' : ''}`,
    //             clickHandler: (/*annotation, point, dygraph, event*/) => {
    //               this.toggleImageDialog(images[0]);
    //             }
    //           }
    //         ]);
    //       }
    //     }
    //   }
    // },
    // xlabel,
    // ylabel,
    // y2label,
    // labelsKMB: chart_settings ? chart_settings.labelsKMB : false,
    // underlayCallback: (canvas, area, dygraph) => {
    //   var future_coords = dygraph.toDomCoords(new Date(moment().unix() * 1000).getTime(), 0);

    //   // splitX and splitY are the coordinates on the canvas for (2006-11-19, 2.25).
    //   var splitX = future_coords[0];

    //   // The drawing area doesn't start at (0, 0), it starts at (area.x, area.y).
    //   // That's why we subtract them from splitX and splitY. This gives us the
    //   // actual distance from the upper-left hand corder of the graph itself.
    //   var leftSideWidth = splitX - area.x;
    //   var rightSideWidth = area.w - leftSideWidth;

    //   canvas.fillStyle = '#f2f2f2';
    //   canvas.fillRect(splitX, area.y, rightSideWidth, canvas.canvas.clientHeight);

    //   const thresholds =
    //     this.props.chartOptions.chart_settings &&
    //     this.props.chartOptions.chart_settings.thresholds;

    //   if (thresholds && thresholds.length) {
    //     thresholds.forEach(elem => {
    //       // get coords
    //       const axis = elem.y2axis ? (elem.y2axis === 'y2' ? 1 : 0) : 0;

    //       var coords = dygraph.toDomYCoord(elem.value, axis);

    //       var splitY = coords;

    //       //draw rectangles

    //       // below color rectangle
    //       if (elem.color_below) {
    //         canvas.fillStyle = elem.color_below;

    //         canvas.fillRect(
    //           0,
    //           splitY,
    //           canvas.canvas.clientWidth,
    //           canvas.canvas.clientHeight - splitY
    //         );
    //       }

    //       // above color rectangle
    //       if (elem.color_above) {
    //         canvas.fillStyle = elem.color_above;

    //         canvas.fillRect(0, splitY, canvas.canvas.clientWidth, -canvas.canvas.clientHeight);
    //       }

    //       //styles and colors
    //       canvas.strokeStyle = elem.color;
    //       canvas.fillStyle = elem.color;
    //       canvas.lineWidth = elem.size;

    //       // draw line
    //       canvas.beginPath();
    //       switch (elem.strokeline) {
    //         case 'dashed':
    //           canvas.setLineDash(Dygraph.DASHED_LINE);
    //           break;
    //         case 'dotted':
    //           canvas.setLineDash([2, 2]);
    //           break;
    //         case 'dot_dash':
    //           canvas.setLineDash(Dygraph.DOT_DASH_LINE);
    //           break;

    //         default:
    //           canvas.setLineDash([]);
    //           break;
    //       }

    //       canvas.moveTo(0, splitY);
    //       canvas.lineTo(canvas.canvas.clientWidth, splitY);
    //       canvas.stroke();

    //       // write text
    //       if (elem.label && elem.label.length) {
    //         canvas.font = 'bold 14px Montserrat';
    //         canvas.textAlign = 'center';
    //         canvas.fillText(
    //           elem.label,
    //           canvas.canvas.clientWidth / 2,
    //           splitY + 15 + canvas.lineWidth
    //         );
    //       }
    //     });
    //   }

    //   if (xAsNumbers) {
    //     var coords = dygraph.toDomCoords(new Date(firstadate * 1000).getTime(), 0);

    //     var splitX = coords[0];

    //     canvas.font = 'bold 15px Montserrat';
    //     canvas.textAlign = 'left';
    //     canvas.fillStyle = 'black';
    //     canvas.fillText('Day 0', splitX + 5, area.y + 15);

    //     canvas.beginPath();
    //     canvas.setLineDash([6]);
    //     canvas.moveTo(splitX, canvas.canvas.clientHeight);
    //     canvas.lineTo(splitX, 0);
    //     canvas.stroke();
    //     canvas.setLineDash([]);
    //   } else {
    //     if (this.state.hideMarkers) {
    //       return;
    //     }

    //     this.props.serieMarkers
    //       .sort((a, b) => b.x - a.x)
    //       .forEach((elem, index) => {
    //         var coords = dygraph.toDomCoords(new Date(elem.x).getTime(), 0);
    //         var prevCoords = this.props.serieMarkers[index - 1]
    //           ? dygraph.toDomCoords(new Date(this.props.serieMarkers[index - 1].x).getTime(), 0)
    //           : null;

    //         /// get width of text
    //         var width = Math.max(
    //           canvas.measureText(`${elem.text} ${elem.subtext ? `(${elem.subtext})` : ''}`)
    //             .width,
    //           canvas.measureText(moment(elem.x).format('DD/MM/YYYY HH:mm')).width
    //         );

    //         let multiplier = 0;

    //         var splitX = coords[0];

    //         if (prevCoords) {
    //           if (Math.abs(coords[0] - prevCoords[0]) < 100) multiplier = (index + 1) * 20;
    //         }

    //         const firstRowPos = index === 0 ? 10 : 10 + multiplier;
    //         const secondRowPos = index === 0 ? 30 : 30 + multiplier;

    //         canvas.font = 'bold 12px Montserrat';
    //         canvas.textAlign = 'left';

    //         /// color for background
    //         canvas.fillStyle = 'white';

    //         /// draw background rect assuming height of font
    //         canvas.fillRect(splitX - 5, area.y + firstRowPos - 15, width + 10, 40);

    //         canvas.fillStyle = dygraph.colorsMap_[elem.series] || 'black';
    //         canvas.strokeStyle = dygraph.colorsMap_[elem.series] || 'black';

    //         // draw vertical line as rect
    //         canvas.fillRect(splitX - 1, area.y + firstRowPos - 15, 2, 40);

    //         canvas.fillText(
    //           `${elem.text} ${elem.subtext ? `(${elem.subtext})` : ''}`,
    //           splitX + 5,
    //           area.y + firstRowPos
    //         );
    //         canvas.fillText(
    //           moment(elem.x).format('DD/MM/YYYY HH:mm'),
    //           splitX + 5,
    //           area.y + secondRowPos
    //         );

    //         canvas.beginPath();
    //         canvas.setLineDash([6]);
    //         canvas.moveTo(splitX, canvas.canvas.clientHeight);
    //         canvas.lineTo(splitX, 0);
    //         canvas.stroke();
    //       });

    //     canvas.setLineDash([]);
    //   }
    // },
    // ...(timezone && {
    //   title: `TIMEZONE: UTC ${moment.tz(timezone).format('Z')}`,
    // titleHeight: 25
    // })
  };
};

export default getChartOptions;
