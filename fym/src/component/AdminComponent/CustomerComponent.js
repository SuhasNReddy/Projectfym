import React, { useMemo, useEffect, useState } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import styles from './PartnerComponent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


const TextFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <div className={styles.filterContainer}>
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
// ... (existing imports)

const CustomerComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Users by Booking Count',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://projectfym-1.onrender.com/api/admin/customerdetails');
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const jsonData = await response.json();
        console.log(jsonData, "customerco");
  
        const bookingCounts = {
          '0': 0,
          '1-4': 0,
          '5-8': 0,
          '9-12': 0,
          '13-16': 0
        };
  
        jsonData.forEach(item => {
          const bookings = item.numBookings;
          if (bookings === 0) bookingCounts['0']++;
          else if (bookings <= 4) bookingCounts['1-4']++;
          else if (bookings <= 8) bookingCounts['5-8']++;
          else if (bookings <= 12) bookingCounts['9-12']++;
          else if (bookings <= 16) bookingCounts['13-16']++;
        });
  
        setData(jsonData);
        setChartData({
          labels: Object.keys(bookingCounts),
          datasets: [{
            label: 'Number of Users by Booking Count',
            data: Object.values(bookingCounts),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }]
        });
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

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
        Header: 'Name',
        accessor: 'name',
        Filter: TextFilter,
      },
      // {
      //   Header: 'Password',
      //   accessor: 'password', // Note: Consider not displaying sensitive data like password
      //   Filter: TextFilter,
      // },
      {
        Header: 'Num of Bookings',
        accessor: 'numBookings',
        Filter: TextFilter,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useFilters, useSortBy);

  return (
    <div>
      <div style={{ textAlign: 'center' }}><h2 style={{color:'#008080'}}>Customer Details</h2></div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <div style={{display:'flex',flexDirection:'column',height:'86vh',overflowX:'auto',scrollbarWidth:'none'}}>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <div style={{ display: 'flex', justifyContent: 'center',alignItems:'center', marginBottom: 20 ,width:'40vw'}}>
        <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
      </div>
        </div>
        <div style={{height:'40vh',overflowX:'auto',scrollbarWidth:'none'}} className={styles.customerContainer}>
          <div className={styles.tableContainer}>
            <table {...getTableProps()} className={styles.partnerTable}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} style={{marginTop:'10px'}}>
                    {headerGroup.headers.map((column) => (
                      <th key={column.id} className={styles.columnHeader}>
                        <div className={styles.headerContent}>
                          {/* <span {...column.getHeaderProps()}>
                            {column.render('Header')}
                          </span> */}
                          {column.canFilter ? column.render('Filter') : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className={styles.tablerow}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
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
      )}
    </div>
  );
};

export default CustomerComponent;
