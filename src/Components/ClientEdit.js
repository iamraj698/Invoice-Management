import React, { useState, useEffect } from "react";
import { useParams ,useNavigate} from "react-router-dom";

function ClientEdit() {
  const { clientId } = useParams();
  const [client, setClient] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    company: "",
  });
const navigate=useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://db-user-auth-default-rtdb.firebaseio.com/client/${clientId}.json`
        );
        const data = await response.json();

        if (data) {
          setClient({
            id: clientId,
            ...data,
          });
        } else {
          console.log("No client data found.");
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      }
    };

    fetchData();
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://db-user-auth-default-rtdb.firebaseio.com/client/${clientId}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(client),
        }
      );

      if (response.ok) {
        alert("Client updated successfully!");
        navigate("/ClientList")
      } else {
        alert("Error updating client!");
      }
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <div className="container-fluide">
        <div className="d-flex p-5 mt-3 flex-column bg-light">
      <h1 className="d-flex justify-content-center">Edit Client</h1>
      <form onSubmit={handleSubmit}>
        <div className="w-100  ">
          <label htmlFor="name" className="form-label mt-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={client.name}
            onChange={handleChange}
            className="form-control"
/>
        </div>
        <div>
          <label htmlFor="email"  className="form-label  mt-3">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={client.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="phone"  className="form-label mt-3">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={client.phone}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="company"  className="form-label mt-3">Company:</label>
         <textarea
            type="text"
            id="company"
            name="company"
            value={client.company}
            onChange={handleChange}
            className="form-control"
          ></textarea>
        </div>
        <div className="d-flex justify-content-center">
        <button type="submit" className="btn btn-primary mt-3">Update Client</button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default ClientEdit;
