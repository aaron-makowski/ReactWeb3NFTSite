import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function About() {
  return (
    <div className={styles.container}> 
      <Head>
        <title>MENJi NFT Drop</title>
        <meta name="description" content="MENJi NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.title} id="about">
        <Image src={'/about_menji_text.png'} id="about" width={568} height={136} />
      </div>
      
      <div className={styles.navBar}>
          <Link href="/home" passHref>
          <button className={styles.navBarItem}>Home</button></Link>
          <Link href="/mint" passHref>
          <button className={styles.navBarItem}>Mint</button></Link>
          <Link href="/team" passHref>
          <button className={styles.navBarItem}>Team</button></Link>             
      </div>

      {/* main */}
      <main className={styles.main}>
        <br />
        <div className={styles.aboutContent}>
          <p className={styles.description}>
            The Creator of Menji's World
            <br/><br/>
            Menji is an American Digital artist and painter from California with a goal to build a world that lives beyond his physical and digital work. Menji's world was created with a sole focus to create unique experiences, bend the limitations of fashion, and be an example that anyone can create a world that is unique to themselves and inclusive to those who care to explore it.
            <br/><br/>
            Welcome to Menji's World.
          </p>
        </div>
        <br/><br/>
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
        </footer>
      </main>
    </div>
  )
}
