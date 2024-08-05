import React, { useState, useEffect } from 'react';
import TransactionsTable from './components/TransactionsTable';
import AddTransactionForm from './components/AddTransactionForm';
import './App.css';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState(null);

  useEffect(() => {
    // Fetch initial transactions from the backend API
    fetch('http://localhost:3000/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data));
  }, []);

  const addTransaction = (transaction) => {
    // Post the new transaction to the backend API
    fetch('http://localhost:3000/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    })
      .then(response => response.json())
      .then(newTransaction => {
        setTransactions([...transactions, newTransaction]);
      });
  };

  const deleteTransaction = (id) => {
    // Delete the transaction from the backend API
    fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTransactions(transactions.filter(transaction => transaction.id !== id));
      });
  };

  const filterTransactions = (transactions, searchTerm) => {
    return transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredTransactions = filterTransactions(transactions, searchTerm);

  const sortedTransactions = sortKey
    ? [...filteredTransactions].sort((a, b) =>
        a[sortKey].localeCompare(b[sortKey])
      )
    : filteredTransactions;

  return (
    <div>
      <h1>Bank Transactions</h1>
      <input
        type="text"
        placeholder="Search by description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => setSortKey('category')}>Sort by Category</button>
      <button onClick={() => setSortKey('description')}>Sort by Description</button>
      <AddTransactionForm onAdd={addTransaction} />
      <TransactionsTable transactions={sortedTransactions} onDelete={deleteTransaction} />
    </div>
  );
};

export default App;
