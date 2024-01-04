import { defineStore } from "pinia";

const files = import.meta.globEager("./modules/*.ts");
const obj: any = {}

Object.keys(files).forEach(item => {
    const name = item.replace(/\.\/modules\/|.ts/g, '')
    obj[name] = defineStore(name, files[item].default)
})

export default obj
