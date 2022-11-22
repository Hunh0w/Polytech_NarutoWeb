import {Container} from "react-grid-system";
import {useRouter} from "next/router";

const navigation = [
    {
        name: "Accueil",
        path: "/"
    },
    {
        name: "Shorts",
        path: "/shorts"
    }
];

export default function Header(props: {}) {

    const router = useRouter();

    const linksElements = [];
    for(let i = 0; i < navigation.length; i++){
        const element = navigation[i];
        console.log(router.asPath)
        console.log(element.path)
        linksElements.push(<li key={i} onClick={(evt) => {router.push(element.path)}} className={router.asPath === element.path ? "active":""}>
            <span>{element.name}</span>
        </li>)
    }

    return (<Container fluid id={"header"} style={{"display": "flex", "justifyContent": "space-between"}}>
        <div>
            <h1>Naruto</h1>
        </div>
        <div className={"navcontainer"}>
            <nav>
                <ul>
                    {linksElements}
                </ul>
            </nav>
        </div>
        <div>
            <button className={"button-85"}>Se connecter</button>
        </div>
    </Container>)
}