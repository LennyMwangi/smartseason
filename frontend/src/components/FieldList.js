import { useState } from 'react';
import AddFieldForm from './AddFieldForm';
import UpdateForm from './UpdateForm';
import AssignAgent from './AssignAgent';

function FieldList({ user, fields, refresh, loading }) {
  // 🔍 Search
  const [search, setSearch] = useState('');

  // 🎯 Filter
  const [statusFilter, setStatusFilter] = useState('All');

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 🔎 Filter logic
  const filteredFields = fields.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.crop_type.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || f.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredFields.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFields = filteredFields.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow">

      {/* 🔹 Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search fields..."
          className="border p-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* Filter */}
        <select
          className="border p-2 rounded w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">🟢 Active</option>
          <option value="At Risk">🔴 At Risk</option>
          <option value="Completed">🟡 Completed</option>
        </select>

      </div>

      {/* Admin Add */}
      {user.role === 'admin' && (
        <div className="mb-4">
          <AddFieldForm refresh={refresh} />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-6">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Field</th>
                <th className="p-2">Crop</th>
                <th className="p-2">Stage</th>
                <th className="p-2">Status</th>
                <th className="p-2">Agent</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedFields.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50">

                  <td className="p-2 font-semibold">{f.name}</td>
                  <td className="p-2">{f.crop_type}</td>
                  <td className="p-2">{f.current_stage}</td>

                  <td className="p-2">
                    <StatusBadge status={f.status} />
                  </td>

                  <td className="p-2">
                    {f.agent_name || 'Unassigned'}
                  </td>

                  <td className="p-2 space-y-2">

                    {user.role === 'admin' && (
                      <AssignAgent fieldId={f.id} refresh={refresh} />
                    )}

                    {user.role === 'agent' && (
                      <UpdateForm fieldId={f.id} refresh={refresh} />
                    )}

                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* 📄 Pagination Controls */}
          <div className="flex justify-between items-center mt-4">

            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>

          </div>
        </>
      )}

    </div>
  );
}

// 🎨 Status badge
function StatusBadge({ status }) {
  const styles = {
    Active: 'bg-green-100 text-green-700',
    'At Risk': 'bg-red-100 text-red-700',
    Completed: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${styles[status] || ''}`}>
      {status}
    </span>
  );
}

export default FieldList;