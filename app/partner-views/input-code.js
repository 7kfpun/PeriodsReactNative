import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

export default class QRCodeReaderView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  connect() {

  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Back'
      this.save();
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          leftButton={<Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="white" onPress={Actions.pop} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            {title: 'Cancel', iconName: 'close', iconSize: 26, show: 'always'},
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
              keyboardType="number-pad"
              placeholder={'Or input the CODE here'}
              placeholderTextColor="#9E9E9E"
            />
            <Button style={styles.button} textStyle={{fontSize: 18, color: 'white'}} onPress={() => console.log()} >
              {'Connect'}
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
