import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
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
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import DateTimePicker from 'react-native-datetime';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import { config } from '../config';

export default class EndPeriodView extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, PeriodStore.getState(), SettingStore.getState());
    this.state.date = new Date();

    this.picker = null;
  }

  componentDidMount() {
    this.showDatePicker();
  }

  showDatePicker() {
    console.log(this.props);
    var date = new Date(moment(this.props.date).add(this.state.settings.PERIOD_LENGTH.VALUE, 'days')) || this.state.date;
    this.refs.picker.showDatePicker(date, (d) => {
      if (moment().diff(d) < 0) {
        this.setState({date: new Date()});
        Alert.alert(
          'The date input should be before today.',
          '',
          [
            {text: 'OK', onPress:() => console.log()},
          ]
        );
      } else {
        this.setState({date: d});
      }
    });
  }

  save() {
    console.log('Save');
    PeriodActions.endPeriod({
      date: this.state.date,
    });
    Actions.pop();
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Save'
      this.save();
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{tintColor: '#EF5350', style: 'light-content'}}
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          leftButton={<Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="white" onPress={() => Actions.pop()} />}
          rightButton={<Icon style={styles.navigatorRightButton} name="check" size={26} color="white" onPress={() => this.save()} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          navIconName="arrow-back"
          onIconClicked={Actions.pop}
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            {title: 'Save', iconName: 'check', iconSize: 26, show: 'always'},
          ]}
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    const format = Platform.OS === 'ios' ? 'LL' : 'll';
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ScrollView>
          <TableView>
            <Section header="PERIOD ENDS">
              <Cell cellstyle="Basic"
                onPress={()=>this.showDatePicker()}
                title={this.props.date && moment(this.props.date).add(this.state.settings.PERIOD_LENGTH.VALUE, 'days').format(format)
                  || this.state.date && moment(this.state.date).format(format)}
              />
            </Section>
          </TableView>
        </ScrollView>

        {Platform.OS === 'android' && <AdMobBanner bannerSize={'smartBannerPortrait'} adUnitID={config.adUnitID.android} />}
        {Platform.OS === 'ios' && <AdMobBanner bannerSize={'smartBannerPortrait'} adUnitID={config.adUnitID.ios} />}

        <DateTimePicker cancelText={'Cancel'} okText={'OK'} ref={'picker'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
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
  input: {
    paddingLeft: 15,
    height: 45,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'gray',
  },
});
