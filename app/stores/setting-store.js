import alt from '../alt';

import SettingActions from '../actions/setting-actions';

// 3rd party libraries
import store from 'react-native-simple-store';

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

  handleUpdatePeriodLengthSettings(periodLengthSettings) {
    if (isNaN(periodLengthSettings.VALUE)) {
      this.settings.PERIOD_LENGTH = data.settings.PERIOD_LENGTH;
    }
    this.settings.PERIOD_LENGTH = periodLengthSettings;
    store.save('settings', this.settings);
  }

  handleUpdateCycleLengthSettings(cycleLengthSettings) {
    if (isNaN(cycleLengthSettings.VALUE)) {
      this.settings.CYCLE_LENGTH = data.settings.CYCLE_LENGTH;
    }
    this.settings.CYCLE_LENGTH = cycleLengthSettings;
    store.save('settings', this.settings);
  }

  handleUpdateOvulationFertileSettings(ovulationFertileSettings) {
    if (isNaN(ovulationFertileSettings.VALUE)) {
      this.settings.OVULATION_FERTILE = data.settings.OVULATION_FERTILE;
    }
    this.settings.OVULATION_FERTILE = ovulationFertileSettings;
    store.save('settings', this.settings);
  }
}

module.exports = alt.createStore(SettingStore, 'SettingStore');
