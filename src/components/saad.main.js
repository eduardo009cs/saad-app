import axios from "axios";
import ShowSavings from "./showSavings";
import React, {useEffect, useState} from "react";
import { loadSavings } from "../utils/functions";
import NumbersGenerated from "./numbersGenerated"
import GenerateNumbers from "./generateNumbers"

const SaadMain = () =>{
    const [savings, setSavings] = useState([]);
    const [users, setUsers] = useState([]);
    const [numbers, setNumbers] = useState([]);
    const apiSavings = 'http://localhost:5000/api/v1/savings';
    const apiUsers = 'http://localhost:5000/api/v1/users';
    useEffect(() => {
        loadData()
    },[])
    const loadData = async () => {
        try {
            const [savingsResponse, usersResponse] = await Promise.all([
                axios.get(apiSavings),
                axios.get(apiUsers)
            ])
            
            setNumbers(loadSavings(savingsResponse.data))
            setSavings(savingsResponse.data);
            setUsers(usersResponse.data);
        } catch (error) {
            console.log(error)
            
        }
    }

    

    return(
        <div className="App">
            
            <div className="generate-number">
                <GenerateNumbers savings={savings} numbersGenerated={numbers} reloadData={loadData} users={users}/>
                
            </div>
            <div className="show-number-saving">
                <div className="show-savings">
                    <ShowSavings savings={savings} users={users} reloadData={loadData} />
                </div>
                <div className="numbers-generated" >
                    <NumbersGenerated numbersGenerated={numbers}/>
                </div>
            </div>
        </div>
    )
}

export default SaadMain