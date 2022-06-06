import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css' //Applies to roadmap elements too

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

//Import Social Icons & Icon Component
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import { Oval } from  'react-loader-spinner'
import { BrowserView, MobileView } from "react-device-detect";
import axios from 'axios'; //for whitelist API call

import Web3 from 'web3' //Classic web3 lib
import Web3Modal from "web3modal"; //Nice Web3 Popup with multiple connections
//Web3Modal Multiple Providers
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

//Web3Modal Options
const providerOptions = {
  // injected: {
  //   package: null,
  //   display: { name: "Default", description: "Default Wallet Provider" }
  // },
  walletconnect: {
    package: WalletConnectProvider,
    display: { name: 'Mobile', description: 'Trust Wallet/MetaMask, etc' }, //Visible Label, changeable
    options: {
        infuraId: "d31a6fe248ed4db3abac78f5b72ace93" //infura project id
    }
  },
  fortmatic: {
      package: Fortmatic,
      options: {
          key: "pk_live_8DFF4684EB75C648" //formatic api key
   }
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Menji's World NFT Mint", // Required
      infuraId: "d31a6fe248ed4db3abac78f5b72ace93", // Required
      rpc: "", // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: false // Optional. Use dark theme, defaults to false
    }
  }
};
let web3Modal;

// TODO put Menji solidity contract address and ABI here
// Contract Details
let address = '0xb585da9872d092498f020a938d65091fd96abbaf';
let abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint16",
				"name": "_srcChainId",
				"type": "uint16"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "_srcAddress",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "_nonce",
				"type": "uint64"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "_payload",
				"type": "bytes"
			}
		],
		"name": "MessageFailed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MAX_MINT_ETHEREUM",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_SUPPLY",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PRESALE_PRICE",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PROVENANCE_HASH",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PUBLIC_MINT_LIMIT",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PUBLIC_PRICE",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PUBLIC_SUPPLY",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "donate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "failedMessages",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "payloadLength",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "payloadHash",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isPresale",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isRevealed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "_srcChainId",
				"type": "uint16"
			},
			{
				"internalType": "bytes",
				"name": "_srcAddress",
				"type": "bytes"
			},
			{
				"internalType": "uint64",
				"name": "_nonce",
				"type": "uint64"
			},
			{
				"internalType": "bytes",
				"name": "_payload",
				"type": "bytes"
			}
		],
		"name": "lzReceive",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "numTokens",
				"type": "uint8"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextTokenId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "_srcChainId",
				"type": "uint16"
			},
			{
				"internalType": "bytes",
				"name": "_srcAddress",
				"type": "bytes"
			},
			{
				"internalType": "uint64",
				"name": "_nonce",
				"type": "uint64"
			},
			{
				"internalType": "bytes",
				"name": "_payload",
				"type": "bytes"
			}
		],
		"name": "onLzReceive",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "publicWalletLimit",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "_srcChainId",
				"type": "uint16"
			},
			{
				"internalType": "bytes",
				"name": "_srcAddress",
				"type": "bytes"
			},
			{
				"internalType": "uint64",
				"name": "_nonce",
				"type": "uint64"
			},
			{
				"internalType": "bytes",
				"name": "_payload",
				"type": "bytes"
			}
		],
		"name": "retryMessage",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "URI",
				"type": "string"
			}
		],
		"name": "setBaseURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "URI",
				"type": "string"
			}
		],
		"name": "setContractURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newVal",
				"type": "uint256"
			}
		],
		"name": "setGasForDestinationLzReceive",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "_chainId",
				"type": "uint16"
			},
			{
				"internalType": "bytes",
				"name": "_trustedRemote",
				"type": "bytes"
			}
		],
		"name": "setTrustedRemote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "_chainId",
				"type": "uint16"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "traverseChains",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"name": "trustedRemoteLookup",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amt",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];


let innerWidth = 700;
let innerHeight = 80;
//get window width
const useWidth = () => {
  const [innerWidth, setWidth] = useState(700); // default width, detect on server.
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  return innerWidth;
}
const useHeight = () => {
  const [innerHeight, setHeight] = useState(700); // default width, detect on server.
  const handleResize2 = () => setHeight(window.innerHeight);
  useEffect(() => {
    window.addEventListener('resize', handleResize2);
    return () => window.removeEventListener('resize', handleResize2);
  }, [handleResize2]);
  return innerHeight;
}


//Web3 - connect wallet & connect to eth contract
const editConnectButton = () => {
  try {
    if (typeof window.provider !== 'undefined') {
      if (typeof window.provider.selectedAddress !== 'undefined') {
        document.getElementById('connectButton').innerText = window.provider.selectedAddress.substr(0, 4) 
                                + '....' + window.provider.selectedAddress.substr(window.provider.selectedAddress.length - 4, 4);
        if (document.getElementById('mintConnectButton')) {
            document.getElementById('mintConnectButton').innerText = window.provider.selectedAddress.substr(0, 4) 
                   + '....' + window.provider.selectedAddress.substr(window.provider.selectedAddress.length - 4, 4);
        }
      } else { 
        document.getElementById('connectButton').innerText = "Connect"; 
        if (document.getElementById('mintConnectButton')) {
          document.getElementById('mintConnectButton').innerText = "Connect"; 
        }
      } 
    }
  } catch (error) {
    console.log('Error setting connect button text', error.message);
  }
}
//Use Infura as default
const setDefaultProvider = () => {
  if (typeof window.provider !== 'undefined' &&
      typeof window.web3 !== 'undefined') {
    return;
  }

  try {
    window.provider = new Web3.providers.HttpProvider(
      'https://ropsten.infura.io/v3/d31a6fe248ed4db3abac78f5b72ace93');
      //'https://mainnet.infura.io/v3/d31a6fe248ed4db3abac78f5b72ace93'); //TODO
  } catch (err) {
    console.log('Failed to set Infura as default walletless provider', err.message);
  } 
  
  try {
    if (typeof window.provider !== 'undefined') {
      window.web3 = new Web3(window.provider);
      // window.provider.enable().catch(function(err) {
      //   console.log('Error enabling', err.message);
      // });
    }
  } catch (err) {
    console.log('Error setting provider and web3', err.message);
  }
}

const connectToContract = () => {
  setDefaultProvider(); //use Infura to get contract info w.o connected wallet

  if (typeof window.web3 !== 'undefined') {
    try {
      window.contract = new window.web3.eth.Contract(abi, address);
    } catch (err) {
      console.log('Error setting contract:', err.message);
    }
  } else {
    console.log('Web3 is undefined.');
  }
}
const switchChainToMainnet = () => {
  // TODO change to 0x1 for launch
  try {
    if (window.provider.chainId !== '0x3') { 
      window.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x3" }],
      }).catch(err => {
        alert('Please switch to the ETH Mainnet', err.message)
      });
    }
  } catch (err) {
    if (window.provider && typeof window.provider.chainId !== 'undefined') {
      if (window.provider.chainId !== '0x3') { 
        alert('Please switch to the ETH Mainnet Network or Reload the page.')
      }
    }
  }
}
const setWeb3 = () => {
  try { //set web3 var
    window.web3 = new Web3(window.provider);
  } catch (err) {
    alert('Failed create web3 instance:', err.message);
  }
}
const enableProvider = () => {
  window.provider.enable().then(() => { 
    console.log('Selected Address:', window.provider.selectedAddress)

    window.provider.on("accountsChanged", (accounts) => {
      editConnectButton();
      console.log('Selected Address:', window.provider.selectedAddress, accounts[0])
    });
    window.provider.on("chainChanged", (chainId) => {
      console.log('Chain changed to', chainId);
      if (chainId != 1) {
        alert('Please Switch to the Ethereum Mainnet Network'); 
      }
    });
    window.provider.on("connect", (info) => {
      console.log('Connected to Wallet:', info);
      if (info.chainId != 1) {
        alert('Please Switch to the Ethereum Mainnet Network'); 
      }
    });
  }).catch(err => {
    alert('Error enabling provider', err.message);
  });
}
const connectWallet = () => {
  //ridiculously redundant code because it solved the errors
  if (typeof window === 'undefined') return;

  try {
    //Get provider
    web3Modal = new Web3Modal({
      network: "ropsten", //TODO change to mainnet
      cacheProvider: false, // optional
      providerOptions, // required
      disableInjectedProvider: false,
    });
    
    web3Modal.connect().then(provider => {
      window.provider = provider;
      alert('chose modal web3 (testing msg)')
    }).catch(err => {
      alert('Trying Backup Providers (testing msg)', err.message)
    });

    if (typeof window.provider === 'undefined') {
      if (typeof window.ethereum !== 'undefined') {
        window.provider = window.ethereum;
        alert('chose ethereum (testing msg)')
      } else if (typeof window.web3 !== 'undefined') {
        window.provider = window.web3.currentProvider;
        alert('chose web3currprov (testing msg)')
      } else { //Couldnt connect to wallet
        alert('Failed to connect to wallet, please reload and try again.')
        return;
      }
    }
    
    //enable provider and subscribe to provider events
    if (window.provider) {
      enableProvider();
      alert('1 (testing msg)')
      switchChainToMainnet();
      alert('2 (testing msg)')
      setWeb3();
      alert('3 (testing msg)')
      connectToContract();
      alert('4 (testing msg)')
    } else {
      alert('Failed to connect to wallet. Please reload the page.');
    }
  } catch (err) {
    alert('Failed to connect to wallet. Please reload the page', err.message)
  }
  editConnectButton();
}


// Fetch ETH contract data
async function fetchStaticData() {
  const totalSupply = await window.contract.methods.MAX_SUPPLY().call();
  const publicPrice = await window.web3.utils.fromWei(await window.contract.methods.PUBLIC_PRICE().call(), 'ether');
  const presalePrice = await window.web3.utils.fromWei(await window.contract.methods.PRESALE_PRICE().call(), 'ether');
  const publicWalletMax = await window.contract.methods.publicWalletLimit().call();
  //unused data currently:
  const publicSupply = await window.contract.methods.PUBLIC_SUPPLY().call();
  const provenanceHash = await window.contract.methods.PROVENANCE_HASH().call();

  const staticData = {
    'totalSupply': totalSupply,
    'publicPrice': publicPrice,
    'presalePrice': presalePrice,
    'publicWalletMax': publicWalletMax,
    'publicSupply': publicSupply,
    'provenanceHash': provenanceHash,
  }
  return staticData;
}
async function fetchDynamicData() {
  const isPresale = await window.contract.methods.isPresale().call();
  const totalMinted = await window.contract.methods.nextTokenId().call();
  const publicWalletLimit = await window.contract.methods.PUBLIC_MINT_LIMIT().call();
  //unused data currently
  const isRevealed = await window.contract.methods.isRevealed().call();

  const dynamicData = {
    'isPresale': isPresale,
    'totalMinted': totalMinted,
    'publicWalletLimit': publicWalletLimit,
    'isRevealed': isRevealed
  }
  return dynamicData;
}
//TODO replace with actual CHEF API Call
async function fetchWhitelistData() {
  // const response = await axios.post('https://APIURL/presale', 
  //                     {wallet: window.provider.selectedAddress});
  const response = {"data":{"allocation":19,"teir":2,"hash":"sha3_32552","signature":"0x2352262"}}
  console.log('Whitelist API Response:', response);
  return response
}

function ConnectButton() {
  return (
    <button className={styles.navBarItem_ConnectButton} id='connectButton'
            onClick={connectWallet}>Connect</button>
  )
}
function DiscordIcon() {
  return (
    <a className={styles.socialButton_discord} href="https://discord.gg/pTRtRXeCSM" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon="fa-brands fa-discord" size='3x'/>
    </a>
  )
}
function TwitterIcon() {
  return (
    <a className={styles.socialButton_twitter} href="https://twitter.com/menjisworld" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon="fa-brands fa-twitter" size='3x' />
    </a>
  )
}
//Main Page Sections/HTML
function NavBar() {
  innerWidth = useWidth();

  return (
    <nav className={styles.navBarContainer}>
      <nav className={styles.navBarLeft}>
            <Image src={"/logo.png"} 
                  width={1350} height={299} 
                  alt="Menji's World Logo" />
      </nav>

      {innerWidth <= 815 && 
        <nav className={styles.navBarRight}>
          <DiscordIcon />
          <ConnectButton />
          <TwitterIcon />
        </nav>
      }
      {innerWidth > 815 && 
        <nav className={styles.navBarRight}>
          <DiscordIcon />
          <TwitterIcon />
          <ConnectButton />
        </nav>
      }
    </nav>
  )
}
function MainImage() {
  innerWidth = useWidth();
  innerHeight = useHeight();
  
  return (
    // className={styles.mainContentRoadmap}
    <div className={styles.mainContentRoadmap}>
      <Image className={styles.roadmapImage} 
            src={"/_mainart.jpg"} 
            width={innerWidth} height={innerHeight/2}
            alt="Menji's World Main Art" 
            layout='responsive'
            objectFit="cover"
            />
    </div>
  )
}
function AboutMenjiSection() {
  return (
    <div className={styles.aboutContentBG}>
      <div className={styles.aboutContent}>
          Menji
          <br/><br/>
          Menji is an American Digital artist and painter from California with a goal to build a world that lives beyond his physical and digital work.
          <br/><br/>
          Menji's world was created with a sole focus to create unique experiences, bend the limitations of fashion, and be an example that anyone can create a world that is unique to themselves and inclusive to those who care to explore it.
          <br/><br/>
          Welcome to Menji's World.
      </div>
    </div>
  )
}
function TEAMSection() {
  //might have to use useEffect to add and remove efvent listeners from commented code below
  const [team1checked, setTeam1Checked] = useState(false);
  const [team2checked, setTeam2Checked] = useState(false);
  const [team3checked, setTeam3Checked] = useState(false);
  const [team4checked, setTeam4Checked] = useState(false);

  const check1 = () => { setTeam1Checked(!team1checked); window.scrollTo(0,document.body.scrollHeight); }
  const check2 = () => { setTeam2Checked(!team2checked); window.scrollTo(0,document.body.scrollHeight); }
  const check3 = () => { setTeam3Checked(!team3checked); window.scrollTo(0,document.body.scrollHeight); }
  const check4 = () => { setTeam4Checked(!team4checked); window.scrollTo(0,document.body.scrollHeight); }
  
  // useEffect(() => {

  //   window.document.getElementById('i1').addEventListener('click', check1);
  //   window.document.getElementById('p1').addEventListener('click', check1);

  //   window.document.getElementById('i2').addEventListener('click', check2);
  //   window.document.getElementById('p2').addEventListener('click', check2);

  //   window.document.getElementById('i3').addEventListener('click', check3);
  //   window.document.getElementById('p3').addEventListener('click', check3);

  //   window.document.getElementById('i4').addEventListener('click', check4);
  //   window.document.getElementById('p4').addEventListener('click', check4);
  //   return () => {
  //     window.document.getElementById('i1').removeEventListener('click', check1);
  //     window.document.getElementById('p1').removeEventListener('click', check1);

  //     window.document.getElementById('i2').removeEventListener('click', check2);
  //     window.document.getElementById('p2').removeEventListener('click', check2);

  //     window.document.getElementById('i3').removeEventListener('click', check3);
  //     window.document.getElementById('p3').removeEventListener('click', check3);

  //     window.document.getElementById('i4').removeEventListener('click', check4);
  //     window.document.getElementById('p4').removeEventListener('click', check4);
  //   }
  // }, [team1checked, team2checked, team3checked, team4checked,setTeam1Checked, setTeam2Checked, setTeam3Checked, setTeam4Checked])

  return (
    <div className={styles.teamContainer}>
      <div className={styles.teamMember}>
        <Image id='i3' className={styles.teamMemberImage} src={'/team3.jpeg'} width={200} height={200} onClick={check3}/>
        <p id='p3' className={styles.teamMemberName} onClick={check3}>Menji <a>+</a></p>
        { team3checked && <p className={styles.teamMemberText}>SF based artist with a passion for uplifting those around him. </p> }
      </div>
      <div className={styles.teamMember}>
        <Image id='i2' className={styles.teamMemberImage} src={'/team2.jpeg'} width={200} height={200} onClick={check2} />
        <p id='p2' className={styles.teamMemberName} onClick={check2}>Jay <a>+</a></p>
        { team2checked && <p className={styles.teamMemberText}>Cofounder of Painted Labs. Big Tech Director turned NFT degen. Alpha addict.</p> }
      </div>   
      <div className={styles.teamMember}>
        <Image id='i4' className={styles.teamMemberImage} src={'/team4.jpeg'} width={200} height={200} onClick={check4} />
        <p id='p4' className={styles.teamMemberName} onClick={check4}>Doc <a>+</a></p>
        { team4checked && <p className={styles.teamMemberText}>Cofounder of Painted Labs. Community Operations - Eternal Optimist. No idea is too crazy</p> }
      </div>         
      <div className={styles.teamMember}>
        <Image id='i1' className={styles.teamMemberImage} src={'/team1.jpeg'} width={200} height={200} onClick={check1} />
        <p id='p1' className={styles.teamMemberName} onClick={check1}>Sticky <a>+</a></p>
        { team1checked && <p className={styles.teamMemberText}>Crypto-Native savant now doubling as COO of Painted Labs. TA impeccable. </p> }
      </div>
    </div>
  )
} 
function MintModalLoading() {
  return (
    <div className={styles.mintModalLoading} id='mintModalLoading' >
        <Oval
          height="90%"
          width="90%"
          color='green'
          secondaryColor='orange'
          ariaLabel='loading'
        />
    </div>
  )
}
function MintModal() {
  const [mintLoading, setMintLoading] = useState(false);
  const [mintButtonDisabled, setMintButtonDisabled] = useState (false);

  const [mintError, setMintError] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintErrorMessage, setMintErrorMessage] = useState("");
  const [mintSuccessMessage, setMintSuccessMessage] = useState("");

  const [titleText, setTitleText] = useState("Presale Mint");
  const [mintButtonText, setMintButtonText] = useState("Mint");
  const [presaleData, setPresaleData] = useState({});
  const [isPresale, setIsPresale] = useState(true); 

  const [totalMintAmount, setTotalMintAmount] = useState(0);
  const [amountMintedAlready, setAmountMintedAlready] = useState(0);
  const [publicWalletLimit, setPublicWalletLimit] = useState(0);

  const [mintAmount, setMintAmount] = useState(1);
  const [totalMintPrice, setTotalMintPrice] = useState(0);
  const [pricePerNFT, setPricePerNFT] = useState(0.01);
  const [maxMintForCurrentWallet, setMaxMintForCurrentWallet] = useState(10);
  

  const setMintPriceBoxValue = (price) => {
    if (window.document.getElementById('mintAmountBox') !== null) {
      const num = parseInt(window.document.getElementById('mintAmountBox').value);
      setTotalMintPrice(Math.round(num * price * 100) / 100);
    }
  }
  //Fetch Contract Data & Call Whitelist API
  const fetchAndSetRemoteData = (secondTry = false) => {

    if (window.contract) {
      fetchStaticData().then(data => {
        setTotalMintAmount(data.totalSupply);

        //total minted + check if presale
        fetchDynamicData().then(_data => {
          setIsPresale(_data.isPresale);
          setAmountMintedAlready(_data.totalMinted); 
          setPublicWalletLimit(_data.publicWalletLimit);

          // if presale or public sale then set Mint window text + NFT Price 
          if (_data.isPresale === true) {
            setTitleText('Presale Mint');
            setPricePerNFT(data.presalePrice);
            setMintPriceBoxValue(data.presalePrice);

            //fetch presale allocation API data for wallet
            if (typeof window.provider.selectedAddress !== 'undefined') {
              fetchWhitelistData().then(__data => {
                setPresaleData(__data);
                setMaxMintForCurrentWallet(__data.data.allocation);
              }).catch(err => {
                setMaxMintForCurrentWallet(data.publicWalletMax);
                console.log('Error fetching whitelist data, defaulting to public max', err.message);
              });
            } else {
              setMaxMintForCurrentWallet(data.publicWalletMax);
            }

          } else { //is public sale
            setPresaleData({}); 
            setTitleText('Public Mint'); 
            setPricePerNFT(data.publicPrice); 
            setMintPriceBoxValue(data.publicPrice);
            setMaxMintForCurrentWallet(data.publicWalletMax);
          }
        }).catch(err => {
          console.log('Error fetching Dynamic contract data', err.message);
        });
      }).catch(err => {
        if (!secondTry) {
          console.log('Error fetching static contract data', err.message)
          switchChainToMainnet();
          connectToContract();
          fetchAndSetRemoteData(true);
        } else {
          alert('Please Reload the page. Error connecting to contract.')
        }
      });
    } else {
      if (!secondTry) {
        switchChainToMainnet();
        connectToContract();
        fetchAndSetRemoteData(true);
      } else {
        alert('Please Reload the page. Error connecting to contract.')
      }
    }
  }
  //called from mint button
  const mint = () => {
    if (typeof window.provider === 'undefined' ||
        typeof window.provider.selectedAddress === 'undefined') {
      alert('Please connect to a wallet');
      return;
    }
    
    connectToContract();
    
    //Try to mint
    if (window.contract) {
      fetchAndSetRemoteData();
      if (pricePerNFT > 0.01) {
        setMintButtonText("Minting"); setMintButtonDisabled(true);

        setMintError(false); setMintSuccess(false); 
        setMintErrorMessage(""); setMintSuccessMessage("");
    
        setMintLoading(true); //bring up loading spinner

        //TODO next comment this out and see if it stops the mint
        makePurchase();
      } else {
        setMintError(true);
        setMintErrorMessage('Please Wait for Contract Data to load');
      }
    }
  }  
  //purchase NFT for presale and public sales via mint button
  const makePurchase = () => { 


    function publicPurchase() { 
      window.contract.methods.purchase(mintAmount).send({
        from: window.provider.selectedAddress, 
        value: window.web3.utils.toWei(totalMintPrice, 'ether')
      }).then(function(receipt) {
          console.log(receipt);
          setMintSuccess(true);
          setMintSuccessMessage('Minted ' + receipt.events.Purchase.returnValues.length + ' tokens!');
          afterMintUIChanges();
      }).catch(err => {
        setMintError(true);
        setMintErrorMessage('Error minting tokens: ' + err.message);
        afterMintUIChanges();
      });
    }

    function presalePurchase() {
      // Solidity .sol contract presale function
      // function presalePurchase(
      //   uint256 _quantity, uint256 _tier, bytes32 _hash, bytes memory _signature)
      window.contract.presalePurchase(
        mintAmount, 
        presaleData.data.teir, 
        presaleData.data.hash, 
        presaleData.data.signature
      ).send({from: window.provider.selectedAddress, 
              value: window.web3.utils.toWei(totalMintPrice, 'ether')
      }).then(function(receipt) {
          console.log(receipt);
          setMintSuccess(true);
          setMintSuccessMessage('Minted ' + receipt.events.PresalePurchase.returnValues.length + ' tokens!');
          afterMintUIChanges();
      }).catch(err => {
        setMintError(true);
        setMintErrorMessage('Error minting tokens: ' + err.message);
        afterMintUIChanges();
      });

    }

    function testMint() {
      window.contract.methods.mint(mintAmount).send({
        from: window.provider.selectedAddress//,
        // value: window.web3.utils.toWei(totalMintPrice.toString(), 'ether')
      }).then(function(receipt) {
          console.log(receipt);
          setMintSuccess(true); //todo switch ropsten to nothing and add opensea link
          setMintSuccessMessage('Mint Success: https://ropsten.etherscan.io/tx/' + receipt.transactionHash);
          afterMintUIChanges();
      }).catch(err => {
        console.log(err.message)
        setMintError(true);
        setMintErrorMessage('Error minting tokens: ' + err.message);
        afterMintUIChanges();
      });
    }

    //call mint function   
    if (mintAmount > 0 && totalMintPrice > 0) {
      if (isPresale) {
        try {   
          if (typeof presaleData.data !== 'undefined' &&
              typeof presaleData.data.allocation !== 'undefined' &&
              typeof presaleData.data.teir !== 'undefined' &&
              typeof presaleData.data.hash !== 'undefined' &&
              typeof presaleData.data.signature !== 'undefined') {
            if (presaleData.data.allocation > 0) {                
              if (mintAmount > presaleData.data.allocation) {
                setMintError(true);
                setMintErrorMessage('Error: You can only mint up to ' + presaleData.data.allocation + ' tokens in the presale');
                afterMintUIChanges();
                return;
              }
              if (mintAmount > 0) {
                  testMint(); //TODO UNCOMMENT
                  // presalePurchase(presaleData);
              } else {
                alert('Wallet not white listed for presale or presale API down', presaleData);
              }  
            }
          } else {
            alert('Wallet not whitelisted for presale');
          }
        } catch (err) {
          alert('Wallet not white listed for presale or presale API down', err.message);
        }
      } else {
        console.log('Public sale is live. Minting Public.')
        testMint();
        // publicPurchase();
      }
    } else {
      setMintError(true);
      setMintErrorMessage('Zero Mint Error: Please Reload the page and try again.');
    }
  }
  //reset mint modal button, etc.
  const afterMintUIChanges = () => {
    setMintButtonDisabled(false);
    setMintButtonText("Mint");
    setMintLoading(false);
  }  

  // Plus and Minus NFT amount buttons
  const incrementMintAmountNumberBox = (maxMint) => {
    const num = parseInt(window.document.getElementById('mintAmountBox').value);
    if (num < maxMint) {
      setMintAmount(num + 1); 
      setTotalMintPrice(
        Math.round((num + 1) * pricePerNFT * 100) / 100);        
    }
  }
  const decrementMintAmountNumberBox = () => {
    const num = parseInt(window.document.getElementById('mintAmountBox').value);
    if (num > 1) {
      setMintAmount(num - 1); 
      setTotalMintPrice(
        Math.round((num - 1) * pricePerNFT * 100) / 100);
    }
  }
  //click events for closing alert popups
  useEffect(() => {
    function closeAlertPopup() {
      setMintError(false);
      setMintErrorMessage("");
      setMintSuccess(false);
      setMintSuccessMessage("");
    }
    if (mintError === true || mintSuccess === true) {
      window.document.getElementById('closeAlertButton').addEventListener('click', closeAlertPopup);
    }
  }, [mintError, mintSuccess]);

  return (
    <div>
      {/* conditionally rendered popups */}
      { mintLoading && <MintModalLoading /> } {/* loading spinner */}
      { mintError   && <div className={styles.alertPopup} id='alertBG'>
                         <a>{mintErrorMessage}<div id='closeAlertButton'></div></a></div> }
      { mintSuccess && <div className={styles.alertPopup} id='alertBG'>
                         <a>{mintSuccessMessage}<div id='closeAlertButton'></div></a></div> }
      
      {/* Mint Modal popup */}
      {/* onload */}
      
      <div id='mintModal' className={styles.mintModal} onLoad={() => {
            editConnectButton();
            fetchAndSetRemoteData();
      }}>
        <div className={styles.mintModalBody}>

          <div className={styles.mintModalHeader}>
            <h2>{titleText}</h2><button id='closeModalButton' 
                                        className={styles.mintModalCloseButton}/>  
          </div>

          <div className={styles.mintModalHeader2}>
            <div className={styles.mintModalInputContainer}>
              <button className={styles.mintPopup_ConnectButton}
                      id='mintConnectButton'>Connect</button>
            </div>

            <div className={styles.mintModalHeader}>
              <div className={styles.mintModalInputContainer2}>
                <div className={styles.mintModalSection_left}>
                  <h3>This Wallet's Max
                    <div>
                      <h3 id='maxMint'>
                        {isPresale || publicWalletLimit
                                    ? maxMintForCurrentWallet.toString()
                                    : 'No Max'}
                      </h3>
                    </div>
                  </h3>
                </div>
                <div className={styles.mintModalSection_right}>
                  <h3>Total Minted
                    <div>
                      <h3>{amountMintedAlready.toString()}/{totalMintAmount.toString()}</h3>
                    </div>
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mintModalInputContainer}>
            <p>Amount to Mint</p>
            <div className={styles.mintNumberBoxWithButtons}>
              <div id='minusButton' 
                   className={styles.minusSign}
                   onClick={decrementMintAmountNumberBox}
              >-</div>
              <input id='mintAmountBox' className={styles.inputNumber} 
                    value={mintAmount} type="number" disabled />
              <div id='plusButton' 
                   className={styles.plusSign}
                   onClick={() => {incrementMintAmountNumberBox(maxMintForCurrentWallet);}}
              >+</div>
            </div>
          </div>

          <div className={styles.mintModalInputContainer2}>
            <div className={styles.mintModalSection_left}> 
              <p>Total Price</p>
              <p>Price Per NFT</p>
            </div>
            <div className={styles.mintModalSection_right}> 
              <input className={styles.inputNumber2} type="text" value={totalMintPrice.toString() + ' ETH'} disabled/>
              <input className={styles.inputNumber2} type="text" value={pricePerNFT.toString() + ' ETH'} disabled/>
            </div>
          </div>

          <div className={styles.mintModalInputContainer}>
            <button id='mintButtonOnPopup' className={styles.mintModalButton} 
                    onClick={mint} disabled={mintButtonDisabled}>{mintButtonText}</button>
          </div>
        </div>
      </div> 
    </div> 
  )
}

function PDFViewer() {
  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    console.log('PDF Loaded')
  }

  return (
    <div className={styles.pdfBG} id='pdfBG'>
      <div className={styles.pdfHeader}>
        <a href='https://pdfhost.io/v/2GZg4aAJM_Menjis_World_Collector_Agreement' target='_blank'>Open Document</a>
        <span id='closePDFButton'>X</span>
      </div>

      <Document className={styles.pdfViewBox}
                file="/Menjis_World_Collector_Agreement.pdf"
                onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          key={`page_1`}
          pageNumber={1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
      </div>
      
  );
}
//Roadmap Page Sections/HTML
function FAQSection() {
  const [faq1checked, setFaq1Checked] = useState(false);
  const [faq2checked, setFaq2Checked] = useState(false);
  const [faq3checked, setFaq3Checked] = useState(false);
  // const [faq4checked, setFaq4Checked] = useState(false);

  return (<>
    <BrowserView>
      <div className={styles.FAQContainer}>
        <nav className={styles.FAQItem}>
          <div className={styles.touch} onClick={() => {setFaq1Checked(!faq1checked); window.scrollTo(0,document.body.scrollHeight);}}>
            <span>What is the mint date?</span>
            { faq1checked && <ul className={styles.slide}>
            <li><a>Menji’s World mint date is still to be determined based on current market conditions. We want our holders to be rewarded from the start so waiting for the most optimal time to drop our collection is imperative to long-term success.</a></li> 
            </ul> }
          </div>
        </nav>

        <nav className={styles.FAQItem}>
          <div className={styles.touch} onClick={() => {setFaq2Checked(!faq2checked); window.scrollTo(0,document.body.scrollHeight);}}>
            <span>How many NFTs will be available?</span>               
            { faq2checked && <ul className={styles.slide}>
              <li><a> Total NFTs available will be finalized as we get closer to mint date!</a></li> 
            </ul> }
          </div>
        </nav>

        <nav className={styles.FAQItem}>
          <div className={styles.touch} onClick={() => {setFaq3Checked(!faq3checked); window.scrollTo(0,document.body.scrollHeight);}}>
            <span>How much will each NFT cost?</span>              
            { faq3checked && <ul className={styles.slide}>
              <li><a>Likewise, mint cost will be made available as we get closer to mint date.</a></li> 
            </ul> }
          </div>
        </nav>

        {/* <nav className={styles.FAQItem}>
          <div className={styles.touch} onClick={() => {setFaq4Checked(!faq4checked); window.scrollTo(0,document.body.scrollHeight);}}>
            <span>Who is Painted Labs?</span>
            { faq4checked && <ul className={styles.slide}>
              <li><a>The Paint Room is a group of 100 of NFTs Greatest Talents, Alphas, Innovators, Marketers, and Influencers. The Paint Room Structure acts as an Engine for MoshiMochi Innovation and Holder Development. The Mochis will add the fuel...</a></li> 
            </ul> }
          </div>
        </nav> */}
      </div>
    </BrowserView>

    <MobileView>
      <div className={styles.FAQContainer}>
        <nav className={styles.FAQItemMobile}>
          <div className={styles.touch} onClick={() => {setFaq1Checked(!faq1checked); window.scrollTo(0,document.body.scrollHeight);}}>
            <span>What is the mint date?</span>
            { faq1checked && <ul className={styles.slide}>
            <li><a>Menji’s World mint date is still to be determined based on current market conditions. We want our holders to be rewarded from the start so waiting for the most optimal time to drop our collection is imperative to long-term success.</a></li> 
            </ul> }
          </div>
        </nav>

        <nav className={styles.FAQItemMobile}>
          <div className={styles.touch} onClick={() => {setFaq2Checked(!faq2checked); window.scrollTo(0,document.body.scrollHeight);}}>
            <span>How many NFTs will be available?</span>               
            { faq2checked && <ul className={styles.slide}>
              <li><a> Total NFTs available will be finalized as we get closer to mint date!</a></li> 
            </ul> }
          </div>
        </nav>

        <nav className={styles.FAQItemMobile}>
          <div className={styles.touch} onClick={() => {setFaq3Checked(!faq3checked); window.scrollTo(0,document.body.scrollHeight);}}>
            <span>How much will each NFT cost?</span>              
            { faq3checked && <ul className={styles.slide}>
              <li><a>Likewise, mint cost will be made available as we get closer to mint date.</a></li> 
            </ul> }
          </div>
        </nav>

        {/* <nav className={styles.FAQItemMobile}>
          <div className={styles.touch} onClick={() => {setFaq4Checked(!faq4checked); window.scrollTo(0,document.body.scrollHeight);}}>
            <span>Who is Painted Labs?</span>
            { faq4checked && <ul className={styles.slide}>
              <li><a>The Paint Room is a group of 100 of NFTs Greatest Talents, Alphas, Innovators, Marketers, and Influencers. The Paint Room Structure acts as an Engine for MoshiMochi Innovation and Holder Development. The Mochis will add the fuel...</a></li> 
            </ul> }
          </div>
        </nav> */}
      </div>
    </MobileView>

    </>)
} 
function RoadmapPage() {
  innerWidth = useWidth();
  innerHeight = useHeight();

  return (<>

    <div className={styles.mainContentRoadmap}>
      {/* link to view roadmap.jpg in a new tab */}
      <a href='/roadmap.jpg' target="_blank">
        <Image className={styles.roadmapImage} 
              src={"/roadmap.jpg"} 
              width={innerWidth} height={innerHeight/2}
              alt="Click to open Roadmap Image" 
              layout='responsive'
              objectFit="cover"/>
      </a>

    </div>
    <BrowserView>
    <div className={styles.roadmapTextBG}>
      <div className={styles.roadmapTitle1}>Utility Roadmap</div>

      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitle}>Free T-Shirt</div>
        <div className={styles.roadmapText}>Menji's World holders will have access to a complimentary T-shirt shortly after the reveal.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitle}>Physical Prints</div>
        <div className={styles.roadmapText}>Unique and high quality prints designed by Menji will be available for purchase.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitle}>Menji's World Trailer</div>
        <div className={styles.roadmapText}>Opening scene to the Menji's World animated series.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitle}>Menji's World X Team Trees</div>
        <div className={styles.roadmapText}>Menji’s World will make be dedicating resources to Plant Trees all over the world in representation of the community with the help of Team Trees.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitle}>High Quality Merch</div>
        <div className={styles.roadmapText}>High Quality Merch designed by Menji using one of the most established suppliers in the NFT ecosystem.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitle}>Collectibles</div>
        <div className={styles.roadmapText}>IRL collectables of characters within Menji’s World that will serve as a physical bridge into the virtual world we all know and live.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitle}>Farmers Market Event</div>
        <div className={styles.roadmapText}>Members will have the chance to attend a live event hosted by Menji’s World. Music, good food, and good vibes.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitle}>Meditation App</div>
        <div className={styles.roadmapText}>Your mind's best friend. A partnership with one of the largest meditation apps that will include community discounted subscriptions and Menjified experiences.</div>
      </div>
    </div>
    </BrowserView>
    <MobileView>
    <div className={styles.roadmapTextBG}>
      <div className={styles.roadmapTitle1}>Utility Roadmap</div>

      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitleMobile}>Free T-Shirt</div>
        <div className={styles.roadmapText}>Menji's World holders will have access to a complimentary T-shirt shortly after the reveal.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitleMobile}>Physical Prints</div>
        <div className={styles.roadmapText}>Unique and high quality prints designed by Menji will be available for purchase.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitleMobile}>Menji's World Trailer</div>
        <div className={styles.roadmapText}>Opening scene to the Menji's World animated series.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitleMobile}>Menji's World X Team Trees</div>
        <div className={styles.roadmapText}>Menji’s World will make be dedicating resources to Plant Trees all over the world in representation of the community with the help of Team Trees.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitleMobile}>High Quality Merch</div>
        <div className={styles.roadmapText}>High Quality Merch designed by Menji using one of the most established suppliers in the NFT ecosystem.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitleMobile}>Collectibles</div>
        <div className={styles.roadmapText}>IRL collectables of characters within Menji’s World that will serve as a physical bridge into the virtual world we all know and live.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitleMobile}>Farmers Market Event</div>
        <div className={styles.roadmapText}>Members will have the chance to attend a live event hosted by Menji’s World. Music, good food, and good vibes.</div>
      </div>
      <div className={styles.roadmapTextBox}>
        <div className={styles.roadmapTitleMobile}>Meditation App</div>
        <div className={styles.roadmapText}>Your mind's best friend. A partnership with one of the largest meditation apps that will include community discounted subscriptions and Menjified experiences.</div>
      </div>
    </div>
    </MobileView>
    <div className={styles.roadmapButtons}>
      <button className={styles.mintButton2} id='mintButton2'>
                                  <BrowserView>Mint Now</BrowserView>
                                  <MobileView>Mint</MobileView>    
      </button>

      { innerWidth >= 515 && 
      <Link href="/home">
        <a className={styles.mintButton2}><BrowserView>Home Page</BrowserView>
                                          <MobileView>Home</MobileView> </a> 
      </Link> }

      { innerWidth < 515 && 
      <Link href="/home">
        <a className={styles.mintButton2}>Home</a> 
      </Link> }
      
    </div>
    
    </>)
}
//roadmap.js needs these functions exported to be able to render
export { NavBar, PDFViewer, MintModal, FAQSection, RoadmapPage, editConnectButton, connectWallet };



export default function Home() {
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [collectorsAgreementOpen, setCollectorsAgreementOpen] = useState(false);

  //Mint Modal Popup
  useEffect(() => {
    const closeAndConnect = () => {
      closeMintModal();
      connectWallet();
    }
    const closeMintModal = () => {
      setMintModalOpen(false);
    }
    if (mintModalOpen === true) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('mintModal')) {closeMintModal();}}
      window.document.getElementById('closeModalButton').addEventListener('click', closeMintModal);
      window.document.getElementById('mintConnectButton').addEventListener('click', closeAndConnect);
    }
  }, [mintModalOpen]);

  //PDF Popup
  useEffect(() => {
    const closePDFModal = () => {
      setCollectorsAgreementOpen(false);
    }
    if (collectorsAgreementOpen === true) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('pdfBG')) {closePDFModal();}}
      window.document.getElementById('closePDFButton').addEventListener('click', closePDFModal);
    }
  }, [collectorsAgreementOpen]);

  return (
    <div className={styles.container} onLoad={() => {
      editConnectButton();
      setDefaultProvider();
    }}>
      <Head>
        <title>MENJi's World NFT Drop</title>
        <meta name="description" content="MENJi's NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      { collectorsAgreementOpen && <PDFViewer /> }

      {/* Takes over page when Mint Button clicked */}
      { mintModalOpen && <MintModal /> }

      <NavBar />  {/* At top of both pages: Logo + Connect button + Social Buttons*/}
      <MainImage />
      <main> {/* Theoretically useful for SEO */}
        <AboutMenjiSection />

        {/* Section with Mint button, roadmap page button, about project */}
        <div className={styles.mainContent_2}>
          {/* NFT Breakdown Image */}
          <div className={styles.mainContent_2_left}>
            <Image src={"/sample_nft_sm.jpg"} 
                  width={1054} height={854} 
                  alt="Menji's World Sample Art"
                  />
          </div>

          {/* Mint Button + Page 2 Button + About Menji's World Text */}
          <div className={styles.mainContent_2_right}>
            <a className={styles.mintButton} id='mintButton'
                onClick={() => {setMintModalOpen(true);}}>Mint</a>
            <p className={styles.aboutContent_2}> 
              Menji's World
              <br/><br/>
                Menji is an American Digital artist and painter from California with a goal to build a world that lives beyond his physical and digital work.
                <br/><br/>
                Menji's world was created with a sole focus to create unique experiences, bend the limitations of fashion, and be an example that anyone can create a world that is unique to themselves and inclusive to those who care to explore it.
                <br/><br/>
                Welcome to Menji's World.
            </p>
            <Link href="/roadmap">
              <a className={styles.mintButton} id='page2Button'
                >FAQ / Roadmap</a>
            </Link>        
          </div>
        </div>
      </main>

      <TEAMSection />  {/* 4 circular images with expandable member descriptions */}
      <div>
        {/* link to meji's world colelctor agreement and copyright 2022 paintedlabs */}
        <div className={styles.copyright}>
          <a>© 2022 MENJi's WORLD. All rights reserved.</a>
          <a className={styles.pdfPopupLink} 
             onClick={() => {setCollectorsAgreementOpen(true);}}>Collectors Agreement</a>
        </div>
      </div>
    </div>
  )
}