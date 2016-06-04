import {
  AppRegistry,
  BackAndroid,
} from 'react-native';
import Periods from './periods';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';

BackAndroid.addEventListener('hardwareBackPress', () => {
  try {
    Actions.pop();
    return true;
  } catch (err) {
    return false;
  }
});

AppRegistry.registerComponent('Periods', () => Periods);
