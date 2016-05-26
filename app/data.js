exports.data = {
  settings: {
    PERIOD_LENGTH: {
      PREDICTION_TYPE: 'DEFAULT',  // ['DEFAULT', 'AVERAGE']
      VALUE: 3,  // <number> or ['LAST_1_MONTH', 'LAST_3_MONTHS', 'LAST_6_MONTHS']
    },
    CYCLE_LENGTH: {
      PREDICTION_TYPE: 'DEFAULT',  // ['DEFAULT', 'AVERAGE']
      VALUE: 30,  // <number> or ['LAST_1_MONTH', 'LAST_3_MONTHS', 'LAST_6_MONTHS']
    },
    OVULATION_FERTILE: {
      PREDICTION_TYPE: 'DEFAULT',  // ['DEFAULT', 'AVERAGE']
      VALUE: 14,  // <number> or ['LAST_1_MONTH', 'LAST_3_MONTHS', 'LAST_6_MONTHS']
    },
  },
  periods: [],
  periodas: [{
    'date': [2001, 0, 31],
    'length': 3,
  }, {
    'date': [2002, 0, 31],
    'length': 2,
  }, {
    'date': [2003, 0, 31],
    'length': 2,
  }, {
    'date': [2004, 0, 31],
    'length': 2,
  }, {
    'date': [2005, 0, 31],
    'length': 2,
  }, {
    'date': [2006, 0, 31],
    'length': 2,
  }, {
    'date': [2007, 0, 31],
    'length': 2,
  }, {
    'date': [2008, 0, 31],
    'length': 2,
  }, {
    'date': [2009, 0, 31],
    'length': 2,
  }, {
    'date': [2010, 0, 31],
    'length': 2,
  }],
};
