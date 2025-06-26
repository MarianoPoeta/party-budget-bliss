
import React, { useState } from 'react';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useTemplates } from '../hooks/useTemplates';

interface ConfigSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigSidebar: React.FC<ConfigSidebarProps> = ({ isOpen, onClose }) => {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTemplates();
  const [editingTemplate, setEditingTemplate] = useState<{ type: string; template: any } | null>(null);

  const handleSaveTemplate = (type: string, template: any) => {
    if (template.id) {
      updateTemplate(type, template.id, template);
    } else {
      addTemplate(type, template);
    }
    setEditingTemplate(null);
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

          <Tabs defaultValue="meals" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="meals">Meals</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="stay">Stay</TabsTrigger>
            </TabsList>

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
    </>
  );
};

export default ConfigSidebar;
