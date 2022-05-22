import React from 'react'
import SingleClass from './SingleClass'

export default function classesList({classes, removeClass, setClasses}) {
    return (
        classes.map(class_ =>{
            return <>
                    <SingleClass key={class_.id} class_={class_} removeClass={removeClass} setClasses={setClasses} />
                    <br></br>
                   </> 
            
        }) 
      )
}
