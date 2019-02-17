import get from "lodash/get";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationScreenProps, NavigationState } from "react-navigation";

import Background from "../Components/Background";
import { IAppState, withApplicationState } from "../Store";

interface ILaunchScreenProps
  extends IAppState,
    NavigationScreenProps<NavigationState> {}

class Launch extends React.PureComponent<ILaunchScreenProps> {
  public componentDidMount() {
    setTimeout(this.redirect, 2000);
  }

  public redirect = () => {
    console.log({
      store: this.props.store,
      first: get(this.props, "store.countdowns[0]")
    });
    if (get(this.props, "store.countdowns[0]")) {
      this.props.navigation.replace("CountdownScreen", {
        countdown: get(this.props, "store.countdowns[0]")
      });
    } else {
      this.props.navigation.replace("CreateScreen");
    }
  };

  public render() {
    return (
      <Background
        background={{ type: "image", image: require("../Images/bunnies.jpeg") }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Counting Days</Text>
        </View>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  title: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "100"
  }
});

export default withApplicationState(Launch);
