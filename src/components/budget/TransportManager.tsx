import React, { useState } from 'react';
import { Car, Users, Clock, MapPin, Plus, X, Link, Unlink, Calculator } from 'lucide-react';
import { TransportTemplate, ActivityTemplate } from '../../types/Budget';
import { TransportAssignment, ActivityTransportLink } from '../../types/EnhancedBudget';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface TransportManagerProps {
  transportTemplates: TransportTemplate[];
  selectedActivities: any[];
  transportAssignments: TransportAssignment[];
  onAddAssignment: (assignment: TransportAssignment) => void;
  onUpdateAssignment: (id: string, updates: Partial<TransportAssignment>) => void;
  onRemoveAssignment: (id: string) => void;
  onLinkToActivity: (transportId: string, activityId: string, guestCount: number) => void;
  onUnlinkFromActivity: (transportId: string) => void;
}

const TransportManager: React.FC<TransportManagerProps> = ({
  transportTemplates,
  selectedActivities,
  transportAssignments,
  onAddAssignment,
  onUpdateAssignment,
  onRemoveAssignment,
  onLinkToActivity,
  onUnlinkFromActivity
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedTransportId, setSelectedTransportId] = useState<string>('');
  const [newAssignment, setNewAssignment] = useState<Partial<TransportAssignment>>({
    guestCount: 0,
    duration: 1,
    distance: 0,
    pickupLocation: '',
    dropoffLocation: '',
    notes: ''
  });

  const vehicleTypeColors = {
    bus: 'bg-blue-50 text-blue-700 border-blue-200',
    minivan: 'bg-green-50 text-green-700 border-green-200',
    car: 'bg-slate-50 text-slate-700 border-slate-200',
    limousine: 'bg-purple-50 text-purple-700 border-purple-200',
    boat: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  };

  const handleAddAssignment = () => {
    if (newAssignment.transportTemplateId && newAssignment.guestCount && newAssignment.duration) {
      const template = transportTemplates.find(t => t.id === newAssignment.transportTemplateId);
      if (template) {
        const calculatedPrice = template.pricePerHour * newAssignment.duration!;
        const assignment: TransportAssignment = {
          id: Date.now().toString(),
          transportTemplateId: newAssignment.transportTemplateId!,
          transportTemplate: template,
          guestCount: newAssignment.guestCount!,
          duration: newAssignment.duration!,
          distance: newAssignment.distance,
          calculatedPrice,
          pickupLocation: newAssignment.pickupLocation,
          dropoffLocation: newAssignment.dropoffLocation,
          notes: newAssignment.notes
        };
        onAddAssignment(assignment);
        setIsAddDialogOpen(false);
        setNewAssignment({
          guestCount: 0,
          duration: 1,
          distance: 0,
          pickupLocation: '',
          dropoffLocation: '',
          notes: ''
        });
      }
    }
  };

  const handleLinkToActivity = (transportId: string, activityId: string, guestCount: number) => {
    onLinkToActivity(transportId, activityId, guestCount);
    setIsLinkDialogOpen(false);
  };

  const getLinkedActivity = (assignment: TransportAssignment) => {
    if (assignment.activityId) {
      return selectedActivities.find(activity => activity.id === assignment.activityId);
    }
    return null;
  };

  const getAvailableActivities = (assignment: TransportAssignment) => {
    return selectedActivities.filter(activity => 
      !transportAssignments.some(ta => 
        ta.id !== assignment.id && ta.activityId === activity.id
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Transport Management</h2>
        <p className="text-slate-700">Add transport services for your event. You can link them to specific activities or use them as standalone services.</p>
      </div>

      {/* Add Transport Assignment */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Transport Assignments
            </CardTitle>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transport
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Info Section */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Transport Options</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>Standalone Transport:</strong> Add transport services for general use (airport transfers, city tours, etc.)</p>
              <p>• <strong>Activity-Linked Transport:</strong> Link transport to specific activities that require transportation</p>
              <p>• <strong>Flexible Assignment:</strong> You can link/unlink transport to activities at any time</p>
            </div>
          </div>

          {transportAssignments.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No transport assigned</h3>
              <p className="text-slate-600 mb-4">Add transport options to get started</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                variant="outline"
                className="border-slate-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Transport
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transportAssignments.map((assignment) => {
                const linkedActivity = getLinkedActivity(assignment);
                const availableActivities = getAvailableActivities(assignment);
                
                return (
                  <div key={assignment.id} className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{assignment.transportTemplate.name}</h4>
                          <Badge className={`${vehicleTypeColors[assignment.transportTemplate.vehicleType]} font-medium`}>
                            {assignment.transportTemplate.vehicleType}
                          </Badge>
                          {linkedActivity && (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              <Link className="h-3 w-3 mr-1" />
                              Linked to {linkedActivity.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{assignment.transportTemplate.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-slate-700">Guests</span>
                            </div>
                            <p className="text-lg font-bold text-blue-600">{assignment.guestCount}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-slate-700">Duration</span>
                            </div>
                            <p className="text-lg font-bold text-green-600">{assignment.duration}h</p>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Calculator className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-slate-700">Price</span>
                            </div>
                            <p className="text-lg font-bold text-purple-600">${assignment.calculatedPrice}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Car className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-slate-700">Capacity</span>
                            </div>
                            <p className="text-lg font-bold text-orange-600">{assignment.transportTemplate.capacity}</p>
                          </div>
                        </div>

                        {assignment.pickupLocation && assignment.dropoffLocation && (
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>From: {assignment.pickupLocation}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>To: {assignment.dropoffLocation}</span>
                            </div>
                          </div>
                        )}

                        {assignment.notes && (
                          <p className="text-sm text-slate-600 italic">"{assignment.notes}"</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {!linkedActivity && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTransportId(assignment.id);
                              setIsLinkDialogOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Link className="h-4 w-4 mr-1" />
                            {availableActivities.length > 0 ? 'Link Activity' : 'Link Activity (Optional)'}
                          </Button>
                        )}
                        {linkedActivity && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUnlinkFromActivity(assignment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Unlink className="h-4 w-4 mr-1" />
                            Unlink
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemoveAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Transport Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Transport Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transportTemplate">Transport Type *</Label>
                <Select 
                  value={newAssignment.transportTemplateId} 
                  onValueChange={(value) => setNewAssignment(prev => ({ ...prev, transportTemplateId: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <span>{template.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {template.vehicleType}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guestCount">Number of Guests *</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={newAssignment.guestCount}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (hours) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newAssignment.duration}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                  className="mt-1"
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  value={newAssignment.distance}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, distance: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input
                  id="pickupLocation"
                  value={newAssignment.pickupLocation}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, pickupLocation: e.target.value }))}
                  className="mt-1"
                  placeholder="e.g., Hotel lobby"
                />
              </div>
              <div>
                <Label htmlFor="dropoffLocation">Dropoff Location</Label>
                <Input
                  id="dropoffLocation"
                  value={newAssignment.dropoffLocation}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                  className="mt-1"
                  placeholder="e.g., Activity venue"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newAssignment.notes}
                onChange={(e) => setNewAssignment(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1"
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAssignment} className="bg-green-600 hover:bg-green-700">
                Add Transport
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link to Activity Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Link Transport to Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getAvailableActivities(transportAssignments.find(ta => ta.id === selectedTransportId)!).length > 0 ? (
              <div>
                <Label htmlFor="activitySelect">Select Activity</Label>
                <Select onValueChange={(value) => {
                  const activity = selectedActivities.find(a => a.id === value);
                  if (activity) {
                    handleLinkToActivity(selectedTransportId, value, activity.guestCount || 0);
                  }
                }}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose an activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableActivities(transportAssignments.find(ta => ta.id === selectedTransportId)!).map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-600 mb-4">No activities available to link.</p>
                <p className="text-sm text-slate-500">You can add activities in the Activities tab and then link them here.</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransportManager; 