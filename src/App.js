import React, {useState, useEffect} from 'react';
import ClassesList from './ClassesList';
import { v4 as uuidv4 } from 'uuid';
import './main.css';

const localStorageKey = 'OLDGPADATA'
const localStorageWGPA = 'WGPADATA'
const localstorageUWGPA = 'UWGPADATA'

function defaultClasses() {
  return [{id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1, random: ''}, 
          {id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1, random: ''}, 
          {id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1, random: ''}, 
          {id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1, random: ''}]
}

function App() {
  const [classes, setClasses] =  useState(defaultClasses());
  const [WGPAValue, setWGPA] = useState(0);
  const [UWGPAValue, setUWGPA] = useState(0);
  const [cumulative, setCumulative] = useState({gpa: 0.0, creditAmount: 0});
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);




  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem(localStorageKey));
    const oldWGPA = localStorage.getItem(localStorageWGPA);
    const oldUWGPA = localStorage.getItem(localstorageUWGPA);
    setClasses(storage);
    setWGPA(oldWGPA);
    setUWGPA(oldUWGPA);
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, []);

  useEffect(() => {
    console.log('Some data changed...');
    let total_credits = 0;
    let total_grade = (cumulative.gpa * cumulative.creditAmount);
    let UW_grade = 0
    const calc = [...classes].filter(clas => clas.grade !== 'Pass')
    calc.forEach(cls => {
      total_credits += cls.creditAmount
      total_grade += (cls.gradeNum * cls.creditAmount)
      UW_grade += (cls.gradeNum * cls.creditAmount)
      if(cls.grade !== 'Fail' && cls.grade !== 'F') {
        if(cls.type === "IB/AP/DE") {
          total_grade += 1;
        } else if (cls.type === "Honors (HN)") {
          total_grade += .5
        }
      }
    })

    updateWGPA((total_grade/(total_credits + cumulative.creditAmount)))
    updateUWGPA((UW_grade/total_credits))
    localStorage.setItem(localStorageKey, JSON.stringify(classes));
  }, [classes, cumulative])

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

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  function addClass() {
    setClasses((prevClasses) => {
      console.log('added a class...')
      return [...prevClasses, {id: uuidv4(), name: '', grade: 'A', gradeNum: 4.0, type: 'Regular', creditAmount: 1, random: ''}]
    })
  }

  function removeClass(id) {
    console.log('Removed a class...')
    const newClasses = classes.filter(class_ => class_.id !== id)
    setClasses(newClasses)
  }

  function handleCumulative() {
    let currGPA = document.getElementById('CurrGPA').value;
    let currCredits = document.getElementById('CurrCredits').value;
    if(currGPA === '' || currCredits === '') return setCumulative({gpa: 0.0, creditAmount: 0})
    if(!(/^[0-9]*$/.test(currCredits)) || currCredits === '') return;
    if(!(/^[+-]?\d+(\.\d+)?$/.test(currGPA)) || currGPA === '') return;
    currGPA = Number(currGPA);
    currCredits = Number(currCredits)
    currGPA = (currGPA <= 5) ? currGPA : 5
    currGPA = (currGPA >= 0) ? currGPA : 0
    setCumulative({gpa: currGPA, creditAmount: currCredits})
  }

  function displayGPAs() {
    if (WGPAValue === UWGPAValue || UWGPAValue === 'NaN') {
      const GP = (WGPAValue === 'NaN') ? 'no classes added!' : WGPAValue
      return <>
              <h1 className='cool-h1'>GPA: {GP}</h1>
            </>
    }
    return <>
              <h1 className='cool-h1'>Weighted GPA: {WGPAValue}</h1>
              <h1 className='cool-h1'>Unweighted GPA: {UWGPAValue}</h1>
          </>
  }

  return (
    <div>
      <div className='left-div' style={{height: height*.5}}>
        <h1 className='cool-h1'>Cumulative Stats</h1>
        <br></br>
        <input type="text" name="GPA" id="CurrGPA" placeholder='Current GPA (Weighted)' onInput={handleCumulative} maxLength="5"></input>
        <input type="text" name="GPA" id="CurrCredits" placeholder='Credit Amount' onInput={handleCumulative} maxLength="2"></input>
      </div>
    
      <div className='center' id='center-div' style={{height: classes.length*140+200 > height*.5 ? classes.length*140+200 : height*.5}}>
        <h1 className='cool-h1'>School GPA Calculator</h1>
        <br></br>
        <ClassesList classes={classes} removeClass={removeClass} setClasses={setClasses}/>
        <br></br>
      </div>
    
      <div className='right-div' style={{height: height*.5}}>
        {displayGPAs()}
        <button onClick={addClass} className='add-button' style={{width: width*.25 - 4, right: 1, top: height*.462}}>Add Class</button>
      </div>
    </div>
  );
}

export default App;
