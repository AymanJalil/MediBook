import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    contactInfo: '',
  });

  const handleAddDoctor = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDoctor),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDoctors([...doctors, data]);

      setNewDoctor({
        name: '',
        specialization: '',
        contactInfo: '',
      });
    } catch (e) {
      setError(e);
      console.error("Could not add doctor:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/doctors'); // Replace with your backend API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (e) {
        setError(e);
        console.error("Could not fetch doctors:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortOrder('asc');
    }
  };

  const sortedDoctors = [...doctors].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredDoctors = sortedDoctors.filter(doctor => {
    return Object.values(doctor).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading doctors...</p>;
  }


  if (error) {
    return <p>Error fetching doctors: {error.message}</p>;
  }


  return (
    <div className="App">
      <h1>Doctors</h1>

      <div>
        <input
          type="text"
          placeholder="Doctor Name"
          value={newDoctor.name}
          onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Specialization"
          value={newDoctor.specialization}
          onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={newDoctor.contactInfo}
          onChange={e => setNewDoctor({ ...newDoctor, contactInfo: e.target.value })}
        />
        <button onClick={handleAddDoctor}>Add Doctor</button>
      </div>

      <h2>Search Doctors</h2>
      <h2>Search Doctors</h2>
      <input
        type="text"
        placeholder="Search doctors..."
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('specialization')}>Specialization</th>
            <th onClick={() => handleSort('contactInfo')}>Contact Info</th>
          </tr>
        </thead>
        <tbody>
          {currentDoctors.map(doctor => (
            <tr key={doctor.id}>
              <td>{doctor.name}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.contactInfo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
          <button key={pageNumber} onClick={() => paginate(pageNumber)} className={currentPage === pageNumber ? 'active' : ''}>
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
