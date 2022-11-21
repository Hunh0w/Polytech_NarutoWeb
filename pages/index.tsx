import Head from 'next/head'
// @ts-ignore
import { Player } from 'video-react';
import "node_modules/video-react/dist/video-react.css";
import {useState} from "react";

export default function Home() {

  const [ shorts, setShorts ] = useState(["tobi_VS_konan.mp4", "itachi.mp4"]);

  const shorts_elements = [];
  for(let i = 0; i < shorts.length; i++){
    shorts_elements.push(
        <Player
            key={i}
            poster="/naruto.png"
            fluid={false}
            width={500}
            height={500}
            src={"/shorts/"+shorts[i]}
        />
    );
  }

  return (
    <div>
      <Head>
        <title>Naruto Web</title>
        <meta name="description" content="Naruto Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="shorts">
        {shorts_elements}
      </div>
    </div>
  )
}
