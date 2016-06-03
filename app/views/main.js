import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Flux
import PeriodStore from '../stores/period-store';
import SettingStore from '../stores/setting-store';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobBanner } from 'react-native-admob';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import moment from 'moment';

import {getOrdinal} from '../utils/get-ordinal';
import {config} from '../config';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, PeriodStore.getState(), SettingStore.getState());
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

      let cycleDiffs = [];
      for (let i = 0; i < this.state.periods.length - 1; i++) {
        cycleDiffs.push(moment(this.state.periods[i].date).diff(this.state.periods[i + 1].date, 'days'));
      }
      console.log('cycleDiffs', cycleDiffs);

      this.setState({
        nextPeriod: moment(this.state.periods[0].date).add(this.state.settings.CYCLE_LENGTH.VALUE, 'days').format('MMM D'),
        nextFertile: moment(this.state.periods[0].date).add(this.state.settings.CYCLE_LENGTH.VALUE - this.state.settings.OVULATION_FERTILE.VALUE - 5, 'days').format('MMM D'),

        averagePeriodDays: Math.round(this.state.periods.filter((item) => item.length !== undefined).map((item) => item.length).reduce((a, b) => a + b, 0) / this.state.periods.filter((item) => item.length !== undefined).length),
        averageCycleDays: Math.round(cycleDiffs.reduce((a, b) => a + b, 0) / cycleDiffs.length),
      });
    } else {
      this.setState({
        averagePeriodDays: '/',
        averageCycleDays: '/',
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

  onActionSelected(position) {
    if (position === 0) {  // index of 'Settings'
      Actions.settings();
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
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

  render_prediction_block() {
    if (this.state.periods && this.state.periods.length > 0) {
      return <View style={[styles.block, {flex: 2, marginTop: 10, alignItems: 'center'}]}>
        <View style={styles.dayLeftheader}>
          {this.state.daysLeft !== null &&  this.state.daysLeft >= 0 && <Text style={styles.headerText}><Text style={{fontSize: 40}}>{this.state.daysLeft}</Text>{' DAYS LEFT'}</Text>}
          {this.state.daysLeft !== null &&  this.state.daysLeft < 0 && <Text style={styles.headerText}><Text style={{fontSize: 40}}>{Math.abs(this.state.daysLeft)}</Text>{' DAYS LATE'}</Text>}
          {this.state.daysOfPeriod !== null && this.state.daysOfPeriod !== 0 && <Text style={styles.headerText}><Text style={{fontSize: 40}}>{getOrdinal(this.state.daysOfPeriod + 1)}</Text>{' DAY OF PERIOD'}</Text>}
          <Text style={styles.subHeaderText}><Text style={{fontSize: 20}}>{this.state.nextPeriod}</Text>{' Next Period'}</Text>
          <Text style={styles.subHeaderText}><Text style={{fontSize: 20}}>{this.state.nextFertile}</Text>{' Next Fertile'}</Text>
        </View>

        <View>
          {!this.state.isStarted && <Button style={styles.button} textStyle={{color: 'white', fontSize: 18}} onPress={Actions.startPeriod} >
            {'Period Starts'}
          </Button>}
          {this.state.isStarted && <Button style={styles.button} textStyle={{color: 'white', fontSize: 18}} onPress={() => Actions.endPeriod({date: this.state.startedPeriod.date})} >
            {'Period Ends'}
          </Button>}
        </View>
      </View>;
    } else {
      return <View style={[styles.block, {flex: 2, marginTop: 10, alignItems: 'center'}]}>
        <View style={styles.dayLeftheader}>
          <Text style={styles.headerText}>Please enter your period.</Text>
        </View>

        <View>
          <Button style={styles.button} textStyle={{color: 'white', fontSize: 18}} onPress={Actions.startPeriod} >
            {'Period Starts'}
          </Button>
        </View>
      </View>;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={{flex: 1}}>
          {this.render_prediction_block()}

          <View style={[styles.block, {flex: 1}]}>
            <View style={[styles.header, {marginTop: 8}]}>
              <Text style={styles.headerText}>Statistics</Text>
              <Text style={styles.subHeaderText}>Average</Text>
            </View>
            <View style={styles.header}>
              <Text style={styles.subHeaderText}>Average period days</Text>
              <Text style={styles.subHeaderHighlightText}>
                {this.state.averagePeriodDays} Days
              </Text>
            </View>
            <View style={[styles.header, {marginBottom: 8}]}>
              <Text style={styles.subHeaderText}>Average period cycle</Text>
              <Text style={styles.subHeaderHighlightText}>
                {this.state.averageCycleDays} Days
              </Text>
            </View>
          </View>
        </View>

        {Platform.OS === 'android' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.android} />}
        {Platform.OS === 'ios' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.ios} />}
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
    color: '#212121',
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
