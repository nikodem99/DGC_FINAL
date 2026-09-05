import React from 'react'
import { Link } from 'react-router-dom'

const PageTitle = (props) => {
    return (
        <div className={`wpo-breadcumb-area${props.hclass ? ` ${props.hclass}` : ''}`}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wpo-breadcumb-wrap">
                            <h2>{props.pageTitle}</h2>
                            <ul>
                                <li><Link to="/home">Strona główna</Link></li>
                                <li>{props.pagesub}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageTitle;

