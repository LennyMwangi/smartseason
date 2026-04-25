import { useEffect, useState } from 'react';
import API from '../api/axios';
import FieldList from '../components/FieldList';

// 📊 Charts
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

function Dashboard({ user }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await API.get('/fields');
      setFields(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  // 📊 Stats
  const total = fields.length;
  const active = fields.filter(f => f.status === 'Active').length;
  const risk = fields.filter(f => f.status === 'At Risk').length;
  const completed = fields.filter(f => f.status === 'Completed').length;

  // 🥧 Pie Data
  const pieData = [
    { name: 'Active', value: active },
    { name: 'At Risk', value: risk },
    { name: 'Completed', value: completed }
  ];

  const COLORS = ['#22c55e', '#ef4444', '#eab308'];

  // 📊 Bar Data (group by stage)
  const stageMap = {};
  fields.forEach(f => {
    stageMap[f.current_stage] = (stageMap[f.current_stage] || 0) + 1;
  });

  const barData = Object.keys(stageMap).map(stage => ({
    stage,
    count: stageMap[stage]
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard ({user.role})</h2>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Fields" value={total} color="bg-blue-500" />
        <Card title="Active" value={active} color="bg-green-500" />
        <Card title="At Risk" value={risk} color="bg-red-500" />
        <Card title="Completed" value={completed} color="bg-yellow-500" />
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="mb-2 font-semibold">Field Status Distribution</h4>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="mb-2 font-semibold">Fields by Stage</h4>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Fields Table */}
      <FieldList
        user={user}
        fields={fields}
        refresh={fetchFields}
        loading={loading}
      />

    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`p-4 rounded-xl text-white shadow ${color}`}>
      <h4 className="text-sm">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default Dashboard;