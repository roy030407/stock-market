import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import TradingPage from './TradingPage';
import PortfolioPage from './PortfolioPage';
import { Home, PieChart } from 'lucide-react';

function NavBar() {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">College Club Stocks</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <Home className="h-5 w-5 mr-2" />
              Trading
            </Link>
            <Link
              to="/portfolio"
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/portfolio' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <PieChart className="h-5 w-5 mr-2" />
              Portfolio
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [portfolio, setPortfolio] = useState({});
  const [funds, setFunds] = useState(10000);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex flex-col items-center">
        <NavBar />
        <main className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center">
          <div className="w-full max-w-6xl">
            <Routes>
              <Route
                path="/"
                element={
                  <TradingPage
                    portfolio={portfolio}
                    setPortfolio={setPortfolio}
                    funds={funds}
                    setFunds={setFunds}
                  />
                }
              />
              <Route
                path="/portfolio"
                element={
                  <PortfolioPage
                    portfolio={portfolio}
                    funds={funds}
                    setPortfolio={setPortfolio}
                    setFunds={setFunds}
                  />
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
