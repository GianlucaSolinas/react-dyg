// import { createJSS } from '@utils';

const Styles = {
  container: {
    fontSize: '13px',
    border: '1px solid black',
    borderRadius: '2px'
  },
  row: {
    padding: '5px',
    borderTop: '1px solid #ededed',
    borderBottom: '1px solid #ededed',
    display: 'grid',
    gridColumn: '55% 45%',
    gridTemplateColumns: '55% 45%',
    gridColumnGap: '5px',
    maxHeight: '70px'
  },
  label: {
    display: 'flex',
    wordBreak: 'break-all',
    alignSelf: 'center'
  },
  value_container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center'
  },
  date: {
    textAlign: 'center',
    marginBottom: '5px'
  },
  value: {
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 'bold'
  }
};

export default Styles;
