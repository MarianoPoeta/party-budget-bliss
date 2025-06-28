
import React from 'react';
import { Car, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

const TransportTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <Car className="h-4 w-4" />
        <AlertDescription>
          Transport options will be automatically calculated based on selected activities that require transportation.
          You can also add standalone transport services here.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5" />
            Transport Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <Car className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">Transport templates coming soon</p>
            <p className="text-sm mt-1">
              This section will allow you to add dedicated transport services
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-slate-600">Transport Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Timing Considerations</p>
              <p>Factor in travel time between venues and activities</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Group Size</p>
              <p>Choose vehicles that accommodate your entire group comfortably</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Car className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Vehicle Types</p>
              <p>Consider luxury options for special occasions or practical choices for longer distances</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportTab;
