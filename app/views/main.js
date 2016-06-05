import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Flux
import PeriodActions from '../actions/period-actions';
import PeriodStore from '../stores/period-store';
import SettingStore from '../stores/setting-store';

import moment from 'moment';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobBanner } from 'react-native-admob';
import Button from 'apsl-react-native-button';
import DateTimePicker from 'react-native-datetime';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import Toast from 'react-native-root-toast';

import { config } from '../config';
import { getOrdinal } from '../utils/get-ordinal';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      date: new Date(),
    }, PeriodStore.getState(), SettingStore.getState());
  }

  componentDidMount() {
    PeriodStore.listen((state) => this.onPeriodStoreChange(state));
    SettingStore.listen((state) => this.onSettingStoreChange(state));

    this.updateStatistics();
  }

  componentWillUnmount() {
    PeriodStore.unlisten((state) => this.onPeriodStoreChange(state));
    SettingStore.unlisten((state) => this.onSettingStoreChange(state));
  }

  updateStatistics() {
    if (this.state.periods.length > 0) {
      if (this.state.periods.filter((item) => item.length === undefined).length === 1) {
        let startedPeriod = this.state.periods.filter((item) => item.length === undefined)[0];
        this.setState({
          isStarted: true,
          startedPeriod: startedPeriod,
          daysOfPeriod: moment().diff(moment(startedPeriod.date), 'days'),
          daysLeft: null,
        });
      } else {
        this.setState({
          isStarted: false,
          startedPeriod: null,
          daysOfPeriod: null,
          daysLeft: moment(this.state.periods[0].date).add(this.state.settings.CYCLE_LENGTH.VALUE, 'days').diff(moment(), 'days') + 1,
        });
      }

      this.setState({
        nextPeriod: moment(this.state.periods[0].date).add(this.state.settings.CYCLE_LENGTH.VALUE, 'days').format('MMM D'),
        nextFertile: moment(this.state.periods[0].date).add(this.state.settings.CYCLE_LENGTH.VALUE - this.state.settings.OVULATION_FERTILE.VALUE - 5, 'days').format('MMM D'),
      });
    }
  }

  onPeriodStoreChange(state) {
    console.log('onPeriodStoreChange', state);
    this.setState({
      periods: state.periods,
      key: Math.random(),
    });

    this.updateStatistics();
  }

  onSettingStoreChange(state) {
    console.log('onSettingStoreChange', state);
    this.setState({settings: state.settings});

    this.updateStatistics();
  }

  showDatePicker() {
    var date = this.state.date;
    this.refs.picker.showDatePicker(date, (d) => {
      if (moment().diff(d) < 0) {
        Toast.show('The date input should be before today.', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
      } else {
        PeriodActions.addPeriod({
          date: d,
          // event: 'PERIOD',
        });
      }
    });
  }

  render_prediction_block() {
    if (this.state.periods && this.state.periods.length > 0) {
      return <View style={[styles.block, {flex: 2, marginTop: 10, alignItems: 'center'}]}>
        <View style={[styles.dayLeftheader, {alignItems: 'center'}]}>
          {this.state.daysLeft !== null &&  this.state.daysLeft >= 0 && <Text style={styles.headerText}><Text style={{fontSize: 40}}>{this.state.daysLeft}</Text>{' DAYS LEFT'}</Text>}
          {this.state.daysLeft !== null &&  this.state.daysLeft < 0 && <Text style={styles.headerText}><Text style={{fontSize: 40}}>{Math.abs(this.state.daysLeft)}</Text>{' DAYS LATE'}</Text>}
          {this.state.daysOfPeriod !== null && <Text style={styles.headerText}><Text style={{fontSize: 40}}>{getOrdinal(this.state.daysOfPeriod + 1)}</Text>{' DAY OF PERIOD'}</Text>}
          <Text style={styles.subHeaderText}><Text style={{fontSize: 20}}>{this.state.nextPeriod}</Text>{' Next Period'}</Text>
          <Text style={styles.subHeaderText}><Text style={{fontSize: 20}}>{this.state.nextFertile}</Text>{' Next Fertile'}</Text>
        </View>

        <View>
          {!this.state.isStarted && <Button style={styles.button} textStyle={{color: 'white', fontSize: 18}} onPress={() => this.showDatePicker()} >
            {'Period Starts'}
          </Button>}
          {this.state.isStarted && <Button style={styles.button} textStyle={{color: 'white', fontSize: 18}} onPress={() => Actions.endPeriod({date: this.state.startedPeriod.date})} >
            {'Period Ends'}
          </Button>}
        </View>
      </View>;
    } else {
      return <View style={[styles.block, {flex: 2, marginTop: 10, alignItems: 'center'}]}>
        <View style={[styles.dayLeftheader, {alignItems: 'center'}]}>
          <Text style={styles.headerText}>Please enter your period.</Text>
        </View>

        <View>
          <Button style={styles.button} textStyle={{color: 'white', fontSize: 18}} onPress={() => this.showDatePicker()} >
            {'Period Starts'}
          </Button>
        </View>
      </View>;
    }
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Settings'
      Actions.settings();
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{tintColor: '#EF5350', style: 'light-content'}}
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          rightButton={<Icon style={styles.navigatorRightButton} name="settings" size={26} color="white" onPress={Actions.settings} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            {title: 'Settings', iconName: 'settings', iconSize: 26, show: 'always'},
          ]}
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={{flex: 1}}>
          {this.render_prediction_block()}
        </View>

        {Platform.OS === 'android' && <AdMobBanner bannerSize={'smartBannerPortrait'} adUnitID={config.adUnitID.android} />}
        {Platform.OS === 'ios' && <AdMobBanner bannerSize={'smartBannerPortrait'} adUnitID={config.adUnitID.ios} />}

        <DateTimePicker isTopUp={true} cancelText={'Cancel'} okText={'OK'} ref={'picker'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    marginBottom: 50,
  },
  navigatorBarIOS: {
    backgroundColor: '#EF5350',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#B71C1C',
  },
  navigatorLeftButton: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 50,
  },
  navigatorRightButton: {
    paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 10,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#EF5350',
  },
  block: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
  },
  dayLeftheader: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },
  headerText: {
    color: '#212121',
    fontSize: 20,
    marginBottom: 20,
  },
  subHeaderText: {
    color: '#808080',
    fontSize: 16,
  },
  subHeaderHighlightText: {
    color: '#EF5350',
    fontSize: 16,
  },
  button: {
    flex: 1,
    width: 260,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    borderColor: 'white',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
});
