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

import Calendar from '../utils/calendar';

export default class CalendarView extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, PeriodStore.getState(), SettingStore.getState());
    // this.state = PeriodStore.getState();
    // this.state.settings = data.settings;
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
    this.setState({settings: state.settings});
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          rightButton={<Icon style={styles.navigatorRightButton} name="settings" size={26} color="white" onPress={() => {
            Actions.settings();
          }} />}
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
      'Alert Title',
      d.date.toString(),
      [
        {text: 'Add period', onPress: () => console.log('Ask me later pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ]
    );
  }

  render() {

    const today = new Date(),
      todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
      aWeekLater = new Date(today.getTime() +  7 * 24 * 60 * 60 * 1000),
      aWeekLaterStr = aWeekLater.getFullYear() + '-' + (aWeekLater.getMonth() + 1) + '-' + aWeekLater.getDate();

    // Options
    const holiday = {
      [todayStr]: 'Today',
    },

    active = {
      [todayStr]: 'fill',
      [aWeekLaterStr]: 'fill',
      '2016-03-05': 'border',
      '2016-04-10': 'blooding',
      '2016-04-25': 'border',
      '2016-06-05': 'border',
      '2016-06-06': 'border',
      '2016-06-07': 'border',
      '2016-06-17': 'fill',
      '2016-06-18': 'fill',
      '2016-06-19': 'fill',
      '2016-06-25': 'blooding',
      '2016-06-26': 'blooding',
      '2016-06-27': 'blooding',
    },

    note = {
      [todayStr]: '出发',
      // [aWeekLaterStr]: '返程',
      '2016-03-05': '特价',
      '2016-04-10': '特价',
      '2016-04-25': '特价',
      '2016-05-05': '特价',
      '2016-06-25': '.',
    };

    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <Calendar
          holiday={holiday}
          active={active}
          note={note}
          startTime="2016-04-01"
          endTime="2016-12-01"
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
