import React from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Firebase from 'firebase';
import moment from 'moment';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import BarcodeScanner from 'react-native-barcode-scanner-universal';
import Button from 'apsl-react-native-button';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';
// import Toast from 'react-native-root-toast';

import { config } from '../config';
import { guid } from '../utils/guid';

const WIDTH = Dimensions.get('window').width;

export default class QRCodeReaderView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      cameraAvailable: false,
    };
    // this.state = {cameraAvailable: true};
  }

  componentWillMount() {
    this.firebaseRef = new Firebase(config.firebaseHost);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  checkCamera() {
    if (Platform.OS === 'ios') {
      Camera.checkDeviceAuthorizationStatus().then(isAuthorized => {
        console.log(isAuthorized);
        if (isAuthorized) {
          this.setState({cameraAvailable: true});
        } else {
          Alert.alert(
            'Camera Access Denied',
            'Go to Settings / Privacy / Camera and enable access for this app',
            [
              {text: 'OK', onPress:() => console.log()},
            ]
          );
        }
      }).catch(err => console.error(err));
    } else {
      this.setState({cameraAvailable: true});
    }
  }

  connect(linkingToken) {
    if (!this.state.isLoading) {
      this.setState({isLoading: true});

      console.log(linkingToken);
      var that = this;
      console.log('linkingToken', linkingToken);
      this.firebaseRef.child('users').orderByChild('linkingToken/token').equalTo(linkingToken).once('value', function(snapshot) {
        if (snapshot.val()) {
          var keys = Object.keys(snapshot.val());
          if (keys.length > 0) {
            var uuid = guid();
            store.save('uuid', uuid);
            store.save('gender', 'male');
            var partnerUuid = keys[0];
            console.log('partnerUuid', partnerUuid);
            store.save('partnerUuid', partnerUuid);
            that.firebaseRef.child('users').child(partnerUuid).child('partners').child(uuid).set({
              uuid: uuid,
              gender: 'male',
              linkedDate: moment().format(),
            });

            Actions.mainMale();
            // Toast.show('Nice! You have linked the calendar with your partnar.', {
            //   duration: Toast.durations.SHORT,
            //   position: Toast.positions.BOTTOM,
            //   onHidden: Actions.mainMale,
            // });
          }
        }
      });
    }
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Settings'
      Actions.selectGender();
      store.delete('gender');
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          rightButton={<Icon style={styles.navigatorRightButton} name="close" size={26} color="white" onPress={() => {Actions.selectGender(); store.delete('gender');}} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            {title: 'Close', iconName: 'close', iconSize: 26, show: 'always'},
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

    if (!this.state.cameraAvailable) {
      this.checkCamera();
    }

    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={[styles.block, {marginTop: 10, height: 40}]}>
            <Text style={{fontSize: 16, color: '#BDBDBD'}}>{"Scan QR code from your partnar"}</Text>
          </View>

          <View style={styles.block}>
            {!this.state.cameraAvailable && <Icon name="refresh" size={32} color="gray" onPress={() => this.checkCamera()} />}
            {this.state.cameraAvailable && <BarcodeScanner
              onBarCodeRead={(code) => {
                this.setState({code: code});
                if (code && code.type === 'org.iso.QRCode') {
                  this.connect(code.data);
                  // Actions.inputCode({value: code.data});
                }
              }}
              captureAudio={false}
              style={styles.camera}>
              {scanArea}
            </BarcodeScanner>}
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
