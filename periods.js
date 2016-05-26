import React from 'react';
import {
  Actions,
  Router,
  Scene,
} from 'react-native-router-flux';

import SelectGenderView from './app/views/select-gender';

import Main from './app/views/main';
import AddPeriodView from './app/views/add-period';
import StartPeriodView from './app/views/start-period';
import EndPeriodView from './app/views/end-period';
import EditHistoryView from './app/views/edit-history';

import SettingsView from './app/views/settings';
import PeriodLengthSettingsView from './app/views/settings/period-length';
import CycleLengthSettingsView from './app/views/settings/cycle-length';
import OvulationFertileSettingsView from './app/views/settings/ovulation-fertile';

import LinkView from './app/views/link';

import QRCodeReaderView from './app/partner-views/qrcode-reader';
import InputCodeView from './app/partner-views/input-code';
// import QRCodeReaderView from './app/partner-views/test';

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = [
  'Warning: In next release empty section headers',
  'Warning: Failed propType: Invalid prop `prevButtonText`',
  'Warning: Failed propType: Invalid prop `nextButtonText`',
];

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="selectGender" title="Select your gender" component={SelectGenderView} initial={true}  type="reset" />

    <Scene key="main" title="Period Calendar" component={Main} type="reset" />
    <Scene key="addPeriod" title="Add Period" component={AddPeriodView} />
    <Scene key="startPeriod" title="Period Starts" component={StartPeriodView} />
    <Scene key="endPeriod" title="Period Ends" component={EndPeriodView} />
    <Scene key="editHistory" title="Edit" component={EditHistoryView} />

    <Scene key="settings" title="Settings" component={SettingsView} />
    <Scene key="periodLengthSettings" title="Period Length" component={PeriodLengthSettingsView} />
    <Scene key="cycleLengthSettings" title="Cycle Length" component={CycleLengthSettingsView} />
    <Scene key="ovulationFertileSettings" title="Ovulation and Fertile" component={OvulationFertileSettingsView} />

    <Scene key="link" title="Link" component={LinkView} />

    <Scene key="qrcodeReader" title="QR Code Reader" component={QRCodeReaderView}  type="reset" />
    <Scene key="inputCode" title="Input code" component={InputCodeView} />
  </Scene>
);

export default class Periods extends React.Component {
  render() {
    return <Router scenes={scenes}/>;
  }
}
