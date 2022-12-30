export const url = "http://sigsegv:8080";

export const isObjectEmpty = (object: any) => {
    for(let i in object) return false;
    return true;
}