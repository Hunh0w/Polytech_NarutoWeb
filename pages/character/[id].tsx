import { useRouter } from "next/router";

export default function Character() {
    const router = useRouter();
    const { query: { id } } = router;
    return <div>
        <h1>{id}</h1>
    </div>
}