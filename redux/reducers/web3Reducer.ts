import { AnyAction } from "redux";

type StateType = {
  provider?: any;
  web3Provider?: any;
  address?: string;
  chainId?: number;
  user?: any;
};

type ActionType =
  | {
      type: "SET_WEB3_PROVIDER";
      payload: {
        provider?: StateType["provider"];
        web3Provider?: StateType["web3Provider"];
        address?: StateType["address"];
        chainId?: StateType["chainId"];
        user?: StateType["user"];
      };
    }
  | {
      type: "SET_ADDRESS";
      payload: {
        address?: StateType["address"];
      };
    }
  | {
      type: "SET_CHAIN_ID";
      payload: {
        chainId?: StateType["chainId"];
      };
    }
  | {
      type: "RESET_WEB3_PROVIDER";
    };

const initState: StateType = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
  user: null,
};

const web3Reducer: (state: StateType, action: ActionType) => StateType = (
  state = initState,
  action
) => {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.payload.provider,
        web3Provider: action.payload.web3Provider,
        address: action.payload.address,
        chainId: action.payload.chainId,
        user: action.payload.user,
      };

    case "SET_ADDRESS":
      return {
        ...state,
        address: action.payload.address,
      };

    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.payload.chainId,
      };

    case "RESET_WEB3_PROVIDER":
      return {
        ...initState,
      };
    default:
      return { ...state };
  }
};

export default web3Reducer;
