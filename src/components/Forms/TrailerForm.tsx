import React, { useState, ChangeEvent } from 'react';
import {Trailer } from "../Types/types";

// Define the prop types for TrailerForm
interface TrailerFormProps {
  onClose: () => void;
}


const TrailerForm: React.FC<TrailerFormProps> = ({ onClose }) => {
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [formData, setFormData] = useState<Trailer>({ _id: '', trailerNumber: '', vin: '', year: 0, make: '', model: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setTrailers((prevTrailers) => [...prevTrailers, formData]);
    setFormData({ _id: '', trailerNumber: '', vin: '', year: 0, make: '', model: '' });
    onClose(); // Call the onClose prop when the form is submitted
  };

  const handleCancel = () => {
    setFormData({ _id: '', trailerNumber: '', vin: '', year: 0, make: '', model: '' });
    onClose(); // Call the onClose prop when the form is canceled
  };

  return (
    <div>
      <label>Name:</label>
      <input type="text" name="trailerNumber" value={formData.trailerNumber} onChange={handleChange} />
      <label>VIN#:</label>
      <input type="text" name="vin" value={formData.vin} onChange={handleChange} />
      <label>Year:</label>
      <input type="number" name="year" value={formData.year} onChange={handleChange} />
      <label>Make:</label>
      <input type="text" name="make" value={formData.make} onChange={handleChange} />
      <label>Model:</label>
      <input type="text" name="model" value={formData.model} onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default TrailerForm;