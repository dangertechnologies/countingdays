import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-navigation";

interface ITitleInputProps {
  value?: string;
  onChange(title: string): void;
  onSubmit(): any;
}

const TitleInput = ({ value, onSubmit, onChange }: ITitleInputProps) => (
  <LinearGradient colors={["#11998e", "#38ef7d"]} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.inputLabel}>Event title</Text>
      <View style={styles.textField}>
        <TextInput
          placeholder="Enter a title"
          placeholderTextColor="#FFFFFF"
          style={styles.textInput}
          value={value}
          onChangeText={text => onChange(text)}
          onSubmitEditing={() => onSubmit()}
        />
      </View>
    </SafeAreaView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },

  textField: {
    width: "80%"
  },

  inputLabel: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "100",
    marginBottom: 3,
    position: "absolute",
    top: 100
  },
  textInput: {
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "100",
    height: 50,
    textAlign: "center"
  }
});

export default TitleInput;
