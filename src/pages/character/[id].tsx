import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {isObjectEmpty, url} from "../../utils/global_vars";
import {Container} from "react-grid-system";
import {info} from "next/dist/build/output/log";

interface Frame {
    id: number
    name: string
    link: string
}

interface Rank {
    id: number
    name: string
    powerlevel: number
}

interface CharacterAppearance {
    name: string
    rank: Rank
    images: Frame[]
    short_fights: Frame[]
    short_character: Frame[]
}

interface Character {
    id: number
    realname: string
    description: string
    organizations: number[]
    abilities: string[]
    appearances: CharacterAppearance[]
}

export default function Character() {
    const router = useRouter();
    const { query: { id } } = router;

    if(!id){
        return <></>
    }

    const [ infos, setInfos ] = useState<Character>({
        id: -1,
        realname: '',
        description: '',
        organizations: [],
        abilities: [],
        appearances: []
    });

    useEffect(() => {
        fetch(url+"/characters/"+id, {
            method: "get",
        }).then((resp) => resp.json())
        .then(async (jsondata) => {
            const appearances = jsondata.appearances??[];

            const organizations = [];
            for(let i = 0; i < jsondata.organizations.length; i++){
                const orgID = jsondata.organizations[i];
                const org = await fetch(url+"/organizations/"+orgID, {
                    method: "get"
                }).then((resp) => resp.json());
                if(org) organizations.push(org);
            }
            jsondata.organizations = organizations;

            for(let i = 0; i < appearances.length; i++){
                const images: Frame[] = [];
                const short_fights: Frame[] = [];
                const short_character: Frame[] = [];

                const rankresp = await fetch(url+"/ranks/"+jsondata.appearances[i].rank, {
                    method: 'get'
                }).then((resp) => resp.json())
                .then((jsrank: Rank) => {
                    return jsrank;
                });
                const rank = rankresp??{id: -1, name: "Shinobi", powerlevel: 0};
                jsondata.appearances[i].rank = rank;

                for(const imageid of appearances[i].images){
                    const result = await fetch(url+"/images/"+imageid, {
                        method: "get"
                    }).then((result) => result.json())
                    .then((image: Frame) =>{
                        return image;
                    });
                    images.push(result);
                }
                jsondata.appearances[i].images = images;

                for(const shortid of appearances[i].short_fights){
                    const result = await fetch(url+"/shorts/"+shortid, {
                        method: "get"
                    }).then((result) => result.json())
                    .then((short: Frame) =>{
                        return short;
                    });
                    short_fights.push(result);
                }

                jsondata.appearances[i].short_fights = short_fights;

                for(const shortid of appearances[i].short_character){
                    const result = await fetch(url+"/shorts/"+shortid, {
                        method: "get"
                    }).then((result) => result.json())
                    .then((short: Frame) =>{
                        return short;
                    });
                    short_character.push(result);
                }

                jsondata.appearances[i].short_character = short_character;
            }

            setInfos(jsondata);
        });
    }, []);

    const getOrgsType = (type: string) => {
      const orgs = [];
      for(let i = 0; i < infos.organizations.length; i++){
          const org: any = infos.organizations[i];
          if(org.type === type)
              orgs.push(org)
      }
      return orgs;
    };

    const clans = getOrgsType("clan");
    const affiliations = getOrgsType("affiliation");
    const teams = getOrgsType("team");

    return <Container fluid>
        <Container id={"character"} style={{"backgroundColor": "black", "textAlign": "center"}}>
            <h1><u>{infos.realname}</u></h1>
            <p>
                <i>
                {infos.description}
                </i>
            </p>

            <Container id={"properties"}>
                {infos.abilities.length > 0 &&
                    <table id={"abilities"}>
                        <tr>
                            <th><h3>Compétences</h3></th>
                        </tr>
                        {infos.abilities.map((value: string, index) => {
                            return (<tr key={index}>
                                <td>{value}</td>
                            </tr>)
                        })}
                    </table>
                }
                {clans.length > 0 &&
                    <table id={"clans"}>
                        <tr>
                            <th><h3>Clans</h3></th>
                        </tr>
                        {getOrgsType("clan").map((value: any, index) => {
                            return (<tr key={index}>
                                <td>{value.name}</td>
                            </tr>)
                        })}
                    </table>
                }
                {teams.length > 0 &&
                    <table id={"teams"}>
                        <tr>
                            <th><h3>Equipes</h3></th>
                        </tr>
                        {getOrgsType("team").map((value: any, index) => {
                            return (<tr key={index}>
                                <td>{value.name}</td>
                            </tr>)
                        })}
                    </table>
                }
                {affiliations.length > 0 &&
                    <table id={"affiliations"}>
                        <tr>
                            <th><h3>Affiliations</h3></th>
                        </tr>
                        {getOrgsType("affiliation").map((value: any, index) => {
                            return (<tr key={index}>
                                <td>{value.name}</td>
                            </tr>)
                        })}
                    </table>
                }

            </Container>
            <Container className={"character_appearances"}>
                {infos.appearances.map((value: CharacterAppearance, index) => {
                    return (

                        <div className={"character_appearance"} key={index}>
                            <h1 className={"title"}>Apparence: {value.name}</h1>
                            <h2>Rang: <i><u>{value.rank.name}</u></i></h2>
                            {value.images.map((image: Frame, index) => {
                                return (<div key={index}>
                                    <img src={image.link} width={"50%"} />
                                </div>)
                            })}
                            <Container className={"character_shortcharacter"}>
                                {value.short_character.length > 0 &&
                                    <h1><u>Shorts</u></h1>
                                }
                                <Container className={"shorts"}>
                                    {value.short_character.map((short: Frame, index) => {
                                       return (<div className={"short"} key={index}>
                                           <iframe src={short.link}
                                                   title={short.name} frameBorder="0"
                                                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                   allowFullScreen></iframe>
                                       </div>)
                                    })}
                                </Container>
                            </Container>
                            <Container className={"character_shortfights"}>
                                {value.short_fights.length > 0 &&
                                    <h1><u>Fights</u></h1>
                                }
                                <Container className={"shorts"}>
                                    {value.short_fights.map((short: Frame, index) => {
                                        return (<div className={"short"} key={index}>
                                            <iframe src={short.link}
                                                    title={short.name}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen></iframe>
                                        </div>)
                                    })}
                                </Container>
                            </Container>
                        </div>
                    )
                })}
            </Container>

        </Container>
    </Container>
}