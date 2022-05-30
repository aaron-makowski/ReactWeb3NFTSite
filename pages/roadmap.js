import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from 'react'

import { NavBar, PDFViewer, RoadmapPage, FAQSection, editConnectButton, connectWallet, MintModal } from './home.js'

export default function Home() {
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [collectorsAgreementOpen, setCollectorsAgreementOpen] = useState(false);

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
  useEffect(() => {
    if (mintModalOpen) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('mintModal')) {closeMintModal();}}
      window.document.getElementById('closeModalButton').addEventListener('click', closeMintModal);
      window.document.getElementById('mintConnectButton').addEventListener('click', closeAndConnect);
    }
  }, [mintModalOpen]);

  const closePDFModal = () => {
    window.document.onclick = null;
    window.document.getElementById('closePDFButton').removeEventListener('click', closePDFModal);
    setCollectorsAgreementOpen(false);
  }
  useEffect(() => {
    if (collectorsAgreementOpen) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('pdfBG')) {closePDFModal();}}
      window.document.getElementById('closePDFButton').addEventListener('click', closePDFModal);
    }
  }, [collectorsAgreementOpen]);

  //on page load
  useEffect(() => {
    editConnectButton();
    window.document.getElementById('mintButton2').addEventListener('click', openMintModal);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>MENJi's World NFT Drop</title>
        <meta name="description" content="MENJi's NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      { collectorsAgreementOpen && <PDFViewer /> }
      { mintModalOpen && <MintModal /> } {/* Takes over page when Mint Button clicked */}

      <NavBar />
      <main>{/* Theoretically useful for SEO */}
        <RoadmapPage />{/*  Roadmap Image + Mint Button + Home Button */}
        <FAQSection />
      </main>
    </div>
  )
}