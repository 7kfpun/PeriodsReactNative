import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';

export default class SettingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPregnancy: false,
      value: 0.2,
    };
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          leftButton={<Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="white" onPress={() => Actions.pop()} />}
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
          <TableView>
            <Section header="PERIOD">
              <Cell cellstyle="RightDetail" title="Period length" detail="3 Days" onPress={() => Actions.periodLengthSettings()} />
              <Cell cellstyle="RightDetail" title="Cycle length" detail="32 Days" onPress={() => Actions.cycleLengthSettings()} />
              <Cell cellstyle="RightDetail" title="Ovulation and Fertile" detail="14 Days" onPress={() => Actions.ovulationFertileSettings()} />
              {/*<CustomCell>
                <Text style={{flex: 1, fontSize: 16, color: 'black'}}>Pregnancy</Text>
                <Switch
                  onValueChange={(value) => this.setState({isPregnancy: value})}
                  value={this.state.isPregnancy} />
              </CustomCell>*/}
            </Section>
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
});
