import React from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import Firebase from 'firebase';
import moment from 'moment';

// 3rd party libraries
import { AdMobBanner } from 'react-native-admob';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

const { WIDTH } = Dimensions.get('window');

import { config } from '../config';

export default class DemoReactNative extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      periods: [],
    };
  }

  componentWillMount() {
    this.firebaseRef = new Firebase(config.firebaseHost);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  componentDidMount() {
    this.pullData();
  }

  pullData() {
    let that = this;

    store.get('partnerUuid').then((partnerUuid) => {
      if (partnerUuid) {
        this.firebaseRef.child('users').child(partnerUuid).on('value', (snapshot) => {
          console.log('check', snapshot.val());
          let values = snapshot.val();
          if (values !== null) {
            store.save('periods', values.periods);
            store.save('settings', values.settings);
            that.setState({
              periods: values.periods,
              key: Math.random(),
            });
          }
        });
      }
    });
  }

  _onFetch(page = 1, callback, options) {
    var rows = this.state.periods.slice(4 * (page - 1), 4 * page);
    if (4 * page > this.state.periods.length) {
      callback(rows, {
        allLoaded: true, // the end of the list is reached
      });
    } else {
      callback(rows);
    }
  }

  _onPress(rowData) {
    console.log(rowData + ' pressed');
  }

  _renderRowView(rowData) {
    return (
      <View
        style={styles.row}
      >
        <View>
          <Text>{moment(rowData.date).format('MMM D, YYYY')} - {moment(rowData.date).add(rowData.length, 'day').format('MMM D, YYYY')}</Text>
          <Text>Length: {rowData.length}</Text>
        </View>
      </View>
    );
  }

  _renderPaginationWaitingView(paginateCallback) {
    return (
      <TouchableHighlight
        underlayColor="#C8C7CC"
        onPress={paginateCallback}
        style={styles.paginationView}
      >
        <View style={{flexDirection: 'row'}}>
          <Icon name="touch-app" size={15} color="gray"/>
          <Text style={{fontSize: 13}}>{'Load more'}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          rightButton={<Icon style={styles.navigatorRightButton} name="refresh" size={26} color="white" onPress={() => this.pullData()} />}
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
          <GiftedListView
            key={this.state.key}
            rowView={this._renderRowView}
            onFetch={(page, callback) => this._onFetch(page, callback)}
            firstLoader={true}

            pagination={true}
            paginationWaitingView={this._renderPaginationWaitingView}

            refreshable={true}
            withSections={false} // enable sections
            customStyles={{
              paginationView: {
                backgroundColor: '#eee',
              },
            }}

            refreshableTintColor="blue"
          />

          {Platform.OS === 'android' && <AdMobBanner style={{marginLeft: 10}} bannerSize={"mediumRectangle"} adUnitID={config.adUnitID.android} />}
          {Platform.OS === 'ios' && <AdMobBanner style={{marginLeft: 10}} bannerSize={"mediumRectangle"} adUnitID={config.adUnitID.ios} />}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
  row: {
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
  },
  paginationView: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: WIDTH,
    height: 200,
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 2,
    borderWidth: 0,
  },
  productName: {
    fontSize: 20,
    lineHeight: 40,
    color: '#757575',
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 32,
    color: '#9E9E9E',
  },
});
