import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from 'react'

import { PDFViewer, RoadmapPage, MintModal, setDefaultProvider } from './home.js'

export default function Home() {
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [collectorsAgreementOpen, setCollectorsAgreementOpen] = useState(false);

  useEffect(() => {
    const closeMintModal = () => {
      setMintModalOpen(false);
    }
    if (mintModalOpen) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('mintModal')) {closeMintModal();}}
      window.document.getElementById('closeModalButton').addEventListener('click', closeMintModal);
    }
  }, [mintModalOpen]);


  useEffect(() => {
    const closePDFModal = () => {
      setCollectorsAgreementOpen(false);
    }
    if (collectorsAgreementOpen) {
      window.document.onclick = function(event) {
        if (event.target === window.document.getElementById('pdfBG')) {closePDFModal();}}
      window.document.getElementById('closePDFButton').addEventListener('click', closePDFModal);
    }
  }, [collectorsAgreementOpen]);

  return (
    <div className={styles.container} onLoad={() => {
      if (typeof window.provider === 'undefined' && 
          typeof window.provider.selectedAddess === 'undefined') {
        window.provider = setDefaultProvider(); 
      }
    }}>
      <Head>
        <title>MENJi's World NFT Drop</title>
        <meta name="description" content="MENJi's NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      { collectorsAgreementOpen && <PDFViewer /> }
      { mintModalOpen && <MintModal setConnectModalOpen={setMintModalOpen}/> } {/* Takes over page when Mint Button clicked */}

      <main>{/* Theoretically useful for SEO */}
        <RoadmapPage setMintModalOpen={setMintModalOpen}
                     setCollectorsAgreementOpen={setCollectorsAgreementOpen} />{/*  Roadmap Image + Mint Button + Home Button */}
      </main>
    </div>
  )
}