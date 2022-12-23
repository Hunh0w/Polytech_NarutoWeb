import Head from "next/head";
import jsSHA from "jssha";
// @ts-ignore
import Cookies from "js-cookie"
import {Container} from "react-grid-system";
import {useState} from "react";

export default function Characters() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

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
        fetch("http://sigsegv:8080/login", {
            method: 'post',
            headers: {
              "Content-Type": "application/json"
            },
            body: formdata
        }).then((response) => {
            console.log(response);
            const token = response.headers.get("Authorization");
            Cookies.set("token", token);
        });
    }

    return <>
        <Head>
            <title>Authentification</title>
        </Head>
        <Container id={"login"} fluid>
            <Container className={"container"}>
                <h1>Authentification</h1>
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