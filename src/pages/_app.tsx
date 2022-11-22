import '../../styles/globals.css'
import '../../styles/shorts.css'
import '../../styles/header.css'
import type { AppProps } from 'next/app'
import Header from "../components/header";

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Header />
    <Component {...pageProps} />
  </>
}
