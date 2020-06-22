import { createJSS } from '@utils';
import { graphStyles } from '@utils/styles';

const Styles = {
  graphStyles,
  container: {
    width: '80%',
    display: 'inline-block'
  },
  legend_hover: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: '999 !important',
    minWidth: '30%'
  }
};

export default createJSS(Styles);
