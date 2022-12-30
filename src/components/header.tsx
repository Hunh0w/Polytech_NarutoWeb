import {Container} from "react-grid-system";
import {useRouter} from "next/router";
// @ts-ignore
import Cookies from "js-cookie";
import {useEffect, useState} from "react";

const navigation = [
    {
        name: "Personnages",
        path: "/characters"
    },
    {
        name: "Organisations",
        path: "/organizations"
    },
    {
        name: "Rangs",
        path: "/ranks"
    }
];

export default function Header(props: {}) {

    const router = useRouter();

    const [ btnProps, setBtnProps ] = useState({title: "Connexion", style: {}, path: "/login"});

    const linksElements = [];
    for(let i = 0; i < navigation.length; i++){
        const element = navigation[i];
        linksElements.push(<li key={i} onClick={(evt) => {router.push(element.path)}} className={router.asPath === element.path ? "active":""}>
            <span>{element.name}</span>
        </li>)
    }

    useEffect(() => {
        const token = Cookies.get("token");
        if(token != null){
            const json_str = Buffer.from(token, 'base64').toString('utf8');
            const json_obj = JSON.parse(json_str);
            const username: string = json_obj.username;
            const privileges: number = json_obj.privileges;

        }
    }, []);

    return (<Container fluid id={"header"} style={{"display": "flex", "justifyContent": "space-between"}}>
        <div>
            <h1 className={"title"}>Naruto</h1>
        </div>
        <div className={"navcontainer"}>
            <nav>
                <ul>
                    {linksElements}
                </ul>
            </nav>
        </div>
        <div>
            <button className={"button-85"} onClick={(evt) => {
                 if(btnProps.path !== "") router.push(btnProps.path)
            }} style={btnProps.style}>{btnProps.title}</button>
        </div>
    </Container>)
}