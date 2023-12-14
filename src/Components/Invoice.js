import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function Invoice() {
  const [formData, setFormData] = useState({
    invoicefor: "",
    name: "",
    project: "",
    duedate: "",
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([
    { description: "", qty: "", unitprice: "", total: 0 },
  ]);

  const [adjustment, setAdjustment] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch(
        "https://db-user-auth-default-rtdb.firebaseio.com/client/.json"
      );
      const data = await response.json();

      if (data) {
        setClients(Object.values(data));
      }
    };

    fetchClients();
  }, []);

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProductInputChange = (e, index) => {
    const { name, value } = e.target;
    const newProducts = [...products];
    newProducts[index][name] = value;
    newProducts[index].total = calculateTotal(newProducts[index]);
    setProducts(newProducts);
  };

  const calculateTotal = (product) => {
    const qty = parseFloat(product.qty) || 0;
    const unitprice = parseFloat(product.unitprice) || 0;
    return qty * unitprice;
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { description: "", qty: "", unitprice: "", total: 0 },
    ]);
  };

  const calculateGrandTotal = () => {
    const productsTotal = products.reduce(
      (total, product) => total + product.total,
      0
    );
    return productsTotal - adjustment;
  };

  const calculateOverdue = () => {
    const dueDate = new Date(formData.duedate);
    const currentDate = new Date();

    return currentDate > dueDate && !paymentStatus;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { invoicefor, name, project, duedate } = formData;

    const hasIncompleteProduct = products.some(
      (product) =>
        product.description.trim() === "" ||
        product.qty.trim() === "" ||
        product.unitprice.trim() === ""
    );
    if (invoicefor && name && project && duedate && !hasIncompleteProduct) {
      const productsTotal = products.reduce(
        (total, product) => total + product.total,
        0
      );

      const invoiceId = uuidv4();
      const submittedDate = new Date().toISOString();

      const res = await fetch(
        `https://db-user-auth-default-rtdb.firebaseio.com/invoice/.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceId,
            invoicefor,
            name,
            project,
            duedate,
            products,
            grandTotal: calculateGrandTotal(),
            submittedDate,
            adjustment,
            finalTotal: productsTotal,
            paymentStatus,
          }),
        }
      );

      if (res.ok) {
        setFormData({
          invoicefor: "",
          name: "",
          project: "",
          duedate: "",
        });

        setProducts([{ description: "", qty: "", unitprice: "", total: 0 }]);
        setAdjustment(0);
        setPaymentStatus(false);

        // Fetch the latest invoice ID
        const latestInvoiceResponse = await fetch(
          'https://db-user-auth-default-rtdb.firebaseio.com/invoice.json?orderBy="$key"&limitToLast=1'
        );
        const latestInvoiceData = await latestInvoiceResponse.json();

        if (latestInvoiceData) {
          const latestInvoiceKey = Object.keys(latestInvoiceData)[0];
          navigate(`/invoicemanagement/${latestInvoiceKey}`);
        } else {
          console.log("No latest invoice found");
        }

        alert("Data stored successfully!");
      } else {
        alert("Error storing data!");
      }
    } else {
      alert("Fill in all required data, including at least one product.");
    }
  };

  const handleCompanyChange = (selectedCompany) => {
    const selectedClient = clients.find(
      (client) => client.company === selectedCompany
    );
    if (selectedClient) {
      setFormData({
        ...formData,
        invoicefor: selectedClient.company,
        name: selectedClient.name,
      });
    }
  };

  return (
    <div className="container-fluide d-flex align-items-center justify-content-center bg-light">
      <div className="p-5 w-100 mt-4">
        <form onSubmit={handleFormSubmit}>
        <h2 className="d-flex justify-content-center mb-3">New Invoice</h2>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Invoice For: </label>
              <select
                name="invoicefor"
                value={formData.invoicefor}
                className="form-control"
                onChange={(e) => handleCompanyChange(e.target.value)}
              >
                <option value="" disabled>
                  Select Company
                </option>
                {clients.map((client) => (
                  <option key={client.company} value={client.company}>
                    {client.company}
                  </option>
                ))}
              </select>
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
              <label className="form-label">Project: </label>
              <input
                type="text"
                name="project"
                value={formData.project}
                onChange={handleFormInputChange}
                className="form-control"
              />
            </div>

            <div className="col">
              <label className="form-label">Due Date: </label>
              <input
                type="date"
                name="duedate"
                value={formData.duedate}
                onChange={handleFormInputChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Description</label>
            </div>
            <div className="col">
              <label className="form-label">Qty</label>
            </div>
            <div className="col">
              <label className="form-label">Unit Price</label>
            </div>
            <div className="col">
              <label className="form-label">Total</label>
            </div>
          </div>

          {products.map((product, index) => (
            <div className="row mb-3" key={index}>
              <div className="col">
                <input
                  type="text"
                  name="description"
                  value={product.description}
                  onChange={(e) => handleProductInputChange(e, index)}
                  className="form-control"
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  name="qty"
                  min="0"
                  value={product.qty}
                  onChange={(e) => handleProductInputChange(e, index)}
                  className="form-control"
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  name="unitprice"
                  min="0"
                  value={product.unitprice}
                  onChange={(e) => handleProductInputChange(e, index)}
                  className="form-control"
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  name="total"
                  value={product.total.toFixed(2)}
                  readOnly
                  className="form-control"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddProduct}
          >
            Add Product
          </button>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Adjustment:</label>
            </div>
            <div className="col">
              <input
                type="number"
                name="adjustment"
                value={adjustment}
                onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
                className="form-control"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Grand Total:</label>
            </div>
            <div className="col">
              <input
                type="text"
                name="grandTotal"
                value={calculateGrandTotal().toFixed(2)}
                readOnly
                className="form-control"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Payment Status:</label>
            </div>
            <div className="col">
              <input
                type="checkbox"
                name="paymentStatus"
                checked={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.checked)}
              />
              <label className="form-check-label"> Mark as Paid</label>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Overdue:</label>
            </div>
            <div className="col">
              <span
                className={calculateOverdue() ? "text-danger" : "text-success"}
              >
                {calculateOverdue() ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Invoice;
