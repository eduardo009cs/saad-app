import { config } from "../utils/loadEnvironmentConfig"

const NumbersGenerated = ({numbersGenerated}) =>{
    const rows = config.maxNumberForGroup;
    const cols = config.maxNumberOfGroups;
        
    const generateTable = () =>{
        if(numbersGenerated.length == 0){
            console.log("Cargando informacion de numeros")
        }else{
            const tableRows = []
            for(let i = 0; i < rows; i++){
                const cells = [];
                for (let j = 0; j < cols; j++) {
                    let number = (i + 1) + (config.maxNumberForGroup*j); 
                    if(numbersGenerated[j].includes(number)){
                        cells.push(
                            <td className="no-border" style={{color:"white",fontWeight:"bold",backgroundColor: config.colors_cells.busy,padding:"1px"}}>
                                {number}
                            </td>
                        )
                    }else{
                        cells.push(
                            <td className="no-border" style={{backgroundColor: config.colors_cells[j+1], padding:"1px"}}>
                                {number}
                            </td>
                        )
                    }
                }
                tableRows.push(
                    <tr className="no-border">{cells}</tr>
                )

            }
            return tableRows;
        }
    }
    
    return(
        <div className="table-responsive">
            <table className="table centered-cell" >
                <thead>
                    <tr className="no-border">
                        {
                            numbersGenerated.map((value,index) =>(
                                <th key={index} className="no-border" style={{color:"white",backgroundColor:config.colors_headers[index+1]}}>Grupo {index + 1}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody >
                    {   
                        generateTable()
                    }
                </tbody>
            </table>
        </div>
               
    )

}
export default  NumbersGenerated