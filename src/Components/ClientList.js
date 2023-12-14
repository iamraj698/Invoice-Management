import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 

function ClientList() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://db-user-auth-default-rtdb.firebaseio.com/client/.json"
        );
        const data = await response.json();

        if (data) {
          const clientsArray = Object.keys(data).map((clientId) => ({
            id: clientId,
            ...data[clientId],
          }));

          setClients(clientsArray);
        } else {
          console.log("No client data found.");
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClient = async (clientId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (isConfirmed) {
      try {
        const response = await fetch(
          `https://db-user-auth-default-rtdb.firebaseio.com/client/${clientId}.json`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setClients((prevClients) =>
            prevClients.filter((client) => client.id !== clientId)
          );
          alert("Client deleted successfully!");
        } else {
          alert("Error deleting client!");
        }
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      (client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      true
  );

  return (
    <div className="container-fluide">
      <div className="p-5 mt-3 bg-light">
        <h1>Client Details</h1>
        <input
          type="text"
          placeholder="Search clients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-3"
        />
        <div style={{ maxHeight: "330px", overflowY: "auto" }}>
          <ul>
            {filteredClients.map((client) => (
              <li key={client.id}>
                <strong>ID:</strong> {client.id} <br />
                <strong>Name:</strong> {client.name} <br />
                <strong>Email:</strong> {client.email} <br />
                <strong>Phone:</strong> {client.phone} <br />
                <strong>Company:</strong> {client.company} <br />
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="btn btn-danger"
                  style={{ marginRight: "10px" }}
                >
                  Delete
                </button>
            
                <Link
                  to={`/ClientEdit/${client.id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>
                <hr />
              </li>
            ))}
          </ul>
        </div>
        <div className="d-flex justify-content-center">
         
          <Link to="/ClientProfile" className="btn btn-primary mt-2">
            Add client
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ClientList;
