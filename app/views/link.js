import React from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Firebase from 'firebase';
import moment from 'moment';

// 3rd party libraries
import { Cell, CustomCell, Section, TableView } from 'react-native-tableview-simple';
import DeviceInfo from 'react-native-device-info';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import QRCode from 'react-native-qrcode';
import Share from 'react-native-share';
import store from 'react-native-simple-store';

const WIDTH = Dimensions.get('window').width;

import { config } from '../config';
import { guid } from '../utils/guid';
import { token } from '../utils/token';

export default class LinkView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLinkingEnabled: false,
      linkingToken: {},
      uuid: '',
      partners: null,
    };
  }

  componentWillMount() {
    this.firebaseRef = new Firebase(config.firebaseHost);
  }

  componentDidMount() {
    this.getPartners();
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  enableLinking(value) {
    if (value) {  // Enable
      Alert.alert(
        'Enable linking',
        null,
        [
          {text: 'Cancel', onPress: () => this.setState({isLinkingEnabled: false})},
          {text: 'OK', onPress: () => {
            this.setState({
              isLinkingEnabled: value,
            });

            let uuid = guid();
            let that = this;
            store.save('isLinkingEnabled', value);
            store.save('uuid', uuid).then(() => {
              that.updateToken();
              that.getPartners();

              store.get('periods').then((periods) => {
                store.get('settings').then((settings) => {
                  that.firebaseRef.child('periods').child(uuid).set(periods);
                  that.firebaseRef.child('settings').child(uuid).set(settings);
                });
              });
            });
          }},
        ]
      );
    } else {  // Disable
      Alert.alert(
        'Disable linking',
        'Linked account(s) would be removed.',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel')},
          {text: 'OK', onPress: () => {
            this.setState({
              isLinkingEnabled: value,
            });

            let that = this;
            store.get('uuid').then((uuid) => {
              that.firebaseRef.child('users').child(uuid).remove();
              that.firebaseRef.child('partners').child(uuid).remove();
              that.firebaseRef.child('periods').child(uuid).remove();
              that.firebaseRef.child('settings').child(uuid).remove();
            });
            store.delete('isLinkingEnabled');
            store.delete('uuid');
            store.delete('linkingToken');
            store.delete('expiredDate');
          }}
        ]
      );
    }
  }

  updateToken() {
    let that = this;
    store.get('uuid').then((uuid) => {
      let linkingToken = {
        token: token(),
        expiredDate: moment().add(1, 'day').format(),
      };

      this.setState({
        linkingToken: linkingToken,
        key: Math.random(),
      });
      store.save('linkingToken', linkingToken);

      that.firebaseRef.child('users').child(uuid).update({
        gender: 'FEMALE',
        linkingToken: linkingToken,
        name: DeviceInfo.getDeviceName(),
      });

    });
  }

  getPartners() {
    let that = this;
    store.get('isLinkingEnabled').then((isLinkingEnabled) => {
      store.get('uuid').then((uuid) => {
        store.get('partners').then((partners) => {
          store.get('linkingToken').then((linkingToken) => {
            if (isLinkingEnabled) {
              that.setState({
                uuid: uuid,
                partners: partners,
                isLinkingEnabled: true,
                linkingToken: linkingToken,
              });

              that.firebaseRef.child('partners').child(uuid).on('value', (snapshot) => {
                console.log('partners', snapshot.val());
                partners = snapshot.val() || {};
                that.setState({partners: partners});
                Object.keys(partners).forEach((partner) => {
                  that.firebaseRef.child('users').child(partner).once('value', (snapshot1) => {
                    console.log('snapshotsnapshot1', snapshot1.val());
                    partners[partner] = snapshot1.val();
                    that.setState({partners: partners});
                  });
                });
                store.save('partners', partners);
              });
            }
          });
        });
      });
    });
  }
  removeLink(linkedUuid) {
    Alert.alert(
      'Delete linking',
      null,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel')},
        {text: 'OK', onPress: () => {
          console.log(linkedUuid);
          store.get('uuid').then((uuid) => {
            this.firebaseRef.child('partners').child(uuid).child(linkedUuid).remove();
          });
        }},
      ]
    );
  }

  share() {
    let share_text;
    if (this.state.enableLinking && this.state.linkingToken) {
      share_text =  "Download the best Period Calender app and input this 'CODE' to pair with your partner. CODE: " + this.state.linkingToken.token;
    } else {
      share_text =  'Download the best Period Calender app and pair with your partner for free.';
    }

    Share.open({
      share_text: share_text,
      share_URL: 'http://google.cl',
      title: 'Period Calender',
    },(e) => {
      console.log(e);
    });
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Save'
      this.share();
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{tintColor: '#EF5350', style: 'light-content'}}
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          rightButton={<EvilIcon style={styles.navigatorRightButton} name="share-apple" size={32} color="white" onPress={() => this.share()} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            {title: 'Share', iconName: 'share', iconSize: 26, show: 'always'},
          ]}
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    let that = this;
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ScrollView>
          <TableView>
            <Section header="LINKING" footer="Scan QR code or input the code in your partner device to pair calendar.">
              <CustomCell>
                <Text style={{flex: 1, fontSize: 16, color: 'black'}}>Enable</Text>
                <Switch
                  onValueChange={(value) => this.enableLinking(value)}
                  value={this.state.isLinkingEnabled} />
              </CustomCell>

              <Cell cellstyle="RightDetail" title="Name" detail={DeviceInfo.getDeviceName()} />

              <CustomCell>
                <Text style={{flex: 1, fontSize: 16, color: 'black'}}>Token</Text>
                <Text style={{alignItems: 'flex-end', fontSize: 16, color: '#424242'}}>{this.state.linkingToken.token}</Text>
                <Icon style={{alignItems: 'flex-end'}} name="refresh" size={20} color="#1565C0" onPress={() => this.updateToken()} />
              </CustomCell>

              {this.state.isLinkingEnabled
                && <View style={{backgroundColor: 'white'}}>
                    <TouchableOpacity style={styles.qrBlock} onPress={() => this.share()}>
                      <View>
                        <QRCode
                          key={this.state.key}
                          value={this.state.linkingToken.token}
                          size={WIDTH - 80}
                          bgColor="purple"
                          fgColor="white"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                }
            </Section>

            {this.state.isLinkingEnabled
              && <Section header="LINKED DEVICES" footer={this.state.partners && Object.keys(this.state.partners).length > 0 && 'Tap to remove'}>
              {(() => {
                switch (this.state.partners && Object.keys(this.state.partners).length > 0) {
                  case true:    return Object.keys(this.state.partners).map((uuid, i) => {
                    return <Cell
                      key={i}
                      cellstyle="RightDetail"
                      title={this.state.partners[uuid].gender + ' ' + this.state.partners[uuid].name}
                      detail={uuid.slice(0, 8) + '...'}
                      onPress={() => that.removeLink(uuid)}
                    />;
                  });
                  default:      return <Cell
                    key={this.state.key}
                    cellstyle="Basic"
                    title={'Tap to share the CODE to your partnar'}
                    onPress={() => this.share()}
                  />;
                }
              })()}
            </Section>}

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
    marginBottom: 50,
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
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'white',
  },
  codeText: {
    fontSize: 20,
    textAlign: 'center'
  },
  qrBlock: {
    height: WIDTH,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
