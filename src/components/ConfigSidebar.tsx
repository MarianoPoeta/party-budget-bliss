import React, { useState } from 'react';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useTemplates, TemplateType } from '../hooks/useTemplates';
import { Menu } from '../types/Menu';

interface ConfigSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigSidebar: React.FC<ConfigSidebarProps> = ({ isOpen, onClose }) => {
  const { templates, menus, addTemplate, updateTemplate, deleteTemplate, addMenu, updateMenu, deleteMenu } = useTemplates();
  const [editingTemplate, setEditingTemplate] = useState<{ type: TemplateType; template: any } | null>(null);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const handleSaveTemplate = (type: TemplateType, template: any) => {
    if (template.id) {
      updateTemplate(type, template.id, template);
    } else {
      addTemplate(type, template);
    }
    setEditingTemplate(null);
  };

  const handleSaveMenu = (menu: Menu) => {
    if (menu.id && menus.find(m => m.id === menu.id)) {
      updateMenu(menu.id, menu);
    } else {
      addMenu(menu);
    }
    setEditingMenu(null);
  };

  const TemplateForm = ({ type, template, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState(template || {});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {type === 'meals' && (
          <>
            <div>
              <Label htmlFor="pricePerPerson">Price per Person</Label>
              <Input
                id="pricePerPerson"
                type="number"
                value={formData.pricePerPerson || ''}
                onChange={(e) => setFormData({ ...formData, pricePerPerson: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="restaurant">Restaurant</Label>
              <Input
                id="restaurant"
                value={formData.restaurant || ''}
                onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
              />
            </div>
          </>
        )}

        {type === 'activities' && (
          <>
            <div>
              <Label htmlFor="basePrice">Base Price</Label>
              <Input
                id="basePrice"
                type="number"
                value={formData.basePrice || ''}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </>
        )}

        {type === 'transport' && (
          <>
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <select
                id="vehicleType"
                value={formData.vehicleType || 'car'}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md"
                required
              >
                <option value="car">Car</option>
                <option value="minivan">Minivan</option>
                <option value="bus">Bus</option>
                <option value="limousine">Limousine</option>
                <option value="boat">Boat</option>
              </select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacity (passengers)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="pricePerHour">Price per Hour ($)</Label>
              <Input
                id="pricePerHour"
                type="number"
                value={formData.pricePerHour || ''}
                onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) })}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="pricePerKm">Price per Km ($) (optional)</Label>
              <Input
                id="pricePerKm"
                type="number"
                value={formData.pricePerKm || ''}
                onChange={(e) => setFormData({ ...formData, pricePerKm: parseFloat(e.target.value) || undefined })}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includesDriver"
                checked={formData.includesDriver || false}
                onChange={(e) => setFormData({ ...formData, includesDriver: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="includesDriver">Includes Driver</Label>
            </div>
          </>
        )}

        {type === 'stay' && (
          <>
            <div>
              <Label htmlFor="pricePerNight">Price per Night ($)</Label>
              <Input
                id="pricePerNight"
                type="number"
                value={formData.pricePerNight || ''}
                onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) })}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="maxOccupancy">Max Occupancy</Label>
              <Input
                id="maxOccupancy"
                type="number"
                value={formData.maxOccupancy || ''}
                onChange={(e) => setFormData({ ...formData, maxOccupancy: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="roomType">Room Type</Label>
              <select
                id="roomType"
                value={formData.roomType || 'double'}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md"
                required
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="hostel">Hostel</option>
              </select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                value={formData.rating || ''}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                min="1"
                max="5"
                step="0.1"
              />
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Configure Templates</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="menus" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="menus">Menus</TabsTrigger>
              <TabsTrigger value="meals">Meals</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="stay">Stay</TabsTrigger>
            </TabsList>

            {/* Menus Tab */}
            <TabsContent value="menus" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Menus</h3>
                <Button
                  size="sm"
                  onClick={() => setEditingMenu({} as Menu)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {menus.map((menu) => (
                  <div key={menu.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{menu.name}</h4>
                        <p className="text-sm text-slate-600">{menu.description}</p>
                        <p className="text-xs text-slate-500">${menu.pricePerPerson}/person</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingMenu(menu)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMenu(menu.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Template Tabs */}
            {(['meals', 'activities', 'transport', 'stay'] as const).map((type) => (
              <TabsContent key={type} value={type} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                  <Button
                    size="sm"
                    onClick={() => setEditingTemplate({ type, template: null })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {templates[type].map((template) => (
                    <div key={template.id} className="border rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-slate-600">{template.description}</p>
                          {type === 'transport' && (
                            <div className="text-xs text-slate-500 mt-1">
                              <span className="capitalize">{template.vehicleType}</span> • 
                              {template.capacity} passengers • 
                              ${template.pricePerHour}/hour
                              {template.includesDriver && ' • Driver included'}
                            </div>
                          )}
                          {type === 'meals' && (
                            <div className="text-xs text-slate-500 mt-1">
                              ${template.pricePerPerson}/person • {template.restaurant}
                            </div>
                          )}
                          {type === 'activities' && (
                            <div className="text-xs text-slate-500 mt-1">
                              ${template.basePrice} • {template.location}
                            </div>
                          )}
                          {type === 'stay' && (
                            <div className="text-xs text-slate-500 mt-1">
                              ${template.pricePerNight}/night • {template.roomType} • {template.location}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingTemplate({ type, template })}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTemplate(type, template.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Template Edit Dialog */}
      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTemplate.template ? 'Edit' : 'Add'} {editingTemplate.type.slice(0, -1)}
              </DialogTitle>
            </DialogHeader>
            <TemplateForm
              type={editingTemplate.type}
              template={editingTemplate.template}
              onSave={(template: any) => handleSaveTemplate(editingTemplate.type, template)}
              onCancel={() => setEditingTemplate(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Menu Edit Dialog */}
      {editingMenu && (
        <Dialog open={!!editingMenu} onOpenChange={() => setEditingMenu(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMenu.id ? 'Edit' : 'Add'} Menu
              </DialogTitle>
            </DialogHeader>
            {/* Menu form would go here - for now just a simple form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="menuName">Menu Name</Label>
                <Input
                  id="menuName"
                  value={editingMenu.name || ''}
                  onChange={(e) => setEditingMenu({ ...editingMenu, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="menuDescription">Description</Label>
                <Textarea
                  id="menuDescription"
                  value={editingMenu.description || ''}
                  onChange={(e) => setEditingMenu({ ...editingMenu, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSaveMenu(editingMenu)}>Save</Button>
                <Button variant="outline" onClick={() => setEditingMenu(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ConfigSidebar;
