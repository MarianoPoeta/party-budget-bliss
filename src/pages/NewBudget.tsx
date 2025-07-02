import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, AlertTriangle, CheckCircle, Users, Calendar, DollarSign, UtensilsCrossed, MapPin, Car, Hotel, Plus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MenuSelector from '../components/MenuSelector';
import ActivitiesTemplate from '../components/ActivitiesTemplate';
import TransportTemplate from '../components/TransportTemplate';
import StayTemplate from '../components/StayTemplate';
import BasicInfoSection from '../components/budget/BasicInfoSection';
import ExtrasSection from '../components/budget/ExtrasSection';
import TotalAmountCard from '../components/budget/TotalAmountCard';
import TransportManager from '../components/budget/TransportManager';
import EditItemDialog from '../components/budget/EditItemDialog';
import ConfigSidebar from '../components/ConfigSidebar';
import PaymentForm from '../components/budget/PaymentForm';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useBudgetCalculation } from '../hooks/useBudgetCalculation';
import { useTemplates } from '../hooks/useTemplates';
import { EnhancedBudget, BudgetItem, ValidationError, MenuBudgetItem, TransportAssignment } from '../types/EnhancedBudget';
import { Menu } from '../types/Menu';

type Tab = 'basic' | 'menus' | 'activities' | 'transport' | 'stay' | 'extras';

const NewBudget: React.FC = () => {
  const navigate = useNavigate();
  const { templates, menus } = useTemplates();
  
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [budget, setBudget] = useState<Partial<EnhancedBudget>>({
    clientName: '',
    eventDate: '',
    guestCount: 0,
    selectedMeals: [],
    selectedActivities: [],
    selectedTransport: [],
    transportAssignments: [],
    selectedStay: undefined,
    totalAmount: 0,
    isClosed: false
  });

  const [selectedItems, setSelectedItems] = useState<{
    meals: BudgetItem[];
    activities: BudgetItem[];
    transport: BudgetItem[];
    stay?: BudgetItem;
  }>({
    meals: [],
    activities: [],
    transport: []
  });

  const [transportAssignments, setTransportAssignments] = useState<TransportAssignment[]>([]);
  const [extras, setExtras] = useState<number>(0);
  const [configSidebarOpen, setConfigSidebarOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: BudgetItem; type: string; index: number } | null>(null);

  const totalAmount = useBudgetCalculation({
    selectedMeals: selectedItems.meals,
    selectedActivities: selectedItems.activities,
    selectedTransport: selectedItems.transport,
    transportAssignments,
    selectedStay: selectedItems.stay,
    guestCount: budget.guestCount || 0,
    extras
  });

  const tabs: { id: Tab; title: string; icon: React.ReactNode; description: string; count?: number }[] = [
    { id: 'basic', title: 'Información Básica', icon: <Users className="h-4 w-4" />, description: 'Detalles del evento' },
    { id: 'menus', title: 'Menús', icon: <UtensilsCrossed className="h-4 w-4" />, description: 'Comida y bebidas', count: selectedItems.meals.length },
    { id: 'activities', title: 'Actividades', icon: <MapPin className="h-4 w-4" />, description: 'Entretenimiento', count: selectedItems.activities.length },
    { id: 'transport', title: 'Transporte', icon: <Car className="h-4 w-4" />, description: 'Movilidad', count: transportAssignments.length },
    { id: 'stay', title: 'Alojamiento', icon: <Hotel className="h-4 w-4" />, description: 'Hospedaje', count: selectedItems.stay ? 1 : 0 },
    { id: 'extras', title: 'Extras', icon: <Plus className="h-4 w-4" />, description: 'Costos adicionales' }
  ];

  const validateBudget = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Check for activities requiring transport - but make it a warning, not an error
    selectedItems.activities.forEach(item => {
      const activity = item.template as any;
      if (activity.transportRequired) {
        const hasTransport = transportAssignments.some(ta => ta.activityId === item.id);
        if (!hasTransport) {
        errors.push({
          section: 'activities',
          message: `La actividad '${activity.name}' típicamente requiere transporte—considera agregar transporte para esta actividad.`,
          severity: 'warning'
        });
        }
      }
    });

    return errors;
  };

  const handleMenuSelect = (menu: Menu, calculatedPrice: number, guestCount: number) => {
    // Clone menu to avoid mutating global template
    const menuClone = JSON.parse(JSON.stringify(menu));
    const newItem: MenuBudgetItem = {
      id: Date.now().toString(),
      templateId: menuClone.id,
      template: menuClone,
      customizations: {
        guestCount,
        calculatedPrice,
        originalPricePerPerson: menuClone.pricePerPerson
      },
      quantity: 1,
      calculatedPrice,
      guestCount
    };
    setSelectedItems(prev => ({
      ...prev,
      meals: [...prev.meals, newItem]
    }));
  };

  useEffect(() => {
    setSelectedItems(prev => ({
      ...prev,
      meals: prev.meals.map(item => {
        const menu = item.template as Menu;
        const guestCount = budget.guestCount || 0;
        return {
          ...item,
          guestCount,
          calculatedPrice: menu.pricePerPerson * guestCount,
          customizations: {
            ...item.customizations,
            guestCount,
            calculatedPrice: menu.pricePerPerson * guestCount
          }
        };
      })
    }));
     
  }, [budget.guestCount]);

  const handleSelect = (type: string, template: any) => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      templateId: template.id,
      template,
      customizations: {},
      quantity: 1,
      includeTransport: type === 'activities' ? template.transportRequired : undefined
    };

    setSelectedItems(prev => ({
      ...prev,
      [type]: type === 'stay' ? newItem : [...(prev[type as keyof typeof prev] as BudgetItem[]), newItem]
    }));
  };

  const handleEdit = (type: string, index: number, updated: any) => {
    if (type === 'stay') {
      setSelectedItems(prev => ({ ...prev, stay: { ...prev.stay!, template: updated.template } }));
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [type]: (prev[type as keyof typeof prev] as BudgetItem[]).map((item, i) =>
          i === index ? { ...item, ...updated } : item
        )
      }));
    }
  };

  const handleRemove = (type: string, index?: number) => {
    if (type === 'stay') {
      setSelectedItems(prev => ({ ...prev, stay: undefined }));
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [type]: (prev[type as keyof typeof prev] as BudgetItem[]).filter((_, i) => i !== index)
      }));
    }
  };

  // Transport management handlers
  const handleAddTransportAssignment = (assignment: TransportAssignment) => {
    setTransportAssignments(prev => [...prev, assignment]);
  };

  const handleUpdateTransportAssignment = (id: string, updates: Partial<TransportAssignment>) => {
    setTransportAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id ? { ...assignment, ...updates } : assignment
      )
    );
  };

  const handleRemoveTransportAssignment = (id: string) => {
    setTransportAssignments(prev => prev.filter(assignment => assignment.id !== id));
  };

  const handleLinkTransportToActivity = (transportId: string, activityId: string, guestCount: number) => {
    setTransportAssignments(prev => 
      prev.map(assignment => 
        assignment.id === transportId 
          ? { ...assignment, activityId, guestCount }
          : assignment
      )
    );
  };

  const handleUnlinkTransportFromActivity = (transportId: string) => {
    setTransportAssignments(prev => 
      prev.map(assignment => 
        assignment.id === transportId 
          ? { ...assignment, activityId: undefined }
          : assignment
      )
    );
  };

  const handleSaveBudget = () => {
    const errors = validateBudget();
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentComplete = (paymentDetails: any) => {
    const finalBudget: EnhancedBudget = {
      ...budget as EnhancedBudget,
      selectedMeals: selectedItems.meals,
      selectedActivities: selectedItems.activities,
      selectedTransport: selectedItems.transport,
      transportAssignments,
      selectedStay: selectedItems.stay,
      extras,
      totalAmount: totalAmount.totalAmount,
      isClosed: true,
      paymentDetails
    };
    
    console.log('Saving budget with payment:', finalBudget);
    navigate('/budgets');
  };

  const handleCloseEditDialog = () => {
    setEditingItem(null);
  };

  const errors = validateBudget();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/budgets')}
              className="p-2 hover:bg-slate-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
              <h1 className="text-3xl font-bold text-slate-800">Nuevo Presupuesto</h1>
              <p className="text-slate-700">Crear un nuevo presupuesto para despedida de soltero</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setConfigSidebarOpen(true)}
              className="flex items-center gap-2 border-slate-300 hover:bg-slate-100"
            >
              <Settings className="h-4 w-4" />
              Configurar Plantillas
            </Button>
            <Button
              onClick={handleSaveBudget}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Revisar y Guardar
            </Button>
          </div>
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, index) => (
                <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation Tabs */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Budget Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const hasItems = tab.count && tab.count > 0;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                          isActive 
                            ? 'bg-slate-100 border-r-2 border-slate-800 text-slate-900' 
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isActive ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {tab.icon}
                          </div>
                          <div>
                            <p className={`font-medium ${isActive ? 'text-slate-800' : 'text-slate-700'}`}>
                              {tab.title}
                            </p>
                            <p className="text-sm text-slate-600">{tab.description}</p>
                          </div>
                        </div>
                        {hasItems && (
                          <Badge variant="secondary" className="ml-2">
                            {tab.count}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Budget Summary */}
            <Card className="mt-6 border-slate-300">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="text-lg text-slate-800">Resumen del Presupuesto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-700">Menús:</span>
                  <span className="font-semibold text-slate-800">${totalAmount.breakdown.meals.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-700">Actividades:</span>
                  <span className="font-semibold text-slate-800">${totalAmount.breakdown.activities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-700">Transporte:</span>
                  <span className="font-semibold text-slate-800">${totalAmount.breakdown.transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-700">Alojamiento:</span>
                  <span className="font-semibold text-slate-800">${totalAmount.breakdown.stay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-700">Extras:</span>
                  <span className="font-semibold text-slate-800">${totalAmount.breakdown.extras.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-300 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-slate-800">Total:</span>
                    <span className="text-green-700">${totalAmount.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            <Card className="border-slate-300">
              <CardContent className="p-6">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Información Básica</h2>
                      <p className="text-slate-700">Configura los detalles esenciales para tu evento</p>
                    </div>
          <BasicInfoSection
            clientName={budget.clientName || ''}
            eventDate={budget.eventDate || ''}
            guestCount={budget.guestCount || 0}
                      isOpen={true}
                      onToggle={() => {}}
            onClientNameChange={(value) => setBudget(prev => ({ ...prev, clientName: value }))}
            onEventDateChange={(value) => setBudget(prev => ({ ...prev, eventDate: value }))}
            onGuestCountChange={(value) => setBudget(prev => ({ ...prev, guestCount: value }))}
          />
                  </div>
                )}

                {/* Menus Tab */}
                {activeTab === 'menus' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Seleccionar Menús</h2>
                      <p className="text-slate-700">Elige deliciosos menús para tu evento</p>
                    </div>
                    
                    <MenuSelector
                      menus={menus}
                      onSelect={handleMenuSelect}
                      guestCount={budget.guestCount || 0}
            />
            
            {selectedItems.meals.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Menús Seleccionados ({selectedItems.meals.length})
                        </h3>
              <div className="space-y-4">
                          {selectedItems.meals.map((item, index) => {
                            const menu = item.template as Menu;
                            const calculatedPrice = item.calculatedPrice || (menu.pricePerPerson * (budget.guestCount || 0));
                            
                            return (
                              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-100 rounded-lg border border-slate-200">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-slate-800">{menu.name}</h4>
                                    <Badge variant="outline" className="border-slate-300 text-slate-700">{menu.type}</Badge>
                                  </div>
                                  <p className="text-sm text-slate-700 mb-1">{menu.description}</p>
                                  <p className="text-sm text-slate-600">
                                    {menu.restaurant} • ${menu.pricePerPerson}/person
                                  </p>
                                  <p className="text-sm font-semibold text-green-700 mt-1">
                                    Total: ${calculatedPrice.toLocaleString()} ({budget.guestCount || 0} guests)
                                  </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingItem({ item, type: 'meals', index })}
                                    className="border-slate-300 hover:bg-slate-100"
                      >
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemove('meals', index)}
                                    className="border-slate-300 hover:bg-slate-100"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
              </div>
            )}

                {/* Activities Tab */}
                {activeTab === 'activities' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Seleccionar Actividades</h2>
                      <p className="text-slate-700">Elige actividades emocionantes para tu evento</p>
                    </div>
                    
            <ActivitiesTemplate
              items={templates.activities}
              onSelect={(item) => handleSelect('activities', item)}
            />
            
            {selectedItems.activities.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Actividades Seleccionadas ({selectedItems.activities.length})
                        </h3>
              <div className="space-y-4">
                {selectedItems.activities.map((item, index) => {
                  const activity = item.template as any;
                            const linkedTransport = transportAssignments.find(ta => ta.activityId === item.id);
                            
                  return (
                              <div key={item.id} className="p-4 bg-slate-100 rounded-lg space-y-3 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                                    <h4 className="font-semibold text-slate-800">{activity.name}</h4>
                                    <p className="text-sm text-slate-700">{activity.description}</p>
                                    <p className="text-sm font-semibold text-green-700 mt-1">
                                      ${activity.price}
                                    </p>
                                    {activity.transportRequired && (
                                      <div className="flex items-center gap-2 mt-2">
                                        {linkedTransport ? (
                                          <Badge variant="outline" className="text-green-700 border-green-400">
                                            <Car className="h-3 w-3 mr-1" />
                                            Transport: {linkedTransport.transportTemplate.name}
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="text-red-700 border-red-400">
                                            <Car className="h-3 w-3 mr-1" />
                                            Transport Required
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingItem({ item, type: 'activities', index })}
                                      className="border-slate-300 hover:bg-slate-100"
                          >
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRemove('activities', index)}
                                      className="border-slate-300 hover:bg-slate-100"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                        </div>
                      </div>
                    )}
              </div>
            )}

                {/* Transport Tab */}
                {activeTab === 'transport' && (
                  <TransportManager
                    transportTemplates={templates.transport}
                    selectedActivities={selectedItems.activities}
                    transportAssignments={transportAssignments}
                    onAddAssignment={handleAddTransportAssignment}
                    onUpdateAssignment={handleUpdateTransportAssignment}
                    onRemoveAssignment={handleRemoveTransportAssignment}
                    onLinkToActivity={handleLinkTransportToActivity}
                    onUnlinkFromActivity={handleUnlinkTransportFromActivity}
                  />
                )}

                {/* Stay Tab */}
                {activeTab === 'stay' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Accommodation</h2>
                      <p className="text-slate-700">Choose where to stay during your event</p>
                    </div>
                    
            <StayTemplate
              items={templates.stay}
              onSelect={(item) => handleSelect('stay', item)}
            />
            
            {selectedItems.stay && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Selected Stay
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg border border-slate-200">
                  <div>
                            <h4 className="font-semibold text-slate-800">{selectedItems.stay.template.name}</h4>
                            <p className="text-sm text-slate-700">{selectedItems.stay.template.description}</p>
                            <p className="text-sm font-semibold text-green-700 mt-1">
                              ${selectedItems.stay.template.price}
                            </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingItem({ item: selectedItems.stay!, type: 'stay', index: 0 })}
                              className="border-slate-300 hover:bg-slate-100"
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRemove('stay')}
                              className="border-slate-300 hover:bg-slate-100"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            )}
                  </div>
                )}

                {/* Extras Tab */}
                {activeTab === 'extras' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Costos Adicionales</h2>
                      <p className="text-slate-700">Agrega cualquier gasto extra a tu presupuesto</p>
                    </div>
                    
                    <div className="max-w-2xl mx-auto">
          <ExtrasSection
            extras={extras}
                        isOpen={true}
                        onToggle={() => {}}
            onExtrasChange={setExtras}
          />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Configuration Sidebar */}
        <ConfigSidebar 
          isOpen={configSidebarOpen} 
          onClose={() => setConfigSidebarOpen(false)} 
        />

        {/* Payment Form Dialog */}
        <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Completar Presupuesto</DialogTitle>
            </DialogHeader>
            <PaymentForm
              totalAmount={totalAmount.totalAmount}
              onPaymentComplete={handlePaymentComplete}
              onCancel={() => setShowPaymentForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <EditItemDialog
          isOpen={!!editingItem}
          onClose={handleCloseEditDialog}
          editingItem={editingItem}
          onSave={handleEdit}
          guestCount={budget.guestCount || 0}
        />
      </div>
    </Layout>
  );
};

export default NewBudget;