import { useEffect, useState } from 'react';
import API from '../api/axios';

function AssignAgent({ fieldId, refresh }) {
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await API.get('/auth/users'); // we'll add this endpoint
      const onlyAgents = res.data.filter(u => u.role === 'agent');
      setAgents(onlyAgents);
    } catch (err) {
      console.error(err);
    }
  };

  const assignAgent = async () => {
    try {
      await API.put(`/fields/${fieldId}/assign`, {
        agent_id: selected
      });

      alert('Agent assigned');
      refresh();

    } catch (err) {
      console.error(err);
      alert('Assignment failed');
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <select onChange={(e) => setSelected(e.target.value)}>
        <option value="">Select agent</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <button onClick={assignAgent}>Assign</button>
    </div>
  );
}

export default AssignAgent;