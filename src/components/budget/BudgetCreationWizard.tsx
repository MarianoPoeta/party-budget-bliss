import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Calendar, 
  Users, 
  Building, 
  MapPin,
  DollarSign,
  AlertTriangle,
  ChefHat,
  Car,
  Bed,
  Trophy,
  Sparkles,
  Save,
  Eye,
  Clock,
  Target
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
import { useBudgetWorkflow } from '../../hooks/useBudgetWorkflow';
import { useBudgetCalculation } from '../../hooks/useBudgetCalculation';
import { useStore } from '../../store';
import { Menu } from '../../types/Menu';
import { Activity } from '../../types/Activity';
import { Accommodation } from '../../types/Accommodation';
import { TransportTemplate } from '../../types/Budget';
import { BudgetItem } from '../../types/EnhancedBudget';

interface BudgetCreationWizardProps {
  onSave: (budget: any) => void;
  onCancel: () => void;
  initialBudget?: any;
}

const WIZARD_STEPS = [
  { 
    id: 'basic', 
    title: 'Información Básica', 
    description: 'Detalles del cliente y evento',
    icon: Users,
    color: 'blue'
  },
  { 
    id: 'meals', 
    title: 'Menús & Comidas', 
    description: 'Selecciona los menús para el evento',
    icon: ChefHat,
    color: 'orange'
  },
  { 
    id: 'activities', 
    title: 'Actividades', 
    description: 'Planifica las actividades del evento',
    icon: Trophy,
    color: 'green'
  },
  { 
    id: 'transport', 
    title: 'Transporte', 
    description: 'Opciones de transporte',
    icon: Car,
    color: 'purple'
  },
  { 
    id: 'accommodation', 
    title: 'Alojamiento', 
    description: 'Reserva el alojamiento',
    icon: Bed,
    color: 'pink'
  },
  { 
    id: 'review', 
    title: 'Revisión Final', 
    description: 'Revisa y confirma tu presupuesto',
    icon: Eye,
    color: 'slate'
  }
];

const BudgetCreationWizard: React.FC<BudgetCreationWizardProps> = ({
  onSave,
  onCancel,
  initialBudget
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { 
    menus, 
    activities, 
    accommodations, 
    transportTemplates,
    addToast 
  } = useStore();

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

  // Navigation functions
  const nextStep = useCallback(() => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < WIZARD_STEPS.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsAnimating(false);
      }, 150);
    }
  }, []);

  // Validation for each step
  const stepValidation = useMemo(() => {
    const errors = validateBudget();
    return {
      basic: !budget.clientName || !budget.eventDate || !budget.guestCount,
      meals: false, // Optional
      activities: false, // Optional
      transport: false, // Optional
      accommodation: false, // Optional
      review: errors.filter(e => e.severity === 'error').length > 0
    };
  }, [budget, validateBudget]);

  // Progress calculation
  const progress = useMemo(() => {
    const completedSteps = WIZARD_STEPS.slice(0, currentStep + 1).filter((_, index) => {
      const stepId = WIZARD_STEPS[index].id as keyof typeof stepValidation;
      return !stepValidation[stepId];
    });
    return Math.round((completedSteps.length / WIZARD_STEPS.length) * 100);
  }, [currentStep, stepValidation]);

  // Handle save
  const handleSave = async () => {
    const errors = validateBudget();
    const hasErrors = errors.filter(e => e.severity === 'error').length > 0;
    
    if (!hasErrors) {
      const budgetToSave = { 
        ...budget, 
        totalAmount: budgetCalculation.totalAmount,
        breakdown: budgetCalculation.breakdown,
        id: budget.id || `budget-${Date.now()}`,
        createdAt: budget.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onSave(budgetToSave);
      addToast({
        id: `save-${Date.now()}`,
        message: 'Presupuesto guardado exitosamente',
        type: 'success'
      });
    } else {
      addToast({
        id: `error-${Date.now()}`,
        message: 'Corrige los errores antes de guardar',
        type: 'error'
      });
    }
  };

  // Step content renderer
  const getStepContent = () => {
    switch (WIZARD_STEPS[currentStep].id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Información del Evento</h2>
              <p className="text-slate-600">Comencemos con los detalles básicos de tu despedida de soltero</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium text-slate-700">
                  Nombre del Cliente *
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
                <Label htmlFor="eventDate" className="text-sm font-medium text-slate-700">
                  Fecha del Evento *
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
                <Label htmlFor="guestCount" className="text-sm font-medium text-slate-700">
                  Número de Invitados *
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="guestCount"
                    type="number"
                    value={budget.guestCount || ''}
                    onChange={(e) => updateBudgetField('guestCount', parseInt(e.target.value) || 0)}
                    placeholder="ej., 10"
                    min="1"
                    className="h-11 pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventLocation" className="text-sm font-medium text-slate-700">
                  Ubicación del Evento
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="eventLocation"
                    value={(budget as any).eventLocation || ''}
                    onChange={(e) => updateBudgetField('eventLocation' as any, e.target.value)}
                    placeholder="ej., Madrid, España"
                    className="h-11 pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                Descripción del Evento
              </Label>
                              <Textarea
                  id="description"
                  value={(budget as any).description || ''}
                  onChange={(e) => updateBudgetField('description' as any, e.target.value)}
                  placeholder="Describe el tipo de evento, preferencias especiales, o cualquier detalle importante..."
                  rows={4}
                  className="resize-none"
                />
            </div>
          </div>
        );
      
      case 'meals':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Menús y Comidas</h2>
              <p className="text-slate-600">Selecciona los menús que quieres incluir en tu evento</p>
            </div>
            
            {/* Selected meals summary */}
            {budget.selectedMeals && budget.selectedMeals.length > 0 && (
              <Card className="bg-orange-50 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-800">Menús Seleccionados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budget.selectedMeals.map((meal: BudgetItem) => (
                      <div key={meal.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <h4 className="font-medium text-slate-900">{meal.template?.name}</h4>
                          <p className="text-sm text-slate-600">{meal.template?.type}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('meals', meal.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Quitar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Available menus */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menus.filter(menu => menu.isActive).map((menu) => {
                const isSelected = budget.selectedMeals?.some((m: BudgetItem) => m.templateId === menu.id);
                return (
                  <Card 
                    key={menu.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => !isSelected && addItem('meals', menu)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-slate-900">{menu.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {menu.type}
                          </Badge>
                        </div>
                        {isSelected && (
                          <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{menu.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-green-600">
                          €{menu.pricePerPerson}/persona
                        </span>
                        <span className="text-sm text-slate-500">
                          {menu.minPeople}-{menu.maxPeople} personas
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      
      case 'activities':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Actividades</h2>
              <p className="text-slate-600">Planifica las actividades perfectas para tu despedida</p>
            </div>
            
            {/* Selected activities summary */}
            {budget.selectedActivities && budget.selectedActivities.length > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-800">Actividades Seleccionadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budget.selectedActivities.map((activity: BudgetItem) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <h4 className="font-medium text-slate-900">{activity.template?.name}</h4>
                          <p className="text-sm text-slate-600">{activity.template?.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('activities', activity.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Quitar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Available activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.filter(activity => activity.isActive).map((activity) => {
                const isSelected = budget.selectedActivities?.some((a: BudgetItem) => a.templateId === activity.id);
                return (
                  <Card 
                    key={activity.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => !isSelected && addItem('activities', activity)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-slate-900">{activity.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {activity.category}
                          </Badge>
                        </div>
                        {isSelected && (
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-green-600">
                          €{activity.basePrice}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="h-4 w-4" />
                          {activity.duration}h
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      
      case 'transport':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Car className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Transporte</h2>
              <p className="text-slate-600">Organiza el transporte para tu grupo</p>
            </div>
            
            {/* Transport options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transportTemplates.map((transport) => {
                const isSelected = budget.selectedTransport?.some((t: BudgetItem) => t.templateId === transport.id);
                return (
                  <Card 
                    key={transport.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => !isSelected && addItem('transport', transport)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-slate-900">{transport.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {transport.type}
                          </Badge>
                        </div>
                        {isSelected && (
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{transport.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-green-600">
                          €{transport.pricePerGuest}/persona
                        </span>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Users className="h-4 w-4" />
                          {transport.capacity} max
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      
      case 'accommodation':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                <Bed className="h-8 w-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Alojamiento</h2>
              <p className="text-slate-600">Encuentra el lugar perfecto para quedarse</p>
            </div>
            
            {/* Accommodation options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accommodations.filter(acc => acc.isActive).map((accommodation) => {
                const isSelected = budget.selectedStay?.templateId === accommodation.id;
                return (
                  <Card 
                    key={accommodation.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-pink-500 bg-pink-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => !isSelected && addItem('stay', accommodation)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-slate-900">{accommodation.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {accommodation.roomType}
                          </Badge>
                        </div>
                        {isSelected && (
                          <div className="flex items-center justify-center w-8 h-8 bg-pink-500 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{accommodation.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-green-600">
                          €{accommodation.pricePerNight}/noche
                        </span>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Users className="h-4 w-4" />
                          {accommodation.maxCapacity} max
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      
      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Eye className="h-8 w-8 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Revisión Final</h2>
              <p className="text-slate-600">Revisa todos los detalles antes de crear tu presupuesto</p>
            </div>
            
            {/* Budget summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column - Items */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detalles del Evento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cliente:</span>
                      <span className="font-medium">{budget.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Fecha:</span>
                      <span className="font-medium">{budget.eventDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Invitados:</span>
                      <span className="font-medium">{budget.guestCount}</span>
                    </div>
                                    {(budget as any).eventLocation && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ubicación:</span>
                    <span className="font-medium">{(budget as any).eventLocation}</span>
                  </div>
                )}
                  </CardContent>
                </Card>
                
                {/* Items breakdown */}
                {budget.selectedMeals && budget.selectedMeals.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-orange-600" />
                        Menús ({budget.selectedMeals.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {budget.selectedMeals.map((meal: BudgetItem) => (
                          <div key={meal.id} className="flex justify-between">
                            <span className="text-slate-600">{meal.template?.name}</span>
                            <span className="font-medium">€{meal.template?.pricePerPerson}/persona</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Right column - Total */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Resumen del Presupuesto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {budgetCalculation.breakdown.meals > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Menús:</span>
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
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <p className="text-slate-600">Paso en desarrollo...</p>
          </div>
        );
    }
  };

  const currentStepData = WIZARD_STEPS[currentStep];
  const canProceed = !stepValidation[currentStepData.id as keyof typeof stepValidation];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-slate-900">
            {initialBudget ? 'Editar Presupuesto' : 'Crear Nuevo Presupuesto'}
          </h1>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-slate-600">
              Paso {currentStep + 1} de {WIZARD_STEPS.length}
            </span>
          </div>
        </div>
        
        <Progress value={progress} className="h-2 mb-6" />
        
        {/* Step navigation */}
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep || (index === currentStep && canProceed);
            const isAccessible = index <= currentStep;
            
            return (
              <div 
                key={step.id}
                className={`flex items-center cursor-pointer transition-all duration-200 ${
                  isAccessible ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isAccessible && goToStep(index)}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-500 text-white shadow-lg scale-110'
                    : isCompleted
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted && !isActive ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-colors duration-200 ${
                    index < currentStep ? 'bg-blue-300' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
        {getStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : prevStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStep === 0 ? 'Cancelar' : 'Anterior'}
        </Button>
        
        <div className="flex items-center gap-3">
          {currentStep === WIZARD_STEPS.length - 1 ? (
            <Button
              onClick={handleSave}
              disabled={!canProceed}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar Presupuesto
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed}
              className="flex items-center gap-2"
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 space-y-2">
          {validationErrors.map((error, index) => (
            <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetCreationWizard; 