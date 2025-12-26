import React from "react"
import Input from "./Input"

// props is used to access the file in the App.js Component.
function Form(props) {
  return (
    <form className="form">
      <Input type="text" placeholder="Username" />
      <Input type="password" placeholder="Password" />
      {/* if User is not Registered confirm password */}
      {!props.isRegistered && (
        <Input type="password" placeholder="Confirm Password" />
      )}
      {/* if User is Registered Login */}
      <button type="submit">{props.isRegistered ? "Login" : "Register"}</button>
    </form>
  )
}

export default Form
