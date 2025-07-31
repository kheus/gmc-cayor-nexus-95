import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Données basées sur les vraies données disponibles (mise à jour progressive)
const data = [
  { month: 'Jan', immobilier: 0, voyage: 0, assurance: 0, expenses: 0 },
  { month: 'Fév', immobilier: 0, voyage: 0, assurance: 0, expenses: 0 },
  { month: 'Mar', immobilier: 0, voyage: 0, assurance: 0, expenses: 0 },
  { month: 'Avr', immobilier: 0, voyage: 0, assurance: 0, expenses: 0 },
  { month: 'Mai', immobilier: 0, voyage: 0, assurance: 0, expenses: 0 },
  { month: 'Jun', immobilier: 0, voyage: 0, assurance: 0, expenses: 0 },
  { month: 'Jul', immobilier: 300000, voyage: 150000, assurance: 50000, expenses: 200000 },
  { month: 'Aoû', immobilier: 450000, voyage: 250000, assurance: 50000, expenses: 300000 },
  { month: 'Sep', immobilier: 500000, voyage: 300000, assurance: 50000, expenses: 350000 },
  { month: 'Oct', immobilier: 550000, voyage: 300000, assurance: 50000, expenses: 400000 },
  { month: 'Nov', immobilier: 600000, voyage: 350000, assurance: 50000, expenses: 450000 },
  { month: 'Déc', immobilier: 700000, voyage: 400000, assurance: 100000, expenses: 500000 }
]

export function RevenueChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            className="text-xs"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            className="text-xs"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k CFA`}
          />
          <Tooltip 
            formatter={(value, name) => [
              `${Number(value).toLocaleString()} CFA`, 
              name === 'immobilier' ? 'Immobilier' :
              name === 'voyage' ? 'Voyage' :
              name === 'assurance' ? 'Assurance' : 'Dépenses'
            ]}
            labelFormatter={(label) => `Mois: ${label}`}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="immobilier" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="voyage" 
            stroke="hsl(var(--gmc-success))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--gmc-success))', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: 'hsl(var(--gmc-success))', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="assurance" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: 'hsl(var(--secondary))', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="hsl(var(--gmc-danger))" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: 'hsl(var(--gmc-danger))', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: 'hsl(var(--gmc-danger))', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}