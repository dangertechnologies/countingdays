import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears
} from "date-fns";
import get from "lodash/get";
import round from "lodash/round";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// @ts-ignore
import { AnimatedCircularProgress } from "react-native-circular-progress";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationScreenProps, NavigationState } from "react-navigation";
import { compose } from "recompose";
import { IAppState, ICountdown, withApplicationState } from "../Store";

import Background from "../Components/Background";
import Comparison from "../Components/Comparison";

interface ICountdownProps
  extends NavigationScreenProps<{ countdown: ICountdown }> {}

interface ICountdownInnerProps extends ICountdownProps, IAppState {}

interface ICountdownState {
  timeLeft: number;
  percentage: number;
}

interface ITimeLeftProps {
  title: string;
  value: number;
  hidden?: boolean;
}
const TimeLeft = ({ title, value, hidden }: ITimeLeftProps) =>
  hidden ? null : (
    <View style={styles.timeContainer}>
      <Text style={styles.time}>{value}</Text>
      <Text style={styles.timeLabel}>{title}</Text>
    </View>
  );

class Countdown extends React.Component<ICountdownInnerProps, ICountdownState> {
  public state: ICountdownState = {
    percentage: 0,
    timeLeft: 0
  };

  public timeout: ReturnType<typeof setTimeout> | null = null;

  public componentDidMount() {
    this.timeout = setTimeout(this.updateTimeLeft, 1000);
  }

  public updateTimeLeft = () => {
    const countdown =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.countdown
        ? this.props.navigation.state.params.countdown
        : get(this.props.store.countdowns, 0);

    const timeLeft = countdown.endDate - new Date().getTime();
    this.setState(
      {
        timeLeft,
        percentage:
          100 - 100 * (timeLeft / (countdown.endDate - countdown.startDate))
      },
      () => {
        this.timeout = setTimeout(this.updateTimeLeft, 1000);
      }
    );
  };

  public render(): JSX.Element {
    const countdown =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.countdown
        ? this.props.navigation.state.params.countdown
        : get(this.props.store.countdowns, 0);

    if (!countdown) {
      return <View />;
    }

    const years = differenceInYears(countdown.endDate, new Date());
    const months = differenceInMonths(countdown.endDate, new Date()) % 12;
    const days = differenceInCalendarDays(countdown.endDate, new Date()) % 30;
    const hours = differenceInHours(countdown.endDate, new Date()) % 24;
    const minutes = differenceInMinutes(countdown.endDate, new Date()) % 60;
    const seconds = differenceInSeconds(countdown.endDate, new Date()) % 60;

    return (
      <Background background={countdown.background}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>{countdown.title}</Text>
          <Comparison
            hoursAgo={differenceInHours(countdown.endDate, new Date())}
          >
            <View
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
                paddingTop: 50
              }}
            >
              <AnimatedCircularProgress
                size={150}
                width={5}
                fill={this.state.percentage}
                tintColor="#FFFFFF"
                backgroundColor="#3d5875"
              >
                {(fill: number) => (
                  <Text style={styles.percentage}>{`${round(fill, 1)}%`}</Text>
                )}
              </AnimatedCircularProgress>
            </View>
          </Comparison>
          <View style={styles.countdownContainer}>
            <TimeLeft hidden={!years} title="Years" value={years} />
            <TimeLeft
              hidden={!years && !months}
              title="Months"
              value={months}
            />
            <TimeLeft
              hidden={!years && !months && !days}
              title="Days"
              value={days}
            />
            <TimeLeft
              hidden={!years && !months && !hours}
              title="Hours"
              value={hours}
            />
            <TimeLeft title="Minutes" value={minutes} />
            <TimeLeft title="Seconds" value={seconds} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            this.props.navigation.navigate({
              routeName: "CreateScreen",
              params: { model: countdown }
            })
          }
        >
          <MaterialCommunityIcons
            name="calendar-edit"
            size={20}
            color="rgba(255, 255, 255, 0.7)"
          />
        </TouchableOpacity>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  countdownContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%"
  },
  editButton: {
    position: "absolute",
    right: 30,
    top: 30
  },

  percentage: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "400"
  },
  time: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "100"
  },
  timeContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50
  },
  timeLabel: {
    color: "#FFFFFF",
    fontSize: 10
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "100"
  },

  wrapper: { flex: 1, alignItems: "center", justifyContent: "space-evenly" }
});

export default compose<ICountdownInnerProps, ICountdownProps>(
  withApplicationState
)(Countdown);
