import React from "react";
import { Button, Image, View, Text, StyleSheet } from "react-native";

export default class AppInstructions extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>
          Welcome to RecorData! To get started, press the Camera button and take
          a picture of an album cover. Then, select your release from the
          results page to view album details and suggested retail price.
        </Text>
      </View>
    );
  }
}
