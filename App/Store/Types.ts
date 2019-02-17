import Images from "../Images";

export interface IApplicationState {
  countdowns: ICountdown[];
}

export interface ICountdown {
  id: number;
  title: string;
  showPhotos: boolean;
  startDate: number;
  endDate: number;
  background: TBackground;
}

interface IBackgroundLinearGradient {
  type: "gradient";
  colors: string[];
}

interface IBackgroundPhoto {
  type: "photo";
  image:
    | any
    | {
        uri: string;
      };
}

interface IBackgroundPresetPhoto {
  type: "image",
  image: keyof typeof Images
}

export type TBackground = IBackgroundPresetPhoto | IBackgroundPhoto | IBackgroundLinearGradient;
