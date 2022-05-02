import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

import { useState } from 'react'

import { mintNFT, NavBar } from './home.js'


function FAQSection() {
  const [faq1checked, setFaq1Checked] = useState(false);
  const [faq2checked, setFaq2Checked] = useState(false);
  const [faq3checked, setFaq3Checked] = useState(false);
  const [faq4checked, setFaq4Checked] = useState(false);

  return (
    <div className={styles.FAQContainer}>
      <nav className={styles.FAQItem}>
        <div className={styles.touch} onClick={() => {setFaq1Checked(!faq1checked); window.scrollTo(0,document.body.scrollHeight);}}>
          <span>What is the Mint Date and Price?</span>
          { faq1checked && <ul className={styles.slide}>
          <li><a>Being a mochi means that you are part of an ever-growing community of loving, helpful mochis that all want to see this project expand. Being community-led means we put our community first and allow them to give us the leg up in project direction.</a></li> 
          </ul> }
        </div>
      </nav>

      <nav className={styles.FAQItem}>
        <div className={styles.touch} onClick={() => {setFaq2Checked(!faq2checked); window.scrollTo(0,document.body.scrollHeight);}}>
          <span>What is the roadmap?</span>               
          { faq2checked && <ul className={styles.slide}>
            <li><a>Liquidity protocol for NFTs that allows sellers to gain access to instant ETH. Aside from selling, you are able to buy, swap and stake.</a></li> 
          </ul> }
        </div>
      </nav>

      <nav className={styles.FAQItem}>
        <div className={styles.touch} onClick={() => {setFaq3Checked(!faq3checked); window.scrollTo(0,document.body.scrollHeight);}}>
          <span>What is the total collection size?</span>              
          { faq3checked && <ul className={styles.slide}>
            <li><a>You may find us available on any secondary markets such as Opensea or looksrare.</a></li> 
          </ul> }
        </div>
      </nav>

      <nav className={styles.FAQItem}>
        <div className={styles.touch} onClick={() => {setFaq4Checked(!faq4checked); window.scrollTo(0,document.body.scrollHeight);}}>
          <span>Who is Painted Labs?</span>
          { faq4checked && <ul className={styles.slide}>
            <li><a>The Paint Room is a group of 100 of NFTs Greatest Talents, Alphas, Innovators, Marketers, and Influencers. The Paint Room Structure acts as an Engine for MoshiMochi Innovation and Holder Development. The Mochis will add the fuel...</a></li> 
          </ul> }
        </div>
      </nav>
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
              <Image src={"/roadmap_info.png"} 
                     width={1350} height={1080} 
                     alt="Menji about" />
          </div>
          <div className={styles.roadmapButtons}>
            <button className={styles.mintButton2} id='mintButton2'
                        onClick={mintNFT}>Mint Now
            </button>

            <Link href="/home">
              <a className={styles.mintButton2} >Home Page</a>
            </Link>  
          </div>

          <FAQSection />

       </main>
    </div>
  )
}