
const clearImputs = (formInputs)=>{
    for(let input of formInputs){
        if(input.tagName === "INPUT" & input.type !== 'checkbox' & input.type !== 'submit'){            
            input.value = ""
        }
    }
}


export {clearImputs}
