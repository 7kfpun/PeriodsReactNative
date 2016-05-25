import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import {
  Section,
  TableView,
} from 'react-native-tableview-simple';

export default class PeriodLengthSettingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  save() {
    console.log('Save');
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
            <Section header="PERIOD LENGTH">
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                keyboardType="number-pad"
                placeholder="3 Days"
              />
            </Section>
          </TableView>
        </ScrollView>
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
