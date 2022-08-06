import '../styles/globals.css'

//For the wallet connection popup
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider,
         connectorsForWallets, wallet, darkTheme } from '@rainbow-me/rainbowkit';

// Wagmi is a library that allows you to do everything web3
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


const { chains, provider } = configureChains(
  [chain.ropsten], //chain.mainnet,
  [alchemyProvider({ alchemyId: '-JjF8cTJGgfSfhKMVgqxKV48CsCIKfpn' }),
    publicProvider()]
)

const { wallets } = getDefaultWallets({
  appName: "Menji's World NFTs",
  chains
})

const appInfo = {
  appName: "Menji's World NFT Drop",
}
// console.log(wallets)
const connectors = connectorsForWallets([
  // ...wallets,
  {
    groupName: 'Scroll for More',
    wallets: [
      wallet.injected({ chains }),
      wallet.trust({ chains }),
      ...wallets[0].wallets,
      wallet.argent({ chains }),
      wallet.imToken({ chains }),
      wallet.steak({ chains }),
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={darkTheme()} appInfo={appInfo} chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp