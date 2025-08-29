import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    axios.get('https://digital-health-portfolio-backend.onrender.com/api/visitor/count')
      .then(res => setCount(res.data.count))
      .catch(err => console.error('Visitor count error:', err));
  }, []);

  return (
    <span>{count !== null ? ` ${count} visitors` : 'Loading visitors...'}</span>
  );
}

export default VisitorCounter;
