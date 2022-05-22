import React from 'react'
import './main.css'

export default function SingleClass({class_, removeClass, setClasses}) {

    function handleRemoveClick() {
      removeClass(class_.id)
    }

    function rerender(key, value) {
      setClasses((prevClasses) => {
        const newData = [...prevClasses]
        newData.find(cls => cls.id === class_.id)[`${key}`] = value
        return newData
      })

    }

    function handleClassNameChange(event) {
      rerender('name', event.target.value)
    }

    function handleGradeInputChange(event) {
      const [numGrade, grade] = event.target.value.split('|')
      setClasses((prevClasses) => {
        const newData = [...prevClasses]
        newData.find(cls => cls.id === class_.id)['grade'] = grade;
        newData.find(cls => cls.id === class_.id)['gradeNum'] = Number(numGrade);
        return newData
      })
    }

    function handleCreditAmountChange(event) {
      const credit = event.target.value;
      if(!(/^[0-9]*$/.test(credit)) || credit === '') return;
      rerender('creditAmount', Number(credit))
    }

    function handleClassChange(event){
      rerender('type', event.target.value)
    }

    function getRandomClass() {
      const choices = ['History', 'Math', 'Chemistry', 'Physics', 'Computer Scince', 'Advisory', 'AP Physics', 'AP Computer Scinece', 'AP History', 'AP Chemistry', 'IB Computer Science', 'IB Physics', 'IB Chemistry', 'IB History']
      class_.random = choices[Math.floor(Math.random()*choices.length)];
      return class_.random
    }

  return (
    <div>
        <label htmlFor="ClassName">Class Name: </label>
        <input type="text" name="GPA" id="ClassName" placeholder={(class_.random === '') ? getRandomClass() : class_.random} onInput={handleClassNameChange} ></input>
    
        <br className='small-br'></br>
        <label htmlFor="LetterGrade">Class Grade: </label>
        <select id="LetterGrade" onChange={handleGradeInputChange}>
          <option value="0.0|Pass" selected disabled hidden>{class_.grade}</option>
          <option value="4.0|A">A</option>
          <option value="3.7|A-">A-</option>
          <option value="3.3|B+">B+</option>
          <option value="3.0|B">B</option>
          <option value="2.7|B-">B-</option>
          <option value="2.3|C+">C+</option>
          <option value="2.0|C">C</option>
          <option value="1.7|C-">C-</option>
          <option value="1.3|D+">D+</option>
          <option value="1.0|D">D</option>
          <option value="0.0|F">F</option>
          <option value="0.0|Pass">Pass</option>
          <option value="0.0|Fail">Fail</option>
        </select>

        <br className='small-br'></br>
        <label htmlFor="CreditAmount" className='single-label'>Credit Amount: </label>
        <input type="text" name="Credit Amount" id="CreditAmount" maxLength="2" defaultValue={class_.creditAmount} style={{width: 14}} onInput={handleCreditAmountChange} placeholder="1" className='single-input'></input>
    
        <br className='small-br'></br>
        <label  htmlFor="ClassType">Class Type: </label>
        <select id="ClassType" onChange={handleClassChange}>
          <option value="Regular" selected disabled hidden>{class_.type}</option>
          <option value="Regular">Regular</option>
          <option value="Honors (HN)">Honors (HN)</option>
          <option value="IB/AP/DE">IB/AP/DE</option>
    
        </select>
        <button id="Delete" onClick={handleRemoveClick} className='delete-button'>Delete Class</button>
    </div>
  )
}
