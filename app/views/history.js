import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

// Flux
import PeriodStore from '../stores/period-store';
import SettingStore from '../stores/setting-store';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobBanner } from 'react-native-admob';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import moment from 'moment';

import {config} from '../config';

export default class CalendarView extends React.Component {
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
      let cycleDiffs = [];
      for (let i = 0; i < this.state.periods.length - 1; i++) {
        cycleDiffs.push(moment(this.state.periods[i].date).diff(this.state.periods[i + 1].date, 'days'));
      }
      console.log('cycleDiffs', cycleDiffs);

      this.setState({
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
  }

  _onFetch(page = 1, callback, options) {
    var rows = this.state.periods.slice(4 * (page - 1), 4 * page);
    if (4 * page >= this.state.periods.length) {
      callback(rows, {
        allLoaded: true, // the end of the list is reached
      });
    } else {
      callback(rows);
    }
  }

  _renderRowView(rowData) {
    return (
      <TouchableHighlight
        style={styles.row}
        underlayColor="#C8C7CC"
        onPress={() => Actions.editHistory(rowData)}
      >
        <View>
          <Text style={styles.historyText}>{moment(rowData.date).format('MMM D, YYYY')} - {moment(rowData.date).add(rowData.length, 'day').format('MMM D, YYYY')}</Text>
          <Text style={styles.historyText}>Length: {rowData.length}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Settings'
      Actions.settings();
    }
  }

  _renderPaginationWaitingView(paginateCallback) {
    return (
      <TouchableHighlight
        underlayColor="#C8C7CC"
        onPress={paginateCallback}
        style={styles.paginationView}
      >
        <View style={{flexDirection: 'row'}}>
          <Icon name="touch-app" size={15} color="gray"/>
          <Text style={{fontSize: 13}}>{'Load more'}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderPaginationAllLoadedView() {
    return null;
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
        <ScrollView>
          <View style={styles.block}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{'History'}</Text>
              <Text style={styles.subHeaderHighlightText}>{'Predictions'}</Text>
            </View>
            <GiftedListView
              key={this.state.key}
              rowView={this._renderRowView}
              onFetch={(page, callback) => this._onFetch(page, callback)}
              firstLoader={true}
              refreshable={false}
              withSections={false}

              paginationAllLoadedView={this._renderPaginationAllLoadedView}

              pagination={true}
              paginationWaitingView={this._renderPaginationWaitingView}

              refreshableTintColor="blue"
            />
            <View style={styles.header}>
              <Text style={styles.headerText}>{''}</Text>
              <TouchableOpacity
                onPress={() => Actions.addPeriod()}>
                <Text style={styles.subHeaderHighlightText}>{'Add period'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.block}>
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

          <View style={styles.rectangleAdBlock}>
            {Platform.OS === 'android' && <AdMobBanner bannerSize={'mediumRectangle'} adUnitID={config.adUnitID.android} />}
            {Platform.OS === 'ios' && <AdMobBanner bannerSize={'mediumRectangle'} adUnitID={config.adUnitID.ios} />}
          </View>
        </ScrollView>
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
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  headerText: {
    color: '#212121',
    fontSize: 20,
  },
  subHeaderText: {
    color: '#212121',
    fontSize: 16,
  },
  subHeaderHighlightText: {
    color: '#EF5350',
    fontSize: 16,
  },
  historyText: {
    color: '#808080',
  },
  row: {
    height: 50,
    padding: 10,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  buttonLeft: {
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
    borderColor: '#4DB6AC',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 3,
  },
  buttonRight: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    borderColor: '#FFB74D',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 3,
  },
  paginationView: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  rectangleAdBlock: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#424242',
    alignItems: 'center',
  },
});
