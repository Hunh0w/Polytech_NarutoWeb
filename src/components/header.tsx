import {Container} from "react-grid-system";
import {useRouter} from "next/router";
// @ts-ignore
import Cookies from "js-cookie";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../pages/_app";

export const navigation = [
    {
        name: "Personnages",
        path: "/characters"
    }
];

export default function Header(props: {}) {

    const router = useRouter();
    const { userSession, setUserSession } = useContext(UserContext);
    const inSession = userSession.username !== null && userSession.username !== ""

    const linksElements = [];
    for(let i = 0; i < navigation.length; i++){
        const element = navigation[i];
        linksElements.push(<li key={i} onClick={(evt) => {router.push(element.path)}} className={router.asPath === element.path ? "active":""}>
            <span>{element.name}</span>
        </li>)
    }

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
                 if(inSession) router.push("/admin")
                 else router.push("/login")
            }} style={inSession ? userSession.privileges >= 50 ? {"color": "red", "fontWeight": "bold"}:{"color": "blue"}:{}}>{
                inSession
                ? userSession.username
                : "Connexion"
            }</button>
        </div>
    </Container>)
}