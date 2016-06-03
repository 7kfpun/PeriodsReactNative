import alt from '../alt';

import Firebase from 'firebase';

import PeriodActions from '../actions/period-actions';
import { guid } from '../utils/guid';

// 3rd party libraries
import moment from 'moment';
import store from 'react-native-simple-store';

import { config } from '../config';

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

  save(periods) {
    store.save('periods', periods);

    store.get('isLinkingEnabled').then((isLinkingEnabled) => {
      if (isLinkingEnabled) {
        store.get('uuid').then((uuid) => {
          let firebaseRef = new Firebase(config.firebaseHost);
          firebaseRef.child('users').child(uuid).update({periods: periods});
          firebaseRef.off();
        });
      }
    });
  }

  handleAddPeriod(period) {
    console.log('handleAddPeriod', period);
    period.uuid = guid();
    period.event = 'PERIOD';
    this.periods.push(period);
    this.sortPeriod();
    this.save(this.periods);
  }

  handleStartPeriod(period) {
    console.log('handleStartPeriod', period);
    period.uuid = guid();
    this.periods.push(period);
    this.sortPeriod();
    this.save(this.periods);
  }

  handleEndPeriod(period) {
    console.log('handleEndPeriod', period);
    let p = this.periods.filter((item) => item.length === undefined)[0];
    let length = moment(period.date).diff(moment(p.date), 'days');
    p.length = length;
    this.sortPeriod();
    this.save(this.periods);
  }

  handleEditPeriod(period) {
    console.log('handleEditPeriod', period);
    let p = this.periods.filter((item) => item.uuid === period.uuid)[0];
    p.date = period.date;
    p.length = period.length;
    p.event = period.event;
    this.sortPeriod();
    this.save(this.periods);
  }

  handleDeletePeriod(period) {
    console.log('handleDeletePeriod', period);
    let p = this.periods.filter((item) => item.uuid !== period.uuid);
    this.periods = p;
    this.sortPeriod();
    this.save(this.periods);
  }
}

module.exports = alt.createStore(PeriodStore, 'PeriodStore');
