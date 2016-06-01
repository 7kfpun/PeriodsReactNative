import React from 'react';
import {
  Alert,
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Cell, CustomCell,Section, TableView } from 'react-native-tableview-simple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

export default class SettingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      NOTIFICATION_1: true,
      NOTIFICATION_2: true,
      NOTIFICATION_3: true,
    };
  }

  disconnect() {
    Alert.alert(
      'Remove linking',
      'You will disconnect with your partnar\'s calendar',
      [
        {text: 'Cancel', onPress: () => console.log()},
        {text: 'OK', onPress: () => {
          AsyncStorage.clear();
          Actions.selectGender();
        }},
      ]
    );
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
        <ScrollView>
          <TableView>
            <Section header="NOTIFICATION">
              <CustomCell>
                <Text style={{flex: 1, fontSize: 16, color: 'black'}}>NOTIFICATION_1</Text>
                <Switch
                  onValueChange={(value) => this.setState({NOTIFICATION_1: value})}
                  value={this.state.NOTIFICATION_1} />
              </CustomCell>
              <CustomCell>
                <Text style={{flex: 1, fontSize: 16, color: 'black'}}>NOTIFICATION_2</Text>
                <Switch
                  onValueChange={(value) => this.setState({NOTIFICATION_2: value})}
                  value={this.state.NOTIFICATION_2} />
              </CustomCell>
              <CustomCell>
                <Text style={{flex: 1, fontSize: 16, color: 'black'}}>NOTIFICATION_3</Text>
                <Switch
                  onValueChange={(value) => this.setState({NOTIFICATION_3: value})}
                  value={this.state.NOTIFICATION_3} />
              </CustomCell>
            </Section>

            <Section header="LINK">
              <Cell cellstyle="Basic" title="Remove Linking" onPress={() => this.disconnect()} />
            </Section>

            <Section header="DEVELOPMENT">
              <Cell
                cellstyle="Basic"
                title="Print all"
                onPress={() => {
                  store.get('periods').then((periods) => console.log(periods));
                  store.get('settings').then((settings) => console.log(settings));
                  store.get('gender').then((gender) => console.log(gender));
                }}
              />
              <Cell
                cellstyle="Basic"
                title="Delete all"
                onPress={() => {store.delete('periods'); store.delete('settings');}}
              />
              <Cell
                cellstyle="Basic"
                title="Clear all"
                onPress={() => {AsyncStorage.clear(); Actions.selectGender();}}
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
});
