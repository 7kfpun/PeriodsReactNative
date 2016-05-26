import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Flux
import PeriodActions from '../actions/period-actions';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import DateTimePicker from 'react-native-datetime';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import Slider from 'react-native-slider';

import moment from 'moment';

export default class EditHistoryView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(this.props.date),
      length: this.props.length,
    };
    this.picker = null;
  }

  showDatePicker() {
    var date = this.state.date;
    this.picker.showDatePicker(date, (d)=>{
      this.setState({date: d});
    });
  }

  save() {
    console.log('Save');
    PeriodActions.editPeriod({
      uuid: this.props.uuid,
      date: this.state.date,
      length: this.state.length,
    });
    Actions.pop();
  }

  delete() {
    PeriodActions.deletePeriod({
      uuid: this.props.uuid,
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
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          leftButton={<Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="white" onPress={() => Actions.pop()} />}
          rightButton={<Icon style={styles.navigatorRightButton} name="check" size={26} color="white" onPress={() => this.save()} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
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
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ScrollView>
          <TableView>
            <Section header="PERIOD STARTS">
              <Cell cellstyle="Basic"  onPress={() => this.showDatePicker()}
                title={this.state.date && moment(this.state.date).format('MMM Do YY')} />
            </Section>

            <Section header="BLEEDING DAYS">
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
              <Text>Value: {this.state.length}</Text>
            </Section>

            <Section>
              <Cell style={{backgroundColor: 'gray'}} cellstyle="Basic"  onPress={() => this.delete()}
                title={"DELETE"} />
            </Section>
          </TableView>
        </ScrollView>

        <DateTimePicker cancelText="Cancel" okText="OK" ref={(picker)=> {this.picker = picker;}} />
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
