const debounce = (fn:Function,time = 500) =>{
    let timeout:any = null
    return function(){
        if(timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn(...arguments)
            timeout = null
        }, time);
    }
}

export default debounce


// function a(){
//     console.log(...arguments)
// }

// a(1,2,3,4,5,8)



// const aaa = () => {
//     let a = 1
//     return () => {
//         a++
//         console.log(a)
//     }
// }

// const c = debounce(() => {
//     console.log(111)
// })

// c()
// c()

// c()
// c()
// c()
// c()
