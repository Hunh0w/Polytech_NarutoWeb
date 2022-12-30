import '../../styles/globals.css'
import '../../styles/shorts.css'
import '../../styles/header.css'
import '../../styles/login.css'
import '../../styles/characters.css'
import type { AppProps } from 'next/app'
import Header from "../components/header";
import React, {useEffect, useMemo, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie"

export const UserContext = React.createContext({
    userSession: {username: "", privileges: 0},
    setUserSession: (session: UserSession) => {}
});

export interface UserSession {
    username: string
    privileges: number
}


export default function App({ Component, pageProps }: AppProps) {
    const [userSession, setUserSession] = useState({username: "", privileges: 0});
    const value = useMemo(
        () => ({ userSession, setUserSession }),
        [userSession]
    );

  return <UserContextWrapper>
      <Header />
      <Component {...pageProps} />
    </UserContextWrapper>
}

function UserContextWrapper(Props: any){
    const defaultSession: UserSession = {username: "", privileges: 0};
    const [userSession, setUserSession] = useState(defaultSession);
    const value = useMemo(
        () => ({ userSession, setUserSession }),
        [userSession]
    );

    useEffect(() => {
        const token = Cookies.get("token");
        if(token === undefined) return;
        const json_str = Buffer.from(token, 'base64').toString('utf8');
        const json_obj = JSON.parse(json_str);
        const username: string = json_obj.username;
        const privileges: number = json_obj.privileges;
        setUserSession({username: username, privileges: privileges});
    }, []);

    return (
        <UserContext.Provider value={value}>
            {Props.children}
        </UserContext.Provider>
    )
}