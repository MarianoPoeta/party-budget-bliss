
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MealsTemplate from '../components/MealsTemplate';
import ActivitiesTemplate from '../components/ActivitiesTemplate';
import TransportTemplate from '../components/TransportTemplate';
import StayTemplate from '../components/StayTemplate';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  MealTemplate, 
  ActivityTemplate, 
  TransportTemplate as TransportTemplateType, 
  StayTemplate as StayTemplateType, 
  BudgetItem,
  NewBudget as NewBudgetType 
} from '../types/Budget';

// Mock data - in a real app, these would come from your API
const mockMeals: MealTemplate[] = [
  {
    id: '1',
    name: 'Asado Premium',
    description: 'Traditional Argentine BBQ with premium cuts',
    type: 'dinner',
    pricePerPerson: 45,
    minPeople: 8,
    maxPeople: 30,
    restaurant: 'La Parrilla del Chef'
  },
  {
    id: '2',
    name: 'Wine Tasting Lunch',
    description: 'Gourmet lunch with local wine pairing',
    type: 'lunch',
    pricePerPerson: 35,
    minPeople: 6,
    maxPeople: 20,
    restaurant: 'Bodega Vista Andina'
  }
];

const mockActivities: ActivityTemplate[] = [
  {
    id: '1',
    name: 'Rafting Adventure',
    description: 'Exciting white water rafting experience',
    basePrice: 80,
    duration: 4,
    maxCapacity: 16,
    category: 'adventure',
    transportRequired: true,
    transportCost: 25,
    location: 'Rio Mendoza'
  },
  {
    id: '2',
    name: 'Casino Night',
    description: 'VIP casino experience with dinner',
    basePrice: 120,
    duration: 6,
    maxCapacity: 20,
    category: 'nightlife',
    transportRequired: false,
    location: 'Casino Central'
  }
];

const mockTransport: TransportTemplateType[] = [
  {
    id: '1',
    name: 'Luxury Minivan',
    description: 'Comfortable transport for small groups',
    vehicleType: 'minivan',
    capacity: 8,
    pricePerHour: 45,
    pricePerKm: 2,
    includesDriver: true
  },
  {
    id: '2',
    name: 'Party Bus',
    description: 'Large bus with entertainment system',
    vehicleType: 'bus',
    capacity: 25,
    pricePerHour: 120,
    pricePerKm: 3,
    includesDriver: true
  }
];

const mockStay: StayTemplateType[] = [
  {
    id: '1',
    name: 'Mountain Lodge',
    description: 'Cozy lodge with mountain views',
    pricePerNight: 150,
    maxOccupancy: 4,
    roomType: 'suite',
    amenities: ['WiFi', 'Breakfast', 'Pool', 'Spa'],
    location: 'Las Leñas',
    rating: 4.5
  },
  {
    id: '2',
    name: 'Downtown Hotel',
    description: 'Modern hotel in city center',
    pricePerNight: 120,
    maxOccupancy: 2,
    roomType: 'double',
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar'],
    location: 'Mendoza Centro',
    rating: 4.2
  }
];

const steps = ['Basic Info', 'Meals', 'Activities', 'Transport', 'Stay', 'Review'];

const NewBudget: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [budget, setBudget] = useState<Partial<NewBudgetType>>({
    clientName: '',
    eventDate: '',
    guestCount: 0,
    selectedMeals: [],
    selectedActivities: [],
    selectedTransport: [],
    selectedStay: undefined,
    totalAmount: 0
  });

  const [templates, setTemplates] = useState({
    meals: mockMeals,
    activities: mockActivities,
    transport: mockTransport,
    stay: mockStay
  });

  const [editingItems, setEditingItems] = useState<{
    meals: MealTemplate[];
    activities: ActivityTemplate[];
    transport: TransportTemplateType[];
    stay?: StayTemplateType;
  }>({
    meals: [],
    activities: [],
    transport: []
  });

  useEffect(() => {
    // Calculate total amount whenever items change
    const calculateTotal = () => {
      let total = 0;
      
      editingItems.meals.forEach(meal => {
        total += meal.pricePerPerson * (budget.guestCount || 0);
      });
      
      editingItems.activities.forEach(activity => {
        total += activity.basePrice;
        if (activity.transportRequired && activity.transportCost) {
          total += activity.transportCost;
        }
      });
      
      editingItems.transport.forEach(transport => {
        total += transport.pricePerHour * 8; // Assuming 8 hours average
      });
      
      if (editingItems.stay) {
        total += editingItems.stay.pricePerNight * 2; // Assuming 2 nights
      }
      
      setBudget(prev => ({ ...prev, totalAmount: total }));
    };

    calculateTotal();
  }, [editingItems, budget.guestCount]);

  const handleSelect = (type: string, item: any) => {
    setEditingItems(prev => ({
      ...prev,
      [type]: type === 'stay' ? item : [...(prev[type as keyof typeof prev] as any[]), item]
    }));
  };

  const handleEdit = (type: string, index: number, updated: any) => {
    if (type === 'stay') {
      setEditingItems(prev => ({ ...prev, stay: updated }));
    } else {
      setEditingItems(prev => ({
        ...prev,
        [type]: (prev[type as keyof typeof prev] as any[]).map((item, i) => i === index ? updated : item)
      }));
    }
  };

  const handleRemove = (type: string, index?: number) => {
    if (type === 'stay') {
      setEditingItems(prev => ({ ...prev, stay: undefined }));
    } else {
      setEditingItems(prev => ({
        ...prev,
        [type]: (prev[type as keyof typeof prev] as any[]).filter((_, i) => i !== index)
      }));
    }
  };

  const handleSaveBudget = () => {
    console.log('Saving budget:', budget);
    console.log('Selected items:', editingItems);
    // Here you would send the data to your backend
    navigate('/budgets');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Client Name</label>
                <Input
                  value={budget.clientName || ''}
                  onChange={(e) => setBudget(prev => ({ ...prev, clientName: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Event Date</label>
                <Input
                  type="date"
                  value={budget.eventDate || ''}
                  onChange={(e) => setBudget(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Guest Count</label>
                <Input
                  type="number"
                  value={budget.guestCount || ''}
                  onChange={(e) => setBudget(prev => ({ ...prev, guestCount: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <div className="space-y-6">
            <MealsTemplate
              items={templates.meals}
              onSelect={(item) => handleSelect('meals', item)}
            />
            
            {editingItems.meals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Selected Meals</h3>
                {editingItems.meals.map((meal, index) => (
                  <MealsTemplate
                    key={index}
                    items={[]}
                    editable
                    editableItem={meal}
                    onChange={(updated) => handleEdit('meals', index, updated)}
                    onRemove={() => handleRemove('meals', index)}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <ActivitiesTemplate
              items={templates.activities}
              onSelect={(item) => handleSelect('activities', item)}
            />
            
            {editingItems.activities.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Selected Activities</h3>
                {editingItems.activities.map((activity, index) => (
                  <ActivitiesTemplate
                    key={index}
                    items={[]}
                    editable
                    editableItem={activity}
                    onChange={(updated) => handleEdit('activities', index, updated)}
                    onRemove={() => handleRemove('activities', index)}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <TransportTemplate
              items={templates.transport}
              onSelect={(item) => handleSelect('transport', item)}
            />
            
            {editingItems.transport.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Selected Transport</h3>
                {editingItems.transport.map((transport, index) => (
                  <TransportTemplate
                    key={index}
                    items={[]}
                    editable
                    editableItem={transport}
                    onChange={(updated) => handleEdit('transport', index, updated)}
                    onRemove={() => handleRemove('transport', index)}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <StayTemplate
              items={templates.stay}
              onSelect={(item) => handleSelect('stay', item)}
            />
            
            {editingItems.stay && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Selected Stay</h3>
                <StayTemplate
                  items={[]}
                  editable
                  editableItem={editingItems.stay}
                  onChange={(updated) => handleEdit('stay', 0, updated)}
                  onRemove={() => handleRemove('stay')}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Budget Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Client:</span>
                  <span className="ml-2">{budget.clientName}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Date:</span>
                  <span className="ml-2">{budget.eventDate}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Guests:</span>
                  <span className="ml-2">{budget.guestCount}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Total:</span>
                  <span className="ml-2 text-lg font-bold text-slate-900">${budget.totalAmount}</span>
                </div>
              </div>

              <div className="space-y-4">
                {editingItems.meals.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Meals ({editingItems.meals.length})</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {editingItems.meals.map((meal, index) => (
                        <li key={index}>• {meal.name} - ${meal.pricePerPerson}/person</li>
                      ))}
                    </ul>
                  </div>
                )}

                {editingItems.activities.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Activities ({editingItems.activities.length})</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {editingItems.activities.map((activity, index) => (
                        <li key={index}>• {activity.name} - ${activity.basePrice}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {editingItems.transport.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Transport ({editingItems.transport.length})</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {editingItems.transport.map((transport, index) => (
                        <li key={index}>• {transport.name} - ${transport.pricePerHour}/hour</li>
                      ))}
                    </ul>
                  </div>
                )}

                {editingItems.stay && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Stay</h4>
                    <ul className="text-sm text-slate-600">
                      <li>• {editingItems.stay.name} - ${editingItems.stay.pricePerNight}/night</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
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
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index <= currentStep ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= currentStep ? 'text-slate-900' : 'text-slate-500'
              }`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-px mx-4 ${
                  index < currentStep ? 'bg-slate-800' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-96">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSaveBudget}
              className="bg-slate-800 hover:bg-slate-700 flex items-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Budget
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-slate-800 hover:bg-slate-700 flex items-center"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewBudget;
