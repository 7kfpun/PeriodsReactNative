import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';

export default class SelectGenderView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Alert.alert(
      'Select your gender',
      null,
      [
        {text: 'Female', onPress: Actions.main},
        {text: 'Male', onPress: Actions.qrcodeReader},
      ]
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.leftContainer} />
        <View style={styles.rightContainer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    backgroundColor: '#EF5350',
  },
  rightContainer: {
    flex: 1,
    backgroundColor: '#3F51B5',
  },
});
