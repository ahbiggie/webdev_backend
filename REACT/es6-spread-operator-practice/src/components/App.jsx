import React, { useState } from "react"

function App() {
  // step 1a: set state for items
  const [itemName, setItemName] = useState("")
  const [addItem, setAddItem] = useState([])
  // step 1b: handle itemname
  function handleItemNameChange(event) {
    setItemName(event.target.value)
  }
  function handleClick() {
    setAddItem(
      (prevItems) => [...prevItems, itemName]
      //adds to a new array
    )
    // clear input
    setItemName("")
  }
  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input
          // step 1c: add handlers and state to input element
          onChange={handleItemNameChange}
          type="text"
          placeholder="Enter Item Name"
          value={itemName}
        />
        <button onClick={handleClick}>
          <span>Add</span>
        </button>
      </div>
      <div>
        <ul>
          {addItem.map((items) => (
            <li>{items}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
