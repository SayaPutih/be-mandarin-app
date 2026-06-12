export function shuffle(array){
    let length = array.length;
    let result = [...array]

    if(length == 0) throw new Error("Array size 0");

    for(let i = length - 1 ; i > 0 ; i--){
        const j = Math.floor(Math.random() * (i+1));
        [result[i],result[j]] =  [result[j],result[i]]
    }

    return result 
}