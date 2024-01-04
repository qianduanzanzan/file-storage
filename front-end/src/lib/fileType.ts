const fileType:any = {
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    webp: 'image',
    txt: 'txt',
    pdf: 'pdf',
    mp3: 'music',
    ppt: 'ppt',
    doc: 'word',
    docx: 'word',
    xlsx: 'excel',
    xls: 'excel',
    csv: 'excel',
    zip: 'zip',
    rar: 'zip',
    mp4: 'video',
    rmvb: 'video',
    '3gp': 'video',
    avi: 'video'
}

export function getFileIconName(flag:any,type:any){
    if(!flag){
        return 'icon-File'
    }
    if(type && fileType[type.toLowerCase()]){
        return `icon-${fileType[type.toLowerCase()]}`
    }
    return 'icon-unknown'
}