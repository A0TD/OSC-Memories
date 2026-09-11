import React from'react';
import {Link ,useNavigate} from 'react-router-dom';
import notfoundcss from './NotFound.module.css';

export default function NotFound(){
    const navigate = useNavigate();
    return(
        <div className={`d-flex flex-column align-items-center justify-content-center text-center ${notfoundcss.notfcontainer}`}>
            <h1>404</h1>
            <h2>Page Not Found!</h2>
            <p> Oops! The page you are looking for doesn't exist or has been moved.</p>
            <div className='d-flex gap-3'>
            <button onClick={() => navigate(-1)} >Go Back</button>
            <Link to='/' >
            Back To Home
            </Link>
            </div>
           

        </div>
    );
}
