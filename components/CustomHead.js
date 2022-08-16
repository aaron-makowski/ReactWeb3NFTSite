import Head from 'next/head'

export default function CustomHead() {
    return (
        <Head>
            <title>Menji's World</title>
            <meta name="description" content="Mint August 16/17th!" />
            <link rel="icon" href="/favicon.ico" />
            {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> 
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />*/}
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />

            <meta property="og:image" content="https://i.imgur.com/p6qgDQt.png" />
            <meta property="og:type" content="website" />

            <meta itemprop="name" content="Menji's World" />
            <meta itemprop="description" content="Mint August 16th!" />
            <meta itemprop="image" content="https://i.imgur.com/p6qgDQt.png" />

            <meta property="og:url" content="https://i.imgur.com/p6qgDQt.png" />
            <meta property="og:title" content="Menji's World" />
            <meta property="og:description" content="Mint August 16/17th!" />
            
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@menjisworld" />
            <meta name="twitter:title" content="Menji's World" />
            <meta name="twitter:image" content="https://i.imgur.com/p6qgDQt.png" />
            <meta name="twitter:description" content="Mint August 16/17th!" />


        </Head>
    )
}