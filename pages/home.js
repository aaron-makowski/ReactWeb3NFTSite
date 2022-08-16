import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css' //Applies to roadmap elements too

import CustomHead from '../components/CustomHead'
import Image from 'next/image'
import Link from 'next/link'
// General Useful
import { Oval } from  'react-loader-spinner'
import { BrowserView, MobileView } from "react-device-detect";
import axios from 'axios'; //for whitelist API call

//Web3 sauces
import { ethers } from 'ethers'; //general web3
import { ConnectButton } from '@rainbow-me/rainbowkit'; //wallet popup
import {    useAccount   ,   useContractWrite, // read/write eth contracts
         useContractReads, useWaitForTransaction } from 'wagmi' 

let updateMintModal = false;
// TODO LIST

// Contract Details
const testMode = false;
const presaleTestMode = false;
const chainId = 1; //3 ropsten -- 1 eth main

const contractAddress = '0x3efde3541dec397387a559829d8e2f061763fe7f';
const abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_uri",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "_keyHash",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "_vrfCoordinator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_linkToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_linkFee",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "_payees",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_shares",
                "type": "uint256[]"
            },
            {
                "internalType": "address",
                "name": "proxyRegistryAddress",
                "type": "address"
            }
        ],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "ApprovalCallerNotOwnerNorApproved",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ApprovalQueryForNonexistentToken",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ApproveToCaller",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "BalanceQueryForZeroAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MintERC2309QuantityExceedsLimit",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MintToZeroAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MintZeroQuantity",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OwnerQueryForNonexistentToken",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OwnershipNotInitializedForExtraData",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TransferCallerNotOwnerNorApproved",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TransferFromIncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TransferToNonERC721ReceiverImplementer",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TransferToZeroAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "URIQueryForNonexistentToken",
        "type": "error"
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
                "indexed": true,
                "internalType": "uint256",
                "name": "fromTokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "toTokenId",
                "type": "uint256"
            },
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
            }
        ],
        "name": "ConsecutiveTransfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ERC20PaymentReleased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address payable",
                "name": "relayerAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "functionSignature",
                "type": "bytes"
            }
        ],
        "name": "MetaTransactionExecuted",
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
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "shares",
                "type": "uint256"
            }
        ],
        "name": "PayeeAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "PaymentReceived",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "PaymentReleased",
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
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "ERC712_VERSION",
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
        "name": "PRICE",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "functionSignature",
                "type": "bytes"
            },
            {
                "internalType": "bytes32",
                "name": "sigR",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "sigS",
                "type": "bytes32"
            },
            {
                "internalType": "uint8",
                "name": "sigV",
                "type": "uint8"
            }
        ],
        "name": "executeMetaTransaction",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "payable",
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
        "inputs": [],
        "name": "getChainId",
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
        "name": "getDomainSeperator",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getNonce",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_recipients",
                "type": "address[]"
            }
        ],
        "name": "gift",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "mintBalances",
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
        "name": "paused",
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
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "payee",
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
                "name": "_quantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_tier",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "_hash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "_signature",
                "type": "bytes"
            }
        ],
        "name": "presalePurchase",
        "outputs": [],
        "stateMutability": "payable",
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_quantity",
                "type": "uint256"
            }
        ],
        "name": "purchase",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "requestId",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "randomness",
                "type": "uint256"
            }
        ],
        "name": "rawFulfillRandomness",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "release",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "release",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "releaseReserve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "released",
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
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "released",
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
        "name": "renounceOwnership",
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
                "name": "_URI",
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
                "internalType": "bool",
                "name": "_state",
                "type": "bool"
            }
        ],
        "name": "setPaused",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "_state",
                "type": "bool"
            }
        ],
        "name": "setPresale",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint128",
                "name": "_price",
                "type": "uint128"
            }
        ],
        "name": "setPrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_provenance",
                "type": "string"
            }
        ],
        "name": "setProvenance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint128",
                "name": "_limit",
                "type": "uint128"
            }
        ],
        "name": "setPublicLimit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "setSigner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "setTokenOffset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "_state",
                "type": "bool"
            }
        ],
        "name": "setWalletLimit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "shares",
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
        "inputs": [],
        "name": "tokenOffset",
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
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "totalReleased",
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
        "name": "totalReleased",
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
        "name": "totalShares",
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
        "name": "totalSupply",
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
        "inputs": [],
        "name": "withdrawAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]

// const contractAddress = '0x5c729894a796dA01D8679fC0025559BA14bec779';
// const abi = [
//   {
//       "inputs": [
//           {
//               "internalType": "string",
//               "name": "_uri",
//               "type": "string"
//           },
//           {
//               "internalType": "bytes32",
//               "name": "_keyHash",
//               "type": "bytes32"
//           },
//           {
//               "internalType": "address",
//               "name": "_vrfCoordinator",
//               "type": "address"
//           },
//           {
//               "internalType": "address",
//               "name": "_linkToken",
//               "type": "address"
//           },
//           {
//               "internalType": "uint256",
//               "name": "_linkFee",
//               "type": "uint256"
//           },
//           {
//               "internalType": "address[]",
//               "name": "_payees",
//               "type": "address[]"
//           },
//           {
//               "internalType": "uint256[]",
//               "name": "_shares",
//               "type": "uint256[]"
//           },
//           {
//               "internalType": "address",
//               "name": "proxyRegistryAddress",
//               "type": "address"
//           }
//       ],
//       "stateMutability": "payable",
//       "type": "constructor"
//   },
//   {
//       "inputs": [],
//       "name": "ApprovalCallerNotOwnerNorApproved",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "ApprovalQueryForNonexistentToken",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "ApprovalToCurrentOwner",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "ApproveToCaller",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "BalanceQueryForZeroAddress",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "MintToZeroAddress",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "MintZeroQuantity",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "OwnerQueryForNonexistentToken",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "TransferCallerNotOwnerNorApproved",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "TransferFromIncorrectOwner",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "TransferToNonERC721ReceiverImplementer",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "TransferToZeroAddress",
//       "type": "error"
//   },
//   {
//       "inputs": [],
//       "name": "URIQueryForNonexistentToken",
//       "type": "error"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": true,
//               "internalType": "address",
//               "name": "owner",
//               "type": "address"
//           },
//           {
//               "indexed": true,
//               "internalType": "address",
//               "name": "approved",
//               "type": "address"
//           },
//           {
//               "indexed": true,
//               "internalType": "uint256",
//               "name": "tokenId",
//               "type": "uint256"
//           }
//       ],
//       "name": "Approval",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": true,
//               "internalType": "address",
//               "name": "owner",
//               "type": "address"
//           },
//           {
//               "indexed": true,
//               "internalType": "address",
//               "name": "operator",
//               "type": "address"
//           },
//           {
//               "indexed": false,
//               "internalType": "bool",
//               "name": "approved",
//               "type": "bool"
//           }
//       ],
//       "name": "ApprovalForAll",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": true,
//               "internalType": "contract IERC20",
//               "name": "token",
//               "type": "address"
//           },
//           {
//               "indexed": false,
//               "internalType": "address",
//               "name": "to",
//               "type": "address"
//           },
//           {
//               "indexed": false,
//               "internalType": "uint256",
//               "name": "amount",
//               "type": "uint256"
//           }
//       ],
//       "name": "ERC20PaymentReleased",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": false,
//               "internalType": "address",
//               "name": "userAddress",
//               "type": "address"
//           },
//           {
//               "indexed": false,
//               "internalType": "address payable",
//               "name": "relayerAddress",
//               "type": "address"
//           },
//           {
//               "indexed": false,
//               "internalType": "bytes",
//               "name": "functionSignature",
//               "type": "bytes"
//           }
//       ],
//       "name": "MetaTransactionExecuted",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": true,
//               "internalType": "address",
//               "name": "previousOwner",
//               "type": "address"
//           },
//           {
//               "indexed": true,
//               "internalType": "address",
//               "name": "newOwner",
//               "type": "address"
//           }
//       ],
//       "name": "OwnershipTransferred",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": false,
//               "internalType": "address",
//               "name": "account",
//               "type": "address"
//           }
//       ],
//       "name": "Paused",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": false,
//               "internalType": "address",
//               "name": "account",
//               "type": "address"
//           },
//           {
//               "indexed": false,
//               "internalType": "uint256",
//               "name": "shares",
//               "type": "uint256"
//           }
//       ],
//       "name": "PayeeAdded",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": false,
//               "internalType": "address",
//               "name": "from",
//               "type": "address"
//           },
//           {
//               "indexed": false,
//               "internalType": "uint256",
//               "name": "amount",
//               "type": "uint256"
//           }
//       ],
//       "name": "PaymentReceived",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": false,
//               "internalType": "address",
//               "name": "to",
//               "type": "address"
//           },
//           {
//               "indexed": false,
//               "internalType": "uint256",
//               "name": "amount",
//               "type": "uint256"
//           }
//       ],
//       "name": "PaymentReleased",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": true,
//               "internalType": "address",
//               "name": "from",
//               "type": "address"
//           },
//           {
//               "indexed": true,
//               "internalType": "address",
//               "name": "to",
//               "type": "address"
//           },
//           {
//               "indexed": true,
//               "internalType": "uint256",
//               "name": "tokenId",
//               "type": "uint256"
//           }
//       ],
//       "name": "Transfer",
//       "type": "event"
//   },
//   {
//       "anonymous": false,
//       "inputs": [
//           {
//               "indexed": false,
//               "internalType": "address",
//               "name": "account",
//               "type": "address"
//           }
//       ],
//       "name": "Unpaused",
//       "type": "event"
//   },
//   {
//       "inputs": [],
//       "name": "ERC712_VERSION",
//       "outputs": [
//           {
//               "internalType": "string",
//               "name": "",
//               "type": "string"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "MAX_SUPPLY",
//       "outputs": [
//           {
//               "internalType": "uint128",
//               "name": "",
//               "type": "uint128"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "PRESALE_PRICE",
//       "outputs": [
//           {
//               "internalType": "uint128",
//               "name": "",
//               "type": "uint128"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "PROVENANCE_HASH",
//       "outputs": [
//           {
//               "internalType": "string",
//               "name": "",
//               "type": "string"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "PUBLIC_MINT_LIMIT",
//       "outputs": [
//           {
//               "internalType": "uint128",
//               "name": "",
//               "type": "uint128"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "PUBLIC_PRICE",
//       "outputs": [
//           {
//               "internalType": "uint128",
//               "name": "",
//               "type": "uint128"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "PUBLIC_SUPPLY",
//       "outputs": [
//           {
//               "internalType": "uint128",
//               "name": "",
//               "type": "uint128"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "to",
//               "type": "address"
//           },
//           {
//               "internalType": "uint256",
//               "name": "tokenId",
//               "type": "uint256"
//           }
//       ],
//       "name": "approve",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "owner",
//               "type": "address"
//           }
//       ],
//       "name": "balanceOf",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "userAddress",
//               "type": "address"
//           },
//           {
//               "internalType": "bytes",
//               "name": "functionSignature",
//               "type": "bytes"
//           },
//           {
//               "internalType": "bytes32",
//               "name": "sigR",
//               "type": "bytes32"
//           },
//           {
//               "internalType": "bytes32",
//               "name": "sigS",
//               "type": "bytes32"
//           },
//           {
//               "internalType": "uint8",
//               "name": "sigV",
//               "type": "uint8"
//           }
//       ],
//       "name": "executeMetaTransaction",
//       "outputs": [
//           {
//               "internalType": "bytes",
//               "name": "",
//               "type": "bytes"
//           }
//       ],
//       "stateMutability": "payable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "uint256",
//               "name": "tokenId",
//               "type": "uint256"
//           }
//       ],
//       "name": "getApproved",
//       "outputs": [
//           {
//               "internalType": "address",
//               "name": "",
//               "type": "address"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "getChainId",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "getDomainSeperator",
//       "outputs": [
//           {
//               "internalType": "bytes32",
//               "name": "",
//               "type": "bytes32"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "user",
//               "type": "address"
//           }
//       ],
//       "name": "getNonce",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "nonce",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address[]",
//               "name": "_recipients",
//               "type": "address[]"
//           }
//       ],
//       "name": "gift",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "owner",
//               "type": "address"
//           },
//           {
//               "internalType": "address",
//               "name": "operator",
//               "type": "address"
//           }
//       ],
//       "name": "isApprovedForAll",
//       "outputs": [
//           {
//               "internalType": "bool",
//               "name": "",
//               "type": "bool"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "isPresale",
//       "outputs": [
//           {
//               "internalType": "bool",
//               "name": "",
//               "type": "bool"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "isRevealed",
//       "outputs": [
//           {
//               "internalType": "bool",
//               "name": "",
//               "type": "bool"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "",
//               "type": "address"
//           }
//       ],
//       "name": "mintBalances",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "name",
//       "outputs": [
//           {
//               "internalType": "string",
//               "name": "",
//               "type": "string"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "owner",
//       "outputs": [
//           {
//               "internalType": "address",
//               "name": "",
//               "type": "address"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "uint256",
//               "name": "tokenId",
//               "type": "uint256"
//           }
//       ],
//       "name": "ownerOf",
//       "outputs": [
//           {
//               "internalType": "address",
//               "name": "",
//               "type": "address"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "paused",
//       "outputs": [
//           {
//               "internalType": "bool",
//               "name": "",
//               "type": "bool"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "uint256",
//               "name": "index",
//               "type": "uint256"
//           }
//       ],
//       "name": "payee",
//       "outputs": [
//           {
//               "internalType": "address",
//               "name": "",
//               "type": "address"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "uint256",
//               "name": "_quantity",
//               "type": "uint256"
//           },
//           {
//               "internalType": "uint256",
//               "name": "_tier",
//               "type": "uint256"
//           },
//           {
//               "internalType": "bytes32",
//               "name": "_hash",
//               "type": "bytes32"
//           },
//           {
//               "internalType": "bytes",
//               "name": "_signature",
//               "type": "bytes"
//           }
//       ],
//       "name": "presalePurchase",
//       "outputs": [],
//       "stateMutability": "payable",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "publicWalletLimit",
//       "outputs": [
//           {
//               "internalType": "bool",
//               "name": "",
//               "type": "bool"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "uint256",
//               "name": "_quantity",
//               "type": "uint256"
//           }
//       ],
//       "name": "purchase",
//       "outputs": [],
//       "stateMutability": "payable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "bytes32",
//               "name": "requestId",
//               "type": "bytes32"
//           },
//           {
//               "internalType": "uint256",
//               "name": "randomness",
//               "type": "uint256"
//           }
//       ],
//       "name": "rawFulfillRandomness",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address payable",
//               "name": "account",
//               "type": "address"
//           }
//       ],
//       "name": "release",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "contract IERC20",
//               "name": "token",
//               "type": "address"
//           },
//           {
//               "internalType": "address",
//               "name": "account",
//               "type": "address"
//           }
//       ],
//       "name": "release",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "contract IERC20",
//               "name": "token",
//               "type": "address"
//           },
//           {
//               "internalType": "address",
//               "name": "account",
//               "type": "address"
//           }
//       ],
//       "name": "released",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "account",
//               "type": "address"
//           }
//       ],
//       "name": "released",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "renounceOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "from",
//               "type": "address"
//           },
//           {
//               "internalType": "address",
//               "name": "to",
//               "type": "address"
//           },
//           {
//               "internalType": "uint256",
//               "name": "tokenId",
//               "type": "uint256"
//           }
//       ],
//       "name": "safeTransferFrom",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "from",
//               "type": "address"
//           },
//           {
//               "internalType": "address",
//               "name": "to",
//               "type": "address"
//           },
//           {
//               "internalType": "uint256",
//               "name": "tokenId",
//               "type": "uint256"
//           },
//           {
//               "internalType": "bytes",
//               "name": "_data",
//               "type": "bytes"
//           }
//       ],
//       "name": "safeTransferFrom",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "operator",
//               "type": "address"
//           },
//           {
//               "internalType": "bool",
//               "name": "approved",
//               "type": "bool"
//           }
//       ],
//       "name": "setApprovalForAll",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "string",
//               "name": "_URI",
//               "type": "string"
//           }
//       ],
//       "name": "setBaseURI",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "bool",
//               "name": "_state",
//               "type": "bool"
//           }
//       ],
//       "name": "setPaused",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "bool",
//               "name": "_state",
//               "type": "bool"
//           }
//       ],
//       "name": "setPresale",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "string",
//               "name": "_provenance",
//               "type": "string"
//           }
//       ],
//       "name": "setProvenance",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "uint128",
//               "name": "_limit",
//               "type": "uint128"
//           }
//       ],
//       "name": "setPublicLimit",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "uint128",
//               "name": "_price",
//               "type": "uint128"
//           }
//       ],
//       "name": "setPublicPrice",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "bool",
//               "name": "_state",
//               "type": "bool"
//           }
//       ],
//       "name": "setReveal",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "_address",
//               "type": "address"
//           }
//       ],
//       "name": "setSigner",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "setTokenOffset",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "bool",
//               "name": "_state",
//               "type": "bool"
//           }
//       ],
//       "name": "setWalletLimit",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "account",
//               "type": "address"
//           }
//       ],
//       "name": "shares",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "bytes4",
//               "name": "interfaceId",
//               "type": "bytes4"
//           }
//       ],
//       "name": "supportsInterface",
//       "outputs": [
//           {
//               "internalType": "bool",
//               "name": "",
//               "type": "bool"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "symbol",
//       "outputs": [
//           {
//               "internalType": "string",
//               "name": "",
//               "type": "string"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "tokenOffset",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "uint256",
//               "name": "tokenId",
//               "type": "uint256"
//           }
//       ],
//       "name": "tokenURI",
//       "outputs": [
//           {
//               "internalType": "string",
//               "name": "",
//               "type": "string"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "contract IERC20",
//               "name": "token",
//               "type": "address"
//           }
//       ],
//       "name": "totalReleased",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "totalReleased",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "totalShares",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "totalSupply",
//       "outputs": [
//           {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//           }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "from",
//               "type": "address"
//           },
//           {
//               "internalType": "address",
//               "name": "to",
//               "type": "address"
//           },
//           {
//               "internalType": "uint256",
//               "name": "tokenId",
//               "type": "uint256"
//           }
//       ],
//       "name": "transferFrom",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [
//           {
//               "internalType": "address",
//               "name": "newOwner",
//               "type": "address"
//           }
//       ],
//       "name": "transferOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "inputs": [],
//       "name": "withdrawAll",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//   },
//   {
//       "stateMutability": "payable",
//       "type": "receive"
//   }
// ]

function testFetchWhitelistData() {
    let data = JSON.stringify({
        "wallet": "0x4e994e0ad30b2d0f1a946d1ecfab0182b5a6259c"
    });
  
    let config = {
      method: 'post',
      url: 'https://us-central1-menjisworld-allowlist.cloudfunctions.net/getAccount',
      headers: { 
          'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config).then((response) => {
        if (response?.status !== 403) {
            const _data = response?.data;
            console.log(_data)
        } else {
            console.log(response?.status)
        }
    }).catch((error) => {
        console.log(error.message)
    });
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
        color='white'
        secondaryColor='black'
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
  const [mintLink, setMintLink] = useState('')

  function fetchWhitelistData() {
    let data = JSON.stringify({
        "wallet": address.toLowerCase()
    });
  
    let config = {
      method: 'post',
      url: 'https://us-central1-menjisworld-allowlist.cloudfunctions.net/getAccount',
      headers: { 
          'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config).then((response) => {
        // check is response is 403
        if (response?.status !== 403) {
            // {
            //     "address": "0x4e994e0ad30b2d0f1a946d1ecfab0182b5a6259c",
            //     "signature": "0x4a24df03fac477e52ce0643dd6749a0cb162021319361e821610c32925e83f2e50c820b4a52a46c6eb5850677a9b76bfbed4efef21665d1dbbb24ea7a9ad4a2c1c",
            //     "tier": 1,
            //     "allocation": 7,
            //     "hash": "0x122408d9db2be925d982db4432dfb717069120a947d3e4ed0c8b3af153578b02"
            // }
            const _data = response?.data;
            console.log(_data)
            setMaxMintForCurrentWallet(_data?.tier)
            setPresaleData(_data)
        } else {
            setMintButtonDisabled(true)
            setMintButtonText("Not Whitelisted")
            setMaxMintForCurrentWallet(-1)
        }
    }).catch((error) => {
        console.log(error.message)
        setMaxMintForCurrentWallet(-1)
        alert('Error fetching whitelist data or this wallet is not whitelisted')
    });
  }

  // Needed to interact with contract
  const contractInfo = {
    addressOrName: contractAddress,
    contractInterface: abi,
    chainId: chainId,
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
        functionName: 'PRICE',//TODO CHANGE THIS TO PRICE FOR LIVE
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
        functionName: 'totalSupply',
      },
      {
        ...contractInfo,
        functionName: 'PUBLIC_MINT_LIMIT',
      }
    ],
    onSuccess(data) {
      //example response
      //max supply 0: BigNumber {_hex: '0x1388', _isBigNumber: true}
      //price 1: BigNumber {_hex: '0xf8b0a10e470000', _isBigNumber: true}
      //pub lim engaged 2: true
      //pub supply 3: BigNumber {_hex: '0x1324', _isBigNumber: true}
      //prov hash 4: ""
      //isPre 5: true
      //NexttokenID 6: BigNumber {_hex: '0x08', _isBigNumber: true}
      //pub wallet lim 7: BigNumber {_hex: '0x0b', _isBigNumber: true}
      //isrevealed 8: false

        //   const maxSupply = data[0]
        //   const price = data[1]
        //   const pubLimTrue = data[2]
        //   const pubSupply = data[3] //unused
        //   const provHash = data[4] //unused
        //   const presaleTrue = data[5]
        //   const totalMinted = data[6]
        //   const pubWalletMax = data[7]
        //   const reavealedTrue = data[8] //unused
      console.log(data)
      try {
        setIsPresale(data[5])
        setTotalMintAmount(data[0]);
        setAmountMintedAlready(data[6]); 
        setPublicWalletLimit(data[2]);

        let price = ethers.utils.formatEther(data[1].toString())
        setTotalCostBoxValue(price); 
        setPricePerNFT(price); 

        // if public sale
        if (data[5] === false) {//
            setTitleText('Public Mint'); 
            setPresaleData(null); 
            setMaxMintForCurrentWallet(data[7]);
        } else if (data[5] === true) {//
            setTitleText('Presale Mint');
            if (address) fetchWhitelistData()
        }
        updateMintModal = !updateMintModal;
      } catch (e) {
        console.log(e)
        setAllContractDataPresent(false);
        setMaxMintForCurrentWallet(null);
        setPricePerNFT(null);
        setAmountMintedAlready(null);
        setMaxMintForCurrentWallet(null);
        setIsPresale(null);
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
    functionName: 'presalePurchase', 
    onSuccess(data) {
      // console.log(data);
      setMintSuccess(true);
      setMintLink('https://ropsten.etherscan.io/tx/'+ data.hash)
      setMintSuccessMessage('Pending Transaction - Wait here for success message.');
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
      setMintLink('https://etherscan.io/tx/'+ data.hash)
      setMintSuccessMessage('Wait here for success message. Pending Transaction:');
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
  // Presale Mint Func
  const { data: presaleMintData, 
          write: presalePurchase } = useContractWrite({ 
    ...contractInfo, 
    functionName: 'presalePurchase', 
    onSuccess(data) {
      setMintSuccess(true); 
      setMintLink('https://etherscan.io/tx/'+ data.hash)
      setMintSuccessMessage('Wait here for success message. Pending Transaction:');
    },
    onError(error) {
      setMintError(true);
      afterMintUIChanges();
      if (error.message.includes('-32000')) {
        setMintErrorMessage('Error: Insufficient Funds');
      } else {
        setMintLink('https://etherscan.io/tx/'+ data.hash)
        setMintErrorMessage('Error minting tokens: ' + error.message);
      }
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
        setMintLink('https://etherscan.io/tx/'+ mintData.transactionHash)
        setMintSuccessMessage('NFT Minting Success:');
      }
      else if (mintIsError) {
        console.log(mintErrorObj)
        setMintError(true);
        afterMintUIChanges();
        setMintLink('https://etherscan.io/tx/'+ mintData.transactionHash)
        setMintErrorMessage('Error Minting NFT(s):');
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
            presaleData?.data.signature) {
          if (mintAmount > presaleData.tier) {
            setMintErrorMessage('Error: You can only mint up to ' + presaleData.tier + ' tokens in the presale')
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
    if ((isPresale === true && !testMode) || presaleTestMode) {
      _args.push(presaleData.teir,
                 presaleData.hash,
                 presaleData.signature)
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
    setMintLink('');
  }


   // Check if all needed data is present to mint
  // Enable or disable the mint button based on this
  useEffect(() => {
    if (isClosing) return setAllContractDataPresent(false);
    if (maxMintForCurrentWallet && 
        pricePerNFT && 
        amountMintedAlready && 
       (isPresale === true || isPresale === false)) {
      if (isPresale === true && presaleData?.teir && 
          presaleData?.hash  && presaleData?.signature) {
        setMintButtonDisabled(false)
        setAllContractDataPresent(true)
        console.log('All contract data present')
      } else if (isPresale === false) {
        setMintButtonDisabled(false)
        setAllContractDataPresent(true) 
        console.log('All contract data present')
      } else {
        console.log('All contract data NOT present')
        setMintButtonDisabled(true)
        setAllContractDataPresent(false)
      }
    } else {
        console.log('All contract data NOT present')
        setMintButtonDisabled(true)
        setAllContractDataPresent(false)
    }
  }, [maxMintForCurrentWallet, isPresale, pricePerNFT, updateMintModal,
      amountMintedAlready, presaleData, publicWalletLimit, address]);

  return (
    <div>
      {/* conditionally rendered popups */}
      { mintLoading && <MintModalLoading /> } {/* loading spinner */}
      { mintError   && <div className={styles.alertPopup} id='alertBG'>
                         <div>
                          {mintErrorMessage}
                           { !mintLink && mintLink != '' && <><br /><br /><a href={mintLink} target="_blank" rel="noopener noreferrer">
                              Click for Etherscan TX
                            </a> </>}
                            <span id='closeAlertButton' onClick={closeAlertPopup}></span>
                         </div>
                       </div> }
      { mintSuccess && <div className={styles.alertPopup} id='alertBG'>
                         <div>{mintSuccessMessage}
                            { mintLink && mintLink != '' && <><br /><Link href={mintLink} target="_blank" rel="noopener noreferrer">
                              Click for Etherscan TX
                            </Link> </>}
                            <div id='closeAlertButton'onClick={closeAlertPopup}></div>
                         </div> 
                       </div> }

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
                  <h3>{ maxMintForCurrentWallet 
                     && maxMintForCurrentWallet === -1 ? 'Not Whitelisted' : 'Max Mint'}
                    <div><h3 id='maxMint'>
                      {(isPresale === false && publicWalletLimit === false) ? '∞' 
                      : maxMintForCurrentWallet && maxMintForCurrentWallet > 0 ? maxMintForCurrentWallet?.toString() 
                      : maxMintForCurrentWallet && maxMintForCurrentWallet === -1 ? '0'
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
        <a href="https://twitter.com/menjisworld" target="_blank" rel="noopener noreferrer">
          <Image src={'/twitter.png'} width={50} height={50} />
        </a>
        <a href="https://etherscan.io/address/0x3efde3541dec397387a559829d8e2f061763fe7f" target="_blank" rel="noopener noreferrer">
          <Image src={'/etherscan.png'} width={50} height={50} />
        </a>
        <a href="https://discord.gg/pTRtRXeCSM" target="_blank" rel="noopener noreferrer">
          <Image src={'/discord.png'} width={50} height={50} />
        </a>
        <a href="https://opensea.io/collection/menjisworld" target="_blank" rel="noopener noreferrer">
          <Image src={'/opensea.png'} width={50} height={50} />
        </a>
      </nav>
    </nav>
  )
}
function TeamSection() {
  return (<>
    <div className={styles.meetTheTeamTitle}>
      <Image 
          src={"/meetTheTeam.png"} 
          width={830} 
          height={60}
          alt="Menji's World Writeup" 
          layout='responsive'
          objectFit="contain"
    /></div>

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
        <div className={styles.socialButtonTeamContainer}>
          <a className={styles.socialButtonTeam} href="https://twitter.com/m33nji" target="_blank" rel="noopener noreferrer">
            <Image src={'/twitter.png'} width={50} height={50} />
          </a> 
        </div>       
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
        <div className={styles.socialButtonTeamContainer}>
          <a className={styles.socialButtonTeam} href="https://twitter.com/DoctorEthereum" target="_blank" rel="noopener noreferrer">
            <Image src={'/twitter.png'} width={50} height={50} />
          </a>     
        </div>             
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
        <div className={styles.socialButtonTeamContainer}>
`        <a className={styles.socialButtonTeam} href="https://twitter.com/stickydoteth" target="_blank" rel="noopener noreferrer">
           <Image src={'/twitter.png'} width={50} height={50} />
         </a>
        </div>                  
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
        <div className={styles.socialButtonTeamContainer}>
          <a className={styles.socialButtonTeam} href="https://twitter.com/jayg_nft" target="_blank" rel="noopener noreferrer">
            <Image src={'/twitter.png'} width={50} height={50} />
          </a>
        </div>  
      </div>
    </div>
    </>)
}
function MintButton(props) {
  //"https://whitelist.menjisworld.com/"
  return (<>
    { testMode && <div className={styles.mintButtonContainer}>
      <a className={styles.mintButtonPre} 
        id='mintButton' 
        href="https://whitelist.menjisworld.com/"
        target="_blank"
        rel="noopener noreferrer"
        // onClick={() => { testFetchWhitelistData() }} //TODO PUSH THIS BEFORE LIVE AND TEST
      >Mint Aug 16/17th<br />Click to Check Whitelist</a>
    </div> }
    { !testMode && <div className={styles.mintButtonContainer}>
      <a className={styles.mintButton} 
        id='mintButton' 
        onClick={() => {
          props.setMintModalOpen(true);
        }}
      >Mint Now</a>
    </div>}
  </>)
}
function MainImage() {
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
          width={2360} 
          height={1350}
          alt="Menji's World Main Art" 
          layout='responsive'
          objectFit="contain"
    /></div>
    <div className={styles.masterImage}>
      <Image 
          src={'/masterImage.png'} 
          width={1500} 
          height={2484} 
          layout={'responsive'}
          alt="Menji's World Writeup" 
          />
    </div>
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

export default function Home() {

  //Mint Modal Popup open close handling
  const [mintModalOpen, setMintModalOpen] = useState(false);
  useEffect(() => {
    if (mintModalOpen === true) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('mintModal')) {setMintModalOpen(false);}}
    }
  }, [mintModalOpen]);

  return (
    <div className={styles.container}>
      <CustomHead />

      { mintModalOpen && 
        <MintModal setMintModalOpen={setMintModalOpen}/> }

      <NavBar />
      <MintButton setMintModalOpen={setMintModalOpen} />

      <div className={styles.main}>
        <MainImage />
        <TeamSection />    
        <BottomGraphic />  
      </div>
      <div className={styles.copyright}>
          <a>© 2022 MENJi's WORLD. All rights reserved.</a>
          <div className={styles.copyright_subcontainer}>
            <a className={styles.pdfPopupLink} target="_blank" rel="noopener noreferrer"
                  href="/Menjis_World_Collector_Agreement_Final.pdf">
            <div>Collectors Agreement</div></a>
          </div>
        </div>
    </div>
  )
}