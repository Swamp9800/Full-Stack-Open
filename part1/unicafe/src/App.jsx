import { useState } from 'react'

const Header = (props) => <h1>{props.text}</h1>

const StatisticLine = (props) => (
  <tbody>
    <tr>
      <td>{props.text}</td>
      <td>{props.count}{props.addon}</td>
    </tr>
  </tbody>
)

const Body = (props) => {
  if ((props.good + props.neutral + props.bad) === 0) {
    return <p>No feedback given</p>
  }
  return (
    <div>
      <table>
        <StatisticLine text="good" count={props.good} />
        <StatisticLine text="neutral" count={props.neutral} />
        <StatisticLine text="bad" count={props.bad} />
        <StatisticLine text="average" count={(props.good*1 + props.bad*-1)/(props.good + props.neutral + props.bad)} />
        <StatisticLine text="positive" count={props.good / (props.good + props.neutral + props.bad)*100} addon="%"/>
      </table>
    </div>
  )
}

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>
  


const App = () => {
  // save clicks of each button to its own state
  const header = ["give feedback","statistics"]
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text={header[0]}/>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text={header[1]}/>
      <Body good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App