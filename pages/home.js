import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css' //Applies to roadmap elements too

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

//Import Social Icons & Icon Component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab)

//PDF Viewer Popup
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// General Useful
import { Oval } from  'react-loader-spinner'
import { BrowserView, MobileView } from "react-device-detect";
import axios from 'axios'; //for whitelist API call

//Web3 sauces
import { ethers } from 'ethers'; //general web3
import { ConnectButton } from '@rainbow-me/rainbowkit'; //wallet popup
import {    useAccount   ,   useContractWrite, // read/write eth contracts
         useContractReads, useWaitForTransaction } from 'wagmi' 


// Possible Upgrades:
// - websocketprovider + watch dynamic eth data
//          https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-next-mint-nft/pages/index.tsx
// - 


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
function ConnectButtonNavBar() {
  return (<>
    <ConnectButtonCustomized style={styles.navBarItem_ConnectButton}/>
  </>)
}
function MintConnectButton() {
  return (<>
    <ConnectButtonCustomized style={styles.mintPopup_ConnectButton}/>
  </>)
}


//UI Components
function NavBar() {
  // innerWidth = useWidth();

  return (
    <nav className={styles.navBarContainer}>
      <nav className={styles.navBarLeft}>
            <Image src={"/logo.png"} 
                  width={1350} height={299} 
                  alt="Menji's World Logo" />
      </nav>

      {/* {innerWidth <= 815 &&  */}
        <nav className={styles.navBarRight}>
          {/* <DiscordIcon /> */}
          <ConnectButtonNavBar />
          {/* <TwitterIcon /> */}
        </nav>
      {/* } */}
      {/* {innerWidth > 815 && 
        <nav className={styles.navBarRight}>
          <DiscordIcon />
          <TwitterIcon />
          <ConnectButtonNavBar />
        </nav>
      } */}
    </nav>
  )
}

function DiscordIconSmall() {
  return (
    <a className={styles.socialButton_discord_2x} href="https://discord.gg/pTRtRXeCSM" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon="fa-brands fa-discord" size='xl'/>
    </a>
  )
}
function TwitterIconSmall() {
  return (
    <a className={styles.socialButton_twitter_2x} href="https://twitter.com/menjisworld" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon="fa-brands fa-twitter" size='xl' />
    </a>
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
             width={innerWidth} 
             height={innerHeight/2}
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
function AboutSection2() {
  return (
    <p className={styles.aboutContent_2}> 
      Menji's World
      <br/><br/>
        Menji is an American Digital artist and painter from California with a goal to build a world that lives beyond his physical and digital work.
        <br/><br/>
        Menji's world was created with a sole focus to create unique experiences, bend the limitations of fashion, and be an example that anyone can create a world that is unique to themselves and inclusive to those who care to explore it.
        <br/><br/>
        Welcome to Menji's World.
    </p>
  )
}
function SampleNFTimage() {
  return (
    <div className={styles.mainContent_2_left}>
      <Image src={"/sample_nft_sm.jpg"} 
             width={1054} height={854} 
             alt="Menji's World Sample Art"
            />
    </div>
  )
}

function MintPopupButton(props) {
  return (
    <a className={styles.mintButton} 
       id='mintButton' 
       onClick={() => {
        props.setMintModalOpen(true);
       }}
    >Mint</a>
  )
}
function Page2Button() {
  return (
    <Link href="/roadmap">
      <a className={styles.mintButton} 
         id='page2Button'
        >FAQ / Roadmap</a>
    </Link> 
  )
}

//TODO remove popup PDF and just open link in new tab to pdf?
function CopyRightFooter(props) {
  return (<>
    {/* link to meji's world colelctor agreement and copyright 2022 paintedlabs */}
    <div className={styles.copyright}>
      <a>© 2022 MENJi's WORLD. All rights reserved.</a>
      <div className={styles.copyright_subcontainer}>
        <DiscordIconSmall /> 
        <a className={styles.pdfPopupLink}
          onClick={() => {
            props.setCollectorsAgreementOpen(true);
          }}
        >Collectors Agreement</a>
        <TwitterIconSmall />
      </div>
    </div>
  </>)
}
function PDFViewer() {
  function onDocumentLoadSuccess({ numPages: nextNumPages }) { console.log('PDF Loaded') }

  return (
    <div className={styles.pdfBG} id='pdfBG'>
      <div className={styles.pdfHeader}>
        <a href='https://pdfhost.io/v/2GZg4aAJM_Menjis_World_Collector_Agreement' target='_blank'
        >Open Document</a>
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
      setMintErrorMessage('Error minting tokens: ' + error.message);
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

  let _mintData = testMode  ?  testMintData   ?? null
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

    if (mintAmount <= 0 || totalMintPrice <= 0) {
      setMintError(true);
      setMintErrorMessage('Zero Mint Error: Please Reload the page and try again.');
      return false
    }

    if (isPresale !== true && isPresale !== false) {
      setMintError(true)
      setMintErrorMessage('Sale not live yet. Please try again later.')
      return false
    } 

    if (isPresale === true) {
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
    const num = parseInt(window.document.getElementById('mintAmountBox').value);
    if (num < maxMint) {
      setMintAmount(num + 1); 
      setTotalMintPrice(
        Math.round((num + 1) * pricePerNFT * 100) / 100);        
    }
  }
  const decrementMintAmountNumberBox = () => {
    //called onclick
    const num = parseInt(window.document.getElementById('mintAmountBox').value);
    if (num > 1) {
      setMintAmount(num - 1); 
      setTotalMintPrice(
        Math.round((num - 1) * pricePerNFT * 100) / 100);
    }
  }
  // Same as increment and decrement but callable
  const setTotalCostBoxValue = (price) => {
    if (window.document.getElementById('mintAmountBox') !== null) {
      const num = parseInt(window.document.getElementById('mintAmountBox').value);
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
              <MintConnectButton /> {/* setIsClosing={setIsClosing} 
                                        setMintModalOpen={props.setMintModalOpen}*/}                  
            </div>

            <div className={styles.mintModalHeader}>
              <div className={styles.mintModalInputContainer2}>
                <div className={styles.mintModalSection_left}>
                  <h3>Your Max Mint
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

              <input id='mintAmountBox' className={styles.inputNumber} 
                    value={mintAmount} type="number" disabled />

              <div id='plusButton' 
                   className={styles.plusSign}
                   onClick={() => {incrementMintAmountNumberBox(maxMintForCurrentWallet);}}
              >+</div>
            </div>
          </div>

          <div className={styles.mintModalInputContainer2}>
            <div className={styles.mintModalSection_left_2}> 
              <p>Total Price</p>
              <p>Price Per NFT</p>
            </div>
            <div className={styles.mintModalSection_right}> 
              <input className={styles.inputNumber2} 
                     type="text" 
                     value={totalMintPrice ? totalMintPrice.toString() + ' ETH' 
                                           : '...'} disabled/>
              <input className={styles.inputNumber2} 
                     type="text" 
                     value={pricePerNFT ? pricePerNFT.toString() + ' ETH' 
                                        : '...'} disabled/>
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
function FAQSection() {
  const [faq1checked, setFaq1Checked] = useState(false);
  const [faq2checked, setFaq2Checked] = useState(false);
  const [faq3checked, setFaq3Checked] = useState(false);
  // const [faq4checked, setFaq4Checked] = useState(false);

  return (<div>
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
  </div>)
}
function RoadmapTextBoxStack() {
  return (<>
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
  </>)
}
function RoadmapPage(props) {
  innerWidth = useWidth();
  innerHeight = useHeight();

  return (<div>
    <NavBar />

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

    <RoadmapTextBoxStack />

    <div className={styles.roadmapButtons}>
      <button className={styles.mintButton2} id='mintButton2' 
              onClick={() => {props.setMintModalOpen(true);}}>
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

    <FAQSection />
    <CopyRightFooter setCollectorsAgreementOpen={props.setCollectorsAgreementOpen}/>  {/* + User Agreement */}

  </div>)
}
//roadmap.js needs these functions exported to be able to render
export { PDFViewer, MintModal, RoadmapPage };



export default function Home() {
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [collectorsAgreementOpen, setCollectorsAgreementOpen] = useState(false);
  
  //Mint Modal Popup
  const closeMintModal = () => {
    setMintModalOpen(false);
  }
  useEffect(() => {
    if (mintModalOpen === true) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('mintModal')) {closeMintModal();}}
      // window.document.getElementById('closeModalButton').addEventListener('click', closeMintModal);
    }
  }, [mintModalOpen]);


  //PDF Popup
  const closePDFModal = () => {
    setCollectorsAgreementOpen(false);
  }
  useEffect(() => {
    if (collectorsAgreementOpen === true) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('pdfBG')) {closePDFModal();}}
      window.document.getElementById('closePDFButton').addEventListener('click', closePDFModal);
    }
  }, [collectorsAgreementOpen]);


  return (
    <div className={styles.container}>
      <Head>
        <title>MENJi's World NFT Drop</title>
        <meta name="description" content="MENJi's NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/favicon.ico" />
      </Head>

      {/* Popups */}
      { collectorsAgreementOpen && <PDFViewer /> }
      { mintModalOpen && <MintModal setMintModalOpen={setMintModalOpen}/> }

      <NavBar />  {/* At top of both pages: Logo + Connect button + Social Buttons*/}
      <MainImage />
      <main> {/* Useful tag for SEO */}
        <AboutMenjiSection />
        <div className={styles.mainContent_2}>
          <SampleNFTimage />
          <div className={styles.mainContent_2_right}>
            <MintPopupButton setMintModalOpen={setMintModalOpen}/>
            <AboutSection2 />
            <Page2Button />      
          </div>
        </div>
      </main>
      <TEAMSection />
      <CopyRightFooter setCollectorsAgreementOpen={setCollectorsAgreementOpen}/>  {/* + User Agreement */}
    </div>
  )
}