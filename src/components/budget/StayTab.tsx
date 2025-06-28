
import React from 'react';
import { Bed, MapPin, Star, Wifi, Car, Coffee, Waves } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

const StayTab: React.FC = () => {
  const amenityIcons = {
    'WiFi': Wifi,
    'Breakfast': Coffee,
    'Pool': Waves,
    'Parking': Car,
    'Gym': Bed,
    'Spa': Star,
    'Restaurant': Coffee,
    'Bar': Coffee
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Bed className="h-4 w-4" />
        <AlertDescription>
          Choose accommodation that fits your group size and budget. Room calculations are based on maximum occupancy.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Accommodation Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <Bed className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">Accommodation templates coming soon</p>
            <p className="text-sm mt-1">
              This section will allow you to browse and select accommodations
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-slate-600">Accommodation Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Location</p>
              <p>Choose locations near your planned activities to minimize travel time</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bed className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Room Configuration</p>
              <p>Consider the group dynamics when selecting single, double, or shared accommodations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Star className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Amenities</p>
              <p>Look for amenities that enhance the bachelor party experience</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StayTab;
