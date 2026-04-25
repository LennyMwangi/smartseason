import { useState } from 'react';
import API from '../api/axios';

function AddFieldForm({ refresh }) {
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState('');
  const [plantingDate, setPlantingDate] = useState('');

  const handleSubmit = async () => {
    try {
      await API.post('/fields', {
        name,
        crop_type: cropType,
        planting_date: plantingDate
      });

      alert('Field created');

      setName('');
      setCropType('');
      setPlantingDate('');

      refresh(); // reload fields

    } catch (err) {
      console.error(err);
      alert('Failed to create field');
    }
  };

  return (
    <div style={{ border: '1px solid black', padding: 10, marginBottom: 20 }}>
      <h3>Add Field</h3>

      <input
        placeholder="Field name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Crop type"
        value={cropType}
        onChange={(e) => setCropType(e.target.value)}
      /><br /><br />

      <input
        type="date"
        value={plantingDate}
        onChange={(e) => setPlantingDate(e.target.value)}
      /><br /><br />

      <button onClick={handleSubmit}>Create Field</button>
    </div>
  );
}

export default AddFieldForm;