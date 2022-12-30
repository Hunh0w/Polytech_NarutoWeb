import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {isObjectEmpty, url} from "../../utils/global_vars";
import {Container} from "react-grid-system";

interface CharacterAppearance {
    name: string
    rank: number
    images: number[]
    short_fights: number[]
    short_character: number[]
}

interface Character {
    id?: number
    realname?: string
    description?: string
    organizations?: number[]
    abilities?: string[]
    appearances?: CharacterAppearance[]
}

export default function Character() {
    const router = useRouter();
    const { query: { id } } = router;

    const [ infos, setInfos ] = useState<Character>({});

    useEffect(() => {
        fetch(url+"/characters/"+id, {
            method: "get",
        }).then((resp) => {
            return resp.json();
        }).then((jsondata) => {
            if(isObjectEmpty(infos))
                setInfos(jsondata);
        });
    }, []);

    return <Container fluid>
        <Container style={{"backgroundColor": "black", "textAlign": "center"}}>
            <h1 style={{"color": "white"}}>{ infos.realname }</h1>
        </Container>
    </Container>
}