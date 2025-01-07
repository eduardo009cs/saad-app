import React, { useState} from "react";
import { showAlert, sendRequest, validateData, assigningGroup, getIndividualAmount, getTotalAmount, getTotalSavings, getWaitingSavings } from "../utils/functions";
import {DateTime} from 'luxon'
import '../index.css'

let operation

const ShowSavings = ({savings,users, reloadData}) =>{

    const url = 'http://localhost:5000/api/v1/savings';
    const urlSavingUser = 'http://localhost:5000/api/v1/savingUsers';
   
    const [savingUserId, setSavingUserId] = useState("")
    const [date, setDate] = useState("")
    const [number, setnumber] = useState(0)
    const [status, setStatus] = useState(false)
    const [group, setGroup] = useState(0)
    const [title, setTitle] = useState("")
    
    /*
        Operacion 1: Agregar registro a savings_history 
        Operación 2: Agregar registro a savings_user
        Operación 3: Modificar registros para marcar pago
    
    */


    const getDateFormated = (date) =>{
        return DateTime.fromISO(date.split("T")[0]).toFormat('dd LLLL yyyy');
    }
    const openModal = (op,savingUserId,date,number,group,status) =>{
        
        setSavingUserId("")
        setDate("");
        setnumber(0);
        setGroup(0);
        setStatus(false);
        if(op === 1){
            operation = 1;
            setTitle("Registrar Ahorro")
        }else{
            operation = 3;
            setTitle("Editar Ahorro");
            setSavingUserId(savingUserId)
            setDate(date.split('T')[0]);
            setnumber(number);
            setStatus(status);
            setGroup(group);
        }
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
    const deleteSaving = async (savingHistoryId) => {
        const method = "DELETE"
        const params = {
            saving_history_id:savingHistoryId
        }
        const response = await sendRequest(method,params,`${url}/${savingHistoryId}`);
        console.log(response)
        reloadData()
    }
    const processRequest = async() =>{
        var params;
        var method;

        let response;
        if(operation === 1){
           response = await createNewSaving();
           console.log(response)
        }else if (operation === 3) {
            params = {
                status: status
            }
            method = "PUT"
            response = await sendRequest(method,params,urlSavingUser  + "/" + savingUserId)
        }
        

        showAlert(response.message,response.type)
        reloadData()
    }
    
    return(
        <div className="savings-content">
            
                        <div className="table-responsive">
                            <table className="table table-bordered centered-cell table-dark" >
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Fecha</th>
                                        <th>Grupo</th>
                                        <th>Número</th>
                                        {
                                            users.map((user)=>(
                                                
                                                    <th key={user.user_id}>{user.name}</th>
                                                    
                                                
                                            ))
                                        }
                                        <th>Monto</th>
                                        <th>Total</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {
                                        savings.map((saving, i) =>(
                                            <tr key={saving.saving_history_id}>
                                                <td>{i+1}</td>
                                                <td>{getDateFormated(saving.date)}</td>
                                                <td>{saving.group} </td>
                                                <td>{saving.number} </td>
                                                {
                                                    saving.savings_users.map(user => (
                                                        <td key={user.user_id}>
                                                            <button className="btn btn-light" disabled = {user.status} onClick={() => openModal(3,user.savings_users_id,saving.date,saving.number,user.status)}  data-bs-toggle="modal" data-bs-target="#modalSavings">
                                                            {
                                                                user.status ? 
                                                                <i className="fa-duotone fa-regular fa-circle-check" style={{color: "#04c811",}}> </i>:
                                                                <i className="fa-duotone fa-regular fa-circle-xmark" style={{color: "#fc0303",}}> </i>
                                                            }
                                                            </button>
                                                        </td>
                                                    ))
                                                }
                                                <td>{getIndividualAmount(saving.number, saving.group,users.length)}</td>
                                                <td>{getTotalAmount(saving.number, saving.group,users.length)}</td>
                                                <td>
                                                    <button className="btn btn-danger" onClick={() => deleteSaving(saving.saving_history_id)}>
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        
                    
            
            
            <div id="modalSavings" className="modal fade" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{title}</label>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="id"></input>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="date" id="date" className="form-control" placeholder="Fecha" value={date} onChange={(e) => setDate(e.target.value)}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="number" id="number" className="form-control" placeholder="0" value={number} onChange={(e) => setnumber(e.target.value)}></input>
                            </div>
                            <div className="btn-group input-group mb-3" role="group" aria-label="Basic checkbox toggle button group">
                                <input type="checkbox" className="btn-check" id="status" autoComplete="off" checked={status} onChange={(e) => setStatus(e.target.checked)}/>
                                <label className="btn btn-outline-dark" htmlFor="status">
                                    <i className="fa-regular fa-credit-card" style={{color: "#7ca1f8"}}></i> Pago
                                </label>

                            </div>
                            <div className="d-grid col-6 mx-auto">
                                <button className="btn btn-success" onClick={() => processRequest()}>
                                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="btnCerrarModal" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
                
            </div>

        </div>
    )
}
export default ShowSavings