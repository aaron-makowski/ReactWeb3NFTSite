import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'
import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'
import { getName } from '../utils'

const connectors: [WalletConnect , Web3ReactHooks][] = [
  [walletConnect, walletConnectHooks]
]

function Child() {
  const { connector } = useWeb3React()
  console.log(`Priority Connector is: ${getName(connector)}`)
  return null
}

export default function ProviderExample() {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Child />
    </Web3ReactProvider>
  )
}