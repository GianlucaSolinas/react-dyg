import { createJSS } from '@utils';

const Styles = {
  container: {
    fontFamily: 'Montserrat',
    fontSize: '13px',
    borderRight: '1px solid #fff', // borders color
    // height: '100%',
    height: '375px',
    background: '#fff', // grey xxlight
    overflowY: 'auto',
    position: 'relative',
    display: 'inline-block',
    width: '20%'
  },
  chart_title: {
    textAlign: 'center',
    padding: '8px 2px',
    '*': {
      fontWeight: 'bold'
    }
  },
  dayzero: {
    padding: '4px',
    fontFamily: 'Open Sans'
  },
  chart_row: {
    padding: '5px',
    borderTop: '1px solid #999999',
    borderBottom: '1px solid #999999',
    maxHeight: '140px',
    // width: '30%',
    // margin: '16px',
    // display: 'inline-block',
    '&.highlighted': {
      fontWeight: 'bold',
      background: '#eee'
      // borderWidth: '2px'
    }
  },
  chart_label: {
    wordBreak: 'break-all',
    textAlign: 'center',
    fontSize: '12px'
  },
  value_container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    height: '50px'
  },
  chart_date: {
    textAlign: 'center',
    marginBottom: '5px'
  },
  chart_value: {
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 'bold'
  },
  actions_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    textAlign: 'center'
  },
  square: {
    width: '10px',
    height: '10px'
  },
  action_container: {
    position: 'relative',
    textAlign: 'center',
    cursor: 'pointer'
  },
  action_text: {
    fontSize: '10px'
  }
};

export default createJSS(Styles);
