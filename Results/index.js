import React from "react";
import { Button, Image, View, Text, StyleSheet, Linking } from "react-native";

export default class HomeScreen extends React.Component {
  render() {
    const { params } = this.props.navigation.state;
    const firstDescription = params ? params.firstDescription : null;
    const secondDescription = params ? params.secondDescription : null;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
        <Text>First Description: {firstDescription}</Text>
        <Text>Second Description: {secondDescription}</Text>
        <Button
          title="Click me"
          onPress={() => {
            Linking.openURL("http://localhost:3000/authorize");
          }}
        />
      </View>
    );
  }
}
