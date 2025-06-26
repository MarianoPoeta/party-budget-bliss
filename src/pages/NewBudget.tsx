
import React, { useState } from 'react';
import { ArrowLeft, Settings, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MealsTemplate from '../components/MealsTemplate';
import ActivitiesTemplate from '../components/ActivitiesTemplate';
import TransportTemplate from '../components/TransportTemplate';
import StayTemplate from '../components/StayTemplate';
import BasicInfoSection from '../components/budget/BasicInfoSection';
import BudgetSection from '../components/budget/BudgetSection';
import ExtrasSection from '../components/budget/ExtrasSection';
import TotalAmountCard from '../components/budget/TotalAmountCard';
import ConfigSidebar from '../components/ConfigSidebar';
import PaymentForm from '../components/budget/PaymentForm';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useBudgetCalculation } from '../hooks/useBudgetCalculation';
import { useBudgetSections } from '../hooks/useBudgetSections';
import { useTemplates } from '../hooks/useTemplates';
import { EnhancedBudget, BudgetItem, ValidationError } from '../types/EnhancedBudget';

const NewBudget: React.FC = () => {
  const navigate = useNavigate();
  const { openSections, toggleSection } = useBudgetSections();
  const { templates } = useTemplates();
  
  const [budget, setBudget] = useState<Partial<EnhancedBudget>>({
    clientName: '',
    eventDate: '',
    guestCount: 0,
    selectedMeals: [],
    selectedActivities: [],
    selectedTransport: [],
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

  const [extras, setExtras] = useState<number>(0);
  const [configSidebarOpen, setConfigSidebarOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: BudgetItem; type: string; index: number } | null>(null);

  const totalAmount = useBudgetCalculation({
    selectedMeals: selectedItems.meals.map(item => item.template) as any[],
    selectedActivities: selectedItems.activities.map(item => item.template) as any[],
    selectedTransport: selectedItems.transport.map(item => item.template) as any[],
    selectedStay: selectedItems.stay?.template as any,
    guestCount: budget.guestCount || 0,
    extras
  });

  const validateBudget = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Check for activities requiring transport
    selectedItems.activities.forEach(item => {
      const activity = item.template as any;
      if (activity.transportRequired && !item.includeTransport && selectedItems.transport.length === 0) {
        errors.push({
          section: 'activities',
          message: `Activity '${activity.name}' requires transport—please add or enable transport before closing.`,
          severity: 'warning'
        });
      }
    });

    return errors;
  };

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
      setSelectedItems(prev => ({ ...prev, stay: { ...prev.stay!, template: updated } }));
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [type]: (prev[type as keyof typeof prev] as BudgetItem[]).map((item, i) => 
          i === index ? { ...item, template: updated } : item
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

  const handleTransportToggle = (activityIndex: number, includeTransport: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      activities: prev.activities.map((item, i) =>
        i === activityIndex ? { ...item, includeTransport } : item
      )
    }));
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
      selectedStay: selectedItems.stay,
      extras,
      totalAmount,
      isClosed: true,
      paymentDetails
    };
    
    console.log('Saving budget with payment:', finalBudget);
    navigate('/budgets');
  };

  const errors = validateBudget();

  return (
    <Layout>
      <div className="flex">
        <div className="flex-1 space-y-6 pr-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/budgets')}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">New Budget</h1>
                <p className="text-slate-600">Create a new bachelor party budget</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setConfigSidebarOpen(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure Templates
            </Button>
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

          {/* Basic Information */}
          <BasicInfoSection
            clientName={budget.clientName || ''}
            eventDate={budget.eventDate || ''}
            guestCount={budget.guestCount || 0}
            isOpen={openSections.basicInfo}
            onToggle={() => toggleSection('basicInfo')}
            onClientNameChange={(value) => setBudget(prev => ({ ...prev, clientName: value }))}
            onEventDateChange={(value) => setBudget(prev => ({ ...prev, eventDate: value }))}
            onGuestCountChange={(value) => setBudget(prev => ({ ...prev, guestCount: value }))}
          />

          {/* Meals Section */}
          <BudgetSection
            title="Meals"
            count={selectedItems.meals.length}
            isOpen={openSections.meals}
            onToggle={() => toggleSection('meals')}
          >
            <MealsTemplate
              items={templates.meals}
              onSelect={(item) => handleSelect('meals', item)}
            />
            
            {selectedItems.meals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Selected Meals</h3>
                {selectedItems.meals.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">{item.template.name}</h4>
                      <p className="text-sm text-slate-600">{item.template.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingItem({ item, type: 'meals', index })}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemove('meals', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BudgetSection>

          {/* Activities Section */}
          <BudgetSection
            title="Activities"
            count={selectedItems.activities.length}
            isOpen={openSections.activities}
            onToggle={() => toggleSection('activities')}
          >
            <ActivitiesTemplate
              items={templates.activities}
              onSelect={(item) => handleSelect('activities', item)}
            />
            
            {selectedItems.activities.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Selected Activities</h3>
                {selectedItems.activities.map((item, index) => {
                  const activity = item.template as any;
                  return (
                    <div key={item.id} className="p-4 border rounded space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{activity.name}</h4>
                          <p className="text-sm text-slate-600">{activity.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingItem({ item, type: 'activities', index })}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRemove('activities', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      
                      {activity.transportRequired && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`transport-${item.id}`}
                            checked={item.includeTransport}
                            onCheckedChange={(checked) => handleTransportToggle(index, checked as boolean)}
                          />
                          <label 
                            htmlFor={`transport-${item.id}`} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include Transport?
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </BudgetSection>

          {/* Transport Section */}
          <BudgetSection
            title="Transport"
            count={selectedItems.transport.length}
            isOpen={openSections.transport}
            onToggle={() => toggleSection('transport')}
          >
            <TransportTemplate
              items={templates.transport}
              onSelect={(item) => handleSelect('transport', item)}
            />
            
            {selectedItems.transport.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Selected Transport</h3>
                {selectedItems.transport.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">{item.template.name}</h4>
                      <p className="text-sm text-slate-600">{item.template.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingItem({ item, type: 'transport', index })}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemove('transport', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BudgetSection>

          {/* Stay Section */}
          <BudgetSection
            title="Stay"
            count={selectedItems.stay ? 1 : 0}
            isOpen={openSections.stay}
            onToggle={() => toggleSection('stay')}
          >
            <StayTemplate
              items={templates.stay}
              onSelect={(item) => handleSelect('stay', item)}
            />
            
            {selectedItems.stay && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Selected Stay</h3>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h4 className="font-medium">{selectedItems.stay.template.name}</h4>
                    <p className="text-sm text-slate-600">{selectedItems.stay.template.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingItem({ item: selectedItems.stay!, type: 'stay', index: 0 })}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRemove('stay')}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </BudgetSection>

          {/* Extras Section */}
          <ExtrasSection
            extras={extras}
            isOpen={openSections.extras}
            onToggle={() => toggleSection('extras')}
            onExtrasChange={setExtras}
          />

          {/* Total Amount */}
          <TotalAmountCard totalAmount={totalAmount} />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveBudget}
              className="bg-slate-800 hover:bg-slate-700 px-8 py-3"
              size="lg"
            >
              Review & Save Budget
            </Button>
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
              <DialogTitle>Complete Budget</DialogTitle>
            </DialogHeader>
            <PaymentForm
              totalAmount={totalAmount}
              onPaymentComplete={handlePaymentComplete}
              onCancel={() => setShowPaymentForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit {editingItem.type === 'meals' ? 'Meal' : editingItem.type === 'activities' ? 'Activity' : editingItem.type === 'transport' ? 'Transport' : 'Stay'}</DialogTitle>
              </DialogHeader>
              {/* Template editing form would go here */}
              <Button onClick={() => setEditingItem(null)}>Save Changes</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default NewBudget;
