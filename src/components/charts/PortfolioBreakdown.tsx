import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Building2, Car, Shield, TrendingUp, Plane } from "lucide-react"

// Données actuelles basées sur l'état réel du système
const portfolioData = [
  { name: 'Clients Enregistrés', value: 70, amount: 1200000, color: '#3b82f6' },
  { name: 'Infrastructure Système', value: 20, amount: 300000, color: '#10b981' },
  { name: 'Potentiel à Développer', value: 10, amount: 150000, color: '#f59e0b' },
]

const monthlyData = [
  { month: 'Jan', immobilier: 0, voyage: 0, assurance: 0, maintenance: 0 },
  { month: 'Fév', immobilier: 0, voyage: 0, assurance: 0, maintenance: 0 },
  { month: 'Mar', immobilier: 0, voyage: 0, assurance: 0, maintenance: 0 },
  { month: 'Avr', immobilier: 0, voyage: 0, assurance: 0, maintenance: 0 },
  { month: 'Mai', immobilier: 0, voyage: 0, assurance: 0, maintenance: 0 },
  { month: 'Jun', immobilier: 0.7, voyage: 0.4, assurance: 0.1, maintenance: -0.5 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export function PortfolioBreakdown() {
  const totalValue = portfolioData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Répartition du portefeuille */}
      <Card className="gmc-card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Répartition du Portefeuille
          </CardTitle>
          <CardDescription>
            Valeur totale: {(totalValue / 1000000).toFixed(1)}M CFA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value}% (${((portfolioData.find(d => d.name === name)?.amount || 0) / 1000000).toFixed(1)}M CFA)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-accent/5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{item.value}%</div>
                  <div className="text-xs text-muted-foreground">
                    {(item.amount / 1000000).toFixed(1)}M CFA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance mensuelle */}
      <Card className="gmc-card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Mensuelle
          </CardTitle>
          <CardDescription>Revenus vs Dépenses (Millions CFA)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value}M CFA`,
                    name === 'immobilier' ? 'Immobilier' : 
                    name === 'voyage' ? 'Voyage' :
                    name === 'assurance' ? 'Assurance' : 'Maintenance'
                  ]}
                />
                <Legend />
                <Bar dataKey="immobilier" fill="#3b82f6" name="Immobilier" />
                <Bar dataKey="voyage" fill="#10b981" name="Voyage" />
                <Bar dataKey="assurance" fill="#8b5cf6" name="Assurance" />
                <Bar dataKey="maintenance" fill="#ef4444" name="Maintenance" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Building2 className="h-4 w-4 mx-auto mb-1 text-blue-600" />
              <div className="text-sm font-bold text-blue-600">0.7M</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Immobilier</div>
            </div>
            <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <Plane className="h-4 w-4 mx-auto mb-1 text-green-600" />
              <div className="text-sm font-bold text-green-600">0.4M</div>
              <div className="text-xs text-green-700 dark:text-green-300">Voyage</div>
            </div>
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <Shield className="h-4 w-4 mx-auto mb-1 text-purple-600" />
              <div className="text-sm font-bold text-purple-600">0.1M</div>
              <div className="text-xs text-purple-700 dark:text-purple-300">Assurance</div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <Car className="h-4 w-4 mx-auto mb-1 text-red-600" />
              <div className="text-sm font-bold text-red-600">-0.5M</div>
              <div className="text-xs text-red-700 dark:text-red-300">Maintenance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}