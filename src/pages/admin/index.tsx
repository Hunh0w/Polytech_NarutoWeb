import {Container} from "react-grid-system";
import {useEffect, useState} from "react";
import {url} from "../../utils/global_vars";
// @ts-ignore
import Cookies from "js-cookie"


export default function AdminPage() {

    const [ characters, setCharacters ] = useState([]);

    const token = Cookies.get("token");

    const loadCharacters = () => {
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
    }

    useEffect(() => {
        loadCharacters();
    }, []);

    const addProperty = (evt: any) => {
        if(evt.currentTarget.parentElement == null) return;
        if(evt.currentTarget.parentElement.nextSibling == null) return;
        const element = evt.currentTarget.parentElement.nextSibling.firstChild;
        if(element == null) return;
        if(element.parentElement == null) return;
        element.parentElement.append(element.cloneNode(true));
    };

    const delProperty = (evt: any) => {
        if(evt.currentTarget.parentElement == null) return;
        if(evt.currentTarget.parentElement.nextSibling == null) return;
        const element = evt.currentTarget.parentElement.nextSibling.firstChild;
        if(element == null) return;
        if(element.parentElement == null) return;
        if(element.parentElement.children.length <= 1) return;
        element.remove();
    }

    const createCharacter = async (character: any) => {
        let orgIds = [];
        for(let i = 0; i < character.organizations.length; i++)
            orgIds.push(await createOrganization(character.organizations[i]));


        let appearances = [];
        for(let i = 0; i < character.appearances.length; i++){
            const appearance = character.appearances[i];

            const images = [];
            for(let y = 0; y < appearance.images.length; y++)
                images.push(await createImage(appearance.images[y]));
            appearance.images = images;

            const short_character = [];
            for(let y = 0; y < appearance.short_character; y++)
                short_character.push(await createShort(appearance.short_character[y]));
            appearance.short_character = short_character;

            const short_fights = [];
            for(let y = 0; y < appearance.short_fights; y++)
                short_fights.push(await createShort(appearance.short_fights[y]));
            appearance.short_fights = short_fights;

            appearance.rank = await createRank(appearance.rank);

            appearances.push(appearance);
        }

        const payload = {
            realname: character.realname,
            description: character.description,
            organizations: orgIds,
            abilities: character.abilities,
            appearances: appearances
        }

        const resp = await fetch(url+"/characters", {
            method: "post",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if(resp.status === 200){
            loadCharacters();
        }
    }

    const createRank = async (rank: string) => {
        let resp: any = await fetch(url+"/ranks", {
            method: 'get'
        }).then((resp) => resp.json());
        const ranks = resp.ranks;
        for(let i = 0; i < ranks.length; i++){
            const rank_obj = ranks[i];
            if(rank_obj.name.toLowerCase() === rank.toLowerCase())
                return rank_obj["_id"];
        }

        resp = await fetch(url+"/ranks", {
            method: "POST",
            headers:{
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: rank, powerlevel: 50})
        }).then((resp) => resp.json());

        return resp.id;
    }

    const createShort = async (short: any) => {
        let resp: any = await fetch(url+"/shorts", {
            method: 'get'
        }).then((resp) => resp.json());
        const shorts = resp.shorts;
        for(let i = 0; i < shorts.length; i++){
            if(short.link.toLowerCase() === shorts[i].link.toLowerCase())
                return shorts[i]["_id"];
        }

        resp = await fetch(url+"/shorts", {
            method: "POST",
            headers:{
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(short)
        }).then((resp) => resp.json());

        return resp.id;
    }

    const createImage = async (image: any) => {
        let resp: any = await fetch(url+"/images", {
            method: 'get'
        }).then((resp) => resp.json());
        const images = resp.images;
        for(let i = 0; i < images.length; i++){
            if(image.link.toLowerCase() === images[i].link.toLowerCase())
                return images[i]["_id"];
        }

        resp = await fetch(url+"/images", {
            method: "POST",
            headers:{
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(image)
        }).then((resp) => resp.json());

        return resp.id;
    }

    const createOrganization = async (org: any) => {
        let resp: any = await fetch(url+"/organizations", {
            method: 'get'
        }).then((resp) => resp.json());
        const organizations = resp.organizations;
        for(let i = 0; i < organizations.length; i++){
            const organization = organizations[i];
            if(org.name.toLowerCase() === organization.name.toLowerCase() && org.type.toLowerCase() === organization.type.toLowerCase()){
                return organization["_id"];
            }

        }

        resp = await fetch(url+"/organizations", {
            method: "POST",
            headers:{
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(org)
        }).then((resp) => resp.json());

        return resp.id;
    }


    return (<Container fluid>
        <Container id={"admin"}>
            <h1>Administration</h1>
            <Container id={"newcharacter"} className={"global_actions"}>
                <h3><u><i>Nouveau Personnage</i></u></h3>
                <Container className={"attributes"}>
                    <input type={"text"} className={"realname"} placeholder={"realname"} />
                    <input type={"text"} className={"description"} placeholder={"description"} />
                    <div>
                        <label>Organizations</label>
                        <button onClick={addProperty}>+</button>
                        <button onClick={delProperty}>-</button>
                    </div>
                    <div id={"organizations"}>
                        <div className={"organization"}>
                            <input type={"text"} className={"organization"} placeholder={"organization"} />
                            <select>
                                <option value="team">Team</option>
                                <option value="clan">Clan</option>
                                <option value="affiliation">Affiliation</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>Abilities</label>
                        <button onClick={addProperty}>+</button>
                        <button onClick={delProperty}>-</button>
                    </div>
                    <div id={"abilities"}>
                        <input type={"text"} className={"ability"} placeholder={"ability"} />
                    </div>
                    <div className={"appearances_title"}>
                        <label>Appearances</label>
                        <button onClick={addProperty}>+</button>
                        <button onClick={delProperty}>-</button>
                    </div>
                    <div id={"appearances"}>
                        <div className={"appearance"}>
                            <input type={"text"} className={"name"} placeholder={"name"} />
                            <input type={"text"} className={"rank"} placeholder={"rank"} />

                            <div>
                                <label>Images</label>
                                <button onClick={addProperty}>+</button>
                                <button onClick={delProperty}>-</button>
                            </div>
                            <div className={"images"}>
                                <div className={"image"}>
                                    <input type={"text"} className={"name"} placeholder={"nom"}/>
                                    <input type={"text"} className={"link"} placeholder={"lien"} />
                                </div>
                            </div>

                            <div>
                                <label>Shorts</label>
                                <button onClick={addProperty}>+</button>
                                <button onClick={delProperty}>-</button>
                            </div>
                            <div className={"short_characters"}>
                                <div className={"short_character"}>
                                    <input type={"text"} className={"name"} placeholder={"nom"}/>
                                    <input type={"text"} className={"link"} placeholder={"lien"} />
                                </div>
                            </div>

                            <div>
                                <label>Fights</label>
                                <button onClick={addProperty}>+</button>
                                <button onClick={delProperty}>-</button>
                            </div>
                            <div className={"short_fights"}>
                                <div className={"short_fight"}>
                                    <input type={"text"} className={"name"} placeholder={"nom"}/>
                                    <input type={"text"} className={"link"} placeholder={"lien"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
                <button onClick={async (evt) => {
                    const abilities = [];
                    const organizations = [];
                    const appearances = [];

                    const realname_node: any = document.querySelector("#newcharacter .realname");
                    const description_node: any = document.querySelector("#newcharacter .description");
                    const organizations_node: any = document.querySelector("#newcharacter #organizations");
                    const abilities_node: any = document.querySelector("#newcharacter #abilities");
                    const appearances_node: any = document.querySelector("#newcharacter #appearances");

                    if(realname_node == null) return;
                    if(description_node == null) return;
                    if(organizations_node == null) return;
                    if(abilities_node == null) return;
                    if(appearances_node == null) return;

                    const realname = realname_node.value;
                    const description = description_node.value;

                    for(let i = 0; i < abilities_node.children.length; i++){
                        const ability_node = abilities_node.children.item(i);
                        abilities.push(ability_node.value);
                    }

                    for(let i = 0; i < organizations_node.children.length; i++){
                        const organization_node = organizations_node.children.item(i);
                        const organization = organization_node.firstChild.value;
                        const kind = organization_node.lastChild.value;
                        organizations.push({name: organization, type: kind});
                    }

                    for(let i = 0; i < appearances_node.children.length; i++){
                        const appearance_node = appearances_node.children.item(i);
                        const images = [];
                        const short_characters = [];
                        const short_fights = [];

                        const name_node = appearance_node.querySelector(".name");
                        const rank_node = appearance_node.querySelector(".rank");
                        const images_node = appearance_node.querySelector(".images");
                        const short_characters_node = appearance_node.querySelector(".short_characters");
                        const short_fights_node = appearance_node.querySelector(".short_fights");

                        for(let i = 0; i < images_node.children.length; i++){
                            const image_node = images_node.children.item(i);
                            const name = image_node.querySelector(".name");
                            const link = image_node.querySelector(".link");
                            images.push({
                               name: name.value,
                               link: link.value
                            });
                        }
                        for(let i = 0; i < short_characters_node.children.length; i++){
                            const short_character_node = short_characters_node.children.item(i);
                            const name = short_character_node.querySelector(".name");
                            const link = short_character_node.querySelector(".link");
                            short_characters.push({
                                name: name.value,
                                link: link.value
                            });
                        }
                        for(let i = 0; i < short_fights_node.children.length; i++){
                            const short_fight_node = short_fights_node.children.item(i);
                            const name = short_fight_node.querySelector(".name");
                            const link = short_fight_node.querySelector(".link");
                            short_fights.push({
                                name: name.value,
                                link: link.value
                            });
                        }

                        appearances.push({
                            name: name_node.value,
                            rank: rank_node.value,
                            images: images,
                            short_character: short_characters,
                            short_fights: short_fights
                        });
                    }

                    const newCharacter = {
                        realname: realname,
                        description: description,
                        organizations: organizations,
                        abilities: abilities,
                        appearances: appearances
                    }
                    await createCharacter(newCharacter);
                }}>
                    CREATE
                </button>
            </Container>
            <table>
                <tr>
                    <th>id</th>
                    <th>realname</th>
                    <th>Actions</th>
                </tr>
                {characters.map((value: any, index) => {
                    return (<tr key={index}>
                        <td>{value.id}</td>
                        <td>{value.realname}</td>
                        <td className={"actions"}>
                            <button {...{"characterid": value.id}} onClick={async (evt) => {
                                const target = evt.currentTarget;
                                if(target.parentElement == null) return;
                                if(target.parentElement.parentElement == null) return;
                                const parent = target.parentElement.parentElement;
                                let attribute_id = target.getAttribute("characterid");
                                if(attribute_id == null) return;
                                const id = parseInt(attribute_id);
                                const resp = await fetch(url+"/characters", {
                                    method: "delete",
                                    headers: {
                                        "Authorization": token,
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({id: id})
                                });
                                if(resp.status === 200){
                                    parent.remove();
                                }
                            }}>DELETE</button>
                        </td>
                    </tr>)
                })}
            </table>
        </Container>
    </Container> )
}