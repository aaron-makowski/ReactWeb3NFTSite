function renderCollectionStats() {
  //Example json response from fetchCollectionStats()
  // "collection": {
  //   "stats": {
  //     "one_day_volume": 555.25666,
  //     "one_day_change": -0.5331663093466509,
  //     "one_day_sales": 12,
  //     "one_day_average_price": 46.271388333333334,
  //     "seven_day_volume": 20649.460760000016,
  //     "seven_day_change": 2.8759572616219398,
  //     "seven_day_sales": 281,
  //     "seven_day_average_price": 73.4856254804271,
  //     "thirty_day_volume": 30416.557760000058,
  //     "thirty_day_change": 1.2935263029073212,
  //     "thirty_day_sales": 519,
  //     "thirty_day_average_price": 58.606084315992405,
  //     "total_volume": 939506.9115032858,
  //     "total_sales": 20768,
  //     "total_supply": 9999,
  //     "count": 9999,
  //     "num_owners": 3525,
  //     "average_price": 45.23819874341707,
  //     "market_cap": 734782.7691787906,
  //     "floor_price": 0
  //   }
  // }

  const [collectionStats, setCollectionStats] = useState(null);
  useEffect(() => {
    fetchCollectionStats().then(data => {
      setCollectionStats(data.collection.stats);
    });
  }
  , [fetchCollectionStats]);

  return (
    <div>
      <h2>Collection Stats</h2>
      <p>{collectionStats ? 
      <div className={styles.statsBoxContainer}>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>1D Vol</div>
            <div className={styles.statsBoxNumber}>{collectionStats.one_day_volume}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>1D Change</div>
            <div className={styles.statsBoxNumber}>{collectionStats.one_day_change}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>1D Sales</div>
            <div className={styles.statsBoxNumber}>{collectionStats.one_day_sales}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>1D Avg Price</div>
            <div className={styles.statsBoxNumber}>{collectionStats.one_day_average_price}</div>
                    </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>7D Vol</div>
            <div className={styles.statsBoxNumber}>{collectionStats.seven_day_volume}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>7D Change</div>
            <div className={styles.statsBoxNumber}>{collectionStats.seven_day_change}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>7D Sales</div>
            <div className={styles.statsBoxNumber}>{collectionStats.seven_day_sales}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>7D Avg Price</div>
            <div className={styles.statsBoxNumber}>{collectionStats.seven_day_average_price}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>30D Vol</div>
            <div className={styles.statsBoxNumber}>{collectionStats.thirty_day_volume}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>30D Change</div>
            <div className={styles.statsBoxNumber}>{collectionStats.thirty_day_change}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>30D Sales</div>
            <div className={styles.statsBoxNumber}>{collectionStats.thirty_day_sales}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>30D Avg Price</div>
            <div className={styles.statsBoxNumber}>{collectionStats.thirty_day_average_price}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>Total Vol</div>
            <div className={styles.statsBoxNumber}>{collectionStats.total_volume}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>Total Sales</div>
            <div className={styles.statsBoxNumber}>{collectionStats.total_sales}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>Total Supply</div>
            <div className={styles.statsBoxNumber}>{collectionStats.total_supply}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>Count</div>
            <div className={styles.statsBoxNumber}>{collectionStats.count}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>Num Owners</div>
            <div className={styles.statsBoxNumber}>{collectionStats.num_owners}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>Avg Price</div>
            <div className={styles.statsBoxNumber}>{collectionStats.average_price}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>Market Cap</div>
            <div className={styles.statsBoxNumber}>{collectionStats.market_cap}</div>
          </div>
          <div className={styles.statsBox}>
            <div className={styles.statsBoxTitle}>Floor Price</div>
            <div className={styles.statsBoxNumber}>{collectionStats.floor_price}</div>
          </div>
        </div>
      : 'Loading...'}</p>

    </div>
  )
}

function fetchCollectionStats(){
  return new Promise((resolve, reject) => {
      let url = 'https://api.opensea.io/api/v1/asset/' + contractAddress + '/1/?include_orders=false';
      fetch(url).then(response => response.json()).then(data => { resolve(data); }).catch(error => { reject(error); });
  });
}
// function (){
//   //function that
// }
// function (){
//   //function that
// }


const tryBackupProviders = (err, setAddress) => {
    alert('Error connecting to wallet. Trying backup providers. ' + err.message.toString());
    try {
        if (window.ethereum) {
        alert('chose ethereum (testing msg)')
        return connectWalletFunctions(window.ethereum, setAddress);
        }

        if (window.web3) {
        alert('chose web3.current (testing msg)')
        return connectWalletFunctions(window.web3.currentProvider, setAddress);
        }

        alert('Failed to connect to wallet, please reload and try again.')
    } catch (error) {
        alert('Failed to connect to backup wallet providers. ' + error.message.toString())
    }
}

//desktop
function connectWallet_(setProvider) { 
  web3Modal = new Web3Modal({
      network: "ropsten", //TODO change to mainnet
      cacheProvider: false,
      providerOptions, // required
      disableInjectedProvider: false,
  });
  web3Modal.connect().then(provider => { 

      switchChainToMainnet(provider);
      provider.enable()

      console.log('setting provider')
      setProvider(provider)
  }).catch(err => {
      console.log('Error connecting to Modal Wallet', err.code, err.message);
  });
}


// async function callback_() {
//   alert('hi0')
//   setProvider(provider)
//   providerChanged += 1;
// }
// let provider = new WalletConnectProvider({
//   infuraId: "d31a6fe248ed4db3abac78f5b72ace93",
//   rpcUrl: "https://mainnet.infura.io/v3/d31a6fe248ed4db3abac78f5b72ace93",
//   // chainId: 3,
//   // connectCallbacks: [callback_]
// });


// const res = initializeConnector<WalletConnect>(
//   (actions) =>
//     new WalletConnect({
//       actions,
//       options: {
//         rpc: 'https://ropsten.infura.io/v3/d31a6fe248ed4db3abac78f5b72ace93',
//       },
//     })
// )
// console.log(res)
// const [walletConnect, hooks] = res
// const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

// walletConnect.connectEagerly().then(() => {
//   const accounts = useAccounts()
//   const provider = useProvider()
//   setProvider(provider)
//   console.log(accounts, provider)
// })
// .catch(() => {
//   console.debug('Failed to connect eagerly to walletconnect')
// })

// const { activate, library } = useWeb3React();

// const connector = new InjectedConnector({
//   supportedChainIds: [1, 3]
// });

// const connect = useCallback(() => {
//   activate(connector);
// }, [activate]);

// connect();


// provider.enable().then(() => { //request({method: 'eth_requestAccounts',})
//   window.open('dapp://wc?uri='+provider.wc.uri.toString());
// //   console.log(provider)
// //   provider.on("accountsChanged", (accounts) => {
// //     addressChanged += 1;
// //     addressChanged2 += 1;
// //     console.log('Newly Selected Address:', provider.selectedAddress, accounts[0])
// //   });
// //   provider.on("chainChanged", (chainId) => {
// //     console.log('Chain changed to', chainId);
// //     if (chainId != 1) {
// //       alert('Please Switch to the Ethereum Mainnet Network'); 
// //     }
// //   });
// //   provider.on("connect", (info) => {
// //     console.log('Connected to Wallet:', info);
// //     if (info.chainId != 1) {
// //       alert('Please Switch to the Ethereum Mainnet Network'); 
// //     }
// //   });
//   setProvider(provider)
//   providerChanged += 1;
// //   window.open('metamask://wc?uri=wc?uri='+provider.wc.uri.toString());
  
// }).catch((err) => {
//   alert('Error Connecting to wallet. Try Again. ' + err.message.toString())
// });

// provider.connector.approveSession({
//   chainId: 3,
//   accounts: ['0x4E994E0Ad30B2D0F1a946d1ECFaB0182b5A6259c']
// })

// provider.enable().then((addresses) => {
//   console.log(addresses)
//   console.log ('selected addy: ' + addresses[0])
// }).catch((err) => {
//   console.log(err)
// })

// setProvider(provider)
// providerChanged += 1;

// provider.enable().then(() => {
//   alert('connectado')
//   setProvider(provider)
//   providerChanged += 1;
// })
// const web3 = new Web3(provider);
// // console.log(web3)
// web3.eth.getAccounts()
//   .then(x => {

// provider.onConnect(async () => {
//   alert('hi3')
//   setProvider(provider)
//   providerChanged += 1;
// });

const [address, setAddress] = useState("Connect");
useEffect(() => {
  if (provider?.selectedAddress) {
    setAddress(editAddressForConnectButton(provider.selectedAddress));
  } else {
    setAddress("Connect")
  }
}, [addressChanged]); //provider?.selectedAddress?.toString()

onLoad={() => {
  try {
    if (typeof window.provider !== 'undefined') return
    // preload contract data with infura
    let provider = setDefaultProvider(); 
    window.provider = provider;
    
    let web3 = new Web3(provider);
    window._web3 = web3
    
    connectToContract(web3);
    
  } catch (error) {
    console.log('Error setting infura default provider' + error.message);
  }
}}

onLoad={() => {
  if (typeof window.provider === 'undefined' && 
      typeof window.provider.selectedAddess === 'undefined') {
    window.provider = setDefaultProvider(); 
  }
}}

  //click events for closing alert popups
  // useMemo(() => {
  //   if (mintError === true || mintSuccess === true) {
  //     window.document.getElementById('closeAlertButton').addEventListener('click', closeAlertPopup);
  //   }
  // }, [mintError, mintSuccess]);

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isClosing) {
      if (typeof window.provider !== 'undefined' && 
          typeof window.provider.selectedAddress !== 'undefined') {
        setAddress(editAddressForConnectButton(window.provider.selectedAddress));
      } else {
        setAddress("Connect")
      }
    }
  }, [addressChanged2]);

  const [address, setAddress] = useState("Connect");

  <button className={styles.mintPopup_ConnectButton}
  id='mintConnectButton'
  onClick={() => {
    // setIsClosing(true);
    props.setIsClosing(true);
    props.setMintModalOpen(false);
    connectWallet(setAddress);
  }}
>{address}</button>

    {/* <button className={styles.navBarItem_ConnectButton} 
            id='connectButton'
            onClick={() => {connectWallet(setProvider)}}
    >{address}</button> */}



                        {/* <button
                      onClick={openChainModal}
                      className={props.style} 
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12, height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <Image
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              width={12}
                              height={12}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button> */}



  // const isPresale = await window.contract.methods.isPresale().call();
  // const totalMinted = await window.contract.methods.nextTokenId().call();
  // const publicWalletLimit = await window.contract.methods.PUBLIC_MINT_LIMIT().call();
  // //unused data currently
  // const isRevealed = await window.contract.methods.isRevealed().call();
  // const totalSupply = await window.contract.methods.MAX_SUPPLY().call();
  // const publicPrice = await window._web3.utils.fromWei(await window.contract.methods.PUBLIC_PRICE().call(), 'ether');
  // const presalePrice = await window._web3.utils.fromWei(await window.contract.methods.PRESALE_PRICE().call(), 'ether');
  // const publicWalletMax = await window.contract.methods.publicWalletLimit().call();
  // //unused data currently:
  // const publicSupply = await window.contract.methods.PUBLIC_SUPPLY().call();
  // const provenanceHash = await window.contract.methods.PROVENANCE_HASH().call();



//todo  remove this
const editAddressForConnectButton = (address) => {
  try {
    if (typeof address !== 'undefined' && address.length > 12) {
        return address.substr(0, 4) + '....' + address.substr(address.length - 4, 4);
    }
  } catch (error) {
    console.log('Error setting connect button text', error.message);
  }
  return "Connect";
}

  // if (web3) {
  //   window.contract = new web3.eth.Contract(abi, contractAddress);
  // } else {
  //   console.log('Error getting wallet connection.');
  // }


  // let providerOptions = {
//   walletconnect: {
//     package: WalletConnectProvider,
//     display: { name: 'Mobile Connect', description: 'Trust Wallet/MetaMask, etc' }, //Visible Label, changeable
//     options: {
//         infuraId: "d31a6fe248ed4db3abac78f5b72ace93" //infura project id
//     }
//   },
//   fortmatic: {
//       package: Fortmatic,
//       options: {
//           key: "pk_live_8DFF4684EB75C648" //formatic api key
//    }
//   },
//   coinbasewallet: {
//     package: CoinbaseWalletSDK, // Required
//     options: {
//       appName: "Menji's World NFT Mint", // Required
//       infuraId: "d31a6fe248ed4db3abac78f5b72ace93", // Required
//       rpc: "", // Optional if `infuraId` is provided; otherwise it's required
//       chainId: 1, // Optional. It defaults to 1 if not provided
//       darkMode: false // Optional. Use dark theme, defaults to false
//     }
//   }
// };


// import Web3Modal from "web3modal"; //Nice Web3 Popup with multiple connections
// //Web3Modal Multiple Providers
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Fortmatic from "fortmatic";
// import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

//Web3Modal Options
// let web3Modal;

// import WalletConnectCard from '../components/connectorCards/WalletConnectCard'
// import ProviderExample from '../components/ProviderExample'

// export default function Home() {
//   return (
//     <>
//       <ProviderExample />
//       <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
//         <WalletConnectCard />
//       </div>
//     </>
//   )
// }

// import { useWeb3React } from '@web3-react/core';

// import { WalletConnect } from '@web3-react/walletconnect'
// const walletConnect = new WalletConnect({
//   supportedChainIds: [1, 3],
// })

// function ConnectButton() {
//   const { active, account, library, 
//           connector, activate, deactivate } = useWeb3React()
  
//   async function connect() {
//     try {
//       await activate(walletConnect)
//     } catch (ex) {
//       console.log(ex)
//     }
//   }
//   async function disconnect() {
//     try {
//       deactivate()
//     } catch (ex) {
//       console.log(ex)
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect to MetaMask</button>
//       {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
//       <button onClick={disconnect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Disconnect</button>
//     </div>
//   )
// }




  // if (address) {
  //   provider.on("accountsChanged", (accounts) => {
  //     addressChanged += 1;
  //     addressChanged2 += 1;
  //     console.log('Newly Selected Address:', provider.selectedAddress, accounts[0])
  //   });
  //   provider.on("chainChanged", (chainId) => {
  //     console.log('Chain changed to', chainId);
  //     if (chainId != 1) {
  //       alert('Please Switch to the Ethereum Mainnet Network'); 
  //     }
  //   });
  //   provider.on("connect", (info) => {
  //     console.log('Connected to Wallet:', info);
  //     if (info.chainId != 1) {
  //       alert('Please Switch to the Ethereum Mainnet Network'); 
  //     }
  //   });
  // }).catch((err) => {
  //   alert('Error Connecting to wallet. Try Again. ' + err.message.toString())
  // });

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


  //Functions used via connect buttons
function switchChainToMainnet(provider) {
  if (provider && provider.chainId && provider.chainId !== '0x3') {
    provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: "0x3" }],
    }).catch(err => {
      alert('Please switch to the ETH Mainnet', err.message)
    });
  }
}
function connectToContract() { //web3) => {
  const provider = useProvider()
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: abi,
    signerOrProvider: provider
  })
  window.contract = contract;
}



// const setDefaultProvider = () => {
//   return new Web3.providers.HttpProvider(
//     'https://ropsten.infura.io/v3/d31a6fe248ed4db3abac78f5b72ace93');
//     //'https://mainnet.infura.io/v3/d31a6fe248ed4db3abac78f5b72ace93'); //TODO
// }