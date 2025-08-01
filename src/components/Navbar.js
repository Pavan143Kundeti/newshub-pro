import React, { Component } from 'react'
import { Link } from "react-router-dom";

export class Navbar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg bg-dark navbar-dark ">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">NewsHub Pro</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" to="/home">Home</Link>
                                </li>
                                <li className="nav-item"><Link className="nav-link" to="/business">Business</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/entertainment">Entertainment</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/general">General</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/health">Health</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/science">Science</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/sports">Sports</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/technology">Technology</Link></li>
                            </ul>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/search">
                                        <i className="fas fa-search"></i> Search
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/filter">
                                        <i className="fas fa-filter"></i> Filter
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/share">
                                        <i className="fas fa-share-alt"></i> Share
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/bookmarks">
                                        <i className="fas fa-bookmark"></i> Bookmarks
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/analytics">
                                        <i className="fas fa-chart-bar"></i> Analytics
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/settings">
                                        <i className="fas fa-cog"></i> Settings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar
