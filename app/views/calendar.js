import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

// Flux
import PeriodStore from '../stores/period-store';
import SettingStore from '../stores/setting-store';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import moment from 'moment';

import Calendar from '../utils/calendar';

export default class CalendarView extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, PeriodStore.getState(), SettingStore.getState());
  }

  componentDidMount() {
    PeriodStore.listen((state) => this.onPeriodStoreChange(state));
    SettingStore.listen((state) => this.onSettingStoreChange(state));
  }

  componentWillUnmount() {
    PeriodStore.unlisten((state) => this.onPeriodStoreChange(state));
    SettingStore.unlisten((state) => this.onSettingStoreChange(state));
  }

  onPeriodStoreChange(state) {
    console.log('onPeriodStoreChange', state);
    this.setState({
      periods: state.periods,
      key: Math.random(),
    });
  }

  onSettingStoreChange(state) {
    console.log('onSettingStoreChange', state);
    this.setState({
      settings: state.settings,
      key: Math.random(),
    });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          leftButton={<Icon style={styles.navigatorLeftButton} name="help" size={26} color="white" onPress={() => {
            console.log('Help');
          }} />}
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

  showDate(d) {
    Alert.alert(
      'Add on ' + moment(d.date).format('MMM D, YYYY'),
      '',
      [
        {text: 'Add period', onPress: () => Actions.addPeriod({date: d.date})},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ]
    );
  }

  render() {
    const today = new Date(),
      todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      // aWeekLater = new Date(today.getTime() +  7 * 24 * 60 * 60 * 1000),
      // aWeekLaterStr = aWeekLater.getFullYear() + '-' + (aWeekLater.getMonth() + 1) + '-' + aWeekLater.getDate();

    // Options
    let holiday = {
      // [todayStr]: 'Today',
    },

    active = {
      // [todayStr]: 'fill',
      // [aWeekLaterStr]: 'fill',
      // '2016-03-05': 'border',
      // '2016-04-10': 'blooding',
      // '2016-04-25': 'border',
      // '2016-06-05': 'border',
      // '2016-06-06': 'border',
      // '2016-06-07': 'border',
      // '2016-06-17': 'fill',
      // '2016-06-18': 'fill',
      // '2016-06-19': 'fill',
      // '2016-06-25': 'blooding',
      // '2016-06-26': 'blooding',
      // '2016-06-27': 'blooding',
    },

    note = {
      // [aWeekLaterStr]: '返程',
      // '2016-03-05': '特价',
      // '2016-04-10': '特价',
      // '2016-04-25': '特价',
      // '2016-05-05': '特价',
      // '2016-06-25': '.',
    };

    this.state.periods.forEach((item) => {
      console.log(item);
      for (var i = 0; i < item.length; i++) {
        active[moment(item.date).add(i, 'days').format('YYYY-MM-DD')] = 'blooding';
        note[moment(item.date).add(i, 'days').format('YYYY-MM-DD')] = '•';
      }

      active[moment(item.date).add(-this.state.settings.OVULATION_FERTILE.VALUE, 'days').format('YYYY-MM-DD')] = 'fill';
      active[moment(item.date).add(-this.state.settings.OVULATION_FERTILE.VALUE + 1, 'days').format('YYYY-MM-DD')] = 'border';
      for (var i = 0; i < 5; i++) {
        active[moment(item.date).add(-this.state.settings.OVULATION_FERTILE.VALUE - 1 - i, 'days').format('YYYY-MM-DD')] = 'border';
      }
    });

    if (this.state.periods.length > 0) {
      let latestPeriod = this.state.periods[0];

      for (var i = 0; i < 12; i++) {
        for (var j = 0; j < this.state.settings.PERIOD_LENGTH.VALUE; j++) {
          if (i === 0) {

          } else {
            active[moment(latestPeriod.date).add(this.state.settings.CYCLE_LENGTH.VALUE * i + j, 'days').format('YYYY-MM-DD')] = 'blooding';
          }
        }

        active[moment(latestPeriod.date).add(this.state.settings.CYCLE_LENGTH.VALUE * i - this.state.settings.OVULATION_FERTILE.VALUE, 'days').format('YYYY-MM-DD')] = 'fill';
        active[moment(latestPeriod.date).add(this.state.settings.CYCLE_LENGTH.VALUE * i - this.state.settings.OVULATION_FERTILE.VALUE + 1, 'days').format('YYYY-MM-DD')] = 'border';
        for (var k = 0; k < 5; k++) {
          active[moment(latestPeriod.date).add(this.state.settings.CYCLE_LENGTH.VALUE * i - this.state.settings.OVULATION_FERTILE.VALUE - 1 - k, 'days').format('YYYY-MM-DD')] = 'border';
        }
      }
    }

    note[todayStr] = 'Today';

    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <Calendar
          key={this.state.key}
          holiday={holiday}
          active={active}
          note={note}
          startTime={moment().add(-2, 'months').format('YYYY-MM-DD')}
          endTime={moment().add(10, 'months').format('YYYY-MM-DD')}
          onPress={this.showDate}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 40,
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
});
