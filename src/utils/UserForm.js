import React, { useState } from "react";
import { validateForm } from "../utils/formValidator";

const UserForm = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length === 0) {
      alert("Form Valid ✅");
      console.log(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />
      <p style={{color:"red"}}>{errors.name}</p>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <p style={{color:"red"}}>{errors.email}</p>

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <p style={{color:"red"}}>{errors.password}</p>

      <input
        type="text"
        name="mobile"
        placeholder="Mobile"
        onChange={handleChange}
      />
      <p style={{color:"red"}}>{errors.mobile}</p>

      <button type="submit">Submit</button>

    </form>
  );
};

export default UserForm;