import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Web3 from 'web3'
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

//social icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { BrowserView, MobileView } from "react-device-detect";

// TODO put Menji solidity contract address and ABI here to be able to call its functions
let address = '';
let abi = [

];
let innerWidth = 700;


const useWidth = () => {
  const [innerWidth, setWidth] = useState(0); // default width, detect on server.
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    editConnectButton();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  return innerWidth;
}

let editConnectButton = () => {
  try {
    if (typeof window.provider !== 'undefined') {
      console.log('Chosen Address', window.provider.selectedAddress)
      if (typeof window.provider.selectedAddress !== 'undefined') {
        // document.getElementById('connectButton').innerText = window.provider.selectedAddress;
        document.getElementById('connectButton').innerText = window.provider.selectedAddress.substr(0, 5) + '....' + window.provider.selectedAddress.substr(window.provider.selectedAddress.length - 5, 5);
      } else { 
        document.getElementById('connectButton').innerText = "Connect"; 
      } 
    }
  } catch (err) {
    console.log('Error getting Provider + Account + setting connect button text', err);
  }
}
let connectWallet = async() => {
  if (typeof window === 'undefined') return;  

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      display: { name: 'Trust Wallet/MetaMask/Mobile' },
      options: {
          infuraId: "d31a6fe248ed4db3abac78f5b72ace93" //a6ca7a0157184aedbafef89ee4794dc2
      }
    },
    fortmatic: {
        package: Fortmatic,
        options: {
            key: "pk_live_8DFF4684EB75C648"
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
  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false,
  });
  
  try {
    try {
      window.provider = await web3Modal.connect();
    } catch (err) {
      console.log('Modal web3 fail', err);

      if (window.ethereum) { 
        window.provider = window.ethereum;
      } else if (window.web3) {
        window.provider = window.web3.currentProvider;
      } else {
        alert('Connect to Wallet or use your Wallet App Browser to connect to this site');
      }

      let web3 = new Web3(window.provider);
      if (typeof window.web3 === 'undefined') window.web3 = web3;
      if (typeof window.provider !== 'undefined') {
        await window.provider.enable().then(async () => { editConnectButton(); });
        //Sub to change events
        window.provider.on("accountsChanged", (accounts) => {
          console.log('Newly Selected Account: ', accounts[0]);
          editConnectButton();
        });
        window.provider.on("chainChanged", (chainId) => {
          console.log('Chain changed to', chainId);
          if (chainId != 1) {
            alert('Please Connect to the Ethereum Mainnet Network'); 
          }
          editConnectButton(); 
        });
        // Subscribe to provider connection
        window.provider.on("connect", (info) => {
          console.log('Connected to Wallet:', info);
          if (info.chainId != 1) {
            alert('Please Connect to the Ethereum Mainnet Network'); 
          }
          editConnectButton();
        });

      } else {
        console.log('Could not connect to Web3 Wallet');
      }
    }
  } catch (e) { // User has denied account access to DApp...
      console.log('Error Connecting to Wallet:\n', e);
  }
}
let connectToContract = async() => {
  let counter = 0;
  while (true) {

    counter = counter + 1;
    if (typeof window.provider !== 'undefined' && 
        typeof window.contract !== 'undefined') {
      break;
    } 
    else if (counter > 5) {
      alert('Error Connecting to the Ethereum Contract.\nPlease reload the page');
      break;
    } 
    else {
      setTimeout(() => {
        console.log("Web3 Contract didn't connect, retry in 3s"); 
      }, 3000);
    }

    //connect wallet if not connected
    if (typeof window.provider === 'undefined') {
      connectWallet();
    }
    //connect to contract if not connected
    if (typeof window.contract === 'undefined') {
      try {
        window.contract = new window.web3.eth.Contract(abi, address);
        console.log('Contract:', window.contract);
      } catch (e) {
        console.log('Error setting contract:', e);
      }
    }
  }
}

// TODO add proper mint function call here
let mintNFT = async() => { 
  connectToContract();

  document.getElementById('mintButton').textContent = "Minting...";
  document.getElementById('mintButton').disabled = true;
  if (typeof window.provider !== 'undefined' &&
      typeof window.contract !== 'undefined') { 
    await window.contract.methods.mint(1).send({
        from: provider.selectedAddress,
        value: window.web3.utils.toWei("0.1", "ether") // TODO CHANGE TO ACTUAL PRICE
    }).then(async (res) => {
        console.log('Purchase Function Result', res);
        if (typeof res.events.Mint.returnValues._tokenId !== 'undefined') {             
            //re enable button
            document.getElementById('mintButton').textContent = "Mint Now";
            document.getElementById('mintButton').disabled = false;

            // Alert user on result
            console.log('Your Art is Ready, View Minted NFT @\n' + "https://testnets.opensea.io/assets/" + address +"/"+ res.events.Mint.returnValues._tokenId);            
            alert('Your Art is Ready, View Minted NFT @\n' + "https://testnets.opensea.io/assets/" + address +"/"+ res.events.Mint.returnValues._tokenId);            
        } else {
            console.log('Error Purchasing NFT or User Rejected Transaction, Please Reload:\n', res);
            alert("Error Purchasing NFT or User Rejected Transaction, Please Reload");
        }
    });
  } else {
      console.log('Error minting NFT, contract undefined');
  }
}
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
          <a className={styles.socialButton_discord} href="discord.gg/7QYXxXq" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon="fa-brands fa-discord" size='3x'/>
          </a>
          <button className={styles.navBarItem_ConnectButton} id='connectButton'
            onClick={connectWallet}>Connect
          </button>
          <a className={styles.socialButton_twitter} href="twitter.com/menji_nft" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon="fa-brands fa-twitter" size='3x' />
          </a>
        </nav>
      }
      {innerWidth > 815 && 
        <nav className={styles.navBarRight}>
          <a className={styles.socialButton_discord} href="discord.gg/7QYXxXq" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon="fa-brands fa-discord" size='3x'/>
          </a>
          <a className={styles.socialButton_twitter} href="twitter.com/menji_nft" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon="fa-brands fa-twitter" size='3x' />
          </a>
          <button className={styles.navBarItem_ConnectButton} id='connectButton'
                  onClick={connectWallet}>Connect
          </button>
        </nav>
      }
    </nav>
  )
}
function RoadmapPage() {
  innerWidth = useWidth();
  return (<>
    <div className={styles.mainContent}>
      <Image src={"/roadmap_info.png"} 
            width={1350} height={1080} 
            alt="Menji about" />
    </div>
    <div className={styles.roadmapButtons}>
      <button className={styles.mintButton2} id='mintButton2'
                onClick={mintNFT}><BrowserView>Mint Now</BrowserView>
                                  <MobileView>Mint</MobileView>
    
      </button>

      <Link href="/home">
        <a className={styles.mintButton2}><BrowserView>Home Page</BrowserView>
                                          <MobileView>Home</MobileView>
        </a>
      </Link>  
    </div>
    </>
  )
}
export { mintNFT, NavBar, RoadmapPage };


function TEAMSection() {
  const [team1checked, setTeam1Checked] = useState(false);
  const [team2checked, setTeam2Checked] = useState(false);
  const [team3checked, setTeam3Checked] = useState(false);
  const [team4checked, setTeam4Checked] = useState(false);

  return (
    <div className={styles.teamContainer}>
      <div className={styles.teamMember}>
        <Image className={styles.teamMemberImage} src={'/team1.png'} width={200} height={200} onClick={() => {setTeam1Checked(!team1checked); window.scrollTo(0,document.body.scrollHeight);}}/>
        <p className={styles.teamMemberName} onClick={() => {setTeam1Checked(!team1checked); window.scrollTo(0,document.body.scrollHeight);}}>Sticky <a>+</a></p>
        { team1checked && <p className={styles.teamMemberText}>Finance & Business Development - Numbers guy. Parlay savant.</p> }
      </div>

      <div className={styles.teamMember}>
        <Image className={styles.teamMemberImage} src={'/team2.png'} width={200} height={200}  onClick={() => {setTeam2Checked(!team2checked); window.scrollTo(0,document.body.scrollHeight);}}/>
        <p className={styles.teamMemberName} onClick={() => {setTeam2Checked(!team2checked); window.scrollTo(0,document.body.scrollHeight);}}>Jay <a>+</a></p>
        { team2checked && <p className={styles.teamMemberText}>Project Lead - Big Tech Director turned NFT degen. Alpha addict.</p> }
      </div>

      <div className={styles.teamMember}>
        <Image className={styles.teamMemberImage} src={'/team3.png'} width={200} height={200}  onClick={() => {setTeam3Checked(!team3checked); window.scrollTo(0,document.body.scrollHeight);}}/>
        <p className={styles.teamMemberName} onClick={() => {setTeam3Checked(!team3checked); window.scrollTo(0,document.body.scrollHeight);}}>Menji <a>+</a></p>
        { team3checked && <p className={styles.teamMemberText}>NFT Artist - American Digital artist and painter. Unique Style.</p> }
      </div>

      <div className={styles.teamMember}>
        <Image className={styles.teamMemberImage} src={'/team4.png'} width={200} height={200}  onClick={() => {setTeam4Checked(!team4checked); window.scrollTo(0,document.body.scrollHeight);}}/>
        <p className={styles.teamMemberName} onClick={() => {setTeam4Checked(!team4checked); window.scrollTo(0,document.body.scrollHeight);}}>Doc <a>+</a></p>
        { team4checked && <p className={styles.teamMemberText}>Community Operations - Eternal Optimist. No idea is too crazy</p> }
      </div>
    </div>
  )
} 


export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>MENJi's World NFT Drop</title>
        <meta name="description" content="MENJi's NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className={styles.main}>
          <div className={styles.mainContent}>
            <Image src={"/_mainart.jpg"} 
                   width={1350} height={1080} 
                   alt="Menji's World Main Art" 
                   layout='responsive'/>
          </div>
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

          {/* main 2 */}
          <div className={styles.mainContent_2}>
            <div className={styles.mainContent_2_left}>
              {/* <SampleArt /> */}
              <Image src={"/sample_nft_sm.jpg"} 
                    width={1054} height={854} 
                    alt="Menji's World Sample Art"
                    // layout='responsive'
                    />
            </div>
            <div className={styles.mainContent_2_right}>
              <button className={styles.mintButton} id='mintButton'
                      onClick={mintNFT}>Mint Now
              </button>
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

          <TEAMSection />
        
       </main>
    </div>
  )
}