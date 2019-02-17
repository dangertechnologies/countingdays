import { merge } from "lodash";
import React from "react";
import { AsyncStorage } from "react-native";
import { IApplicationState } from "./Types";

const CACHE_KEY = `COUNTING_DAYS_2`;

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

const INITIAL_STATE: IApplicationState = {
  countdowns: []
};

export interface IAppState {
  store: IApplicationState;
  update(value?: RecursivePartial<IApplicationState>): any;
  resetApplicationState(): void;
}

const INITIAL_CONTEXT: IAppState = {
  store: INITIAL_STATE,

  resetApplicationState: () => {
    throw new Error("Provider not initialized");
  },
  update: () => {
    throw new Error("Provider not initialized");
  }
};

const { Provider, Consumer } = React.createContext(INITIAL_CONTEXT);

interface IApplicationStateProps {
  backend?: typeof AsyncStorage;
  children: React.ReactNode;
}

class ApplicationStateProvider extends React.Component<
  IApplicationStateProps,
  IApplicationState
> {
  public state: IApplicationState = INITIAL_STATE;

  public async componentDidMount() {
    const backend = this.props.backend || AsyncStorage;

    const initialState = await backend.getItem(CACHE_KEY);

    if (initialState) {
      console.log({ name: "Store#init", state: initialState });
      this.setState(JSON.parse(initialState));
    } else {
      this.persist();
    }
  }

  public update = (value: Partial<IApplicationState>) => {
    console.log({ name: "Store#update", state: this.state, value });
    this.setState(merge(this.state, value), this.persist);
  };

  public resetApplicationState = () => {
    this.setState(INITIAL_STATE, this.persist);
  };

  public render(): JSX.Element {
    return (
      <Provider
        value={{
          resetApplicationState: this.resetApplicationState,
          store: this.state,
          update: this.update
        }}
      >
        {this.props.children}
      </Provider>
    );
  }

  private persist = async () => {
    console.log({ name: "Store#persist", state: this.state });
    (this.props.backend || AsyncStorage).setItem(
      CACHE_KEY,
      JSON.stringify(this.state)
    );
  };
}

const withApplicationState = <T extends {}>(
  Component: React.ComponentType<T & IAppState>
): React.ComponentType<T> => (props: T) => (
  <Consumer>
    {applicationState => <Component {...props} {...applicationState} />}
  </Consumer>
);

export {
  Provider as InnerProvider,
  ApplicationStateProvider as Provider,
  withApplicationState
};
