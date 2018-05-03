import React from "react";
import { Constants, Camera, FileSystem, Permissions } from "expo";
import ImgToBase64 from "react-native-image-base64";
import { ImagePicker } from "expo";
import { Button, Image, View, Text, StyleSheet } from "react-native";
import { StackNavigator } from "react-navigation";

export default class HomeScreen extends React.Component {
  state = {
    image: null,
    description1: "",
    description2: "",
    loading: false
  };

  render() {
    let { image } = this.state;
    if (this.state.loading) {
      return (
        <View>
          <Text>Loading...</Text>
          <Button
            title="Taking too long? Try Again"
            onPress={() => this.props.navigation.navigate("Home")}
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={styles.titleText}>Welcome to RecorData!</Text>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: "https://i.imgur.com/Km5NHjQ.jpg" }}
          />
          <Button
            title="Instructions"
            onPress={() => this.props.navigation.navigate("Instructions")}
          />
          <Button title="Take a picture!" onPress={this._pickImage} />
        </View>
      </View>
    );
  }
  _pickImage = async () => {
    this.setState({ loading: true });
    let result = await Expo.ImagePicker.launchCameraAsync({
      base64: true
    }); // base64: true means obj returns base64 string
    if (!result.cancelled) {
      const base64String = result.base64;
      fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDof-ri-S6rMgdkcIT7D0Msn4mYsstnl9k`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64String
                },
                features: [
                  {
                    type: "WEB_DETECTION",
                    maxResults: 50
                  },
                  {
                    type: "LABEL_DETECTION",
                    maxResults: 50
                  }
                ]
              }
            ]
          })
        }
      )
        .then(APIData => {
          return APIData.json();
        })
        .then(APIJson => {
          console.log(APIJson);
          this.setState({
            description1:
              APIJson.responses[0].webDetection.webEntities[0].description,
            description2:
              APIJson.responses[0].webDetection.webEntities[1].description,
            loading: false
          });
          this.props.navigation.navigate("Results", {
            firstDescription: this.state.description1,
            secondDescription: this.state.description2
          });
        })
        .catch(err => console.log(err));
    }
  };
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
