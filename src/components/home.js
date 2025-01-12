import Footer from "./footer";
import Navbar from "./navbar";

const Home = () => {
    return(
        <div className="container-home">
            <div className="container-header">
                <Navbar></Navbar>
            </div>
            <div className="container-body">
                <h1>Sistema de Ahorro Aleatorio Diario</h1>
            </div>
            <div className="container-footer">
                <Footer/>
            </div>
        </div>
    )
}

export default Home;