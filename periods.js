import React from 'react';
import {
  View,
} from 'react-native';
import {
  Actions,
  Router,
  Scene,
  NavigationDrawer,
} from 'react-native-router-flux';

// 3rd party libraries
import Icon from 'react-native-vector-icons/MaterialIcons';
import store from 'react-native-simple-store';

import SelectGenderView from './app/views/select-gender';

import Main from './app/views/main';
import CalendarView from './app/views/calendar';
import HistoryView from './app/views/history';

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
import MainMaleView from './app/partner-views/main';
import HistoryMaleView from './app/partner-views/history';
import SettingsMaleView from './app/partner-views/settings';

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = [
  'Warning: In next release empty section headers',
  'Warning: Failed propType: Invalid prop `prevButtonText`',
  'Warning: Failed propType: Invalid prop `nextButtonText`',
];

class TabIcon extends React.Component {
  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <Icon style={{color: this.props.selected ? '#EF5350' : '#616161'}} name={this.props.tabIcon} size={24} />
        {/*<Text style={{color: this.props.selected ? '#EF5350' : '#616161', fontSize: 10}}>{this.props.tabName}</Text>*/}
      </View>
    );
  }
}

class TabIconMale extends React.Component {
  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <Icon style={{color: this.props.selected ? '#5C6BC0' : '#616161'}} name={this.props.tabIcon} size={24} />
        {/*<Text style={{color: this.props.selected ? '#5C6BC0' : '#616161', fontSize: 10}}>{this.props.tabName}</Text>*/}
      </View>
    );
  }
}

class WhiteInitialView extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: 'white'}} />
    );
  }
}


const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>

    <Scene key="whiteInitial" component={WhiteInitialView} initial={true} type="reset" />
    <Scene key="selectGender" title="Select your gender" component={SelectGenderView} type="reset" />

    <Scene key="main" component={NavigationDrawer} type="reset">
      <Scene key="tabbar" tabs={true}>
        <Scene key="home" title="Period Calendar" tabIcon="home" tabName="Home" component={Main} hideNavBar={true} icon={TabIcon} />
        <Scene key="calendar" title="Calendar" tabIcon="today" tabName="Calendar" component={CalendarView} hideNavBar={true} icon={TabIcon} />
        <Scene key="history" title="History" tabIcon="history" tabName="History" component={HistoryView} hideNavBar={true} icon={TabIcon} />
        <Scene key="link" title="Linking" tabIcon="person-add" tabName="Linking" component={LinkView} hideNavBar={true} icon={TabIcon} />
      </Scene>
    </Scene>

    <Scene key="addPeriod" title="Add Period" component={AddPeriodView} />
    <Scene key="startPeriod" title="Period Starts" component={StartPeriodView} />
    <Scene key="endPeriod" title="Period Ends" component={EndPeriodView} />
    <Scene key="editHistory" title="Edit" component={EditHistoryView} />

    <Scene key="settings" title="Settings" component={SettingsView} />
    <Scene key="periodLengthSettings" title="Period Length" component={PeriodLengthSettingsView} />
    <Scene key="cycleLengthSettings" title="Cycle Length" component={CycleLengthSettingsView} />
    <Scene key="ovulationFertileSettings" title="Ovulation and Fertile" component={OvulationFertileSettingsView} />

    <Scene key="qrcodeReader" title="QR Code Reader" component={QRCodeReaderView}  type="reset" />
    <Scene key="inputCode" title="Input code" component={InputCodeView} />

    <Scene key="mainMale" component={NavigationDrawer} type="reset">
      <Scene key="tabbarMale" tabs={true}>
        <Scene key="homeMale" title="Period Calendar" tabIcon="home" tabName="Home" component={MainMaleView} hideNavBar={true} icon={TabIconMale} />
        <Scene key="historyMale" title="History" tabIcon="history" tabName="History" component={HistoryMaleView} hideNavBar={true} icon={TabIconMale} />
        <Scene key="settingsMale" title="Settings" tabIcon="settings" tabName="Settings" component={SettingsMaleView} hideNavBar={true} icon={TabIconMale} />
      </Scene>
    </Scene>
  </Scene>
);

export default class Periods extends React.Component {
  componentDidMount() {
    store.get('gender').then((gender) => {
      if (gender === 'female') {
        Actions.main();
      } else if (gender === 'male') {
        Actions.mainMale();
      } else {
        Actions.selectGender();
      }
    });
  }

  render() {
    return <Router scenes={scenes}/>;
  }
}
