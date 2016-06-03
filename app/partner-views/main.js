import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Firebase from 'firebase';

// 3rd party libraries
import { AdMobBanner } from 'react-native-admob';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import moment from 'moment';

import {getOrdinal} from '../utils/get-ordinal';
import { config } from '../config';

export default class DemoReactNative extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      periods: [],
    };
  }

  componentWillMount() {
    this.firebaseRef = new Firebase(config.firebaseHost);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  componentDidMount() {
    let that = this;

    store.get('periods').then((periods) => {
      store.get('settings').then((settings) => {
        if (periods && settings) {
          that.setState({
            periods: periods,
            settings: settings,
            key: Math.random(),
          });
          that.updateStatistics();
        }
      });
    });

    store.get('partnerUuid').then((partnerUuid) => {
      if (partnerUuid) {
        this.setState({partnerUuid: partnerUuid});
        this.firebaseRef.child('users').child(partnerUuid).on('value', (snapshot) => {
          console.log('check', snapshot.val());
          let values = snapshot.val();
          if (values !== null) {
            store.save('periods', values.periods);
            store.save('settings', values.settings);
            that.setState({
              partnerUuid: partnerUuid,
              periods: values.periods,
              settings: values.settings,
              key: Math.random(),
            });
            that.updateStatistics();
          }
        });
      }
    });
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

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={styles.partnerBlock}>
          <Text style={styles.headerText}>{'You are linking to'}</Text>
          <Text style={styles.headerText}>{this.state.partnerUuid}</Text>
        </View>
        <View style={styles.predictionBlock}>
          <View style={styles.dayLeftheader}>
            {this.state.daysLeft !== null &&  this.state.daysLeft >= 0 && <Text style={styles.headerText}><Text style={{fontSize: 40}}>{this.state.daysLeft}</Text>{' DAYS LEFT'}</Text>}
            {this.state.daysLeft !== null &&  this.state.daysLeft < 0 && <Text style={styles.headerText}><Text style={{fontSize: 40}}>{Math.abs(this.state.daysLeft)}</Text>{' DAYS LATE'}</Text>}
            {this.state.daysOfPeriod !== null && this.state.daysOfPeriod !== 0 && <Text style={styles.headerText}><Text style={{fontSize: 40}}>{getOrdinal(this.state.daysOfPeriod + 1)}</Text>{' DAY OF PERIOD'}</Text>}
            <Text style={styles.subHeaderText}><Text style={{fontSize: 20}}>{this.state.nextPeriod}</Text>{' Next Period'}</Text>
            <Text style={styles.subHeaderText}><Text style={{fontSize: 20}}>{this.state.nextFertile}</Text>{' Next Fertile'}</Text>
          </View>
        </View>
        <View style={styles.suggestionBlock}>
          <Text style={styles.headerText}>{'Show me the money'}</Text>
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
    backgroundColor: '#E3F2FD',
    marginBottom: 50,
  },
  navigatorBarIOS: {
    backgroundColor: '#5C6BC0',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#1A237E',
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
    backgroundColor: '#5C6BC0',
  },
  partnerBlock: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
    marginTop: 5,
  },
  predictionBlock: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  dayLeftheader: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  subHeaderText: {
    color: '#212121',
    fontSize: 16,
  },
  suggestionBlock: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
    marginTop: 5,
  }
});
