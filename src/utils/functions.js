import axios from 'axios'
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {config} from '../utils/loadEnvironmentConfig'
import { DateTime } from 'luxon';
import { Howl } from 'howler';
import sound from "../media/soundNumber.mp3"
export function showAlert(message, icon, focus=""){
    onFocus(focus)
    const mySwal = withReactContent(swal)
    mySwal.fire({
        title:message,
        icon:icon
    });

}

function onFocus(focus){
    if(focus !== ''){
        document.getElementById(FontFaceSetLoadEvent).focus();
    }
}

export const sendRequest = async(method, params,url) =>{
    try {
        const response = await axios({
            method:method,
            url:url,
            data:params
        })
        const type = response.data.type;
        const message = response.data.message;
        const lastSavingId = response.data.lastSavingId || 0
        console.log(response)
        if(type === "success" ){
            return {
                type: type, 
                message: message,
                lastSavingId: lastSavingId
            };
       
        }else{
            return {
                type: type || "error", 
                message: message || "Error desconocido, intentelo más tarde.",
            };
        }
    } catch (error) {
        console.log(error)
        return {
            type: "error", 
            message: "Ocurrio un error inesperado, intentelo mas tarde.",
        };
    }
}

export const validateData = (date,amount) =>{
    if(date === ''){
        return{
            type: "warning", 
            message: "La fecha no debe estar vacia",
            
        }
    }else if(amount < 0){
        return {
            type: "warning", 
            message: "El monto debe de ser mayor a 0",
        }
    }
    return {
        type: "success", 
        message: "Datos correctos",
    }
}

export const assigningGroup = (number) => {
    let group = Math.ceil( number / config.maxNumberForGroup  )
    return group > config.maxNumberOfGroups  ? config.maxNumberOfGroups : group;

}

export const getIndividualAmount = (number, group,numberOfusers) => {
    return group > 3 ? number / numberOfusers : number; 
}

export const getTotalAmount = (number, group,numberOfusers) => {
    return group > 3 ? number : number * numberOfusers;
}

export const loadSavings = (savings) =>{
    let groups = []
    let group = []
    console.log("savings")
    for(let i = 0; i < config.maxNumberOfGroups; i++){
        group=[]
        for(let saving of savings){
            if(saving.number <= (i + 1) * config.maxNumberForGroup && saving.number > (i) * config.maxNumberForGroup){
                group.push(saving.number)
            }else if( saving.number > config.maxNumberForGroup * config.maxNumberOfGroups && (i + 1) == config.maxNumberOfGroups){
                group.push(saving.number)
            }
        }
        groups.push(group)
    }
    
    return groups
}

export const getTotalSavings = (savings) => {
    let totalSaving = 0;

    for(let saving of savings){
        for(let user of saving.savings_users){
            if(user.status){

                totalSaving += getIndividualAmount(saving.number,saving.group,saving.savings_users.length);
            }
        }
    }
    return totalSaving
}
export const getWaitingSavings = (savings) => {
    let waitingSaving = 0;
    for(let saving of savings){
        waitingSaving += getTotalAmount(saving.number,saving.group,saving.savings_users.length)
    }
    return waitingSaving
}

export const generateNumber = (numbers, date) =>{
    const day = DateTime.fromISO(date).toFormat("ccc")
    let stop = false;
    let number = 0
    let counter = 0;
    while(!stop){
        number = Math.floor(Math.random()*365) + 1
        if(!numbers[config.days[day] - 1].includes(number) && number <= ( config.days[day]) * config.maxNumberForGroup && number > (config.days[day] - 1) * config.maxNumberForGroup && counter <= 5){
            stop = true
            
        }
        counter++;
    }
    return number
}


export const playSound  = () =>{
    const audio = new Howl({
        src:[sound]
    })
    audio.play();
}