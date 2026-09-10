import React from 'react'
import { Link } from 'react-router-dom'

const PageTitle = (props) => {
    return (
        <div className={`wpo-breadcumb-area${props.hclass ? ` ${props.hclass}` : ''}`}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wpo-breadcumb-wrap">
                            {/* H1 podstrony. Wczesniej jedynym H1 w dokumencie byl ukryty
                                placeholder z trescia "title"; po jego usunieciu
                                podstrony zostalyby bez glownego naglowka. */}
                            <h1>{props.pageTitle}</h1>
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

