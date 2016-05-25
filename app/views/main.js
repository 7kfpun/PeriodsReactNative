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

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Button from 'apsl-react-native-button';
import Calendar from 'react-native-calendar';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import moment from 'moment';
import _ from 'underscore';

import { data } from '../data.js';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = PeriodStore.getState();
    this.state.settings = data.settings;
  }

  componentDidMount() {
    PeriodStore.listen((state) => this.onPeriodStoreChange(state));
  }

  componentWillUnmount() {
    PeriodStore.unlisten((state) => this.onPeriodStoreChange(state));
  }

  onPeriodStoreChange(state) {
    console.log('onPeriodStoreChange', state);
    this.setState({
      periods: state.periods,
      isStarted: state.isStarted,
      averagePeriodDays: state.averagePeriodDays,
      averageCycleDays: state.averageCycleDays,
      key: Math.random(),
    });
  }

  _onFetch(page = 1, callback, options) {
    var rows = this.state.periods.slice(4 * (page - 1), 4 * page);
    if (4 * page > this.state.periods.length) {
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
          <Text>{moment(rowData.date).format('MMM Do, YYYY')} - {moment(rowData.date).add(rowData.length, 'day').format('MMM Do, YYYY')}</Text>
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

  render_prediction_block() {
    if (this.state.periods && this.state.periods.length > 0) {
      return <View style={[styles.block, {marginTop: 10}]}>
        <View style={styles.dayLeftheader}>
          <Text style={styles.headerText}><Text style={{fontSize: 40}}>{'12'}</Text>{' DAYS LEFT'}</Text>
          <Text style={styles.subHeaderText}><Text style={{fontSize: 20}}>{'Jun 12'}</Text>{' Next Period'}</Text>
          <Text style={styles.subHeaderText}><Text style={{fontSize: 20}}>{'Jun 1'}</Text>{' Next Fertile'}</Text>
        </View>

        <View>
          {!this.state.isStarted && <Button style={styles.buttonRight} textStyle={{fontSize: 18}} onPress={Actions.startPeriod} >
            {'Period Starts'}
          </Button>}
          {this.state.isStarted && <Button style={styles.buttonRight} textStyle={{fontSize: 18}} onPress={Actions.endPeriod} >
            {'Period Ends'}
          </Button>}
          <Button style={styles.buttonRight} textStyle={{fontSize: 18}} onPress={() => store.get('periods').then((periods) => console.log(periods))} >
            {'Print all'}
          </Button>
          <Button style={styles.buttonRight} textStyle={{fontSize: 18}} onPress={() => store.delete('periods')} >
            {'Delete all'}
          </Button>
        </View>
      </View>;
    } else {
      return <View style={[styles.block, {marginTop: 10}]}>
        <View style={styles.dayLeftheader}>
          <Text style={styles.headerText}>Please enter your period.</Text>
        </View>

        <View>
          <Button style={styles.buttonRight} textStyle={{fontSize: 18}} onPress={Actions.startPeriod} >
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
        <ScrollView>
          {this.render_prediction_block()}

          {/*<View style={styles.block}>*/}
            <Calendar
              scrollEnabled={true}
              showControls={true}
              eventDates={['2015-07-03', '2015-07-05', '2015-07-10', '2015-07-15', '2015-07-20', '2015-07-25', '2015-07-28', '2015-07-30']}
              titleFormat={'MMMM YYYY'}
              dayHeadings={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
              prevButtonText={<Icon name="keyboard-arrow-left" size={20} color="#9E9E9E" />}
              nextButtonText={<Icon name="keyboard-arrow-right" size={20} color="#9E9E9E" />}
              onDateSelect={(date) => console.log(date)}
              onTouchPrev={this.onTouchPrev}
              onTouchNext={this.onTouchNext}
              onSwipePrev={this.onSwipePrev}
              onSwipeNext={this.onSwipeNext}
              eventDates={['2015-07-01']}
              startDate={'2015-08-01'}
              selectedDate={'2015-08-15'}
              customStyle={{
                controlButton: {
                  paddingLeft: 50,
                  paddingRight: 50,
                },
                calendarContainer: {
                  backgroundColor: 'white',
                },
                day: {
                  fontSize: 15,
                  textAlign: 'center',
                }
              }}
             />
           {/*</View>*/}

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
            <View style={styles.header}>
              <Text style={styles.headerText}>Statistics</Text>
              <Text style={styles.subHeaderText}>Average</Text>
            </View>
            <View style={styles.header}>
              <Text style={styles.subHeaderText}>Average period days</Text>
              <Text style={styles.subHeaderHighlightText}>
                {this.state.averagePeriodDays} Days
              </Text>
            </View>
            <View style={styles.header}>
              <Text style={styles.subHeaderText}>Average period cycle</Text>
              <Text style={styles.subHeaderHighlightText}>
                {this.state.averageCycleDays} Days
              </Text>
            </View>
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
});
