import { useCallback, useEffect } from "react";
import Web3Modal from "web3modal";
import { providerOptions } from "../config/providerOptions";
import { ethers } from "ethers";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";

import * as UAuthWeb3Modal from "@uauth/web3modal";

let web3Modal: Web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
  });

  UAuthWeb3Modal.registerWeb3Modal(web3Modal);
}

export default function Web3Button({ className }: { className?: string }) {
  const { provider, web3Provider, address, chainId } = useSelector(
    (state: RootState) => state.web3
  );

  const dispatch = useDispatch();

  const connect = useCallback(async function () {
    let provider;
    try {
      provider = await web3Modal.connect();
    } catch (err) {
      console.error("connection canceled");
      return;
    }

    const web3Provider = new ethers.providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    const network = await web3Provider.getNetwork();

    dispatch({
      type: "SET_WEB3_PROVIDER",
      payload: {
        provider,
        web3Provider,
        address,
        chainId: network.chainId,
      },
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
    },
    [provider]
  );

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("accountsChanged", accounts);
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload();
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  return web3Provider ? (
    <button className={className} onClick={disconnect}>
      Disconnect
    </button>
  ) : (
    <button className={className} onClick={connect}>
      Connect
    </button>
  );
}
