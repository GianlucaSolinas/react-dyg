const graphStyles = {
  '& .dygraph-label-rotate-right': {
    textAlign: 'center',
    transform: 'rotate(-90deg)'
  },
  '& .dygraph-label-rotate-left': {
    textAlign: 'center',
    transform: 'rotate(-90deg)'
  },
  '& .dygraph-axis-label.dygraph-axis-label-x,.dygraph-axis-label.dygraph-axis-label-y,.dygraph-axis-label.dygraph-axis-label-y.dygraph-axis-label-y2,.dygraph-xlabel,.dygraph-ylabel,.dygraph-y2label': {
    fontFamily: 'Montserrat',
    fontSize: '13px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  '& .dygraph-title': {
    textAlign: 'center',
    fontFamily: 'Montserrat',
    fontSize: '14px'
  }
};

export { graphStyles };
