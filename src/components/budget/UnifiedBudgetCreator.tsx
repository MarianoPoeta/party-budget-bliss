import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  X, 
  Plus, 
  Edit3, 
  Eye, 
  Calendar, 
  Users, 
  MapPin,
  Check,
  AlertCircle,
  Sparkles,
  Settings,
  Copy,
  Trash2,
  ChefHat,
  Trophy,
  Car,
  Building
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useBudgetWorkflow } from '../../hooks/useBudgetWorkflow';
import { useBudgetCalculation } from '../../hooks/useBudgetCalculation';
import { useStore } from '../../store';
import { Menu, MenuItem } from '../../types/Menu';
import { Activity } from '../../types/Activity';
import { Accommodation } from '../../types/Accommodation';
import { TransportTemplate } from '../../types/Budget';
import { BudgetItem } from '../../types/EnhancedBudget';

interface UnifiedBudgetCreatorProps {
  onSave: (budget: any) => void;
  onCancel: () => void;
  initialBudget?: any;
}

interface TemplateGroup {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  templates: any[];
  selectedItems: BudgetItem[];
}

interface CustomizationMode {
  isCustomizing: boolean;
  activeTemplate: any | null;
  templateType: string | null;
}

const UnifiedBudgetCreator: React.FC<UnifiedBudgetCreatorProps> = ({
  onSave,
  onCancel,
  initialBudget
}) => {
  // State management
  const [step, setStep] = useState<'basic' | 'templates' | 'review'>('basic');
  const [customization, setCustomization] = useState<CustomizationMode>({
    isCustomizing: false,
    activeTemplate: null,
    templateType: null
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Get data from store
  const { 
    menus, 
    activities, 
    accommodations, 
    transportTemplates,
    findOrCreateClient,
    addToast 
  } = useStore();

  // Budget workflow
  const {
    budget,
    validationErrors,
    addItem,
    removeItem,
    updateItem,
    validateBudget,
    updateBudgetField,
    isDirty
  } = useBudgetWorkflow(initialBudget);

  // Budget calculation
  const budgetCalculation = useBudgetCalculation({
    selectedMeals: budget.selectedMeals || [],
    selectedActivities: budget.selectedActivities || [],
    selectedTransport: budget.selectedTransport || [],
    transportAssignments: budget.transportAssignments || [],
    selectedStay: budget.selectedStay,
    guestCount: budget.guestCount || 0,
    extras: budget.extras || 0
  });

  // Update total amount in real-time
  useEffect(() => {
    updateBudgetField('totalAmount', budgetCalculation.totalAmount);
  }, [budgetCalculation.totalAmount, updateBudgetField]);

  // Template groups for organized display
  const templateGroups: TemplateGroup[] = useMemo(() => [
    {
      id: 'meals',
      title: 'Comidas y Menús',
      icon: ChefHat,
      color: 'orange',
      description: 'Desayunos, almuerzos, cenas y catering',
      templates: menus?.filter(m => m.isActive) || [],
      selectedItems: budget.selectedMeals || []
    },
    {
      id: 'activities',
      title: 'Actividades',
      icon: Trophy,
      color: 'green',
      description: 'Aventura, entretenimiento y experiencias',
      templates: activities?.filter(a => a.isActive) || [],
      selectedItems: budget.selectedActivities || []
    },
    {
      id: 'transport',
      title: 'Transporte',
      icon: Car,
      color: 'blue',
      description: 'Traslados y vehículos',
      templates: transportTemplates || [],
      selectedItems: budget.selectedTransport || []
    },
    {
      id: 'accommodation',
      title: 'Alojamiento',
      icon: Building,
      color: 'purple',
      description: 'Hoteles, apartamentos y hospedaje',
      templates: accommodations?.filter(a => a.isActive) || [],
      selectedItems: budget.selectedStay ? [budget.selectedStay] : []
    }
  ], [menus, activities, transportTemplates, accommodations, budget]);

  // Progress calculation
  const progress = useMemo(() => {
    let completedSteps = 0;
    
    // Basic info step
    if (budget.clientName && budget.clientEmail && budget.clientPhone && budget.eventDate && budget.guestCount) {
      completedSteps++;
    }
    
    // Templates step - at least one item selected
    const hasItems = templateGroups.some(group => group.selectedItems.length > 0);
    if (hasItems) {
      completedSteps++;
    }
    
    // Review step - no validation errors
    const errors = validateBudget();
    const hasNoErrors = errors.filter(e => e.severity === 'error').length === 0;
    if (hasNoErrors) {
      completedSteps++;
    }
    
    return Math.round((completedSteps / 3) * 100);
  }, [budget, templateGroups, validateBudget]);

  // Navigation functions
  const goToStep = useCallback((newStep: 'basic' | 'templates' | 'review') => {
    setStep(newStep);
    setCustomization({ isCustomizing: false, activeTemplate: null, templateType: null });
  }, []);

  const nextStep = useCallback(() => {
    if (step === 'basic' && budget.clientName && budget.clientEmail && budget.clientPhone && budget.eventDate && budget.guestCount) {
      goToStep('templates');
    } else if (step === 'templates') {
      goToStep('review');
    }
  }, [step, budget, goToStep]);

  const prevStep = useCallback(() => {
    if (step === 'review') {
      goToStep('templates');
    } else if (step === 'templates') {
      goToStep('basic');
    }
  }, [step, goToStep]);

  // Template management
  const handleAddTemplate = useCallback((template: any, groupId: string) => {
    addItem(groupId as any, template);
    
    // Auto-expand section when item is added
    setExpandedSections(prev => new Set([...prev, groupId]));
    
    addToast({
      id: `add-${Date.now()}`,
      message: `${template.name} añadido al presupuesto`,
      type: 'success'
    });
  }, [addItem, addToast]);

  const handleCustomizeTemplate = useCallback((template: any, groupId: string) => {
    setCustomization({
      isCustomizing: true,
      activeTemplate: template,
      templateType: groupId
    });
  }, []);

  const handleRemoveItem = useCallback((itemId: string, groupId: string) => {
    removeItem(groupId as any, itemId);
    addToast({
      id: `remove-${Date.now()}`,
      message: 'Elemento eliminado del presupuesto',
      type: 'success'
    });
  }, [removeItem, addToast]);

  // Save function
  const handleSave = async () => {
    const errors = validateBudget();
    const hasErrors = errors.filter(e => e.severity === 'error').length > 0;
    
    if (!hasErrors && budget.clientName && budget.clientEmail && budget.clientPhone) {
      // Create or update client
      const client = findOrCreateClient({
        name: budget.clientName,
        email: budget.clientEmail,
        phone: budget.clientPhone
      });
      
      const budgetToSave = { 
        ...budget, 
        clientId: client.id,
        totalAmount: budgetCalculation.totalAmount,
        breakdown: budgetCalculation.breakdown,
        id: budget.id || `budget-${Date.now()}`,
        createdAt: budget.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onSave(budgetToSave);
      addToast({
        id: `save-${Date.now()}`,
        message: `Presupuesto guardado exitosamente. Cliente ${client.name} ${client.id.startsWith('client-') ? 'creado' : 'actualizado'}.`,
        type: 'success'
      });
    } else {
      addToast({
        id: `error-${Date.now()}`,
        message: 'Por favor, completa todos los campos requeridos (nombre, email, teléfono)',
        type: 'error'
      });
    }
  };

  // Toggle section expansion
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Render functions
  const renderBasicInfo = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Información del Cliente</h2>
        <p className="text-slate-600">Datos de contacto y fechas del evento</p>
      </div>
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-6">
            {/* Client Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Datos de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-sm font-medium text-slate-700">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="clientName"
                    value={budget.clientName || ''}
                    onChange={(e) => updateBudgetField('clientName', e.target.value)}
                    placeholder="ej., Juan Pérez"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-sm font-medium text-slate-700">
                    Email *
                  </Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={budget.clientEmail || ''}
                    onChange={(e) => updateBudgetField('clientEmail', e.target.value)}
                    placeholder="ej., juan@email.com"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientPhone" className="text-sm font-medium text-slate-700">
                    Teléfono *
                  </Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={budget.clientPhone || ''}
                    onChange={(e) => updateBudgetField('clientPhone', e.target.value)}
                    placeholder="ej., +54 11 1234-5678"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guestCount" className="text-sm font-medium text-slate-700">
                    Número de Invitados *
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="guestCount"
                      type="number"
                      min="1"
                      max="1000"
                      value={budget.guestCount || ''}
                      onChange={(e) => updateBudgetField('guestCount', parseInt(e.target.value) || 0)}
                      placeholder="ej., 10"
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Event Dates */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Fechas del Evento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-sm font-medium text-slate-700">
                    Fecha de Llegada *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="eventDate"
                      type="date"
                      value={budget.eventDate || ''}
                      onChange={(e) => updateBudgetField('eventDate', e.target.value)}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventEndDate" className="text-sm font-medium text-slate-700">
                    Fecha de Salida
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="eventEndDate"
                      type="date"
                      value={budget.eventEndDate || ''}
                      onChange={(e) => updateBudgetField('eventEndDate', e.target.value)}
                      className="h-11 pl-10"
                      min={budget.eventDate || undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTemplateGroup = (group: TemplateGroup) => {
    const isExpanded = expandedSections.has(group.id);
    const IconComponent = group.icon;
    
    return (
      <Card key={group.id} className="border-l-4 border-l-blue-500">
        <CardHeader 
          className="cursor-pointer transition-colors hover:bg-slate-50"
          onClick={() => toggleSection(group.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 bg-${group.color}-100 rounded-lg`}>
                <IconComponent className={`h-5 w-5 text-${group.color}-600`} />
              </div>
              <div>
                <CardTitle className="text-lg">{group.title}</CardTitle>
                <p className="text-sm text-slate-600">{group.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {group.selectedItems.length > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {group.selectedItems.length} seleccionado{group.selectedItems.length !== 1 ? 's' : ''}
                </Badge>
              )}
              <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            
            {/* Selected Items */}
            {group.selectedItems.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Elementos Seleccionados</h4>
                <div className="space-y-2">
                  {group.selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium text-slate-900">{item.template?.name}</p>
                          <p className="text-sm text-slate-600">
                            {item.template?.pricePerPerson ? 
                              `€${item.template.pricePerPerson}/persona` : 
                              item.template?.basePrice ? `€${item.template.basePrice}` :
                              item.template?.pricePerNight ? `€${item.template.pricePerNight}/noche` : 'Precio personalizado'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCustomizeTemplate(item.template, group.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(item.id, group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Available Templates */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Plantillas Disponibles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.templates.map((template) => {
                  const isSelected = group.selectedItems.some(item => item.templateId === template.id);
                  const canAdd = group.id !== 'accommodation' || group.selectedItems.length === 0;
                  
                  return (
                    <Card 
                      key={template.id} 
                      className={`transition-all duration-200 hover:shadow-md ${
                        isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-slate-900">{template.name}</h5>
                            <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-green-600">
                              {template.pricePerPerson ? 
                                `€${template.pricePerPerson}/persona` : 
                                template.basePrice ? `€${template.basePrice}` :
                                template.pricePerNight ? `€${template.pricePerNight}/noche` : 'Precio personalizado'
                              }
                            </span>
                            {isSelected && (
                              <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCustomizeTemplate(template, group.id)}
                              className="flex-1"
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Personalizar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddTemplate(template, group.id)}
                              disabled={isSelected || !canAdd}
                              className="flex-1"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              {isSelected ? 'Añadido' : 'Añadir'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Selecciona Tus Servicios</h2>
        <p className="text-slate-600">Elige las plantillas que necesitas y personalízalas según tus preferencias</p>
      </div>
      
      <div className="space-y-4">
        {templateGroups.map(renderTemplateGroup)}
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <Eye className="h-8 w-8 text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Revisión Final</h2>
        <p className="text-slate-600">Revisa todos los detalles antes de crear tu presupuesto</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Nombre:</span>
              <span className="font-medium">{budget.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Email:</span>
              <span className="font-medium">{budget.clientEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Teléfono:</span>
              <span className="font-medium">{budget.clientPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Invitados:</span>
              <span className="font-medium">{budget.guestCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Llegada:</span>
              <span className="font-medium">{budget.eventDate}</span>
            </div>
            {budget.eventEndDate && (
              <div className="flex justify-between">
                <span className="text-slate-600">Salida:</span>
                <span className="font-medium">{budget.eventEndDate}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Budget Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Presupuesto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetCalculation.breakdown.meals > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Comidas:</span>
                <span className="font-medium">€{budgetCalculation.breakdown.meals.toLocaleString()}</span>
              </div>
            )}
            {budgetCalculation.breakdown.activities > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Actividades:</span>
                <span className="font-medium">€{budgetCalculation.breakdown.activities.toLocaleString()}</span>
              </div>
            )}
            {budgetCalculation.breakdown.transport > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Transporte:</span>
                <span className="font-medium">€{budgetCalculation.breakdown.transport.toLocaleString()}</span>
              </div>
            )}
            {budgetCalculation.breakdown.stay > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Alojamiento:</span>
                <span className="font-medium">€{budgetCalculation.breakdown.stay.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-green-600">€{budgetCalculation.totalAmount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Selected Items Summary */}
      <div className="space-y-4">
        {templateGroups.map(group => {
          if (group.selectedItems.length === 0) return null;
          
          return (
                            <Card key={group.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <group.icon className={`h-5 w-5 text-${group.color}-600`} />
                      {group.title} ({group.selectedItems.length})
                    </CardTitle>
                  </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {group.selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-slate-900">{item.template?.name}</span>
                      <span className="font-medium">
                        {item.template?.pricePerPerson ? 
                          `€${item.template.pricePerPerson}/persona` : 
                          item.template?.basePrice ? `€${item.template.basePrice}` :
                          item.template?.pricePerNight ? `€${item.template.pricePerNight}/noche` : 'Precio personalizado'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const canProceed = () => {
    if (step === 'basic') {
      return budget.clientName && budget.clientEmail && budget.clientPhone && budget.eventDate && budget.guestCount;
    }
    if (step === 'templates') {
      return templateGroups.some(group => group.selectedItems.length > 0);
    }
    return true;
  };

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">
              {initialBudget ? 'Editar Presupuesto' : 'Crear Nuevo Presupuesto'}
            </h1>
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
          
          {/* Step Navigation */}
          <div className="flex items-center justify-center space-x-8">
            {[
              { id: 'basic', title: 'Información Básica', icon: Users },
              { id: 'templates', title: 'Seleccionar Servicios', icon: Sparkles },
              { id: 'review', title: 'Revisión Final', icon: Eye }
            ].map((stepItem, index) => {
              const StepIcon = stepItem.icon;
              const isActive = step === stepItem.id;
              const isCompleted = ['basic', 'templates', 'review'].indexOf(step) > index;
              const isAccessible = isCompleted || isActive || (index === 0) || 
                                  (index === 1 && budget.clientName && budget.clientEmail && budget.clientPhone && budget.eventDate && budget.guestCount) ||
                (index === 2 && templateGroups.some(group => group.selectedItems.length > 0));
              
              return (
                <div 
                  key={stepItem.id}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                    isAccessible ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => isAccessible && goToStep(stepItem.id as any)}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-green-100 text-green-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted && !isActive ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-500'
                  }`}>
                    {stepItem.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {step === 'basic' && renderBasicInfo()}
        {step === 'templates' && renderTemplateSelection()}
        {step === 'review' && renderReview()}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={step === 'basic' ? onCancel : prevStep}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 'basic' ? 'Cancelar' : 'Anterior'}
          </Button>
          
          <div className="flex items-center gap-3">
            {step === 'review' ? (
              <Button
                onClick={handleSave}
                disabled={!canProceed()}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Guardar Presupuesto
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="fixed bottom-20 right-6 max-w-md space-y-2">
          {validationErrors.map((error, index) => (
            <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Template Customization Dialog */}
      <Dialog open={customization.isCustomizing} onOpenChange={(open) => 
        !open && setCustomization({ isCustomizing: false, activeTemplate: null, templateType: null })
      }>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Personalizar Template</DialogTitle>
            <DialogDescription>
              Ajusta los detalles de {customization.activeTemplate?.name} según tus necesidades
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium mb-2">{customization.activeTemplate?.name}</h3>
              <p className="text-sm text-slate-600">{customization.activeTemplate?.description}</p>
            </div>
            
            {/* Template-specific customization will be rendered here */}
            <div className="text-center py-8 text-slate-500">
              <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Funcionalidad de personalización en desarrollo</p>
              <p className="text-sm">Próximamente podrás ajustar todos los detalles del template</p>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => 
                setCustomization({ isCustomizing: false, activeTemplate: null, templateType: null })
              }>
                Cancelar
              </Button>
              <Button onClick={() => {
                // Add template after customization
                if (customization.activeTemplate && customization.templateType) {
                  handleAddTemplate(customization.activeTemplate, customization.templateType);
                  setCustomization({ isCustomizing: false, activeTemplate: null, templateType: null });
                }
              }}>
                Añadir Template Personalizado
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifiedBudgetCreator; 