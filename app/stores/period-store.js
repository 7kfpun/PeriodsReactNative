import alt from '../alt';

import PeriodActions from '../actions/period-actions';

// 3rd party libraries
import store from 'react-native-simple-store';

class PeriodStore {
  constructor() {
    this.periods = [];

    let that = this;
    store.get('periods').then((periods) => {
      console.log('From store periods:', periods);
      if (!periods || !Array.isArray(periods)) {
        periods = [];
        store.save('periods', []);
      }
      that.periods = periods;
    });

    this.bindListeners({
      handleAddPeriod: PeriodActions.ADD_PERIOD,
      handleUpdatePeriods: PeriodActions.UPDATE_PERIODS,
    });
  }

  handleAddPeriod(period) {
    console.log('handleAddPeriod', period);
    this.periods.push(period);
    store.save('periods', this.periods);
  }

  handleUpdatePeriods(periods) {
    this.periods = periods;
  }
}

module.exports = alt.createStore(PeriodStore, 'PeriodStore');
