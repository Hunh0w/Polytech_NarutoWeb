import Head from "next/head";
import {useEffect, useState} from "react";
import { url } from "../../utils/global_vars"
import {Container} from "react-grid-system";
import {useRouter} from "next/navigation";

interface Character {
    id: number
    image: string
    realname: string
    rank: string
    powerlevel: number
}

export default function Characters() {

    const [ characters, setCharacters ] = useState([]);
    const [ sortType, setSortType ] = useState("");

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

    const displaying = characters.sort((a: Character, b: Character) => {
        if(sortType.toLowerCase() === "powerlevel"){
            if(a.powerlevel > b.powerlevel) return -1;
            else if(a.powerlevel < b.powerlevel) return 1;
            return 0;
        }else if(sortType.toLowerCase() === "rank"){
            if(a.rank === b.rank) return 0;
            return 1;
        }else if(sortType.toLowerCase() === "default"){
            if(a.id > b.id) return 1;
            else if(a.id < b.id) return -1;
        }
        return 0;
    });


    return <>
        <Head>
            <title>Personnages</title>
        </Head>

        <Container fluid id={"sort_box"}>
            <Container className={"container"}>
                <label>
                    Trier par:
                </label>
                <select id={"sort_selector"} onChange={(evt) => {
                    const value = evt.currentTarget.value;
                    setSortType(value);
                }}>
                    <option value={""}></option>
                    <option value={"default"}>ID</option>
                    <option value={"powerlevel"}>Rang</option>
                </select>
            </Container>
        </Container>
        <Container fluid id={"characters"}>
            {displaying.map((value: Character, index) => {
                return (
                    <div className={"character"} key={index}>
                        <div className={"character_card"} onClick={(evt) => router.push("/character/"+value.id)}>
                            <img src={value.image} width={300} />
                            <h1 className={"character_realname"}>{value.realname}</h1>
                        </div>
                    </div>
                )
            })}
        </Container>
    </>
}