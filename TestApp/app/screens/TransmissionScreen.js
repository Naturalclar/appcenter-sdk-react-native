import React, { Component } from 'react';
import { Image, View, SectionList, Text, TouchableOpacity } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

import Analytics from 'appcenter-analytics';

import SharedStyles from '../SharedStyles';
import TransmissionTabBarIcon from '../assets/fuel.png';

import Constants from '../Constants';

const targetTokens = Constants.targetTokens;

export default class TransmissionScreen extends Component {
  static navigationOptions = {
    tabBarIcon: () => <Image style={{ width: 24, height: 24 }} source={TransmissionTabBarIcon} />
  }

  state = {
    targetToken: targetTokens[0]
  }

  render() {
    const pickerRenderItem = ({ item: { title, valueChanged, tokens } }) => (
      <ModalSelector data={tokens} initValue={title} onChange={valueChanged} style={SharedStyles.modalSelector} />
    );
    const actionRenderItem = ({ item: { title, action } }) => (
      <TouchableOpacity style={SharedStyles.item} onPress={action}>
        <Text style={SharedStyles.itemButton}>{title}</Text>
      </TouchableOpacity>
    );
    return (
      <View style={SharedStyles.container}>
        <SectionList
          renderItem={({ item }) => <Text style={[SharedStyles.item, SharedStyles.title]}>{item}</Text>}
          renderSectionHeader={({ section: { title } }) => <Text style={SharedStyles.header}>{title}</Text>}
          keyExtractor={(item, index) => item + index}
          sections={[
            {
              title: 'Select transmission target',
              data: [
                {
                  title: 'Select target token',
                  valueChanged: option => this.setState({ targetToken: option }),
                  tokens: targetTokens
                },
              ],
              renderItem: pickerRenderItem
            },
            {
              title: 'Actions',
              data: [
                {
                  title: 'Track Event with properties',
                  action: async () => {
                    const transmissionTarget = await Analytics.getTransmissionTarget(this.state.targetToken.key);
                    if (transmissionTarget) {
                      transmissionTarget.trackEvent('event_for_transmission_target', { page: 'Transmission screen' });
                    }
                  }
                }
              ],
              renderItem: actionRenderItem
            },
          ]}
        />
      </View>
    );
  }
}
