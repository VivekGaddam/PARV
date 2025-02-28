import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Horizontal.css";
function HorizontalNavbar() {
    return (
        <div>
        <nav className="navbar navbar-dark bg-dark fixed-top w-100 shadow-sm">
            <div className="container-fluid d-flex justify-content-between">
                <a className="navbar-brand">Share eat</a>
                <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-danger" type="submit">Search</button>
                </form>
                <div class="wrap">
  <button class="button">Create</button>
</div>
            </div>
        </nav>
    
</div>
    );
}

export default HorizontalNavbar;
