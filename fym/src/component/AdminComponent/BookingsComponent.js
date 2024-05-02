//bookings component

import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import styles from './PartnerComponent.module.css'; // assuming you have a CSS file for BookingsComponent
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Doughnut } from 'react-chartjs-2';

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

const BookingsComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Booking Status',
        data: [0, 0], // Initial data, will be updated after fetching
        backgroundColor: ['green', 'orange'],
        borderColor: ['white'],
        borderWidth: 2,
        cutout: '80%', // This makes it look more like a ring
      }
    ]
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://projectfym-1.onrender.com/api/admin/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const ordersData = await response.json();
        const completed = ordersData.filter(order => order.status === 'completed').length;
        const pending = ordersData.filter(order => order.status === 'pending').length;

        // Update chart data
        setChartData({
          ...chartData,
          datasets: [{
            ...chartData.datasets[0],
            data: [completed, pending]
          }]
        });

        setOrders(ordersData);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setLoading(false);
        setError(error.message);
      }
    };

    fetchOrders();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Order ID',
        accessor: '_id',
        Filter: TextFilter,
      },
      {
        Header: 'Cid',
        accessor: 'cid',
        Filter: TextFilter,
      },
      
      {
        Header: 'Bid',
        accessor: 'bid',
        Filter: TextFilter,
      },
      {
        Header: 'Start Date',
        accessor: 'startDate',
        Filter: TextFilter,
      },
      {
        Header: 'End Date',
        accessor: 'endDate',
        Filter: TextFilter,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: TextFilter,
      }
      // Add more fields as needed
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: orders }, useFilters, useSortBy);
  console.log(orders,"safa")
  return (
    <div>
      <div style={{ textAlign: 'center' }}><h2 style={{color:'#008080'}}>Bookings</h2></div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <>
        <div style={{ display: 'flex', justifyContent: 'left', marginBottom: 20 ,height:'300px',width:'300px'}}>
        <Doughnut data={chartData} />
      </div>
        <div style={{width:'80vw',overflow:'auto',scrollbarWidth:'none',height:'47vh'}}>
          <div className={styles.tableContainer}>
          <table {...getTableProps()} className={styles.customerTable}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id} className={styles.columnHeader}>
                      <div className={styles.headerContent}>
                        {/* <span {...column.getHeaderProps()}>{column.render('Header')}</span> */}
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
                      <td {...cell.getCellProps()} className={styles.tableCell}>
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
        </>
      )}
    </div>
  );
};

export default BookingsComponent;
