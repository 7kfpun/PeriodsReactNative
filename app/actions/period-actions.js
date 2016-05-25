import alt from '../alt';

// 3rd party libraries
// import store from 'react-native-simple-store';

class PeriodActions {
  updatePeriods(periods) {
    // store.save('periods', periods);
    return periods;
  }

  addPeriod(period) {
    return period;
  }
}

module.exports = alt.createActions(PeriodActions);
