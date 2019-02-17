import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import Entypo from "react-native-vector-icons/Entypo";
import { NavigationScreenProps } from "react-navigation";
import { compose, withStateHandlers } from "recompose";

import { IAppState, ICountdown, withApplicationState } from "../../Store";

import BackgroundPicker from "./Background";
import DateInput from "./DateInput";
import TitleInput from "./TitleInput";

interface ICreateScreenProps
  extends IAppState,
    NavigationScreenProps<{ model?: ICountdown }> {
  model: Partial<ICountdown>;
  index: number;

  setField(model: Partial<ICountdown>): void;
  setIndex(index: number): void;
}

const allowNext = (index: number, model: Partial<ICountdown>) => {
  if (index === 0 && model.title) {
    return true;
  }
  if (index === 1 && model.startDate) {
    return true;
  }

  if (index === 2 && model.endDate) {
    return true;
  }

  if (index === 3) {
    return true;
  }

  return false;
};

class CreateScreen extends React.PureComponent<ICreateScreenProps> {
  public swiper: Swiper | null = null;

  public onSave = () => {
    const { model } = this.props;
    const highestId = Math.max(
      0,
      ...this.props.store.countdowns.map(({ id }) => id)
    );

    let newState;
    const countdown = {
      ...model,
      id: model.id ? model.id : highestId + 1
    };

    if (model.id) {
      newState = {
        countdowns: this.props.store.countdowns.map(cdown =>
          cdown.id === model.id ? { ...cdown, ...countdown } : cdown
        )
      };
    } else {
      newState = {
        countdowns: [...this.props.store.countdowns, countdown]
      };
    }
    this.props.update(newState);

    this.props.navigation.navigate({
      params: { countdown },
      routeName: "CountdownScreen"
    });
  };

  public render(): JSX.Element {
    const { index, setIndex, model, setField } = this.props;

    return (
      <>
        <Swiper
          ref={(c: any) => {
            this.swiper = c;
          }}
          scrollEnabled={false}
          showsButtons={true}
          loop={false}
          onIndexChanged={setIndex}
          index={index}
          activeDotColor="#FFFFFF"
          dotColor="#CCCCCC"
          nextButton={
            !allowNext(index, model) ? (
              <View />
            ) : (
              <Entypo name="chevron-thin-right" size={30} color="#FFFFFF" />
            )
          }
          prevButton={
            index === 0 ? (
              <View />
            ) : (
              <Entypo name="chevron-thin-left" size={30} color="#FFFFFF" />
            )
          }
        >
          <TitleInput
            value={model.title || ""}
            onChange={(title: string) => {
              setField({ title });
            }}
            onSubmit={() => {
              if (this.swiper) {
                // @ts-ignore
                this.swiper.scrollBy(1);
              }
            }}
          />
          <DateInput
            onChange={startDate => {
              setField({ startDate });
              if (this.swiper) {
                // @ts-ignore
                this.swiper.scrollBy(1);
              }
            }}
            initialDate={
              model.startDate || new Date(2019, 0, 5, 10, 30).getTime()
            }
            headline="Start counting from..."
          />
          <DateInput
            minDate={
              model.startDate
                ? model.startDate + 86400000
                : new Date().getTime()
            }
            onChange={endDate => {
              setField({ endDate });
              if (this.swiper) {
                // @ts-ignore
                this.swiper.scrollBy(1);
              }
            }}
            initialDate={
              model.endDate || new Date(2019, 3, 19, 9, 30).getTime()
            }
            headline="When will it end?"
          />
          <BackgroundPicker onChange={background => setField({ background })} />
        </Swiper>

        {model.title && model.background && model.endDate && model.startDate ? (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => this.onSave()}
          >
            <Text style={styles.saveButtonLabel}>Save</Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#222222",
    flex: 1
  },
  saveButton: {
    position: "absolute",
    right: 25,
    top: 30
  },
  saveButtonLabel: {
    color: "#FFFFFF",
    fontSize: 16
  }
});

export default compose<ICreateScreenProps, {}>(
  withStateHandlers<{ model: Partial<ICountdown>; index: number }, any>(
    // @ts-ignore
    ({ navigation }: ICreateScreenProps) => ({
      index: 0,
      model:
        navigation.state.params && navigation.state.params.model
          ? (navigation.state.params.model as ICountdown)
          : {
              background: { type: "gradient", colors: ["#11998e", "#38ef7d"] },
              endDate: undefined,
              startDate: undefined,
              title: ""
            }
    }),
    {
      setField: ({ model: _model }: ICreateScreenProps) => (
        model: Partial<ICountdown>
      ) => ({
        model: {
          ..._model,
          ...model
        }
      }),
      setIndex: () => (index: number) => ({ index })
    }
  ),
  withApplicationState
)(CreateScreen);
