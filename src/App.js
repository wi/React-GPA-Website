import React, {useState, useEffect} from 'react';
import ClassesList from './ClassesList';
import { v4 as uuidv4 } from 'uuid';
import './main.css';

const localStorageKey = 'OLDGPADATA'
const localStorageWGPA = 'WGPADATA'
const localstorageUWGPA = 'UWGPADATA'

function defaultClasses() {
  return [{id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1}, 
          {id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1}, 
          {id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1}, 
          {id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1}]
}

function App() {
  const [classes, setClasses] =  useState(defaultClasses());
  const [WGPAValue, setWGPA] = useState(0)
  const [UWGPAValue, setUWGPA] = useState(0)

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem(localStorageKey));
    const oldWGPA = localStorage.getItem(localStorageWGPA);
    const oldUWGPA = localStorage.getItem(localstorageUWGPA);
    setClasses(storage);
    setWGPA(oldWGPA);
    setUWGPA(oldUWGPA);
  }, [])

  useEffect(() => {
    console.log('Some data changed...');
    let total_credits = 0;
    let total_grade = 0;
    let UW_grade = 0
    const calc = [...classes].filter(clas => clas.grade !== 'Pass' && clas.grade !== 'Fail')
    console.log(calc)
    calc.forEach(cls => {
      total_credits += cls.creditAmount
      total_grade += (cls.gradeNum * cls.creditAmount)
      UW_grade += (cls.gradeNum * cls.creditAmount)
      if(cls.type === "IB/AP/DE") {
        total_grade += 1;
      } else if (cls.type === "Honors (HN)") {
        total_grade += .5
      }
    })

    updateWGPA((total_grade/total_credits))
    updateUWGPA((UW_grade/total_credits))
    localStorage.setItem(localStorageKey, JSON.stringify(classes));
  }, [classes])

  function updateWGPA(gpa) {
    setWGPA((prevWGPA) => {
      if(prevWGPA === gpa) return prevWGPA;
      localStorage.setItem(localStorageWGPA, gpa);
      return gpa.toFixed(2); 
    })
  }

  function updateUWGPA(gpa) {
    setUWGPA((prevUWGPA) => {
      if(prevUWGPA === gpa) return prevUWGPA;
      localStorage.setItem(localstorageUWGPA, gpa);
      return gpa.toFixed(2); 
    })
  }

  function addClass() {
    setClasses((prevClasses) => {
      console.log('added a class...')
      return [...prevClasses, {id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1}]
    })

  }

  function removeClass(id) {
    console.log('Removed a class...')
    const newClasses = classes.filter(class_ => class_.id !== id)
    setClasses(newClasses)
  }

  function displayGPAs() {
    if (WGPAValue === UWGPAValue) {
      const GP = (WGPAValue === 'NaN') ? 'no classes added!' : WGPAValue
      return <h1 className='test textColor'>Your GPA is: {GP}</h1>
    }
    return <>
    <h1 className='textColor'>Your weighted GPA is {WGPAValue} and unweighted gpa is {UWGPAValue}</h1>
    </>
  }

  return (
    <div className='center'>
      <h1 style={{textAlign: 'center'}}>School GPA Calculator</h1>
      <br></br>
      <ClassesList classes={classes} removeClass={removeClass} setClasses={setClasses}/>
      <hr></hr>
      {displayGPAs()}
      <br></br>
      <button onClick={addClass} className='add-button'>Add Class</button>
    </div>
  );
}

export default App;
