import { useState } from "react"
import { assigningGroup, generateNumber, getTotalSavings, getWaitingSavings, sendRequest, showAlert, validateData } from "../utils/functions"
import { config } from "../utils/loadEnvironmentConfig"
import { DateTime } from "luxon"

const GenerateNumbers = ({savings,numbersGenerated,users,reloadData}) =>{
    const url = 'http://localhost:5000/api/v1/savings';
    const urlSavingUser = 'http://localhost:5000/api/v1/savingUsers';
    const [date, setDate] = useState("")
    const [number, setNumber] = useState(0)
    const generateNum = async () => {
        const day = DateTime.fromISO(date).toFormat("ccc")
        let stop = false;
        let num = 0
        while(!stop){
            num = Math.floor(Math.random()*365) + 1
            setNumber(num)
            await delay(1000);
            if(!numbersGenerated[config.days[day] - 1].includes(num) && num <= ( config.days[day]) * config.maxNumberForGroup && num > (config.days[day] - 1) * config.maxNumberForGroup ){
                stop = true
            }
        }
        
    }
    const saveNumber = async () =>{

        let response = await createNewSaving();
        showAlert(response.message,response.type)
        reloadData()
    }
    const createNewSaving = async() =>{    
        let response = validateData(date,number);
        if(response.type === "success"){
            let params = {
                date: date+"T00:00:00.000Z",
                number: parseInt(number),
                group: parseInt(assigningGroup(number)),
            }
            let method = "POST"
            response = await sendRequest(method,params,url)
            
            if(response.type === "success"){
                
                let lastSavingId = response.lastSavingId
                response = {}
                response = await createNewSavingUser(lastSavingId);
                console.log(response)
            }
        }
        return response;
    }
    const createNewSavingUser = async(lastSavingId) =>{
        let params = []
        for(let user of users){
            params.push({
                status:false,
                user_id: user.user_id,
                saving_history_id: lastSavingId,
            })
        }
        let method = "POST"
        let response = {}
        response = await sendRequest(method,params,urlSavingUser);
        console.log(response)
        return response;
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve,ms));
    return(
        <div className="container-genarate-numbers">
            
            <div className="card-number">
                <div className="card-number-title">
                    <h3>Generar Número Aleatorio</h3>
                </div>
                <div className="card-number-body">
                    <div className="card-number-input">
                        
                        <input className="input-generate-number" type="date" placeholder="Seleccione una fecha" value={date} onChange={(e) => setDate(e.target.value)}/>
                        <button className="btn-generate-number mb-3" type="button" onClick={() => generateNum()}>Generar</button>

                    </div>
                    <div className="card-number-text">
                        {number}
                    </div>
                </div>
                <div className="card-number-footer">
                    <button className="button-save-number" type="button" onClick={() => saveNumber()}>Guardar</button>
                </div>
            </div>
            <div className="card-group">
                <div className="card-saving text-center mb-3 centered">
                    <div className="card-saving-header">
                        Ahorro Total
                    </div>
                    <div className="separator"></div>
                    <div className="card-saving-body">   
                        {"$ " + getTotalSavings(savings)}
                    </div>
                </div>
                <div className="card-saving text-center mb-3 centered" >
                    <div className="card-saving-header">
                        Ahorro Esperado
                    </div>
                    <div className="separator"></div>
                    <div className="card-saving-body">   
                        {"$ " + getWaitingSavings(savings)}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default  GenerateNumbers