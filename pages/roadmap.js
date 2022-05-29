import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from 'react'

import { NavBar, RoadmapPage, FAQSection, editConnectButton, connectWallet, MintModal } from './home.js'

export default function Home() {
  const [mintModalOpen, setMintModalOpen] = useState(false);

  const closeAndConnect = () => {
    closeMintModal();
    connectWallet();
  }
  const closeMintModal = () => {
    window.document.onclick = null;
    window.document.getElementById('closeModalButton').removeEventListener('click', closeMintModal);
    window.document.getElementById('mintConnectButton').removeEventListener('click', closeAndConnect);
    setMintModalOpen(false);
  }
  const openMintModal = () => {
    setMintModalOpen(true);
  }
  //close events for the mint popup
  useEffect(() => {
    if (mintModalOpen) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('mintModal')) {closeMintModal();}}
      window.document.getElementById('closeModalButton').addEventListener('click', closeMintModal);
      window.document.getElementById('mintConnectButton').addEventListener('click', closeAndConnect);
    }
  }, [mintModalOpen]);

  //on page load
  useEffect(() => {
    editConnectButton();
    window.document.getElementById('mintButton2').addEventListener('click', openMintModal);
    // return () => {
    //   window.document.getElementById('mintButton2').removeEventListener('click', openMintModal);
    // }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>MENJi's World NFT Drop</title>
        <meta name="description" content="MENJi's NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      { mintModalOpen && <MintModal /> } {/* Takes over page when Mint Button clicked */}

      <NavBar />
      <main>{/* Theoretically useful for SEO */}
        <RoadmapPage />{/*  Roadmap Image + Mint Button + Home Button */}
        <FAQSection />
      </main>
    </div>
  )
}