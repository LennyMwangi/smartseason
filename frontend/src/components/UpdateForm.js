import { useState } from 'react';
import API from '../api/axios';

function UpdateForm({ fieldId, refresh }) {
  const [stage, setStage] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    try {
      await API.post(`/updates/${fieldId}`, {
        stage,
        notes
      });

      alert('Update added');

      setStage('');
      setNotes('');

      refresh();

    } catch (err) {
      console.error(err);
      alert('Failed to update');
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <select onChange={(e) => setStage(e.target.value)}>
        <option value="">Select stage</option>
        <option value="Planted">Planted</option>
        <option value="Growing">Growing</option>
        <option value="Ready">Ready</option>
        <option value="Harvested">Harvested</option>
      </select>

      <br /><br />

      <input
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Update Field</button>
    </div>
  );
}

export default UpdateForm;