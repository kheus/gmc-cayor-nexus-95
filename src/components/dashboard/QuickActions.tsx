import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, Plus } from "lucide-react"

interface QuickAction {
  name: string
  icon: LucideIcon
  color: string
}

interface QuickActionsProps {
  actions: QuickAction[]
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Actions Rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-center">{action.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}