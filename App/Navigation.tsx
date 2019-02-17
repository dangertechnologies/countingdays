import { Animated, Easing } from "react-native";
import {
  createAppContainer,
  createStackNavigator,
  TransitionConfigurer
} from "react-navigation";
import CountdownScreen from "./Screens/Countdown";
import CreateScreen from "./Screens/Create";
import LaunchScreen from "./Screens/Launch";

const crossFade: TransitionConfigurer = () => ({
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const { index } = scene;
    const height = layout.initHeight;
    const translateX = 0;
    const translateY = 0;
    const opacity = position.interpolate({
      extrapolate: "clamp",
      inputRange: [index - 0.5, index],
      outputRange: [0.5, 1]
    });
    return { opacity, transform: [{ translateY }, { translateX }] };
  },
  transitionSpec: {
    duration: 500,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  }
});

export default createAppContainer(
  createStackNavigator(
    {
      CountdownScreen,
      CreateScreen,
      LaunchScreen
    },
    {
      containerOptions: {
        style: { flex: 1, backgroundColor: "transparent" }
      },
      headerMode: "none",
      initialRouteName: "LaunchScreen",

      transitionConfig: crossFade
    }
  )
);
