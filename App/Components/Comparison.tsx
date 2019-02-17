import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMonths,
  differenceInYears,
  endOfDay,
  format,
  startOfDay
} from "date-fns";
import { isEqual, sortBy, take } from "lodash";
import {
  Body,
  Card,
  CardItem,
  DeckSwiper,
  Left,
  Text,
  Thumbnail,
  View
} from "native-base";
import React from "react";
import {
  CameraRoll,
  GetPhotosReturnType,
  Image,
  StyleSheet
} from "react-native";

interface IComparisonProps {
  hoursAgo: number;
  children: React.ReactNode;
}

interface IComparisonState {
  photos: GetPhotosReturnType["edges"];
}

class Comparison extends React.Component<IComparisonProps, IComparisonState> {
  public state: IComparisonState = {
    photos: []
  };

  public componentDidMount() {
    this.loadPhotos();
  }

  public componentDidUpdate(props: IComparisonProps) {
    if (props.hoursAgo !== this.props.hoursAgo) {
      this.loadPhotos();
    }
  }

  public shouldComponentUpdate(
    props: IComparisonProps,
    state: IComparisonState
  ) {
    return (
      !isEqual(props, this.props) || !isEqual(state.photos, this.state.photos)
    );
  }

  public loadPhotos = async (after?: string) => {
    const { hoursAgo } = this.props;

    // Max date should be the end of the day
    // Min date should be the beginning of the day
    const timestamp = new Date().getTime() - hoursAgo * 60 * 60 * 1000;
    const maxDate = endOfDay(timestamp).getTime();
    const minDate = startOfDay(timestamp).getTime();

    // Then we try to find the photos closest to the actual time

    let photos: GetPhotosReturnType = await CameraRoll.getPhotos({
      after,
      first: 200
    });

    if (
      photos.edges.find(
        ({ node }) =>
          node.timestamp * 1000 < maxDate && node.timestamp * 1000 > minDate
      )
    ) {
      // Filter out the 10 nearest photos to the actual timestamp:
      this.setState({
        photos: take(
          sortBy(
            photos.edges.filter(
              ({ node }) =>
                node.timestamp * 1000 < maxDate &&
                node.timestamp * 1000 > minDate
            ),
            ({ node }) => node.timestamp * 1000 - timestamp
          ),
          10
        )
      });
    } else if (
      !photos.edges.every(({ node }) => node.timestamp * 1000 < minDate)
    ) {
      if (photos.page_info.end_cursor) {
        this.loadPhotos(photos.page_info.end_cursor);
      }
    }
  };

  public render() {
    const { photos } = this.state;

    return (
      <View style={styles.container}>
        {!photos || !photos.length ? (
          this.props.children
        ) : (
          // @ts-ignore
          <DeckSwiper
            dataSource={this.state.photos}
            renderEmpty={() => this.props.children}
            looping={false}
            renderItem={(item: GetPhotosReturnType["edges"][number]) => {
              const years = differenceInYears(
                new Date(),
                item.node.timestamp * 1000
              );
              const months =
                differenceInMonths(new Date(), item.node.timestamp * 1000) % 12;
              const days =
                differenceInCalendarDays(
                  new Date(),
                  item.node.timestamp * 1000
                ) % 30;
              const hours =
                differenceInHours(new Date(), item.node.timestamp * 1000) % 24;

              const text = [
                years ? `${years} years` : "",
                months ? `${months} months` : "",
                days ? `${days} days` : "",
                hours ? `${hours} hours` : "",
                "ago"
              ].join(" ");

              return (
                <Card style={styles.card}>
                  <CardItem cardBody>
                    <Image style={styles.cardImage} source={item.node.image} />
                  </CardItem>
                  <CardItem footer style={{ flexDirection: "column" }}>
                    <Text>Time perspective</Text>
                    <Text note style={{ textAlign: "center" }}>
                      {text}
                    </Text>
                  </CardItem>
                </Card>
              );
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: "hidden"
  },
  cardImage: {
    flex: 1,
    height: 250
  },
  container: {
    height: 250,
    width: "70%"
  }
});

export default Comparison;
