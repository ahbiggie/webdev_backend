import { useState } from "react"
function TodoItems() {
  return (
    <div>
      <ul>
        {items.map((todoItem) => (
          <li>{todoItem}</li>
        ))}
      </ul>
    </div>
  )
}

export default TodoItems
