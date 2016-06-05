import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default class SelectGenderView extends React.Component {
  constructor(props) {
    super(props);
  }

  selectFemale() {
    Actions.lastPeriod();
  }

  selectMale() {
    Actions.qrcodeReader();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={{flex: 1}} onPress={() => this.selectFemale()}>
          <View style={styles.leftContainer}>
            <FontAwesomeIcon name="female" size={40} color="white"  />
            <Animatable.Text
              animation="pulse"
              iterationCount="infinite"
              direction="normal"
              style={styles.text}>Female</Animatable.Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{flex: 1}} onPress={() => this.selectMale()}>
          <View style={styles.rightContainer}>
            <FontAwesomeIcon name="male" size={40} color="white" />
            <Animatable.Text
              animation="pulse"
              iterationCount="infinite"
              direction="alternate"
              style={styles.text}>Male</Animatable.Text>
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
    marginTop: 25,
    fontSize: 18,
    color: 'white',
  },
});
