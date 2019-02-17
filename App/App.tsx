import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import Navigation from "./Navigation";
import { Provider } from "./Store/ApplicationState";

export default class App extends React.Component {
  public render() {
    return (
      <Provider>
        <View style={styles.container}>
          <StatusBar backgroundColor="transparent" barStyle="light-content" />
          <Navigation />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1
  }
});
