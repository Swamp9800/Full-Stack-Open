const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) => {
  const value = parts.reduce((acc, part) => acc + part.exercises, 0);
  return (
    <p><strong>total of {value} exercises</strong></p>
  )
}

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises}
  </p>


const Content = ({ parts }) => {
  return (<>
    {parts.map(part => 
      <Part key={part.id} part={part}/>
    )}
    <Total parts={parts}/>
    </>
  )
}

const Course = (props) => {
  const course = props.course
  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
    </div>
  )
}

export default Course