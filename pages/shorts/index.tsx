import Head from "next/head";
// @ts-ignore
import { Player } from 'video-react';
import "node_modules/video-react/dist/video-react.css";
import {useState} from "react";
import { Container, Row, Col } from 'react-grid-system';

export default function Characters() {
    const [ shorts, setShorts ] = useState(["tobi_VS_konan.mp4", "itachi.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4", "madara_VS_all.mp4"]);

    const shorts_elements = [];
    for(let i = 0; i < shorts.length; i++){
        shorts_elements.push(
            <Col sm={12} xl={5} xxl={4} key={i}>
                <div className={"short"}>
                    <h2 className={"shortName"}>{shorts[i]}</h2>
                    <Player
                        poster="/naruto.png"
                        fluid={false}
                        width={500}
                        height={500}
                        src={"/shorts/"+shorts[i]}
                    />
                </div>
            </Col>
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
                <Container fluid>
                    <Row>
                        {shorts_elements}
                    </Row>
                </Container>
            </div>
        </div>
    )
}