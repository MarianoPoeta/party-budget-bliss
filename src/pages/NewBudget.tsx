
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MealsTemplate from '../components/MealsTemplate';
import ActivitiesTemplate from '../components/ActivitiesTemplate';
import TransportTemplate from '../components/TransportTemplate';
import StayTemplate from '../components/StayTemplate';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { 
  MealTemplate, 
  ActivityTemplate, 
  TransportTemplate as TransportTemplateType, 
  StayTemplate as StayTemplateType,
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

const NewBudget: React.FC = () => {
  const navigate = useNavigate();
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

  const [templates] = useState({
    meals: mockMeals,
    activities: mockActivities,
    transport: mockTransport,
    stay: mockStay
  });

  const [selectedItems, setSelectedItems] = useState<{
    meals: MealTemplate[];
    activities: ActivityTemplate[];
    transport: TransportTemplateType[];
    stay?: StayTemplateType;
  }>({
    meals: [],
    activities: [],
    transport: []
  });

  const [extras, setExtras] = useState<number>(0);
  
  const [openSections, setOpenSections] = useState<{
    basicInfo: boolean;
    meals: boolean;
    activities: boolean;
    transport: boolean;
    stay: boolean;
    extras: boolean;
  }>({
    basicInfo: true,
    meals: true,
    activities: true,
    transport: true,
    stay: true,
    extras: true
  });

  useEffect(() => {
    // Calculate total amount whenever items change
    const calculateTotal = () => {
      let total = 0;
      
      selectedItems.meals.forEach(meal => {
        total += meal.pricePerPerson * (budget.guestCount || 0);
      });
      
      selectedItems.activities.forEach(activity => {
        total += activity.basePrice;
        if (activity.transportRequired && activity.transportCost) {
          total += activity.transportCost;
        }
      });
      
      selectedItems.transport.forEach(transport => {
        total += transport.pricePerHour * 8; // Assuming 8 hours average
      });
      
      if (selectedItems.stay) {
        total += selectedItems.stay.pricePerNight * 2; // Assuming 2 nights
      }
      
      total += extras;
      
      setBudget(prev => ({ ...prev, totalAmount: total }));
    };

    calculateTotal();
  }, [selectedItems, budget.guestCount, extras]);

  const handleSelect = (type: string, item: any) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: type === 'stay' ? item : [...(prev[type as keyof typeof prev] as any[]), item]
    }));
  };

  const handleEdit = (type: string, index: number, updated: any) => {
    if (type === 'stay') {
      setSelectedItems(prev => ({ ...prev, stay: updated }));
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [type]: (prev[type as keyof typeof prev] as any[]).map((item, i) => i === index ? updated : item)
      }));
    }
  };

  const handleRemove = (type: string, index?: number) => {
    if (type === 'stay') {
      setSelectedItems(prev => ({ ...prev, stay: undefined }));
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [type]: (prev[type as keyof typeof prev] as any[]).filter((_, i) => i !== index)
      }));
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveBudget = () => {
    const finalBudget = {
      ...budget,
      selectedMeals: selectedItems.meals,
      selectedActivities: selectedItems.activities,
      selectedTransport: selectedItems.transport,
      selectedStay: selectedItems.stay,
      extras,
      totalAmount: budget.totalAmount
    };
    
    console.log('Saving budget:', finalBudget);
    // Here you would send the data to your backend
    navigate('/budgets');
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

        {/* Basic Information */}
        <Collapsible open={openSections.basicInfo} onOpenChange={() => toggleSection('basicInfo')}>
          <Card className="border-slate-200">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50">
                <CardTitle className="flex items-center justify-between">
                  Basic Information
                  {openSections.basicInfo ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Meals Section */}
        <Collapsible open={openSections.meals} onOpenChange={() => toggleSection('meals')}>
          <Card className="border-slate-200">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50">
                <CardTitle className="flex items-center justify-between">
                  Meals ({selectedItems.meals.length})
                  {openSections.meals ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <MealsTemplate
                  items={templates.meals}
                  onSelect={(item) => handleSelect('meals', item)}
                />
                
                {selectedItems.meals.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Selected Meals</h3>
                    {selectedItems.meals.map((meal, index) => (
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
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Activities Section */}
        <Collapsible open={openSections.activities} onOpenChange={() => toggleSection('activities')}>
          <Card className="border-slate-200">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50">
                <CardTitle className="flex items-center justify-between">
                  Activities ({selectedItems.activities.length})
                  {openSections.activities ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <ActivitiesTemplate
                  items={templates.activities}
                  onSelect={(item) => handleSelect('activities', item)}
                />
                
                {selectedItems.activities.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Selected Activities</h3>
                    {selectedItems.activities.map((activity, index) => (
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
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Transport Section */}
        <Collapsible open={openSections.transport} onOpenChange={() => toggleSection('transport')}>
          <Card className="border-slate-200">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50">
                <CardTitle className="flex items-center justify-between">
                  Transport ({selectedItems.transport.length})
                  {openSections.transport ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <TransportTemplate
                  items={templates.transport}
                  onSelect={(item) => handleSelect('transport', item)}
                />
                
                {selectedItems.transport.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Selected Transport</h3>
                    {selectedItems.transport.map((transport, index) => (
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
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Stay Section */}
        <Collapsible open={openSections.stay} onOpenChange={() => toggleSection('stay')}>
          <Card className="border-slate-200">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50">
                <CardTitle className="flex items-center justify-between">
                  Stay {selectedItems.stay && '(1)'}
                  {openSections.stay ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <StayTemplate
                  items={templates.stay}
                  onSelect={(item) => handleSelect('stay', item)}
                />
                
                {selectedItems.stay && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Selected Stay</h3>
                    <StayTemplate
                      items={[]}
                      editable
                      editableItem={selectedItems.stay}
                      onChange={(updated) => handleEdit('stay', 0, updated)}
                      onRemove={() => handleRemove('stay')}
                    />
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Extras Section */}
        <Collapsible open={openSections.extras} onOpenChange={() => toggleSection('extras')}>
          <Card className="border-slate-200">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50">
                <CardTitle className="flex items-center justify-between">
                  Extras
                  {openSections.extras ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-slate-700">Additional Costs</label>
                  <Input
                    type="number"
                    value={extras}
                    onChange={(e) => setExtras(Number(e.target.value) || 0)}
                    className="mt-1"
                    placeholder="Enter any additional costs..."
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Total Amount */}
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-slate-600 mr-2" />
                <span className="text-lg font-semibold text-slate-700">Total Amount</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">${budget.totalAmount?.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveBudget}
            className="bg-slate-800 hover:bg-slate-700 px-8 py-3"
            size="lg"
          >
            Save Budget
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NewBudget;
