import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Header';
import BugList from './components/BugList';
import BugForm from './components/BugForm';
import BugDetail from './components/BugDetail';
import ErrorFallback from './components/ErrorFallback';
import './App.css';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<BugList />} />
              <Route path="/bugs/new" element={<BugForm />} />
              <Route path="/bugs/:id" element={<BugDetail />} />
              <Route path="/bugs/:id/edit" element={<BugForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
