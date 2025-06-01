import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function PortfolioPage({ portfolio, funds, setPortfolio, setFunds }) {
  const stocks = [
    { symbol: 'LDC', name: 'Literary and Debating Club', price: 145.32, color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    { symbol: '180DC', name: '180 Degrees Consulting', price: 87.45, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { symbol: 'BC', name: 'Business Club', price: 210.89, color: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { symbol: 'MC', name: 'Music Club', price: 65.78, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { symbol: 'RC', name: 'Robotics Club', price: 120.50, color: 'bg-gradient-to-r from-yellow-500 to-amber-500' },
  ];

  const calculatePortfolioValue = () => {
    return Object.entries(portfolio).reduce((total, [symbol, quantity]) => {
      const stock = stocks.find(s => s.symbol === symbol);
      return total + (stock?.price || 0) * quantity;
    }, 0);
  };

  const totalValue = funds + calculatePortfolioValue();

  const [sellQuantities, setSellQuantities] = useState({});

  const handleSellQuantityChange = (symbol, delta) => {
    setSellQuantities(prev => ({
      ...prev,
      [symbol]: Math.max(0, Math.min((prev[symbol] || 0) + delta, portfolio[symbol] || 0))
    }));
  };

  const executeSell = (symbol) => {
    const quantity = sellQuantities[symbol] || 0;
    const stock = stocks.find(s => s.symbol === symbol);
    
    if (quantity <= 0) return;
    if (quantity > (portfolio[symbol] || 0)) return;
    
    const proceeds = stock.price * quantity;
    setFunds(prev => prev + proceeds);
    setPortfolio(prev => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) - quantity
    }));
    
    setSellQuantities(prev => ({ ...prev, [symbol]: 0 }));
  };

  return (
    <div className="space-y-8 w-full">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-4xl font-bold text-gray-800 mb-3 text-center">Your Club Portfolio</h2>
        <p className="text-gray-600 text-lg text-center">Track your investments in campus organizations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-sm bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-lg"></div>
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500 text-sm">Available Funds</CardDescription>
            <CardTitle className="text-3xl font-bold text-gray-800">${funds.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-sm bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg"></div>
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500 text-sm">Portfolio Value</CardDescription>
            <CardTitle className="text-3xl font-bold text-gray-800">${calculatePortfolioValue().toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-sm bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-t-lg"></div>
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500 text-sm">Total Value</CardDescription>
            <CardTitle className="text-3xl font-bold text-gray-800">${totalValue.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-0 shadow-lg w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
        <div className="h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-t-lg"></div>
        <CardHeader>
          <CardTitle className="text-gray-800 text-center">Your Holdings</CardTitle>
          <CardDescription className="text-gray-600 text-center">Stocks you currently own</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(portfolio).filter(([_, qty]) => qty > 0).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(portfolio)
                .filter(([_, qty]) => qty > 0)
                .map(([symbol, quantity]) => {
                  const stock = stocks.find(s => s.symbol === symbol);
                  if (!stock) return null;
                  const value = stock.price * quantity;
                  const percentage = (value / totalValue * 100).toFixed(1);
                  const sellQuantity = sellQuantities[symbol] || 0;
                  
                  return (
                    <div key={symbol} className="group p-6 border rounded-lg hover:bg-gray-50/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 ${stock.color} rounded-full mr-3`}></div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">{stock.name}</h3>
                            <p className="text-sm text-gray-500">{symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-gray-800 text-lg">${value.toFixed(2)}</span>
                          <span className="text-sm text-gray-500">{percentage}% of portfolio</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-500">{quantity} shares</span>
                        <span className="text-gray-500">@ ${stock.price.toFixed(2)} each</span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-gray-50/80 backdrop-blur-sm p-3 rounded-md">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleSellQuantityChange(symbol, -1)}
                            disabled={sellQuantity <= 0}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium text-gray-800">
                            {sellQuantity}
                          </span>
                          <button
                            onClick={() => handleSellQuantityChange(symbol, 1)}
                            disabled={sellQuantity >= quantity}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => executeSell(symbol)}
                          disabled={sellQuantity <= 0}
                          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                        >
                          Sell Shares
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 bg-gray-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-6 text-lg">You don't own any club stocks yet</p>
              <a
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium"
              >
                Start Trading
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}