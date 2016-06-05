import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment';

// Flux
import PeriodActions from '../actions/period-actions';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import DateTimePicker from 'react-native-datetime';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import Slider from 'react-native-slider';
import store from 'react-native-simple-store';

export default class AddPeriodView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date || new Date(),
      length: 3,
    };
    this.picker = null;
  }

  showDatePicker() {
    var date = this.state.date;
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
    PeriodActions.addPeriod({
      date: this.state.date,
      length: this.state.length,
    });

    store.save('gender', 'female');
    Actions.main();
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
          leftButton={<Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="white" onPress={Actions.selectGender} />}
          rightButton={<Icon style={styles.navigatorRightButton} name="check" size={26} color="white" onPress={() => this.save()} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          navIconName="arrow-back"
          onIconClicked={Actions.selectGender}
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
            <Section header="PERIOD STARTS">
              <Cell cellstyle="Basic"
                onPress={()=>this.showDatePicker()}
                title={this.state.date && moment(this.state.date).format(format)}
              />
            </Section>

            <Section header="BLEEDING DAYS">
              <View style={{backgroundColor: 'white'}}>
                <Slider
                  style={sliderStyles.container}
                  trackStyle={sliderStyles.track}
                  thumbStyle={sliderStyles.thumb}
                  minimumTrackTintColor="#31a4db"
                  thumbTouchSize={{width: 50, height: 40}}
                  value={this.state.length}
                  onValueChange={(length) => this.setState({length})}
                  minimumValue={1}
                  maximumValue={30}
                  step={1}
                />
              </View>
              <Text style={{marginLeft: 20}}>Value: {this.state.length}</Text>
            </Section>
          </TableView>
        </ScrollView>

        <DateTimePicker cancelText={'Cancel'} okText={'OK'} ref={'picker'} />
      </View>
    );
  }
}

const sliderStyles = StyleSheet.create({
  container: {
    height: 45,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: 'white',
  },
  track: {
    height: 2,
    backgroundColor: '#303030',
  },
  thumb: {
    width: 10,
    height: 10,
    backgroundColor: '#31a4db',
    borderRadius: 10 / 2,
    shadowColor: '#31a4db',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EF5350',
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
