import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button, Container, Title } from 'rbx';

const schedule = require('./cs-courses.json')


const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

// a conflict must involve overlapping days and times
const days = ['M', 'Tu', 'W', 'Th', 'F'];

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;


const coursedays = (course) => {
    let dayStr = course.meets.split(' ')
    dayStr = dayStr[0]
    let dayArr = []
    days.map(d => {
      return dayStr.includes(d) ?
        dayArr.push(d)
        :
        null
    })
    return dayArr
  };

const coursehours = (course) => {
    let hoursStr = course.meets.split(' ')
    hoursStr = hoursStr[1].split('-')
    let hoursArr = []
    hoursStr.map(hr => {
      return hr.length === 4 ?
      hoursArr.push(parseInt(hr.substring(0,1) + hr.substring(2,4), 10))
      :
      hoursArr.push(parseInt(hr.substring(0,2) + hr.substring(3,5), 10))
    })
    return(hoursArr)
  };

const daysOverlap = (course1, course2) => ( 
  days.some(day => coursedays(course1).includes(day) && coursedays(course2).includes(day))
);

const hoursOverlap = (course1, course2) => (
  Math.max(coursehours(course1)[0], coursehours(course2)[0]) < Math.min(coursehours(course1)[1], coursehours(course2)[1])
);

const timeConflict = (course1, course2) => (
  daysOverlap(course1, course2) && hoursOverlap(course1, course2)
);

const courseConflict = (course1, course2) => (
  course1 !== course2
  && getCourseTerm(course1) === getCourseTerm(course2)
  && timeConflict(course1, course2)
);

const hasConflict = (course, selected) => (
  selected.some(selection => courseConflict(course, selection))
);

const Banner = ({ title }) => (
  <h1 className="title">{ title }</h1>
);

const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
  course.id.slice(1, 4)
)

const buttonColor = selected => (
  selected ? `button is-success is-selected` : 'button'
);

const TermSelector = ({ state }) => (
  <div className="field has-addons">
  { Object.values(terms)
      .map(value => 
        <button key={value}
          className={ buttonColor(value === state.term) }
          onClick={ () => state.setTerm(value) }
          >
          { value }
        </button>
      )
  }
  </div>
);
  
const Course = ({ course, state }) => (
  <button className={ buttonColor(state.selected.includes(course)) }
    onClick={ () => state.toggle(course) }
    disabled={ hasConflict(course, state.selected) }
    >
    { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
  </button>
);

const useSelection = () => {
  const [selected, setSelected] = React.useState([]);
  const toggle = (x) => {
    setSelected(selected.includes(x) ? selected.filter(y => y !== x) : [x].concat(selected))
  };
  return [ selected, toggle ];
};

const CourseList = ({ courses }) => {
  const [term, setTerm] = React.useState('Fall');
  const [selected, toggle] = useSelection();
  const termCourses = courses.filter(course => term === getCourseTerm(course));
 
  return (
    <React.Fragment>
      <TermSelector state={ { term, setTerm } } />
      <div className="buttons">
        { termCourses.map(course =>
           <Course key={ course.id } course={ course }
             state={ { selected, toggle } } />) }
      </div>
    </React.Fragment>
  );
};

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: schedule.courses.map(addCourseTimes)
});

const App = () => {

  return (
    <div className="container">
      <Banner title={ schedule.title } />
      <CourseList courses={ schedule.courses } />
    </div>
  );
};



export default App;
