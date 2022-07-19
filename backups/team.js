import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Team() {
  return (
    <div className={styles.container}>
      <Head>
        <title>MENJi NFT Drop</title>
        <meta name="description" content="MENJi NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div className={styles.title} id="team">
          <Image src={'/team_text.png'} width={415} height={230} />
        </div>

      <div className={styles.navBar}>
          <Link href="/home" passHref>
          <button className={styles.navBarItem}>Home</button></Link>
          <Link href="/mint" passHref>
          <button className={styles.navBarItem}>Mint</button></Link>
          <Link href="/about" passHref>
          <button className={styles.navBarItem}>About</button></Link>             
        </div>
    <br/>
      {/* main */}
      <main className={styles.main}>
          {/* TEAM SECTION */}

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

          <br/>
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
