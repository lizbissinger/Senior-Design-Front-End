import React, { useState, useEffect } from "react";
import { TrailerDetail } from "../Types/types";
import Button from '@mui/material/Button';

interface TrailerFormProps {
  onAddTrailer: (trailer: TrailerDetail) => void;
  onEditTrailer?: (trailer: TrailerDetail) => void;
  editingTrailer?: TrailerDetail | null;
}

const TrailerForm: React.FC<TrailerFormProps> = ({
  onAddTrailer,
  onEditTrailer,
  editingTrailer,
}) => {
  const [newTrailer, setNewTrailer] = useState<TrailerDetail>({
    _id: "",
    trailerNumber: "",
    make: "",
    model: "",
    year: 0,
    vin: "",
  });

  useEffect(() => {
    if (editingTrailer) {
      setNewTrailer(editingTrailer);
    }
  }, [editingTrailer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTrailer((prevTrailer) => ({ ...prevTrailer, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrailer) {
      onEditTrailer && onEditTrailer(newTrailer);
    } else {
      onAddTrailer(newTrailer);
    }

    setNewTrailer({
      _id: "",
      trailerNumber: "",
      make: "",
      model: "",
      year: 0,
      vin: "",
    });
  };

  return (
    <form className="trailer-form" onSubmit={handleSubmit}>
      <div className="field">
      <input
        type="text"
        name="trailerNumber"
        placeholder="Trailer Number"
        value={newTrailer.trailerNumber}
        onChange={handleInputChange}
        required
      />
      </div>
      <div className="field">
      <input
        type="text"
        name="make"
        placeholder="Make"
        value={newTrailer.make}
        onChange={handleInputChange}
        required
      />
      </div>
      <div className="field">
      <input
        type="text"
        name="model"
        placeholder="Model"
        value={newTrailer.model}
        onChange={handleInputChange}
        required
      />
      </div>
      <div className="field">
      <input
        type="number"
        name="year"
        placeholder="Year"
        value={newTrailer.year}
        onChange={handleInputChange}
        required
      />
      </div>
      <div className="field">
      <input
        type="text"
        name="vin"
        placeholder="VIN"
        value={newTrailer.vin}
        onChange={handleInputChange}
        required
      />
      </div>
      <Button className= "mt-3" type="submit">
        {editingTrailer ? "Update Trailer" : "Add Trailer"}
      </Button>
    </form>
  );
};

export default TrailerForm;
