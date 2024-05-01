// QueriesDisplay.js
import React, { useState, useEffect } from 'react';
import styles from './QueriesDisplay.module.css';

const QueriesDisplay = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch('/api/admin/queries');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setQueries(data);
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };
  
    fetchQueries();
  }, []);
  

  const onDeleteQuery = async (id) => {
    console.log('inside delete ',id);
    try {
      const response = await fetch(`/api/admin/queries/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Query deleted successfully');
        setQueries((prevQueries) => prevQueries.filter((query) => query._id !== id));
      } else {
        console.error('Failed to delete query');
      }
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };
  
  console.log(queries,"qu");

  return (
    <div className={styles.queriesHeadContainer} style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 style={{color:'#008080'}}>Queries Display</h2>
      <div className={styles.queriesDisplayContainer}>
        {queries.length === 0 ? (
          <div style={{ color: 'green', textAlign: 'center', flexBasis: '100%' }}>No queries to display</div>
        ) : (
          queries.map((query) => (
            <div key={query._id} className={styles.queryItem}>
              <div className={styles.flexContainer}>
              <p style={{ textAlign: 'left' ,marginTop:'10px'}}>
                <strong>Name:</strong> 
              </p>
              <p style={{textAlign:'left',color:'black',marginTop:'10px'}}>
              {query.name}
              </p>
              <p style={{ textAlign: 'left' ,marginTop:'10px'}}>
                <strong>Email:</strong> 
              </p>
              <p style={{textAlign:'left',color:'black',marginTop:'10px'}}>{query.email}</p>
              <p style={{ textAlign: 'left' ,marginTop:'10px'}}>
                <strong>Subject:</strong> 
              </p>
              <p style={{textAlign:'left',color:'black',marginTop:'10px'}}>{query.subject}</p>
              <p style={{ textAlign: 'left',marginTop:'10px' }}>
                <strong>Query:</strong> 
              </p>
              <p style={{textAlign:'left',color:'black',marginTop:'10px'}} className={styles.queries}>{query.queryText}</p>
              </div>
              <div style={{ display:'flex',flexDirection:'row',justifyContent:'space-around',marginTop:'10px'}}>
              <button className={styles.respond} onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + query.email + `&su=${query.subject}`, '_blank')}>Respond</button>
                <button className={styles.delete} onClick={() => onDeleteQuery(query._id)}>Delete</button>
              </div>
            </div>
          ))          
        )}
      </div>
    </div>
  );
};

export default QueriesDisplay;
