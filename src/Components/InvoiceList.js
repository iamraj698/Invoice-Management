import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import "./Invoicelist.css";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing invoices from the database
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          "https://db-user-auth-default-rtdb.firebaseio.com/invoice.json"
        );
        const data = await response.json();

        if (data) {
          // Convert the data object into an array
          const invoicesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          setInvoices(invoicesArray);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  const handleEdit = (invoiceId) => {
    navigate(`/invoices/${invoiceId}/edit`);
  };

  const handleView = (invoiceId) => {
    navigate(`/invoicemanagement/${invoiceId}`);
  };

  const handleDelete = async (invoiceId) => {
    // Ask the user for confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmDelete) {
      return; // If the user cancels the deletion, do nothing
    }

    try {
      const response = await fetch(
        `https://db-user-auth-default-rtdb.firebaseio.com/invoice/${invoiceId}.json`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Update the state to remove the deleted invoice
        setInvoices((prevInvoices) =>
          prevInvoices.filter((invoice) => invoice.id !== invoiceId)
        );
        alert("Invoice deleted successfully!");
      } else {
        alert("Error deleting invoice!");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const isOverdue = (dueDate, paymentStatus) => {
    const currentDate = new Date();
    const dueDateObject = new Date(dueDate);

    // Check if the payment is made on the due date or before
    if (paymentStatus || currentDate <= dueDateObject) {
      return false; // Not overdue
    }

    return true; // Overdue
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoicefor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluide">
      <div className="d-flex justify-content-center p-3 flex-column">
        <h1 className="mt-5">Invoice List</h1>
        <Form.Group controlId="searchBox" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by Invoice For or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="w-100">
            <thead>
              <tr>
                <th>Invoice For</th>
                <th>Name</th>
                <th>Payment Status</th>
                <th>Due Date</th>
                <th>Overdue Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoicefor}</td>
                  <td>{invoice.name}</td>
                  <td
                    style={{ color: invoice.paymentStatus ? "green" : "red" }}
                  >
                    {invoice.paymentStatus ? "Paid" : "Unpaid"}
                  </td>
                  <td>{invoice.duedate}</td>
                  <td
                    style={{
                      color: isOverdue(invoice.duedate, invoice.paymentStatus)
                        ? "red"
                        : "green",
                    }}
                  >
                    {isOverdue(invoice.duedate, invoice.paymentStatus)
                      ? "Overdue"
                      : "Not Overdue"}
                  </td>

                  <td>
                    <Button
                      className="edit"
                      variant="secondary"
                      style={{ marginRight: "8px" }}
                      onClick={() => handleEdit(invoice.id)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      className="view"
                      style={{ marginRight: "8px" }}
                      onClick={() => handleView(invoice.id)}
                    >
                      <FaEye /> View
                    </Button>
                    <Button
                      className="del"
                      variant="warning"
                      style={{ marginRight: "8px" }}
                      onClick={() => handleDelete(invoice.id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InvoiceList;
