import alt from '../alt';

import Firebase from 'firebase';

import SettingActions from '../actions/setting-actions';

// 3rd party libraries
import store from 'react-native-simple-store';

import { config } from '../config';
import { data } from '../data';

class SettingStore {
  constructor() {
    this.settings = {};

    let that = this;
    store.get('settings').then((settings) => {
      console.log('From store settings:', settings);
      if (!settings) {
        console.log(data);
        settings = data.settings;
        store.save('settings', settings);
      }
      that.settings = settings;
    });

    this.bindListeners({
      handleUpdatePeriodLengthSettings: SettingActions.UPDATE_PERIOD_LENGTH_SETTINGS,
      handleUpdateCycleLengthSettings: SettingActions.UPDATE_CYCLE_LENGTH_SETTINGS,
      handleUpdateOvulationFertileSettings: SettingActions.UPDATE_OVULATION_FERTILE_SETTINGS,
    });
  }

  save(settings) {
    store.save('settings', settings);

    store.get('isLinkingEnabled').then((isLinkingEnabled) => {
      if (isLinkingEnabled) {
        store.get('uuid').then((uuid) => {
          let firebaseRef = new Firebase(config.firebaseHost);
          firebaseRef.child('users').child(uuid).update({settings: settings});
          firebaseRef.off();
        });
      }
    });
  }

  handleUpdatePeriodLengthSettings(periodLengthSettings) {
    if (isNaN(periodLengthSettings.VALUE)) {
      this.settings.PERIOD_LENGTH = data.settings.PERIOD_LENGTH;
    }
    this.settings.PERIOD_LENGTH = periodLengthSettings;
    this.save(this.settings);
  }

  handleUpdateCycleLengthSettings(cycleLengthSettings) {
    if (isNaN(cycleLengthSettings.VALUE)) {
      this.settings.CYCLE_LENGTH = data.settings.CYCLE_LENGTH;
    }
    this.settings.CYCLE_LENGTH = cycleLengthSettings;
    this.save(this.settings);
  }

  handleUpdateOvulationFertileSettings(ovulationFertileSettings) {
    if (isNaN(ovulationFertileSettings.VALUE)) {
      this.settings.OVULATION_FERTILE = data.settings.OVULATION_FERTILE;
    }
    this.settings.OVULATION_FERTILE = ovulationFertileSettings;
    this.save(this.settings);
  }
}

module.exports = alt.createStore(SettingStore, 'SettingStore');
