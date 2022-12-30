import Head from "next/head";
import {useEffect, useState} from "react";
import { url } from "../../utils/global_vars"
import {Container} from "react-grid-system";
import {useRouter} from "next/navigation";

interface Character {
    id: number
    image: string
    realname: string
}

export default function Characters() {

    const [ characters, setCharacters ] = useState([]);

    const router = useRouter();

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
    }, []);



    return <>
        <Head>
            <title>Personnages</title>
        </Head>
        <Container fluid id={"characters"}>
            {characters.map((value: Character, index) => {
                return (
                    <div className={"character"} key={index}>
                        <div className={"character_card"} onClick={(evt) => router.push("/character/"+value.id)}>
                            <img src={value.image} />
                            <h1 className={"character_realname"}>{value.realname}</h1>
                        </div>
                    </div>
                )
            })}
        </Container>
    </>
}