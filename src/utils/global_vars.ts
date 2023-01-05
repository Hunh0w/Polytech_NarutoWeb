export const url = "http://162.38.112.154:8080";

export const isObjectEmpty = (object: any) => {
    for(let i in object) return false;
    return true;
}