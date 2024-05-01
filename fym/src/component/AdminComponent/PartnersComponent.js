// Import React, useState, useEffect, useMemo
import React, { useState, useEffect, useMemo } from 'react';

// Import useTable, useSortBy, useFilters from react-table
import { useTable, useSortBy, useFilters } from 'react-table';

// Import the CSS module
import styles from './PartnerComponent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BiCheckSquare } from "react-icons/bi";
import Chart from 'chart.js/auto';

const TextFilter = ({ column }) => { 
  const { filterValue, setFilter } = column;

  // Apply inline CSS to hide the filter for the 'status' column
  const filterStyle = column.accessor === 'status' ? { display: 'none' } : {};
  const searchIcon = <FontAwesomeIcon icon={faSearch} />;

return (
  <div className={styles.filterContainer} style={filterStyle} >
    <span style={{color:'lightblue'}}><FontAwesomeIcon icon={faSearch} /></span>
    <input style={{color:'lightblue'}}
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value)} 
      placeholder={`Search ${column.Header}`}
      className={styles.filterInput}
    />
    <div>
      <span {...column.getSortByToggleProps()} className={styles.sortIcon} style={{color:'lightblue'}}>
        &#9650;
      </span>
      <span {...column.getSortByToggleProps()} className={styles.sortIcon} style={{color:'lightblue'}}>
        &#9660;
      </span>
    </div>
  </div>
);
};

const TextFilter1 = ({ column }) => {
  const { filterValue, setFilter } = column;

  // Apply inline CSS to hide the filter for the 'status' column
  const filterStyle = column.accessor === 'status' ? { display: 'none' } : {};

  return (
    <div>
      
    </div>
  );
};


// Function component to render the PartnersComponent
const PartnersComponent = () => {
  const [businessData, setBusinessData] = useState([]);

  // State to store the count of approved businesses
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => {
    // Calculate the count of approved businesses
    const count = businessData.filter(business => business.status === 'approved').length;

    // Update state with the calculated count
    setApprovedCount(count);
  }, [businessData]);

  // Render the pie chart for approved count vs total count
useEffect(() => {
  const ctx = document.getElementById('approvedCountChart');

  // Ensure the context is available and counts are valid
  if (ctx && approvedCount !== undefined && businessData.length !== undefined) {
    // Check if there's an existing chart instance and destroy it
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    // Create a new chart instance
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Pending'],
        datasets: [{
          data: [approvedCount, businessData.length - approvedCount],
          backgroundColor: ['#00FF4B', '#FF00B4'],
        }],
      },
      options: {
        cutout: '70%',
        cutoutPercentage: 80,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      },
    });
  }
}, [approvedCount, businessData]);

  const [approvedPercentage, setApprovedPercentage] = useState(0);

  useEffect(() => {
    // Calculate the percentage of approved status
    const approvedCount = businessData.filter(business => business.status === 'approved').length;
    const totalCount = businessData.length;
    const percentage = (approvedCount / totalCount) * 100;

    // Update state with the calculated percentage
    setApprovedPercentage(percentage);
  }, [businessData]);

  // Render the pie chart
useEffect(() => {
  const ctx = document.getElementById('pieChart');

  // Ensure the context is available and percentage is valid
  if (ctx && approvedPercentage !== undefined) {
    // Check if there's an existing chart instance and destroy it
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    // Create a new chart instance
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Rejected'],
        datasets: [{
          data: [approvedPercentage, 100 - approvedPercentage],
          backgroundColor: ['#36A2EB', '#FF6384'],
        }],
      },
      options: {
        cutout: '70%',
        cutoutPercentage: 80,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      },
    });
  }
}, [approvedPercentage]);



  useEffect(() => {
    // Fetch business data from the database
    const fetchBusinessData = async () => {
      try {
        const response = await fetch('/api/admin/businessdetails'); // Replace 'your-backend-api-endpoint-here' with your actual backend API endpoint
        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setBusinessData(data);
        } else {
          console.error('Data received from backend is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
      }
    };

    fetchBusinessData();
  }, []);

  // Function to update status
  const updateStatus = async (id, status) => {
    try {
      // Send a PATCH request to your backend API to update the status
      const response = await fetch(`/api/admin/business/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }), // Assuming your backend expects the status to be passed in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update the status in the local businessData state
      setBusinessData((prevData) =>
        prevData.map((business) =>
          business._id === id ? { ...business, status } : business
        )
      );

      console.log(`Status updated successfully for business with ID: ${id}`);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Define columns using useMemo hook
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: '_id',
        Filter: TextFilter,
      },
      {
        Header: 'Email',
        accessor: 'email',
        Filter: TextFilter,
      },
      {
        Header: 'Username',
        accessor: 'username',
        Filter: TextFilter,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: TextFilter1,
        Cell: ({ row }) => (
          <>
            <span>{row.values.status}</span>
            <button className={styles.status}onClick={() => updateStatus(row.original._id, 'approved')}>
              <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
            </button>
            <button className={styles.status}onClick={() => updateStatus(row.original._id, 'rejected')}>
              <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
            </button>
          </>
        ),
      },
    ],
    []
  );

  // Use useTable hook to get table properties
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: businessData }, useFilters, useSortBy);

  // Render the table
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center' }}><h2 style={{color:'#088F8F'}}>Business Details</h2></div>
      <div style={{height:"84vh",overflow:'auto'}}>
      <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
      <div style={{ textAlign: 'center' ,display:'flex',flexDirection:'column'}}>
        <h3>Percentage</h3>
        <canvas id="pieChart" width="300px" height="300px"></canvas>
      </div>
      <div style={{ textAlign: 'center',display:'flex',flexDirection:'column' }}>
      <h3>Count</h3>
          <canvas id="approvedCountChart" width="300px" height="300px"></canvas>
        </div>
      </div>
      <div className={styles.partnerContainer}>
        <div className={styles.tableContainer}>
          <table {...getTableProps()} className={styles.partnerTable}>
            <thead className={styles.headerGroup}>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id} className={styles.columnHeader}>
                      <div className={styles.headerContent}>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={rowIndex} className={styles.tablerow}>
                    {row.cells.map((cell, cellIndex) => (
                      <td
                        {...cell.getCellProps()}
                        key={cellIndex}
                        className={styles.tableCell}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

// Export the PartnersComponent
export default PartnersComponent;
