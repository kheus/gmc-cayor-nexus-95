import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataSync } from '@/hooks/useDataSync'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, Download, Eye, Trash2, Plus, Search, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  name: string
  type: 'contract' | 'receipt' | 'photo' | 'insurance' | 'other'
  category: string
  size: number
  uploadDate: Date
  lastModified: Date
  clientId?: string
  propertyId?: string
  url: string
  tags: string[]
}

// Les documents seront générés automatiquement basés sur les données réelles
const generateDocumentsFromData = (clients: any[]): Document[] => {
  const documents: Document[] = []
  
  // Génération de documents basée sur les données réelles
  clients.forEach(client => {
    documents.push({
      id: `contract-${client.id}`,
      name: `Contrat_Client_${client.nom}.pdf`,
      type: 'contract',
      category: 'Contrats',
      size: 245000, // 245 KB
      uploadDate: new Date(client.created_at || Date.now()),
      lastModified: new Date(client.updated_at || client.created_at || Date.now()),
      clientId: client.id,
      url: '#',
      tags: ['contrat', 'client']
    })
  })
  
  return documents
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Contrat_Bail_Villa_Moderne.pdf',
    type: 'contract',
    category: 'Contrats de bail',
    size: 2048000,
    uploadDate: new Date(2024, 0, 15),
    lastModified: new Date(2024, 0, 15),
    clientId: 'client-1',
    propertyId: 'prop-1',
    url: '/documents/contract1.pdf',
    tags: ['bail', 'villa', 'contrat']
  },
  {
    id: '2',
    name: 'Recu_Loyer_Novembre_2023.pdf',
    type: 'receipt',
    category: 'Reçus de paiement',
    size: 512000,
    uploadDate: new Date(2023, 10, 30),
    lastModified: new Date(2023, 10, 30),
    clientId: 'client-1',
    url: '/documents/receipt1.pdf',
    tags: ['reçu', 'loyer', 'novembre']
  },
  {
    id: '3',
    name: 'Photos_Appartement_3A.zip',
    type: 'photo',
    category: 'Photos propriétés',
    size: 15680000,
    uploadDate: new Date(2024, 0, 10),
    lastModified: new Date(2024, 0, 10),
    propertyId: 'prop-3',
    url: '/documents/photos1.zip',
    tags: ['photos', 'appartement', 'visite']
  },
  {
    id: '4',
    name: 'Police_Assurance_Auto_GMC_2024.pdf',
    type: 'insurance',
    category: 'Assurances',
    size: 1024000,
    uploadDate: new Date(2024, 0, 5),
    lastModified: new Date(2024, 0, 5),
    url: '/documents/insurance1.pdf',
    tags: ['assurance', 'auto', '2024']
  }
]

const documentTypes = [
  { value: 'contract', label: 'Contrats', color: 'bg-blue-100 text-blue-800' },
  { value: 'receipt', label: 'Reçus', color: 'bg-green-100 text-green-800' },
  { value: 'photo', label: 'Photos', color: 'bg-purple-100 text-purple-800' },
  { value: 'insurance', label: 'Assurances', color: 'bg-orange-100 text-orange-800' },
  { value: 'other', label: 'Autres', color: 'bg-gray-100 text-gray-800' }
]

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(type: Document['type']) {
  switch (type) {
    case 'contract': return <FileText className="h-4 w-4 text-blue-600" />
    case 'receipt': return <FileText className="h-4 w-4 text-green-600" />
    case 'photo': return <FileText className="h-4 w-4 text-purple-600" />
    case 'insurance': return <FileText className="h-4 w-4 text-orange-600" />
    default: return <FileText className="h-4 w-4 text-gray-600" />
  }
}

export function DocumentManager() {
  // Gestion robuste en cas d'erreur Supabase
  let clients: any[] = []
  try {
    const dataSync = useDataSync()
    clients = dataSync?.clients || []
  } catch (error) {
    console.log('Supabase non connecté, utilisation de données vides')
  }
  
  const [documents, setDocuments] = useState<Document[]>([])
  
  useEffect(() => {
    const generatedDocuments = generateDocumentsFromData(clients)
    setDocuments(generatedDocuments)
  }, [clients])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || doc.type === selectedType
    return matchesSearch && matchesType
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        // Simuler l'upload
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newDocument: Document = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'other', // Par défaut, l'utilisateur peut changer après
          category: 'Nouveaux documents',
          size: file.size,
          uploadDate: new Date(),
          lastModified: new Date(),
          url: URL.createObjectURL(file),
          tags: []
        }

        setDocuments(prev => [newDocument, ...prev])
      }

      toast({
        title: "Upload réussi",
        description: `${files.length} fichier${files.length > 1 ? 's' : ''} ajouté${files.length > 1 ? 's' : ''}`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'upload",
        description: "Impossible de télécharger les fichiers"
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId))
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès"
    })
  }

  const handleDownload = (doc: Document) => {
    // Simuler le téléchargement
    const link = document.createElement('a')
    link.href = doc.url
    link.download = doc.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Téléchargement démarré",
      description: `${doc.name} en cours de téléchargement`
    })
  }

  const documentStats = {
    total: documents.length,
    totalSize: documents.reduce((sum, doc) => sum + doc.size, 0),
    byType: documentTypes.map(type => ({
      ...type,
      count: documents.filter(doc => doc.type === type.value).length
    }))
  }

  return (
    <Card className="gmc-card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Gestionnaire de Documents
            </CardTitle>
            <CardDescription>
              {documentStats.total} documents • {formatFileSize(documentStats.totalSize)} au total
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gmc-button"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Upload...' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {documentStats.byType.map(type => (
            <div key={type.value} className="text-center p-3 bg-accent/5 rounded-lg">
              <div className="text-lg font-bold">{type.count}</div>
              <div className="text-xs text-muted-foreground">{type.label}</div>
            </div>
          ))}
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">Rechercher</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Rechercher des documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type de document" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {documentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Liste des documents */}
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || selectedType !== 'all' 
                  ? 'Aucun document ne correspond aux critères'
                  : 'Aucun document disponible'
                }
              </p>
            </div>
          ) : (
            filteredDocuments.map(doc => {
              const typeInfo = documentTypes.find(t => t.value === doc.type)
              
              return (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                        {typeInfo && (
                          <Badge variant="secondary" className={`text-xs ${typeInfo.color}`}>
                            {typeInfo.label}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>{doc.uploadDate.toLocaleDateString('fr-FR')}</span>
                        {doc.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1">
                              {doc.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                              {doc.tags.length > 2 && (
                                <span className="text-muted-foreground">+{doc.tags.length - 2}</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.url, '_blank')}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}