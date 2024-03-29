import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import styles from "../styles/Home.module.css";

export default function Home() {
  const imageUrl = "https://gateway.ipfs.io/ipfs/QmTCuKodCzuRDHyJqKeXx41XM2vXmaXNCEbwfq1untP7By/pearl.jpg";
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);

  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);

  // tokenIdsMinted keeps track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");

  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  // publicMint: Mint an NFT
  const mintNFT = async () => {
    console.log('Button clicked!'); 
    console.log('mintNFT function called');
    try {
      // We need a Signer since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      // call the mint from the contract to mint the nfts
      const tx = await nftContract.mint({
        // value signifies the cost of one NFT which is "0.01" eth.
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      // wait for transaction to get mined
      await tx.wait();
      setLoading(false);
      window.alert("successfully minted");
    } catch (err) {
      console.error(err);
    }
  };


  // connectWallet: Connects the MetaMask wallet
  const connectWallet = async () => {
    console.log('connectWallet function called');
    try {
      // Get the provider from web3Modal (MetaMask)
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  // getTokenIdsMinted: displays number of tokenIds minted
  const getTokenIdsMinted = async () => {
    try {
      // Get the provider from web3Modal (MetaMask)
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      // call the tokenIds from the contract
      const _tokenIds = await nftContract.tokenIds();
      console.log("tokenIds", _tokenIds);
      //_tokenIds is a `Big Number`. We need to convert the Big Number to a string
      setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // when the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
      getTokenIdsMinted();

      // set an interval to get the number of token Ids minted every 5 seconds
      setInterval(async function () {
        await getTokenIdsMinted();
      }, 6 * 1000);
    }
  }, [walletConnected]);

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wllet
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );

    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    // does not work rn
    return (
      <button className={styles.button} onClick={mintNFT}> 
        Click to Mint
      </button>
    );
  };





  return (
    <div>
      <Head>
        <title>amArtCollection</title>
        <meta name="description" content="myNFTs-Dapp" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to my art project!</h1>
          <div className={styles.description}>
            A NFT collection for you, from me.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/6 have been minted
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src={imageUrl} alt="NFT Image" />
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by AM</footer>
    </div>
  );
}
