import isEqual from "lodash/isEqual";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ImagePicker, { Image as IImage } from "react-native-image-crop-picker";

import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-navigation";
import { compose, withStateHandlers } from "recompose";

import Background from "../../Components/Background";
import Images from "../../Images";
import { TBackground } from "../../Store";

const { width, height } = Dimensions.get("screen");

interface IBackgroundPickerProps {
  initialBackground?: TBackground;
  onChange(background: TBackground): any;
}

interface IBackgroundPickerInnerProps extends IBackgroundPickerProps {
  background: TBackground;
  setBackground(background: TBackground): void;
}

const gradients = [
  ["#11998e", "#38ef7d"],
  ["#FC466B", "#3F5EFB"],
  ["#7F00FF", "#E100FF"],
  ["#200122", "#6f0000"],
  ["#A770EF", "#CF8BF3", "#FDB99B"]
];

class PhotoPicker extends React.Component<IBackgroundPickerInnerProps> {
  public render(): JSX.Element {
    return (
      <Background {...this.props}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.inputLabel}>Background</Text>
          <View style={styles.backgroundField}>
            {gradients.map(gradient => (
              <TouchableOpacity
                onPress={() => {
                  this.props.setBackground({
                    colors: gradient,
                    type: "gradient"
                  });
                  this.props.onChange({
                    colors: gradient,
                    type: "gradient"
                  });
                }}
              >
                <LinearGradient
                  colors={gradient}
                  style={[
                    this.props.background.type === "gradient" &&
                    isEqual(this.props.background.colors, gradient)
                      ? styles.gradientSelected
                      : {},
                    styles.gradient
                  ]}
                />
              </TouchableOpacity>
            ))}
            {[
              { type: "image" as "image", image: "bunny" as "bunny" },
              { type: "image" as "image", image: "bear" as "bear" }
            ].map(image => (
              <TouchableOpacity
                onPress={() => {
                  this.props.setBackground(image);
                  this.props.onChange(image);
                }}
              >
                <Image
                  source={Images[image.image]}
                  style={[
                    isEqual(this.props.background, image)
                      ? styles.gradientSelected
                      : {},
                    styles.gradient
                  ]}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={{}}
              onPress={() =>
                ImagePicker.openPicker({
                  height,
                  width,
                  cropping: true,
                  includeBase64: true
                }).then(image => {
                  this.props.onChange({
                    image: {
                      uri: `data:${(image as IImage).mime};base64,${
                        (image as IImage).data
                      }`
                    },
                    type: "photo"
                  });
                  this.props.setBackground({
                    image: {
                      uri: `data:${(image as IImage).mime};base64,${
                        (image as IImage).data
                      }`
                    },
                    type: "photo"
                  });
                })
              }
            >
              <LinearGradient
                colors={["#11998e", "#38ef7d"]}
                style={[
                  this.props.background.type === "image"
                    ? styles.gradientSelected
                    : {},
                  styles.gradient
                ]}
              >
                <Ionicons name="ios-camera" color="#FFFFFF" size={30} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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

  backgroundField: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    height: 150,
    justifyContent: "space-evenly",
    width: "60%"
  },
  gradient: {
    alignItems: "center",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    margin: 3,
    width: 50
  },
  gradientSelected: {
    borderColor: "#FFFFFF",
    borderWidth: 1
  },

  inputLabel: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "100",
    marginBottom: 3,
    position: "absolute",
    top: 100
  },
  nextButton: { position: "absolute", bottom: 100 },
  nextButtonLabel: { color: "#FFFFFF", fontSize: 20, fontWeight: "300" },

  textInput: {
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "100",
    height: 50,
    textAlign: "center"
  }
});

export default compose<IBackgroundPickerInnerProps, IBackgroundPickerProps>(
  withStateHandlers(
    ({ initialBackground }: IBackgroundPickerProps) => ({
      background: initialBackground || {
        type: "gradient",
        colors: gradients[0]
      }
    }),
    {
      setBackground: () => (background: TBackground) => ({ background })
    }
  )
)(PhotoPicker);
