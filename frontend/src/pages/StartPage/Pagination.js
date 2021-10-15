import React from "react";
import './style.css'
const Pagination=({PostPerPage, totalPost,paginate, setCurrentPage,CurrentPage})=>{
    const pageNumbers=[]
    for(let i=1; i<=Math.ceil(totalPost/ PostPerPage); i++){
        pageNumbers.push(i)
    }
    const nextPage = () => {
        if(CurrentPage<Math.ceil(totalPost/ PostPerPage))
        setCurrentPage(prev=> prev+1)
    }
    const prevPage = () => {
        if(CurrentPage>1)
            setCurrentPage(prev=> prev-1)
    }
    return(
        <div className='paginate'>
            <button
                className={pageNumbers.length>1?'prev-page':'hide'}
                onClick={prevPage}
            />
            <ul className='pagination'>
                {
                    pageNumbers.length>1?
                    pageNumbers.map(number=>(
                        <li key={number} className="page-item">
                            <button
                               className="page-link"
                                onClick={()=>paginate(number)}>
                                {number}
                            </button>
                        </li>

                    )) : null
                }
            </ul>
            <button
                className={pageNumbers.length>1?'next-page':'hide'}
                onClick={nextPage}
            />
        </div>
    )
}

export default Pagination;