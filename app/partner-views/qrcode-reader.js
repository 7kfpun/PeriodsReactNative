import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Dimensions from 'Dimensions';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import BarcodeScanner from 'react-native-barcode-scanner-universal';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

const WIDTH = Dimensions.get('window').width;

export default class QRCodeReaderView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  connect() {

  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          rightButton={<Icon style={styles.navigatorRightButton} name="close" size={26} color="white" onPress={Actions.selectGender} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            {title: 'Settings', iconName: 'close', iconSize: 26, show: 'always'},
          ]}
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    let scanArea = null;
    if (Platform.OS === 'ios') {
      scanArea = (
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={[styles.block, {marginTop: 10, height: 40}]}>
            <Text style={{fontSize: 16, color: '#BDBDBD'}}>{"Scan QR code from your partnar"}</Text>
          </View>

          <View style={styles.block}>
            <BarcodeScanner
              onBarCodeRead={(code) => {console.log(code); this.setState({code: code});}}
              style={styles.camera}>
              {scanArea}
            </BarcodeScanner>
          </View>

          <View style={styles.block}>
            <Button style={styles.button} textStyle={{fontSize: 18, color: '#BDBDBD'}} onPress={Actions.inputCode} >
              {'Or input the CODE instead?'}
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
    backgroundColor: '#424242',
  },
  camera: {
    flex: 1
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rectangle: {
    height: 250,
    width: WIDTH - 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#616161',
    backgroundColor: 'transparent'
  },
});
