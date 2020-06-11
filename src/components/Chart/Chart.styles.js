import { createJSS } from '@utils';

const Styles = {
  container: {},
  legend_hover: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: '999 !important',
    minWidth: '30%'
  }
};

export default createJSS(Styles);
