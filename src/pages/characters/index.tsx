import Head from "next/head";
import {useEffect, useState} from "react";
import { url } from "../../utils/global_vars"
import {Container} from "react-grid-system";

interface Character {
    id: number
    image: string
    realname: string
}

export default function Characters() {

    const [ characters, setCharacters ] = useState([]);


    useEffect(() => {
        fetch(url+"/characters", {
            method: 'GET',
            headers: {
                "Accept": "application/json"
            }
        })
        .then((resp) => resp.json())
        .then((jsonObj) => {
            setCharacters(jsonObj.characters);
        })
    });



    return <>
        <Head>
            <title>Personnages</title>
        </Head>
        <Container fluid id={"characters"}>
            {characters.map((value: Character, index) => {
                return (
                    <div className={"character"} key={index}>
                        <img src={value.image} />
                        <h1 className={"character_realname"}>{value.realname}</h1>
                    </div>
                )
            })}
        </Container>
    </>
}