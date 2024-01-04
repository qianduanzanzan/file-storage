export const formatSize = (size:any) => {
    // const bit = Number((size / 8).toFixed(2))
    const bit = size
    if(bit < 1024){
        return `${bit}B`
    }
    const kb = Number((bit / 1024).toFixed(2))
    if(bit < 1024){
        return `${kb}kb`
    }
    const mb = Number((kb / 1024).toFixed(2))
    if(mb < 1024){
        return `${mb}mb`
    }
    const gb = Number((mb / 1024).toFixed(2))
    return `${gb}gb`
}
