import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ClientProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { company, name, email, phone } = formData;

    if (company && name.length > 0 && email && phone) {
      const res = await fetch(
        `https://db-user-auth-default-rtdb.firebaseio.com/client/.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company,
            name,
            email,
            phone,
          }),
        }
      );

      if (res.ok) {
        setFormData({
          company: "",
          name: "",
          email: "",
          phone: "",
        });

        alert("Data stored successfully!");
        navigate("/invoice");
      } else {
        alert("Error storing data!");
      }
    } else {
      alert("Fill in all required data, including at least one product.");
    }
  };

  return (
    <>
    <div className="container-fluide">
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column bg-light">
        <h2>Add New Client</h2>
        <div
          className="p-5"
          style={{ maxWidth: "100%", width: "50rem" }}
        >
          <form onSubmit={handleFormSubmit}>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Company: </label>
                <textarea
                  name="company"
                  value={formData.company}
                  onChange={handleFormInputChange}
                  className="form-control"
                ></textarea>
              </div>
              <div className="col">
                <label className="form-label">Name: </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormInputChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Email: </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormInputChange}
                  className="form-control"
                />
              </div>
              <div className="col">
                <label className="form-label">Phone: </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormInputChange}
                  className="form-control"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}

export default ClientProfile;
