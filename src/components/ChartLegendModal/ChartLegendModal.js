import React from 'react';
import PropTypes from 'prop-types';
import Styles from './ChartLegendModal.styles';
import moment from 'moment-timezone';

const ChartLegendModal = ({ data, timezone = '', parseDateAsString = false }) => {
  let filteredSeries = data.series.filter(v => v.isHighlighted);

  let styles = {};

  if (!filteredSeries || filteredSeries.length === 0) {
    styles.opacity = 0;
  }

  let datashow = '';

  if (parseDateAsString) {
    datashow = data.xHTML;
  } else if (moment.tz(data.x, timezone).isValid()) {
    datashow = moment.tz(data.x, timezone).format('DD/MM/YYYY HH:mm');
  }

  return (
    <div style={{ ...styles, ...Styles.container }}>
      {filteredSeries.map((v, index) => {
        let style = { color: v.color };

        return (
          <div key={index} style={{ ...Styles.row }}>
            <div style={{ ...style, ...Styles.label }}>{v.label}</div>
            <div style={{ ...Styles.value_container }}>
              <div style={{ ...Styles.date }}>{datashow}</div>
              <div style={{ ...Styles.value }}>{v.yHTML}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

ChartLegendModal.propTypes = {
  data: PropTypes.object,
  timezone: PropTypes.string,
  parseDateAsString: PropTypes.bool,
  reference: PropTypes.any
};

export default ChartLegendModal;
