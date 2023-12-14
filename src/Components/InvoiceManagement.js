import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./Invoice.css";
import html2pdf from "html2pdf.js";

function InvoiceManagement() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Function to get the last displayed invoice ID from local storage
  const getLastInvoiceId = () => {
    return localStorage.getItem("lastDisplayedInvoiceId");
  };

  // Function to set the last displayed invoice ID in local storage
  const setLastInvoiceId = (invoiceId) => {
    localStorage.setItem("lastDisplayedInvoiceId", invoiceId);
  };

  const [formData, setFormData] = useState({
    invoicefor: "",
    name: "",
    project: "",
    duedate: "",
  });

  const [products, setProducts] = useState([
    { description: "", qty: "", unitprice: "", total: 0 },
  ]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Fetch existing invoice details
    const fetchInvoice = async () => {
      try {
        const response = await fetch(
          `https://db-user-auth-default-rtdb.firebaseio.com/invoice/${id}.json`
        );
        const data = await response.json();

        if (data) {
          setFormData(data);
          setProducts(data.products || []);

          // Set the last displayed invoice ID in local storage
          setLastInvoiceId(id);
        }
      } catch (error) {
        console.error("Error fetching invoice details:", error);
      }
    };

    fetchInvoice();
  }, [id]);

  const addressLines = `123 Your Street
  Your City, ST 12345
  (123) 456-7890.`;

  const componentRef = useRef();

  const downloadPDF = () => {
    const input = componentRef.current;

    html2pdf(input, {
      margin: 10,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });

    setShowPreview(true);
  };

  // const handleClosePreview = () => {
  //   setShowPreview(false);
  // };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const lastInvoiceId = getLastInvoiceId();

      if (lastInvoiceId) {
        navigate(`/invoicemanagement/${lastInvoiceId}`);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <>
      <div className="container-fluide">
      <div style={{ maxHeight: "600px", overflowY: "auto" }}>
        <div ref={componentRef} className="invoice " style={{marginTop:"4rem"}}>
          <p className="my-cmp mb-2">Your Company</p>
          <pre className="text-black">{addressLines}</pre>
          <h2 className="head-text">Invoice</h2>
          <h6 className="sub-text mb-4">
            Submitted on{" "}
            {formData.submittedDate
              ? formData.submittedDate.substring(0, 10)
              : "N/A"}
          </h6>
          <div>
          <table className="text-black">
              <tr>
                <th style={{ paddingRight: "5rem" }}>Invoice for</th>
                <th style={{ paddingRight: "5rem" }}>Payable to</th>
                <th style={{ paddingRight: "5rem" }}>Invoice #</th>
              </tr>
              <tr style={{ color: "grey" }}>
                <td rowSpan="3" style={{ maxWidth: "30%" }}>
                  <pre>{formData.invoicefor}</pre>
                </td>
                <td>{formData.name}</td>
                <td>{formData.invoiceId}</td>
              </tr>
              <tr className="mt-5">
                <th>Project</th>
                <th>Due Date</th>
              </tr>
              <tr style={{ color: "grey" }}>
                <td>{formData.project}</td>
                <td>{formData.duedate}</td>
              </tr>
              <tr>
                <td colSpan="5">
                  <hr />
                </td>
              </tr>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.description}</td>
                  <td>{product.qty}</td>
                  <td>{product.unitprice}</td>
                  <td>{product.total}</td>
                </tr>
              ))}

              <tr>
                <td colSpan="5">
                  <hr />
                </td>
              </tr>
              <tr>
                <td colSpan="2">Notes:</td>
                <td>Subtotal</td>
                <td>{formData.finalTotal}</td>
              </tr>
              <tr>
                {" "}
                <td colSpan="2"></td>
                <td>Adjustments</td>
                <td>{formData.adjustment}</td>
              </tr>
              <tr>
                <td>
                  <h2>Total</h2>
                </td>
                <td></td>
                <td></td>
                <td className="">
                  <h2>{formData.grandTotal}</h2>
                </td>
              </tr>
            </table>
            </div>
          </div>
      
        <Button className="print m-3" onClick={downloadPDF}>
          Download PDF
        </Button>  </div>
        {/* Preview Modal
        <Modal show={showPreview} onHide={handleClosePreview} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>PDF Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
       
            <iframe
              title="PDF Preview"
              src={`data:application/pdf;base64,${html2pdf.inputPdf}` || ""}
              width="100%"
              height="500px"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePreview}>
              Close
            </Button>
          </Modal.Footer>
        </Modal> */}
      </div>
    </>
  );
}

export default InvoiceManagement;