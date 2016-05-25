import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

export default class Main extends Component {
  _onFetch(page = 1, callback, options) {
    setTimeout(() => {
      var rows = ['row '+((page - 1) * 3 + 1), 'row '+((page - 1) * 3 + 2), 'row '+((page - 1) * 3 + 3)];
      if (page === 3) {
        callback(rows, {
          allLoaded: true, // the end of the list is reached
        });
      } else {
        callback(rows);
      }
    }, 1000); // simulating network fetching
  }

  /**
   * When a row is touched
   * @param {object} rowData Row data
   */
  _onPress(rowData) {
    console.log(rowData+' pressed');
  }

  /**
   * Render a row
   * @param {object} rowData Row data
   */
  _renderRowView(rowData) {
    return (
      <TouchableHighlight
        style={styles.row}
        underlayColor='#c8c7cc'
        onPress={() => Actions.editHistory(rowData)}
      >
        <Text>{rowData}</Text>
      </TouchableHighlight>
    );
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title}}
          rightButton={<Icon style={styles.navigatorRightButton} name="settings" size={26} color="gray" onPress={() => {
            Actions.settings();
          }} />}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={styles.history}>
          <View style={styles.header}>
            <Text style={styles.headerText}>History</Text>
            <Text style={styles.subHeaderText}></Text>
          </View>
          <GiftedListView
            rowView={this._renderRowView}
            onFetch={this._onFetch}
            firstLoader={true} // display a loader for the first fetching
            pagination={true} // enable infinite scrolling using touch to load more
            refreshable={false} // enable pull-to-refresh for iOS and touch-to-refresh for Android
            withSections={false} // enable sections
            customStyles={{
              paginationView: {
                backgroundColor: '#eee',
              },
            }}

            refreshableTintColor="blue"
          />
        </View>
        <View style={styles.statistics}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Statistics</Text>
            <Text style={styles.subHeaderText}>Average</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  navigatorBarIOS: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: 'pink',
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
  history: {
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  headerText: {
    color: '#212121',
    fontSize: 20,
    lineHeight: 26,
  },
  subHeaderText: {
    color: '#212121',
    fontSize: 16,
    lineHeight: 24,
  },
  statistics: {
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 100,
  },
});
