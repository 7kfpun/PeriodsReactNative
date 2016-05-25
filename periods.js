import React from 'react';
import {
  Actions,
  Router,
  Scene,
} from 'react-native-router-flux';

import Main from './app/views/main';
import AddPeriodView from './app/views/add-period';
import EditHistoryView from './app/views/edit-history';
import SettingsView from './app/views/settings';

import PeriodLengthSettingsView from './app/views/settings/period-length';
import CycleLengthSettingsView from './app/views/settings/cycle-length';
import OvulationFertileSettingsView from './app/views/settings/ovulation-fertile';

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = ['Warning: Failed propType: SceneView'];

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="main" title="Period Calendar" component={Main} initial={true} />
    <Scene key="addPeriod" title="Add " component={AddPeriodView} />
    <Scene key="editHistory" title="Edit" component={EditHistoryView} />
    <Scene key="settings" title="Settings" component={SettingsView} />
    <Scene key="periodLengthSettings" title="Period Length" component={PeriodLengthSettingsView} />
    <Scene key="cycleLengthSettings" title="Cycle Length" component={CycleLengthSettingsView} />
    <Scene key="ovulationFertileSettings" title="Ovulation and Fertile" component={OvulationFertileSettingsView} />
  </Scene>
);

export default class Periods extends React.Component {
  render() {
    return <Router scenes={scenes}/>;
  }
}
