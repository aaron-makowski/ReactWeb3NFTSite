import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css' //Applies to roadmap elements too

import CustomHead from '../components/CustomHead'
import Image from 'next/image'

// General Useful
import { Oval } from  'react-loader-spinner'
import { BrowserView, MobileView } from "react-device-detect";
import axios from 'axios'; //for whitelist API call

//Web3 sauces
import { ethers } from 'ethers'; //general web3
import { ConnectButton } from '@rainbow-me/rainbowkit'; //wallet popup
import {    useAccount   ,   useContractWrite, // read/write eth contracts
         useContractReads, useWaitForTransaction } from 'wagmi' 



// TODO put Menji solidity contract address and ABI here
// Contract Details
const contractAddress = '0xb585da9872d092498f020a938d65091fd96abbaf';
const abi = [
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
let innerHeight = 800;
//get window width
const useWidth = () => {
  const [_innerWidth, setWidth] = useState(700); // default width, detect on server.
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  return _innerWidth;
}
const useHeight = () => {
  const [_innerHeight, setHeight] = useState(700); // default width, detect on server.
  const handleResize2 = () => setHeight(window.innerHeight);
  useEffect(() => {
    window.addEventListener('resize', handleResize2);
    return () => window.removeEventListener('resize', handleResize2);
  }, [handleResize2]);
  return _innerHeight;
}


//TODO replace with actual CHEF API Call
async function fetchWhitelistData() {
  // const response = await axios.post('https://APIURL/presale', 
  //                     {wallet: window.provider.selectedAddress});
  const response = {"data":{"allocation":19,"teir":2,"hash":"sha3_32552","signature":"0x2352262"}}
  console.log('Whitelist API Response:', response);
  return response
}

//UI Components
function ConnectButtonCustomized(props) {

  return (<>
    <ConnectButton.Custom>
    {
      ({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              'style': { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
            })}
          >{(() => {
              if (!mounted || !account || !chain) {
                return (
                  <button className={props.style} 
                          onClick={openConnectModal} type="button">
                    Connect
                  </button>
                );
              }

              if (chain.unsupported) {
                return (<>
                  <BrowserView>
                    <button className={props.style} 
                            onClick={openChainModal} type="button">
                      Wrong network
                    </button>
                  </BrowserView>
                  <MobileView>
                    <button className={props.style} 
                        onClick={openChainModal} type="button">
                      Wrong network
                    </button>  
                  </MobileView>
                </>);
              }

              return (
                  <button onClick={openAccountModal} type="button"
                          className={props.style}>
                    {account.displayName}
                    {/* {account.displayBalance ? ` (${account.displayBalance})` : ''} */}
                  </button>
              );
            })() }
          </div>
        );
      }
    }
    </ConnectButton.Custom>
  </>)
}

function MintModalLoading() {
  return (
    <div className={styles.mintModalLoading} 
         id='mintModalLoading' >
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
function MintModal(props) {
  const [titleText, setTitleText] = useState("Presale Mint");
  const [mintButtonText, setMintButtonText] = useState("Mint");

  //Total Cost for X NFTs
  const [totalMintPrice, setTotalMintPrice] = useState(null);
  const [totalMintAmount, setTotalMintAmount] = useState(null);
  const [mintAmount, setMintAmount] = useState(1);

  //Contract Data
  const [isPresale, setIsPresale] = useState(null);
  const [presaleData, setPresaleData] = useState(null);
  const [maxMintForCurrentWallet, setMaxMintForCurrentWallet] = useState(null);
  const [pricePerNFT, setPricePerNFT] = useState(null);
  const [amountMintedAlready, setAmountMintedAlready] = useState(null);
  const [publicWalletLimit, setPublicWalletLimit] = useState(null);
  
  //Checks if all data needed to mint is present
  const [allContractDataPresent, setAllContractDataPresent] = useState(false);
  const [isClosing, setIsClosing] = useState(false); //if popup closing

  //Loading Spinner
  const [mintLoading, setMintLoading] = useState(false);
  const [mintButtonDisabled, setMintButtonDisabled] = useState(true);

  //Minting Success/Error Popups
  const [mintError, setMintError] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintErrorMessage, setMintErrorMessage] = useState("");
  const [mintSuccessMessage, setMintSuccessMessage] = useState("");


  ///////      ///////
  const testMode = true
  ///////      ///////

  // Needed to interact with contract
  const contractInfo = {
    addressOrName: contractAddress,
    contractInterface: abi,
    chainId: 3,//TODO change to 1
  }

  //Fetch / Read Contract Data
  useContractReads({
    contracts: [
      {
        ...contractInfo,
        functionName: 'MAX_SUPPLY',
      },
      {
        ...contractInfo,
        functionName: 'PUBLIC_PRICE',
      },
      {
        ...contractInfo,
        functionName: 'PRESALE_PRICE',
      },
      {
        ...contractInfo,
        functionName: 'publicWalletLimit',
      },      
      {
        ...contractInfo,
        functionName: 'PUBLIC_SUPPLY', //unused currently
      },      
      {
        ...contractInfo,
        functionName: 'PROVENANCE_HASH', //unused currently
      },
      {
        ...contractInfo,
        functionName: 'isPresale',
      },
      {
        ...contractInfo,
        functionName: 'nextTokenId',
      },
      {
        ...contractInfo,
        functionName: 'PUBLIC_MINT_LIMIT',
      },
      {
        ...contractInfo,
        functionName: 'isRevealed', //unused currently
      },
    ],
    onSuccess(data) {
      //example response
      //max supply 0: BigNumber {_hex: '0x1388', _isBigNumber: true}
      //pub price 1: BigNumber {_hex: '0xf8b0a10e470000', _isBigNumber: true}
      //presale price  2: BigNumber {_hex: '0xf8b0a10e470000', _isBigNumber: true}
      //pub lim engaged 3: true
      //pub supply 4: BigNumber {_hex: '0x1324', _isBigNumber: true}
      //prov hash 5: ""
      //isPre 6: true
      //NexttokenID 7: BigNumber {_hex: '0x08', _isBigNumber: true}
      //pub wallet lim 8: BigNumber {_hex: '0x0b', _isBigNumber: true}
      //isrevealed 9: false

      // console.log(data);

      // if public sale
      if (data[6] === false) {
        setIsPresale(data[6])
        setTotalMintAmount(data[0]);
        setAmountMintedAlready(data[7]); 
        setPublicWalletLimit(data[3]);

        setTitleText('Public Mint'); 
        let price = ethers.utils.formatEther(data[1].toString())
        setTotalCostBoxValue(price); 
        setPricePerNFT(price); 

        setPresaleData(null); 
        setMaxMintForCurrentWallet(data[8]);

      } else if (data[6] === true) {
        setIsPresale(data[6]);
        setTotalMintAmount(data[0]);
        setAmountMintedAlready(data[7]); 
        setPublicWalletLimit(data[3]);

        setTitleText('Presale Mint');
        let price = ethers.utils.formatEther(data[2].toString())
        setTotalCostBoxValue(price); 
        setPricePerNFT(price); 

        if (address) { //fetch presale allocation API data for wallet
          fetchWhitelistData().then(_data => {
            setPresaleData(_data);
            setMaxMintForCurrentWallet(_data.data.allocation);
          }).catch(err => {
            setMaxMintForCurrentWallet(data[8]);
            console.log('Error fetching whitelist data, defaulting to public max ' + err.message);
          });
        } else {
          setMaxMintForCurrentWallet(data[8]);
        }
      }
    },
    onError(error) {
      console.log(error)
      setAllContractDataPresent(false);
      setMaxMintForCurrentWallet(null);
      setPricePerNFT(null);
      setAmountMintedAlready(null);
      setMaxMintForCurrentWallet(null);
      setIsPresale(null);
    }
  })


      //////////////////////////////
     // Contract Write Functions //
    //////////////////////////////
   //
  // Test Mint Function
  const { data: testMintData, 
          write: testMint } = useContractWrite({ 
    ...contractInfo, 
    functionName: 'mint', 
    onSuccess(data) {
      // console.log(data);
      setMintSuccess(true);
      setMintSuccessMessage(
        'Pending Transaction: https://ropsten.etherscan.io/tx/' 
        + data.hash + '\r\n\r\nWait here for success message.');
    },
    onError(error) {
      setMintError(true);
      afterMintUIChanges();
      if (error.message.includes('-32000')) {
        setMintErrorMessage('Error: Insufficient Funds');
      } else {
          setMintErrorMessage('Error minting tokens: ' + error.message);
      }
    }
  })
  // Public Sale Mint Func
  const { data: publicMintData, 
          write: publicPurchase  } = useContractWrite({ 
    ...contractInfo, 
    functionName: 'purchase',
    onSuccess(data) {
      // console.log(data);
      setMintSuccess(true); 
      setMintSuccessMessage('Pending Transaction: https://etherscan.io/tx/' 
                           + data.hash + '\r\n\r\nWait here for success message.');
    },
    onError(error) {
      setMintError(true);
      afterMintUIChanges();
      setMintErrorMessage('Error minting tokens: ' + error.message);
    }
  })
  // Presale Mint Func
  const { data: presaleMintData, 
          write: presalePurchase } = useContractWrite({ 
    ...contractInfo, 
    functionName: 'presalePurchase', 
    onSuccess(data) {
      setMintSuccess(true); 
      setMintSuccessMessage('Pending Transaction: https://etherscan.io/tx/' 
                           + data.hash + '\r\n\r\nWait here for success message.');
    },
    onError(error) {
      setMintError(true);
      afterMintUIChanges();
      setMintErrorMessage('Error minting tokens: ' + error.message);
    }
  })

  let _mintData = testMode  ? testMintData    ?? null
                : isPresale ? presaleMintData ?? null
                            : publicMintData  ?? null

   //  Wait for 1 confirmation  //
  // + get transaction receipt //
  const {   data    : mintData,
           isError  : mintIsError,
          isSuccess : mintIsSuccess,
            error   : mintErrorObj } = useWaitForTransaction({
    hash: _mintData?.hash,
  })

    //   Reset UI after Mint   //
   // + Close Loading Spinner //
  //   + Success/Error Popup //
  useEffect(() => {
    if (mintData) {
      if (mintIsSuccess) {
        setMintSuccess(true);
        afterMintUIChanges();
        setMintSuccessMessage(
              'NFT Minting Success:' +
              '\r\n\r\nhttps://etherscan.io/tx/' + mintData.transactionHash);
      }
      else if (mintIsError) {
        console.log(mintErrorObj)
        setMintError(true);
        afterMintUIChanges();
        setMintErrorMessage(
              'Error Minting: ' + mintErrorObj.toString() + 
              '\r\n\r\nhttps://etherscan.io/tx/' + mintData.transactionHash);
      }
    }
  }, [mintData, mintIsSuccess, mintIsError]);



  // Current Active Address
  const { address } = useAccount()
  
  // Check if we can Mint //
  const passGuardClauses = () => {
    //guard clauses to make sure we can mint successfully
    if (!address) { //!provider ||
      // console.log(provider)
      alert('Please connect to a wallet')
      return false
    }

    if (!allContractDataPresent) {
      setMintError(true);
      setMintErrorMessage('Please Wait for Contract Data to load');
      return false
    }

    if (mintAmount <= 0 || totalMintPrice <= 0 || !totalMintPrice || !mintAmount) {
      setMintError(true);
      setMintErrorMessage('Zero Mint Error: Please Reload the page and try again.');
      return false
    }

    if (isPresale !== true && isPresale !== false) {
      setMintError(true)
      setMintErrorMessage('Sale not live yet. Please try again later.')
      return false
    } 

    if (isPresale === true && testMode == false) {
      try {
        if (presaleData?.data.teir && presaleData?.data.hash && 
            presaleData?.data.signature && presaleData?.data.allocation) {
          if (mintAmount > presaleData.data.allocation) {
            setMintErrorMessage('Error: You can only mint up to ' + presaleData.data.allocation + ' tokens in the presale')
            setMintError(true)
            return false
          } else {
            return true
          }
        } else {
          setMintError(true)
          setMintErrorMessage('Presale Data Fetching Error.')
          return false
        }
      } catch (err) {
        setMintError(true)
        setMintErrorMessage('Presale Data Fetching Error.')
        return false
      }
    }
    return true
  }

  // Called on Mint Button click
  const mint = () => {
    setMintButtonDisabled(true);
    setMintButtonText("Minting"); 

    // Make sure we have all necessary/valid data to mint
    if (!passGuardClauses()) return afterMintUIChanges();

    // Bring up loading spinner
    setMintLoading(true);

     // Pass in amounnt to mint, total price 
    // & presale data into the Write function
    let _args = [mintAmount] 
    if (isPresale === true && !testMode) {
      _args.push(presaleData.data.teir,
                 presaleData.data.hash,
                 presaleData.data.signature)
    }
    const _overrides = { 
      from: address, 
      value: ethers.utils.parseEther( totalMintPrice.toString() )
    }

    // Call appropriate Mint function 
    if (testMode  === true ) {
      return    testMint     ({ args: _args, overrides: _overrides })}
    if (isPresale === false) { 
      return publicPurchase  ({ args: _args, overrides: _overrides })}
    if (isPresale === true ) {
      return presalePurchase ({ args: _args, overrides: _overrides })}
    
    // This should never print
    console.error('Unknown Minting Error.')
  }


  // UI Funcs //
  // Plus and Minus NFT amount buttons
  const incrementMintAmountNumberBox = (maxMint) => {
    //called onclick
    const num = mintAmount //parseInt(window.document.getElementById('mintAmountBox').innerHTML);
    if (num < maxMint) {
      setMintAmount(num + 1); 
      setTotalMintPrice(
        Math.round((num + 1) * pricePerNFT * 100) / 100);        
    }
  }
  const decrementMintAmountNumberBox = () => {
    //called onclick
    const num = mintAmount //parseInt(window.document.getElementById('mintAmountBox').innerHTML);
    if (num > 1) {
      setMintAmount(num - 1); 
      setTotalMintPrice(
        Math.round((num - 1) * pricePerNFT * 100) / 100);
    }
  }
  // Same as increment and decrement but callable
  const setTotalCostBoxValue = (price) => {
    if (window.document.getElementById('mintAmountBox') !== null) {
      const num = mintAmount //parseInt(window.document.getElementById('mintAmountBox').innerHTML);
      setTotalMintPrice(Math.round(num * price * 100) / 100);
    }
  }
  // UI: Enable Mint Button + Close Loading Spinner
  const afterMintUIChanges = () => {
    setMintButtonDisabled(false);
    setMintButtonText("Mint");
    setMintLoading(false);
  }
  // Reset UI Vars when a popup is closed
  const closeAlertPopup = () => {
    setMintError(false);
    setMintErrorMessage("");
    setMintSuccess(false);
    setMintSuccessMessage("");
  }


   // Check if all needed data is present to mint
  // Enable or disable the mint button based on this
  useEffect(() => { //TODO maybe useMemo
    if (isClosing) return setAllContractDataPresent(false);
    if (maxMintForCurrentWallet && 
        pricePerNFT && 
        amountMintedAlready && 
        isPresale !== null) {
      console.log('All contract data present')
      setAllContractDataPresent(true)
      setMintButtonDisabled(false)
    } else {
      console.log('All contract data NOT present')
      setMintButtonDisabled(true); 
      setAllContractDataPresent(false);
    }
  }, [maxMintForCurrentWallet, isPresale, pricePerNFT,
      amountMintedAlready, presaleData, publicWalletLimit, address]);

  return (
    <div>
      {/* conditionally rendered popups */}
      { mintLoading && <MintModalLoading /> } {/* loading spinner */}
      { mintError   && <div className={styles.alertPopup} id='alertBG'>
                         <a>{mintErrorMessage}<div id='closeAlertButton' 
                                                   onClick={closeAlertPopup}></div></a></div> }
      { mintSuccess && <div className={styles.alertPopup} id='alertBG'>
                         <a>{mintSuccessMessage}<div id='closeAlertButton'
                                                     onClick={closeAlertPopup}></div></a></div> }
      
      {/* Mint Modal popup */}
      <div id='mintModal' className={styles.mintModal}>
        <div className={styles.mintModalBody}>

          <div className={styles.mintModalHeader}>
            <h2>{titleText}</h2><button id='closeModalButton' 
                                        className={styles.mintModalCloseButton}
                                        onClick={() => {setIsClosing(true); 
                                                        props.setMintModalOpen(false);}}/>  
          </div>

          <div className={styles.mintModalHeader2}>
            <div className={styles.mintModalInputContainer}>
              <ConnectButtonCustomized style={styles.mintPopup_ConnectButton} /> 
            </div>

            <div className={styles.mintModalHeader}>
              <div className={styles.mintModalInputContainer2}>
                <div className={styles.mintModalSection_left}>
                  <h3>Max Mint
                    <div><h3 id='maxMint'>
                      {(isPresale === false && publicWalletLimit === false) ? '∞' 
                      : maxMintForCurrentWallet ? maxMintForCurrentWallet?.toString() 
                      : '...'}
                    </h3></div>
                  </h3>
                </div>
                <div className={styles.mintModalSection_right}>
                  <h3>Total Minted<div><h3>
                    {amountMintedAlready ? amountMintedAlready.toString() : '...'}/{totalMintAmount ? totalMintAmount.toString() : '...'}</h3>
                  </div></h3>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mintModalInputContainer3}>
            <p>Amount to Mint</p>
            <div className={styles.mintNumberBoxWithButtons}>
              <div id='minusButton' 
                   className={styles.minusSign}
                   onClick={() => decrementMintAmountNumberBox()}
              >-</div>

              {/* <input id='mintAmountBox' className={styles.inputNumber} 
                    value={mintAmount} type="number"/> */}
              
              <h3 id='mintAmountBox' className={styles.inputNumber}>{mintAmount ? mintAmount.toString() : '...'}</h3>

              <div id='plusButton' 
                   className={styles.plusSign}
                   onClick={() => {incrementMintAmountNumberBox(maxMintForCurrentWallet);}}
              >+</div>
            </div>
          </div>

          <div className={styles.mintModalInputContainer2}>
            <div className={styles.mintModalSection_left_2}> 
              <p>Total Cost</p>
              <p>Price Each</p>
            </div>
            <div className={styles.mintModalSection_right}> 
                <h3 className={styles.inputNumber2}>{totalMintPrice ? totalMintPrice.toString() + ' ETH' : '...'}</h3>
                <h3 className={styles.inputNumber2}>{pricePerNFT ? pricePerNFT.toString() + ' ETH' : '...'}</h3>
            </div>
          </div>

          <div className={styles.mintModalInputContainer}>
            <button id='mintButtonOnPopup' className={styles.mintModalButton} 
                    onClick={() => { mint()}} disabled={mintButtonDisabled}>{mintButtonText}</button>
          </div>
        </div>
      </div> 
    </div> 
  )
}

function NavBar() {
  return (
      <nav className={styles.navBarContainer}>

      <nav className={styles.navBarLeft}>
          <Image className={styles.navBarLogo} 
              src={'/headLogo.png'}
              height={'70%'}
              width={'70%'} />
      </nav>
      <nav className={styles.navBarRight}>
        <a className={styles.socialButton} href="https://twitter.com/menjisworld" target="_blank" rel="noopener noreferrer">
          <Image src={'/twitter.png'} width={50} height={50} />
        </a>
        <a className={styles.socialButton} href="https://ropsten.etherscan.io/address/0xb585da9872d092498f020a938d65091fd96abbaf" target="_blank" rel="noopener noreferrer">
          <Image src={'/etherscan.png'} width={50} height={50} />
        </a>
        <a className={styles.socialButton} href="https://discord.gg/pTRtRXeCSM" target="_blank" rel="noopener noreferrer">
          <Image src={'/discord.png'} width={50} height={50} />
        </a>
        <a className={styles.socialButton} href="https://opensea.io/collection/ethereum/0xe336e2503f2a6e3831468d0f16750efdf6a92951" target="_blank" rel="noopener noreferrer">
          <Image src={'/opensea.png'} width={50} height={50} />
        </a>
      </nav>
    </nav>
  )
}
function TeamSection() {
  return (
    <div className={styles.teamContainer}>
      <div className={styles.teamMember}>
        <div className={styles.teamMemberImage}>
          <Image  
                src={'/menjiTeamRound.png'} 
                width={500} 
                height={500} 
                layout={'responsive'}/>
        </div>
        <Image className={styles.teamMemberInfo}
                src={'/_menjiTeamInfo.png'} 
                width={500} 
                height={179}
                layout={'responsive'}/>      
      </div>
      <div className={styles.teamMember}>
        <div className={styles.teamMemberImage}>
          <Image   
              src={'/docTeamRound.png'}
              width={500} 
              height={500} 
              layout={'responsive'} />
        </div>
        <Image className={styles.teamMemberInfo}
                src={'/_docTeamInfo.png'} 
                width={500} 
                height={179}
                layout={'responsive'} />
      </div>   
      <div className={styles.teamMember}>
        <div className={styles.teamMemberImage}>
          <Image  
                src={'/stickyTeamRound.png'} 
                width={500} 
                height={500} 
                layout={'responsive'} />
        </div>
        <Image className={styles.teamMemberInfo}
                src={'/_stickyTeamInfo.png'} 
                width={500} 
                height={179}
                layout={'responsive'} />
      </div>         
      <div className={styles.teamMember}>
        <div className={styles.teamMemberImage}>
              <Image  
                  src={'/jayTeamRound.png'} 
                  width={500} 
                  height={500} 
                  layout={'responsive'} />
        </div>
        <Image className={styles.teamMemberInfo}
                src={'/_jayTeamInfo.png'} 
                width={500} 
                height={179}
                layout={'responsive'}/>
      </div>
    </div>
  )
}
function MintButton(props) {
  return (
    <div className={styles.mintButtonContainer}>
      <a className={styles.mintButton} 
        id='mintButton' 
        onClick={() => {
          props.setMintModalOpen(true);
        }}
      >Mint Now</a>
    </div>
  )
}
function MainImageStack() {
  return (<>
    <div className={styles.menjisWorldTitle}>
      <Image 
          src={'/menjisWorld.png'}	 
          width={558} 
          height={135}
          alt="Menji's World Main Title" 
          layout='responsive'
          objectFit="contain"
    /></div>
    <div className={styles.menjiOnWorld}>
      <Image 
          src={"/menjiOnWorld.png"} 
          width={3260} 
          height={1350}
          alt="Menji's World Main Art" 
          layout='responsive'
          objectFit="contain"
    /></div>
    <div className={styles.writeupTitle}>
      <Image 
          src={"/writeupTitle.png"} 
          width={1500} 
          height={251}
          alt="Menji's World Writeup" 
          layout='responsive'
          objectFit="contain"
    /></div>
    <div className={styles.writeup}>
      <Image 
          src={"/writeup.png"} 
          width={1500} 
          height={923}
          alt="Menji's World Writeup" 
          layout='responsive'
          objectFit="contain"
    /></div>
    <div className={styles.meetTheTeamTitle}>
      <Image 
          src={"/meetTheTeam.png"} 
          width={830} 
          height={60}
          alt="Menji's World Writeup" 
          layout='responsive'
          objectFit="contain"
    /></div>  
  </>)
}
function BottomGraphic() {
  return (
    <div className={styles.bottomGraphic}>
      <Image
          src={"/bottomGraphic.png"} 
          width={1366} 
          height={762}
          alt="Menji's World Bottom Graphic" 
          layout='responsive'
          objectFit="contain"
      />
    </div>
  )
}
function CopyrightFooter() {
  return (
    <div className={styles.copyright}>
      <a>© 2022 MENJi's WORLD. All rights reserved.</a>
      <div className={styles.copyright_subcontainer}>
        <a className={styles.pdfPopupLink}
          onClick={() => {
              window.open('https://pdfhost.io/v/2GZg4aAJM_Menjis_World_Collector_Agreement', '_blank');}}
        >Collectors Agreement</a>
      </div>
    </div>
  )
}
// make all images not fuck up on devices

// og image test
// new favicon pack test
// make amount minted show below mint button

export default function Home() {

  //Mint Modal Popup open close handling
  const [mintModalOpen, setMintModalOpen] = useState(false);
  useEffect(() => {
    if (mintModalOpen === true) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('mintModal')) {setMintModalOpen(false);}}
    }
  }, [mintModalOpen]);


  innerWidth = useWidth();
  innerHeight = useHeight();

  return (
    <div className={styles.container}>
      <CustomHead />

      { mintModalOpen && 
        <MintModal setMintModalOpen={setMintModalOpen}/> }

      <NavBar />
      <MintButton setMintModalOpen={setMintModalOpen} />

      <div className={styles.main}>
        <MainImageStack />
        <TeamSection />    
        <BottomGraphic />  
        <CopyrightFooter />  
      </div>
    </div>
  )
}

// bg color grey or black better?
// mint button color
// navbar sticky
// mint button sticky
// navbar thickness
// spacing inbetween each element