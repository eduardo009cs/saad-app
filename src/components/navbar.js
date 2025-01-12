import { Link } from "react-router-dom"
import whiteLogo from "../media/white-logo.png"
const Navbar = () => {
    return (
        <nav className="navbar bg-dark navbar-expand-lg bg-body bg-body-tertiary  border-bottom border-body" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={whiteLogo} alt="logo-saad"></img>       
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to={"/generate-number"} >Generardor de Número</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to={"/payments-table"}>Pagos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to={"/numbers-table"}>Tabla de Número</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar