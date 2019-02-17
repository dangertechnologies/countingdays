import { format } from "date-fns";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import DateTimePicker from "react-native-modal-datetime-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-navigation";
import { compose, withStateHandlers } from "recompose";

interface IDateInputProps {
  initialDate?: number;
  headline: string;
  minDate?: number;
  onChange(date: number): any;
}

interface IDateInputInnerProps extends IDateInputProps {
  date: number;
  dateTimePickerOpen: boolean;

  setDate(date: number): void;
  setDateTimePickerOpen(open: boolean): void;
}

const DateInput = ({
  headline,
  onChange,
  minDate,
  date,
  dateTimePickerOpen,
  setDate,
  setDateTimePickerOpen
}: IDateInputInnerProps) => (
  <LinearGradient colors={["#11998e", "#38ef7d"]} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.inputLabel}>{headline}</Text>
      <View style={styles.dateField}>
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center" }}
          onPress={() => setDateTimePickerOpen(true)}
        >
          <React.Fragment>
            <Ionicons name="ios-calendar" color="#FFFFFF" size={80} />
            <Text style={styles.textInput}>
              {format(date, "YYYY-MM-DD HH:mm")}
            </Text>
          </React.Fragment>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => onChange(date)}
      >
        <Text style={styles.nextButtonLabel}>Next</Text>
      </TouchableOpacity>
      <DateTimePicker
        minimumDate={minDate ? new Date(minDate) : undefined}
        date={new Date(date)}
        mode="datetime"
        isVisible={Boolean(dateTimePickerOpen)}
        onConfirm={d => {
          setDate(d.getTime());
          onChange(d.getTime());
        }}
        onCancel={() => setDateTimePickerOpen(false)}
      />
    </SafeAreaView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },

  dateField: {
    alignItems: "center",
    height: 150,
    justifyContent: "center",
    width: "100%"
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

export default compose<IDateInputInnerProps, IDateInputProps>(
  withStateHandlers(
    ({ initialDate }: IDateInputProps) => ({
      date: initialDate || new Date().getTime(),
      dateTimePickerOpen: false
    }),
    {
      setDate: () => (date: number) => ({
        date,
        dateTimePickerOpen: false
      }),
      setDateTimePickerOpen: () => (dateTimePickerOpen: boolean) => ({
        dateTimePickerOpen
      })
    }
  )
)(DateInput);
