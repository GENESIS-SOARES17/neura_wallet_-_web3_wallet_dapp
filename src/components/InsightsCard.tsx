import React from 'react'
import { Zap, ShieldCheck, TrendingUp, Clock, Bell, ExternalLink } from 'lucide-react'

const insights = [
  {
    icon: ShieldCheck,
    title: 'Network Secured',
    description: 'Neura Testnet is operating normally with 99.9% uptime.',
    time: '2 min ago',
    type: 'success',
  },
  {
    icon: TrendingUp,
    title: 'ANKR Price Update',
    description: 'ANKR has increased by 2.45% in the last 24 hours.',
    time: '15 min ago',
    type: 'info',
  },
  {
    icon: Zap,
    title: 'Gas Fees Low',
    description: 'Current gas fees are at optimal levels for transactions.',
    time: '1 hour ago',
    type: 'success',
  },
  {
    icon: Bell,
    title: 'New Feature',
    description: 'Staking rewards are now available on Neura Testnet.',
    time: '3 hours ago',
    type: 'info',
  },
]

const networkStats = [
  { label: 'Block Height', value: '1,234,567' },
  { label: 'TPS', value: '1,250' },
  { label: 'Validators', value: '100' },
  { label: 'Avg Block Time', value: '2.1s' },
]

export const InsightsCard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-neura-dark mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-neura-green" />
          Network Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {networkStats.map((stat) => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">{stat.label}</p>
              <p className="font-bold text-neura-dark">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Feed */}
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-neura-dark flex items-center gap-2">
            <Bell className="w-5 h-5 text-neura-green" />
            Insights
          </h3>
          <a href="#" className="text-xs text-neura-green hover:underline flex items-center gap-1">
            View All <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  insight.type === 'success' ? 'bg-neura-green/10' : 'bg-blue-500/10'
                }`}>
                  <insight.icon className={`w-5 h-5 ${
                    insight.type === 'success' ? 'text-neura-green' : 'text-blue-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neura-dark text-sm">{insight.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{insight.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {insight.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-neura-dark mb-4">Quick Links</h3>
        <div className="space-y-2">
          <a
            href="https://neura.ankr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <span className="text-sm font-medium text-neura-dark">Neura Explorer</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          <a
            href="https://www.ankr.com/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <span className="text-sm font-medium text-neura-dark">Documentation</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          <a
            href="https://testnet-faucet.ankr.com/neura"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <span className="text-sm font-medium text-neura-dark">Testnet Faucet</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  )
}
