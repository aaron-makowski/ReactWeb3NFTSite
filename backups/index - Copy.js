import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

import Web3 from 'web3'
// import random from 'lodash/random';

// import { NFTStorage, File } from 'nft.storage';

// const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc4NUY3RGE3MzlBMDg5MURhMzNiYTYyZWRBNDQxQTY1NzI3MjJGRDYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODY3NjQ1OTY5NywibmFtZSI6IkNhcmlub0Jsb2NrcyJ9.SHm7_sSVY3UAaTEjyIDjrlDfRuEQSCwsbLEQiqJF3Tk'
// const client = new NFTStorage({ token: apiKey })


// import { lazy, Suspense } from 'react'
// const ModelComponent = lazy(() => import("/world.gltf"));

// import { Canvas } from "react-three-fiber";
// import { useGLTF } from '@react-three/drei/useGLTF'
// const { nodes, materials } = useGLTF('/world.glb')
//import Model from '/World.js'

// x,y
// 1:     0,0, 350,290
// 2:   344,0, 740,460
// 3:   740,0, 1080,150
// 4: 189,300, 350,460
// 5:   0,300, 189,460
// 6: 740,150, 080,1010
// 7:   0,470, 360,810
// 8: 357,471, 740,1010
// 9:  0, 810, 360,1010
// 10: 0,1010, 1080, 1350


// Width percentages X axis %
// 0 350 740 1080 - 33% 36% 32%
// 0 189 350 740 1080 - 18% 15% 36% 32%
// 0 360 740 1080 - 33% 35% 32%
// 0 360 740 1080 - 33% 35% 32%
// 0 1080 - 100%

// Height percentages Y axis %
// 0    0     0    - 22% 35% 12%
// 295  472   154  - 12% 40% 64%
// 460  1010  1010 - 26% 25% 25%
// 810  1350  1350 - 15%
// 1010            - 25%
// 1350 


// import * as THREE from "three";
// import { useLoader, Canvas, useFrame } from '@react-three/fiber';
// var loader = new THREE.GLTFLoader(); 
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// const gltf = useLoader(GLTFLoader, '/world.gltf');

// import '@google/model-viewer';


// import { OBJModel } from 'react-3d-viewer'

    

// let nftName;
// let ipfsHash;
// let metadata;
// let attributes;
let provider;
let address = '0x1458aa58f442ee1493344b4084c5538aaf6827a0';
let abi = 
  [
    {"inputs":[{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"string","name":"_tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"_projectId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_invocations","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_pricePerTokenInWei","type":"uint256"},{"internalType":"bool","name":"_dynamic","type":"bool"}],"name":"addProject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_script","type":"string"}],"name":"addProjectScript","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"addWhitelisted","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"artblocksAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"artblocksPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"clearTokenIpfsImageUri","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getRoyaltyData","outputs":[{"internalType":"address","name":"artistAddress","type":"address"},{"internalType":"address","name":"additionalPayee","type":"address"},{"internalType":"uint256","name":"additionalPayeePercentage","type":"uint256"},{"internalType":"uint256","name":"royaltyFeeByID","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"hashToTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nextProjectId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"string","name":"_ipfsHash","type":"string"}],"name":"overrideTokenDynamicImageWithIpfsLink","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"projectDetails","outputs":[{"internalType":"string","name":"projectName","type":"string"},{"internalType":"string","name":"artist","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"website","type":"string"},{"internalType":"string","name":"license","type":"string"},{"internalType":"bool","name":"dynamic","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"projectScriptByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"projectScriptInfo","outputs":[{"internalType":"string","name":"scriptJSON","type":"string"},{"internalType":"uint256","name":"scriptCount","type":"uint256"},{"internalType":"uint256","name":"hashes","type":"uint256"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"bool","name":"locked","type":"bool"},{"internalType":"bool","name":"paused","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"projectShowAllTokens","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"projectTokenInfo","outputs":[{"internalType":"address","name":"artistAddress","type":"address"},{"internalType":"uint256","name":"pricePerTokenInWei","type":"uint256"},{"internalType":"uint256","name":"invocations","type":"uint256"},{"internalType":"uint256","name":"maxInvocations","type":"uint256"},{"internalType":"bool","name":"active","type":"bool"},{"internalType":"address","name":"additionalPayee","type":"address"},{"internalType":"uint256","name":"additionalPayeePercentage","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"projectURIInfo","outputs":[{"internalType":"string","name":"projectBaseURI","type":"string"},{"internalType":"string","name":"projectBaseIpfsURI","type":"string"},{"internalType":"bool","name":"useIpfs","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_ipfsHash","type":"string"}],"name":"purchase","outputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_ipfsHash","type":"string"}],"name":"purchaseTo","outputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"removeProjectLastScript","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"removeWhitelisted","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"showTokenHashes","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"staticIpfsImageLink","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"toggleProjectIsActive","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"toggleProjectIsDynamic","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"toggleProjectIsPaused","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"}],"name":"toggleProjectUseIpfsForStatic","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenIdToProjectId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_artblocksAddress","type":"address"}],"name":"updateArtblocksAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_artblocksPercentage","type":"uint256"}],"name":"updateArtblocksPercentage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"address payable","name":"_additionalPayee","type":"address"},{"internalType":"uint256","name":"_additionalPayeePercentage","type":"uint256"}],"name":"updateProjectAdditionalPayeeInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"address payable","name":"_artistAddress","type":"address"}],"name":"updateProjectArtistAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_projectArtistName","type":"string"}],"name":"updateProjectArtistName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_projectBaseIpfsURI","type":"string"}],"name":"updateProjectBaseIpfsURI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"updateProjectBaseURI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_projectDescription","type":"string"}],"name":"updateProjectDescription","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_hashes","type":"uint256"}],"name":"updateProjectHashesGenerated","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_ipfsHash","type":"string"}],"name":"updateProjectIpfsHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_projectLicense","type":"string"}],"name":"updateProjectLicense","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_maxInvocations","type":"uint256"}],"name":"updateProjectMaxInvocations","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_projectName","type":"string"}],"name":"updateProjectName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_pricePerTokenInWei","type":"uint256"}],"name":"updateProjectPricePerTokenInWei","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_scriptId","type":"uint256"},{"internalType":"string","name":"_script","type":"string"}],"name":"updateProjectScript","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_projectScriptJSON","type":"string"}],"name":"updateProjectScriptJSON","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"uint256","name":"_secondMarketRoyalty","type":"uint256"}],"name":"updateProjectSecondaryMarketRoyaltyPercentage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_projectId","type":"uint256"},{"internalType":"string","name":"_projectWebsite","type":"string"}],"name":"updateProjectWebsite","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}
];

async function mintNFT() {
  // nftName = "Test-" + random(500).toString();
  // metadata = {}
  // metadata["description"] = "Menji NFT Test Minting collection";
  // let testAttributes = [ //demo traits
  //   {"trait_type": "color", "value": "red"},
  //   {"trait_type": "size", "value": "small"},
  //   {"trait_type": "shape", "value": "square"},
  //   {"trait_type": "material", "value": "wood"}
  // ];
  // for (let i = 0; i < testAttributes.length; i++) {
  //   addAttribute(testAttributes[i]["trait_type"], 
  //                testAttributes[i]["value"]);
  // }
  // metadata["properties"]["attributes"] = attributes;
}
let mintNFT_ = async() => { //after drawing this is called
  // document.getElementById('mintNFTButton').textContent = "Minting...";
  // document.getElementById('mintNFTButton').disabled = true;
  // window._minting = false;
  // //after drawing and getting the IPFS URL, mint it on eth
  // if (typeof window.contract !== 'undefined') { 
  //   // _createAndDisplayPopup("Minting in progress, do not leave the page.");
  //   await _loadAndWait();

  //   // TODO GGET IPFS HASH FROM BACKEND
  //   let img_500_ipfsHash = await drawAndIPFSonBackend();

  //   if (typeof img_500_ipfsHash !== 'undefined'){
  //       let img_500 = img_500_ipfsHash[0];
  //       let _ipfsHash = img_500_ipfsHash[1];
        
  //       //Try purchase
  //       console.log('Purchase Phase');
  //       await window.contract.methods.purchase(3, _ipfsHash).send({
  //           from: provider.selectedAddress,
  //           value: window.web3.utils.toWei("0.0001", "ether") // TODO CHANGE TO ACTUAL PRICE
  //       }
  //       ).then(async (res) => {
  //           console.log('Purchase Function Result', res);

  //           if (typeof res.events.Mint.returnValues._tokenId !== 'undefined') {             
  //               //display image on mint site after all success
  //               document.getElementById('nftIMG').src = img_500;
               
  //               //re enable button
  //               document.getElementById('mintNFTButton').textContent = "Mint NFT";
  //               document.getElementById('mintNFTButton').disabled = false;
  //               window._minting = false;

  //               // Alert user on result
  //               console.log('Your Art is Ready, View Minted NFT @\n' + "https://testnets.opensea.io/assets/" + address +"/"+ res.events.Mint.returnValues._tokenId);            
  //               alert('Your Art is Ready, View Minted NFT @\n' + "https://testnets.opensea.io/assets/" + address +"/"+ res.events.Mint.returnValues._tokenId);            

  //           } else {
  //               console.log('Error Purchasing NFT or User Rejected Transaction, Please Reload:\n', res);
  //               alert("Error Purchasing NFT or User Rejected Transaction, Please Reload");
  //           }
  //       });
  //   } else {
  //       console.log('Error getting IPFS Hash and img from backend');
  //   }
  // } else {
  //     console.log('Error minting NFT, contract undefined');
  // }
}



function addAttribute(trait_type, value) {
  attributes.push({
    "trait_type": trait_type,
    "value": value
  });
}

async function returnIPFSHash() {
    await storeJSONonIPFS(
        "MENJi: " + nftName,
        metadata["description"],
        "menji_test_id_" + random(10000) + '_' + Date.now().toString(),
        metadata["properties"]["attributes"]
    );
    if (typeof ipfsHash !== 'undefined') {
        return ipfsHash;
    } else return 0;
}

async function storeJSONonIPFS(_nftName, _nftDescription, 
                               _nftImageFileName) {
  await client.store({
      name: _nftName,
      description: _nftDescription,
      image: new File(
        [canvasAsVar()],
        _nftImageFileName + '.png', { type: 'image/png' } ),
      attributes: attributes
  }).then(tmp_metadata => {
      console.log('IPFS URL for the metadata:', _metadata.url)
      ipfsHash = tmp_metadata.url.toString().substr(7, tmp_metadata.url.toString().length - 1)
      console.log('IPFS IMAGE URI:', 'https://cloudflare-ipfs.com/ipfs/' +
          tmp_metadata.data.image.href.substr(7, tmp_metadata.data.image.href.length - 1)
      );
      console.log(
          'metadata.json contents with IPFS gateway URLs:\n',
          _metadata.embed()
      );
      metadata = tmp_metadata;
  });
}



let editConnectButton = () => {
  try {
    if (typeof provider !== 'undefined') {
      console.log('Chosen Address', provider.selectedAddress)
      if (typeof provider.selectedAddress !== 'undefined') {
        document.getElementById('connectButton').innerText = provider.selectedAddress;
        // document.getElementById('connectButton').innerText = provider.selectedAddress.substr(0, 5) + '.....' + 
        //                                                      provider.selectedAddress.substr(provider.selectedAddress.length - 5, 5);
      } else { 
        document.getElementById('connectButton').innerText = "Connect Wallet"; 
      } 
    }
  } catch (err) {
    console.log('Error getting Provider + Account + setting connect button text', err);
  }
}
//loadAndWait
let _loadAndWait = async() => {
  let counter = 0;
  while (true) {
    counter = counter + 1;
    if (typeof provider !== 'undefined' && 
        typeof window.contract !== 'undefined' &&
        typeof window.nextMintID !== 'undefined') {
      break;
    } else if (counter > 5) {
      alert('Error Connecting to the Ethereum Contract.\nPlease reload the page');
      break;
    } else {
      setTimeout(() => {  console.log("Web3 Contract and NextMintID didnt return, sleep 3"); }, 3000);
    }

    if (typeof provider === 'undefined') {
      connectWallet();
      setWindowDotContract();
      await getNextMintIDAndSetText();
    } else if (typeof window.contract === 'undefined') {
      setWindowDotContract();
      await getNextMintIDAndSetText();
    } else if (typeof window.nextMintID === 'undefined') {
      await getNextMintIDAndSetText();
    } 
  }
}
let connectWallet = async() => {
  if (typeof window === 'undefined') return;  
  try {
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      alert('Connect to Metamask or use your Wallet App Browser to connect to this site');
    }

    web3 = new Web3(provider);
    if (typeof window.web3 === 'undefined') {
      window.web3 = web3;
    } //console.log(window.web3);
    // set up callbacks when web3 details change
    if (typeof provider !== 'undefined') {
      await provider.enable().then(async () => {
        //await provider.send('eth_requestAccounts');
        // User has allowed account access to DApp...
        editConnectButton();
        // setAmountMintedText(); 
        // setWindowDotContract();
        // await getNextMintIDAndSetText();
      });
      //Sub to change events
      // provider.on("accountsChanged", (accounts) => {
      //   console.log('accountsChanged', accounts);
      //   account = accounts[0];
      //   console.log('new account', account);
      //   editConnectButton();
      // });
      // provider.on("chainChanged", (chainId) => {
      //   console.log('Chain changed to', chainId);
      //   if (chainId != 1) {
      //     alert('Please Connect to the Ethereum Mainnet Network'); }
      //   editConnectButton(); 
      // });
      // provider.on("networkChanged", (networkId) => {
      //   console.log('networkChanged, ID:', networkId);
      //   if (networkId != 1) {
      //     alert('Please Connect to the Ethereum Mainnet Network'); }
      //   editConnectButton();
      // });
    } else {
      console.log('Could not connect to Web3 Wallet');
    }
  } catch (e) { // User has denied account access to DApp...
      console.log('Error Connecting to Wallet:\n', e);
  }
} 
//prove we can read contract bfore trying to purchase
let getNextMintIDAndSetText = async() => {
  try {
    setAmountMintedText();
    if (typeof window.contract !== 'undefined') {
      await window.contract.methods.projectTokenInfo(3).call().then(async (res) => {
        window.nextMintID = parseInt(res['invocations']) + 1;
        //console.log('projectTokenDetails()', res);
      });
    }
    setAmountMintedText();

  } catch (err) {
    console.log('Error getting next mint ID', err);
  }
}
let setWindowDotContract = () => {
  try {
    window.contract = new window.web3.eth.Contract(abi, address);
    console.log('Contract:', window.contract);
  } catch (e) {
    console.log('Error setting contract:', e);
  }
}


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>MENJi NFT Drop</title>
        <meta name="description" content="MENJi NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* navbar */}
      <div className={styles.navBarItemLogo}>
        <Image src={"/logo.png"} width={210} height={130} alt="Menji's Spinning World" />
        {/* display /world.obj (a 3d file) */}
        <Model/>
      </div>

      <nav className={styles.navBar}>
          <button className={styles.navBarItem_ConnectButton} id='connectButton'
                  onClick={connectWallet}       >Connect Wallet</button>
          {/* <Link href="#about" passHref>
            <button className={styles.navBarItem}>About</button>
          </Link>
          <Link href="#team" passHref>
            <button className={styles.navBarItem}>Team</button>            
          </Link>
          <Link href="#contact" passHref>
            <button className={styles.navBarItem}>Socials</button>            
          </Link> */}
      </nav>


      {/* main */}
      <main className={styles.main}>
      {/* <OBJModel src="/world.obj" texPath=""/> */}
        {/* <Canvas style={{ background: "#171717" }}>
        <World />
        </Canvas> */}
          {/* Mint section */}
          <div className={styles.mainContent}>
            <Image src={'/sample_nft.png'} width={350} height={350} id='nftIMG' />
            <div className={styles.mintButtonContainer}>
              <button className={styles.mintButton} id='mintNFTButton'
                      onClick={mintNFT}>Mint</button>
            </div>
          </div>  
          <br/><br/><br/><br/>

          {/*ABOUT MENJI  */}
            <Image src={'/about_menji_text.png'} id="about" width={568} height={136} />
          <div className={styles.aboutContent}>
            <p className={styles.description}>
            The Creator of Menji's World
            <br/><br/>
            Menji is an American Digital artist and painter from California with a goal to build a world that lives beyond his physical and digital work. Menji's world was created with a sole focus to create unique experiences, bend the limitations of fashion, and be an example that anyone can create a world that is unique to themselves and inclusive to those who care to explore it.
            <br/><br/>
            Welcome to Menji's World.
            </p>
          </div>
          <br/><br/><br/><br/>

          {/* TEAM SECTION */}
          <div className={styles.title} id="team">
            <Image src={'/team_text.png'} width={277} height={153} />
          </div>
          <div className={styles.teamContainer}>
              <div className={styles.teamMember}>
                <Image src={'/team1.png'} width={200} height={200} />
                <p>Jerald MVP</p>
              </div>
              <div className={styles.teamMember}>
                <Image src={'/team2.png'} width={200} height={200} />
                <p>NFT Captain</p>
              </div>
              <div className={styles.teamMember}>
                <Image src={'/team3.png'} width={200} height={200} />
                <p>David DDS</p>
              </div>
              <div className={styles.teamMember}>
                <Image src={'/team4.png'} width={200} height={200} />
                <p>Sarah PhD</p>
              </div>
          </div>

          {/* <a href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
             className={styles.card}>
            <h2>Deploy &rarr;</h2>
          </a> */}
      


      {/* Footer Social Links */}
      <footer className={styles.footer} id="contact">
        <a href="discord.gg/7QYXxXq"
           target="_blank"
           rel="noopener noreferrer">
          <span className={styles.logo}>
            <Image src={'/discord2.svg'} alt="Discord Logo" width={50} height={50} /></span>
        </a>
        <a href="telegram.me/menji_nft"
           target="_blank"
           rel="noopener noreferrer">
          <span className={styles.logo}>
            <Image src={'/telegram2.svg'} alt="Telegram Logo" width={50} height={50} /></span>
        </a>
        <a href="twitter.com/menji_nft"
           target="_blank"
           rel="noopener noreferrer">
          <span className={styles.logo}>
            <Image src={'/twitter.svg'} alt="Twitter Logo" width={50} height={50} /></span>
        </a>
      </footer></main>
    </div>
  )
}
