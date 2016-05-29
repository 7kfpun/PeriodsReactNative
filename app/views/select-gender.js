import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

StatusBar.setHidden(true);

export default class SelectGenderView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={{flex: 1}} onPress={() => {Actions.main(); StatusBar.setHidden(false);}}>
          <View style={styles.leftContainer}>
            <FontAwesomeIcon name="female" size={40} color="white"  />
            <Text style={styles.text}>Female</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{flex: 1}} onPress={() => {Actions.qrcodeReader(); StatusBar.setHidden(false);}}>
          <View style={styles.rightContainer}>
            <FontAwesomeIcon name="male" size={40} color="white" />
            <Text style={styles.text}>Male</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF5350',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
  },
});
