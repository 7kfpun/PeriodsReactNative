exports.data = {
  settings: {
    period_length: {
      prediction_type: 'DEFAULT',  // ['DEFAULT', 'AVERAGE']
      value: 3,  // <number> or ['LAST_1_MONTH', 'LAST_3_MONTHS', 'LAST_6_MONTHS']
    },
    cycle_length: {
      prediction_type: 'DEFAULT',  // ['DEFAULT', 'AVERAGE']
      value: 30,  // <number> or ['LAST_1_MONTH', 'LAST_3_MONTHS', 'LAST_6_MONTHS']
    },
    ovulation_fertile: {
      prediction_type: 'DEFAULT',  // ['DEFAULT', 'AVERAGE']
      value: 14,  // <number> or ['LAST_1_MONTH', 'LAST_3_MONTHS', 'LAST_6_MONTHS']
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
