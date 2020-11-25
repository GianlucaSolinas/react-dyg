import { createJSS } from '@utils';
import { graphStyles } from '@utils/styles';

const Styles = {
  graphStyles,
  container: {
    width: '100%',
    display: 'inline-block'
  },
  legend_hover: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: '999 !important',
    minWidth: '30%'
  },
  infopanel: {
    textAlign: 'center'
  },
  infoicon: {
    margin: '8px'
  }
};

export default createJSS(Styles);
