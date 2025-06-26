
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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
import { Button } from '../components/ui/button';
import { useBudgetCalculation } from '../hooks/useBudgetCalculation';
import { useBudgetSections } from '../hooks/useBudgetSections';
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
  const { openSections, toggleSection } = useBudgetSections();
  
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

  const totalAmount = useBudgetCalculation({
    selectedMeals: selectedItems.meals,
    selectedActivities: selectedItems.activities,
    selectedTransport: selectedItems.transport,
    selectedStay: selectedItems.stay,
    guestCount: budget.guestCount || 0,
    extras
  });

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

  const handleSaveBudget = () => {
    const finalBudget = {
      ...budget,
      selectedMeals: selectedItems.meals,
      selectedActivities: selectedItems.activities,
      selectedTransport: selectedItems.transport,
      selectedStay: selectedItems.stay,
      extras,
      totalAmount
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
              <StayTemplate
                items={[]}
                editable
                editableItem={selectedItems.stay}
                onChange={(updated) => handleEdit('stay', 0, updated)}
                onRemove={() => handleRemove('stay')}
              />
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
            Save Budget
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NewBudget;
