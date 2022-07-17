import '../styles/globals.css'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false


import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.ropsten], //chain.mainnet,
  [alchemyProvider({ alchemyId: '-JjF8cTJGgfSfhKMVgqxKV48CsCIKfpn' }),
    publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Menji's World NFTs",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

// import { Web3ReactProvider } from '@web3-react/core'
// import Web3 from 'web3'

// function getLibrary(provider) {
//   return new Web3(provider)
// }

// function MyApp({ Component, pageProps }) {
//   return (
//     <Web3ReactProvider getLibrary={getLibrary}>
//       <Component {...pageProps} />
//     </Web3ReactProvider>
//   )
// }

export default MyApp