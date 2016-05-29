import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

// Flux
import SettingStore from '../stores/setting-store';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

export default class SettingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({IS_PREGNANCY: false}, SettingStore.getState());
  }

  componentDidMount() {
    SettingStore.listen((state) => this.onSettingStoreChange(state));
  }

  componentWillUnmount() {
    SettingStore.unlisten((state) => this.onSettingStoreChange(state));
  }

  onSettingStoreChange(state) {
    console.log('onSettingStoreChange', state);
    this.setState({
      settings: state.settings
    });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title, tintColor: 'white'}}
          leftButton={<Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="white" onPress={Actions.pop} />}
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
              <Cell
                cellstyle="RightDetail"
                title="Period length"
                detail={this.state.settings.PERIOD_LENGTH.VALUE + ' Days'}
                onPress={() => Actions.periodLengthSettings()}
              />
              <Cell
                cellstyle="RightDetail"
                title="Cycle length"
                detail={this.state.settings.CYCLE_LENGTH.VALUE + ' Days'}
                onPress={() => Actions.cycleLengthSettings()}
              />
              <Cell
                cellstyle="RightDetail"
                title="Ovulation and Fertile"
                detail={this.state.settings.OVULATION_FERTILE.VALUE + ' Days'}
                onPress={() => Actions.ovulationFertileSettings()}
              />
              {/*<CustomCell>
                <Text style={{flex: 1, fontSize: 16, color: 'black'}}>Pregnancy</Text>
                <Switch
                  onValueChange={(value) => this.setState({IS_PREGNANCY: value})}
                  value={this.state.IS_PREGNANCY} />
              </CustomCell>*/}
            </Section>

            <Section header="LINK">
              <Cell cellstyle="Basic" title="Linking Accounts" onPress={Actions.link} />
            </Section>

            <Section header="DEVELOPMENT">
              <Cell
                cellstyle="Basic"
                title="Print all"
                onPress={() => {store.get('periods').then((periods) => console.log(periods)); store.get('settings').then((settings) => console.log(settings));}}
              />
              <Cell
                cellstyle="Basic"
                title="Delete all"
                onPress={() => {store.delete('periods'); store.delete('settings');}}
              />
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
