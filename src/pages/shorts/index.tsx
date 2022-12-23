import Head from "next/head";

import {useState} from "react";
import { Container, Row, Col } from 'react-grid-system';
import Short from "../../components/short";

export default function Characters() {
    const [ shorts, ] = useState(["tobi_vs_konan.mp4", "itachi.mp4", "madara_vs_all.mp4", "madara_vs_gai.mp4", "obito_vs_kakashi.mp4", "obito_vs_naruto.mp4"]);

    const shorts_elements = [];
    for(let i = 0; i < shorts.length; i++){
        shorts_elements.push(
            <Col sm={12} xl={5} xxl={4} key={i}>
                <Short shortName={shorts[i]}></Short>
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