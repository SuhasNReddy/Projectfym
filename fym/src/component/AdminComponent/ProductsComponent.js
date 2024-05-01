import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import styles from './PartnerComponent.module.css'; // Assuming you have a CSS file for ProductsComponent
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch } from '@fortawesome/free-solid-svg-icons';

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

const ProductsComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { 
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/allproductdetails');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await response.json();
        setProducts(productsData);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        setLoading(false);
        setError(error.message || 'An error occurred while fetching products');
      }
    };

    fetchProducts();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: '_id',
        accessor: '_id',
        Filter: TextFilter,
      },
      {
        Header: 'Product Name',
        accessor: 'productName',
        Filter: TextFilter,
      },
      {
        Header: 'Business ID',
        accessor: 'businessId',
        Filter: TextFilter,
      },
      {
        Header: 'Product Budget',
        accessor: 'productBudget',
        Filter: TextFilter,
      },
      {
        Header: 'Product Discount',
        accessor: 'productDiscount',
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
  } = useTable({ columns, data: products }, useFilters, useSortBy);

  return (
    <div>
      <div style={{ textAlign: 'center' }}><h2 style={{color:'#008080'}}>Products</h2></div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <div style={{ width: '80vw', overflow: 'auto', scrollbarWidth: 'none',height:'87vh' }}>
          <div className={styles.tableContainer}>
            <table {...getTableProps()} className={styles.partnerTable} >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} style={{marginTop:'10px'}}>
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
      )}
    </div>
  );
};

export default ProductsComponent;
