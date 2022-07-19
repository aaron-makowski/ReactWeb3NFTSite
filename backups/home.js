import Head from 'next/head'
import styles from '../styles/Home.module.css'

import ClickOverlay from '../public/art.svg'

import { useEffect } from 'react'
import { connectWallet } from './mint'


export default function Home() {
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // list all elements on the page
      var elements = document.getElementsByTagName('path');
      console.log(elements)
      //loop through all elements
      for (var i = 0; i < elements.length; i++) {
        // get the current element
        var element = elements[i];
        // check if the current element has a class name
        // console.log(element.tagName)
        if (element.tagName == 'path') {
          if (element.onclick == null) {
              const fillString = element.style.fill.replace(/\s/g, ''); //strip spaces out
              element.onmouseover = function() {
                // make cursor pointer
                document.body.style.cursor = 'pointer';
              }
              element.onmouseout = function() {
                // make cursor default
                document.body.style.cursor = 'default';
              }
              if (fillString == 'rgb(0,0,0)') {
                element.addEventListener('click', function() {
                  window.location.href = '/mint';
                });
              } else if (fillString == 'rgb(0,0,1)') {
                element.addEventListener('click', function() {
                  window.location.href = '/about';
                });
              } else if (fillString == 'rgb(0,0,2)') {
                  element.addEventListener('click', function() {
                  window.open('https://discord.gg/7XyXxXx');
                });
              } else if (fillString == 'rgb(0,0,3)') {
                  element.addEventListener('click', function() {
                  window.open('https://t.me/joinchat/menjinft');
                });
              } else if (fillString == 'rgb(0,0,4)') {
                  element.addEventListener('click', function() {
                    window.open('https://twitter.com/MENJiNFT');
                  });
              } else if (fillString == 'rgb(0,0,5)') {
                  element.addEventListener('click', function() {
                    window.open('https://opensea.io/collections/MENJi-NFT-Collection');
                  });
              } else if (fillString == 'rgb(0,0,6)') {
                  element.addEventListener('click', function() {
                    connectWallet();
                  });
              } else if (fillString == 'rgb(0,0,7)') {
                  element.addEventListener('click', function() {
                    window.location.href = '/roadmap';
                  });
              } else if (fillString == 'rgb(0,0,8)') {
                  element.addEventListener('click', function() {
                    window.location.href = '/';
                  });
              } else if (fillString == 'rgb(0,0,9)') {
                  element.addEventListener('click', function() {
                    window.location.href = '/team';
                  });
              }
           }
         }
       }
    }
  }, []); //empty array means run once on page load

  return (
    <div className={styles.blackBackground}>
      <Head>
        <title>MENJi NFT Drop</title>
        <meta name="description" content="MENJi NFT Site by Kodiak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.mainPageContainer}>
        <div className={styles.overlapGrid}>
            <ClickOverlay width="100%"/>
        </div>
      </div>
     </div>
  )
}
