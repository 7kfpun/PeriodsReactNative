import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import Firebase from 'firebase';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Button from 'apsl-react-native-button';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import Toast from 'react-native-root-toast';
import store from 'react-native-simple-store';

import { config } from '../config';

export default class InputNameView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: DeviceInfo.getDeviceName(),
    };
  }

  componentWillMount() {
    this.firebaseRef = new Firebase(config.firebaseHost);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  addName(name) {
    if (name) {
      var that = this;
      store.get('uuid').then((uuid) => {
        that.firebaseRef.child('users').child(uuid).update({
          name: name,
        });
      });

      Toast.show('Nice! You have linked the calendar with your partnar.', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        onHidden: Actions.mainMale,
      });
    } else {
      Alert.alert(
        'Please input your name.',
        '',
        [
          {text: 'OK', onPress:() => console.log()},
        ]
      );
    }
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Back'
      Actions.mainMale();
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          rightButton={{title: 'Skip', handler: Actions.mainMale}}
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
            {title: 'Skip', show: 'always'},
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
        <View style={{flex: 1}}>
          <View style={[styles.block, {marginTop: 20}]}>
            <TextInput
              style={styles.input}
              onChangeText={(value) => this.setState({value})}
              value={this.state.value}
              placeholder={'Inout your name here'}
              placeholderTextColor="#9E9E9E"
            />
            <Button style={styles.button} textStyle={{fontSize: 18, color: 'white'}} onPress={() => this.addName(this.state.value)} >
              {'Add name'}
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  navigatorBarIOS: {
    backgroundColor: '#263238',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#424242',
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
    backgroundColor: '#263238',
  },
  block: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    flex: 1,
    marginBottom: 20,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: '#9E9E9E',
  },
  input: {
    color: 'white',
    paddingLeft: 15,
    height: 45,
    backgroundColor: '#424242',
    marginBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'gray',
  },
});
