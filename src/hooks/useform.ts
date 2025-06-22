import { useState, type ChangeEvent } from "react";



export const useForm=(intialState:string):[string,(e:ChangeEvent<HTMLInputElement>)=>void]=>{

    const [value, setValue]=useState(intialState)

    const handleOnchange=(e:ChangeEvent<HTMLInputElement>)=>{
        setValue(e.target.value)
    }

    return [value,handleOnchange]

}