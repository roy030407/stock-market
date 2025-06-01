import { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';
import { ArrowUp, ArrowDown, Plus, Minus } from 'lucide-react';

const stocks = [
  {
    symbol: 'LDC',
    name: 'Literary and Debating Club',
    price: 145.32,
    change: 1.23,
    description: 'The premier club for public speaking and literary activities on campus.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    symbol: '180DC',
    name: '180 Degrees Consulting',
    price: 87.45,
    change: -0.56,
    description: 'Student-run consulting group providing pro-bono services to nonprofits.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    symbol: 'BC',
    name: 'Business Club',
    price: 210.89,
    change: 3.21,
    description: 'Networking and skill-building for future business leaders.',
    color: 'from-green-500 to-teal-500'
  },
  {
    symbol: 'MC',
    name: 'Music Club',
    price: 65.78,
    change: 0.89,
    description: 'For musicians and music lovers to collaborate and perform.',
    color: 'from-red-500 to-pink-500'
  },
  {
    symbol: 'RC',
    name: 'Robotics Club',
    price: 120.50,
    change: 2.34,
    description: 'Building innovative robotics projects and competing nationally.',
    color: 'from-yellow-500 to-amber-500'
  },
];

export default function TradingPage({ portfolio, setPortfolio, funds, setFunds }) {
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (symbol, delta) => {
    setQuantities(prev => ({
      ...prev,
      [symbol]: Math.max(0, (prev[symbol] || 0) + delta)
    }));
  };

  const executeTrade = (symbol, action) => {
    const stock = stocks.find(s => s.symbol === symbol);
    const quantity = quantities[symbol] || 0;
    
    if (quantity <= 0) return;

    if (action === 'buy') {
      const cost = stock.price * quantity;
      if (cost > funds) return;
      
      setFunds(prev => prev - cost);
      setPortfolio(prev => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) + quantity
      }));
    } else if (action === 'sell') {
      const owned = portfolio[symbol] || 0;
      if (quantity > owned) return;
      
      const proceeds = stock.price * quantity;
      setFunds(prev => prev + proceeds);
      setPortfolio(prev => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) - quantity
      }));
    }

    setQuantities(prev => ({ ...prev, [symbol]: 0 }));
  };

  return (
    <div className="space-y-8 w-full">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-4xl font-bold text-gray-800 mb-3 text-center">Club Stock Exchange</h2>
        <p className="text-gray-600 text-lg text-center">Invest in your favorite campus clubs and organizations</p>
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="flex justify-between items-center">
            <span className="font-medium text-white text-lg">Available Funds:</span>
            <span className="text-3xl font-bold text-white">${funds.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {stocks.map(stock => {
          const ownedShares = portfolio[stock.symbol] || 0;
          const currentQuantity = quantities[stock.symbol] || 0;
          
          return (
            <Card key={stock.symbol} className="border-0 shadow-lg w-full max-w-4xl mx-auto backdrop-blur-sm">
              <div className={`h-3 bg-gradient-to-r ${stock.color} rounded-t-lg`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-800">{stock.symbol}</CardTitle>
                    <CardDescription className="text-gray-600">{stock.name}</CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-800">${stock.price.toFixed(2)}</span>
                    <div className={`flex items-center justify-end ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      <span className="ml-1 font-medium">{Math.abs(stock.change).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{stock.description}</p>
                
                {ownedShares > 0 && (
                  <div className="mb-4 p-3 bg-blue-50/80 backdrop-blur-sm rounded-md border border-blue-100">
                    <p className="text-sm font-medium text-blue-800">You own {ownedShares} shares</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 rounded-full text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors"
                      onClick={() => handleQuantityChange(stock.symbol, -1)}
                      disabled={currentQuantity <= 0}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    
                    <span className="w-16 text-center font-bold text-xl text-gray-800">
                      {currentQuantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 rounded-full text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors"
                      onClick={() => handleQuantityChange(stock.symbol, 1)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 shadow-sm px-6 py-2 text-base font-medium transition-colors"
                      onClick={() => executeTrade(stock.symbol, 'buy')}
                      disabled={currentQuantity <= 0}
                    >
                      Buy
                    </Button>
                    <Button
                      variant="default"
                      className="bg-red-600 hover:bg-red-700 shadow-sm px-6 py-2 text-base font-medium transition-colors"
                      onClick={() => executeTrade(stock.symbol, 'sell')}
                      disabled={currentQuantity <= 0 || ownedShares <= 0 || currentQuantity > ownedShares}
                    >
                      Sell
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
