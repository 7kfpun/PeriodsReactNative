import alt from '../alt';

import PeriodActions from '../actions/period-actions';
import { guid } from '../utils/guid';

// 3rd party libraries
import moment from 'moment';
import store from 'react-native-simple-store';

class PeriodStore {
  constructor() {
    this.periods = [];

    let that = this;
    store.get('periods').then((periods) => {
      console.log('From store periods:', periods);
      if (!periods || !Array.isArray(periods)) {
        periods = [];
        store.save('periods', periods);
      }
      that.periods = periods;
    });

    this.bindListeners({
      handleAddPeriod: PeriodActions.ADD_PERIOD,
      handleStartPeriod: PeriodActions.START_PERIOD,
      handleEndPeriod: PeriodActions.END_PERIOD,
      handleEditPeriod: PeriodActions.EDIT_PERIOD,
      handleDeletePeriod: PeriodActions.DELETE_PERIOD,
    });
  }

  sortPeriod() {
    this.periods.sort(function(a,b){
      return new Date(b.date) - new Date(a.date);
    });
  }

  handleAddPeriod(period) {
    console.log('handleAddPeriod', period);
    period.uuid = guid();
    this.periods.push(period);
    this.sortPeriod();
    store.save('periods', this.periods);
  }

  handleStartPeriod(period) {
    console.log('handleStartPeriod', period);
    period.uuid = guid();
    this.periods.push(period);
    this.sortPeriod();
    store.save('periods', this.periods);
  }

  handleEndPeriod(period) {
    console.log('handleEndPeriod', period);
    let p = this.periods.filter((item) => item.length === undefined)[0];
    let length = moment(period.date).diff(moment(p.date), 'days');
    p.length = length;
    this.sortPeriod();
    store.save('periods', this.periods);
  }

  handleEditPeriod(period) {
    console.log('handleEditPeriod', period);
    let p = this.periods.filter((item) => item.uuid === period.uuid)[0];
    p.date = period.date;
    p.length = period.length;
    this.sortPeriod();
    store.save('periods', this.periods);
  }

  handleDeletePeriod(period) {
    console.log('handleDeletePeriod', period);
    let p = this.periods.filter((item) => item.uuid !== period.uuid);
    this.periods = p;
    this.sortPeriod();
    store.save('periods', this.periods);
  }
}

module.exports = alt.createStore(PeriodStore, 'PeriodStore');
