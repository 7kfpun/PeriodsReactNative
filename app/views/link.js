import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Dimensions from 'Dimensions';

import Firebase from 'firebase';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Cell, CustomCell, Section, TableView } from 'react-native-tableview-simple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import NavigationBar from 'react-native-navbar';
import QRCode from 'react-native-qrcode';
import Share from 'react-native-share';
import store from 'react-native-simple-store';

const WIDTH = Dimensions.get('window').width;

import { guid } from '../utils/guid';

import { config } from '../config';

export default class LinkView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLinkingEnabled: false,
      uuid: '',
      linkedAccounts: null,
    };
  }

  componentWillMount() {
    this.firebaseRef = new Firebase(config.firebaseHost);
  }

  componentDidMount() {
    let that = this;
    store.get('isLinkingEnabled').then((isLinkingEnabled) => {
      store.get('uuid').then((uuid) => {
        if (isLinkingEnabled) {
          that.setState({isLinkingEnabled: true});

          that.firebaseRef.child('users').child(uuid).child('linkedAccounts').on('value', (snapshot) => {
            console.log('linkedAccounts', snapshot.val());
            that.setState({
              linkedAccounts: snapshot.val() || {},
            });
          });
        }
      });
    });
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
            let uuid = guid();
            this.setState({
              isLinkingEnabled: value,
              uuid: uuid,
            });
            store.save('isLinkingEnabled', value);
            store.save('uuid', uuid);
            let that = this;
            store.get('periods').then((periods) => {
              that.firebaseRef.child('users').child(uuid).update({
                isLinkingEnabled: true,
                periods: periods,
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
              uuid: null,
            });
            let that = this;
            store.get('uuid').then((uuid) => that.firebaseRef.child('users').child(uuid).remove());
            store.delete('isLinkingEnabled');
            store.delete('uuid');
          }}
        ]
      );
    }
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
            this.firebaseRef.child('users').child(uuid).child('linkedAccounts').child(linkedUuid).remove();
          });
        }},
      ]
    );
  }

  share() {
    Share.open({
      share_text: this.state.uuid,
      share_URL: 'http://google.cl',
      title: "Download app from 'URL' and input this 'CODE' to sync with your girlfriend."
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
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          leftButton={<Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="white" onPress={() => Actions.pop()} />}
          rightButton={<EvilIcon style={styles.navigatorRightButton} name="share-apple" size={32} color="white" onPress={() => this.share()} />}
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
            <Section header="LINKING" footer={this.state.uuid}>
              <CustomCell>
                <Text style={{flex: 1, fontSize: 16, color: 'black'}}>Enable</Text>
                <Switch
                  onValueChange={(value) => this.enableLinking(value)}
                  value={this.state.isLinkingEnabled} />
              </CustomCell>
              {this.state.isLinkingEnabled && this.state.uuid && <TouchableOpacity style={styles.qrBlock} onPress={() => this.share()}>
                <QRCode
                  value={this.state.uuid}
                  size={WIDTH - 100}
                  bgColor="purple"
                  fgColor="white"
                />
              </TouchableOpacity>}
            </Section>
            {this.state.isLinkingEnabled && <Section header="LINKED DEVICES" footer={this.state.linkedAccounts && Object.keys(this.state.linkedAccounts).length > 0 && 'Tap to remove'}>
              {(() => {
                switch (this.state.linkedAccounts && Object.keys(this.state.linkedAccounts).length > 0) {
                  case true:    return Object.keys(this.state.linkedAccounts).map((uuid, i) => {
                    return <Cell
                      key={i}
                      cellstyle="RightDetail"
                      title={this.state.linkedAccounts[uuid].name}
                      detail={uuid.slice(0, 8) + '...'}
                      onPress={() => that.removeLink(uuid)}
                    />;
                  });
                  default:      return <Cell
                    key={''}
                    cellstyle="Basic"
                    title={'Click to share the CODE to your partnar'}
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
  qrBlock: {
    height: 360,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
