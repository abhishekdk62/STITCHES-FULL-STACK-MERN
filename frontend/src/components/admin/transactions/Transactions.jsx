import React, { useState } from 'react';
import TransactionsList from './elements/TransactionsList';

const Transactions = () => {
  const [selectedTab, setSelectedTab] = useState('list');
  return <div>{selectedTab == 'list' ? <TransactionsList /> : null}</div>;
};

export default Transactions;
