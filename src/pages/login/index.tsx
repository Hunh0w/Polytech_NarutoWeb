import Head from "next/head";
import jsSHA from "jssha";
// @ts-ignore
import Cookies from "js-cookie"
import {Container} from "react-grid-system";
import {useContext, useState} from "react";
import {url} from '../../utils/global_vars'
import {useRouter} from "next/router";
import {UserContext} from "../_app";

export default function Characters() {

    const router = useRouter();

    const [ title, setTitle ] = useState("Authentification");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const { userSession, setUserSession } = useContext(UserContext);

    const handleChange = (event: any, setter: any) => {
        setter(event.target.value);
    }

    const hashPassword = (password: string) => {
        const shaObj = new jsSHA("SHA-384", "TEXT", {encoding: "UTF8"});
        shaObj.update(password);
        return shaObj.getHash("HEX");
    }

    const sendForm = () => {
        const hashpass = hashPassword(password);
        const formdata = JSON.stringify({
            email: email,
            password: hashpass
        });
        fetch(url+"/login", {
            method: 'post',
            headers: {
              "Content-Type": "application/json"
            },
            body: formdata
        }).then((response) => {
            const token = response.headers.get("Authorization");
            if(response.status == 200 && token != null){
                Cookies.set("token", token);
                setTitle("Authentication Success !!");

                const json_str = Buffer.from(token, 'base64').toString('utf8');
                const json_obj = JSON.parse(json_str);
                const username: string = json_obj.username;
                const privileges: number = json_obj.privileges;

                setUserSession({username: username, privileges: privileges});

                setTimeout((e) => {
                    router.push("/characters");
                }, 1500);
            }else {
                setTitle("Authentication Failed")
            }

        });
    }

    return <>
        <Head>
            <title>Authentication</title>
        </Head>
        <Container id={"login"} fluid>
            <Container className={"container"}>
                <h1>{title}</h1>
                <Container className={"form"}>
                    <div>
                        <label style={{"color": "white"}}>Email</label>
                        <input type={"text"} value={email} onChange={(evt) => handleChange(evt,setEmail)} />
                    </div>

                    <div>
                        <label style={{"color": "white"}}>Password</label>
                        <input type={"password"} value={password} onChange={(evt) => handleChange(evt,setPassword)} />
                    </div>
                    <button onClick={sendForm}>Valider</button>
                </Container>
            </Container>
        </Container>
    </>
}