import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddOrder = () => {
  const [dataString, setDataString] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Step 1: Split the string into an array
    const dataArray = dataString.split(',');

    // Step 2: Check if the array is complete (divisible by 3)
    if (dataArray.length % 3 !== 0) {
      setError("Invalid data format. Please provide data in chunks of 3 (orderId, videoLink, quantity).");
      return;
    }

    try {
      // Step 3: Send the data to the backend for processing
      const response = await axios.post("http://localhost:5000/api/orders/process", { data: dataArray });

      if (response.data.success) {
        setSuccess("Data processed successfully.");
        setDataString('');
      } else {
        setError("Failed to process data.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-6 col-lg-4 p-3">
          <h3 className="text-center mb-4">Add Order</h3>
          <form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm">
            <div className="form-group mb-3">
              <label htmlFor="dataString">Order Data (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                id="dataString"
                placeholder="Enter orderId, videoLink, quantity"
                value={dataString}
                onChange={(e) => setDataString(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-3">
              Process Data
            </button>

            {error && <p className="text-danger text-center mt-2">{error}</p>}
            {success && <p className="text-success text-center mt-2">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;