import React from 'react';
import { Save, X, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface BudgetFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  hasErrors: boolean;
  isDirty?: boolean;
}

const BudgetFormActions: React.FC<BudgetFormActionsProps> = ({
  onCancel,
  onSave,
  hasErrors,
  isDirty = false
}) => {
  return (
    <Card className="border-t-2 border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 flex items-center gap-2">
            {hasErrors ? (
              <>
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-red-600 font-medium">
                  Por favor corrige todos los errores antes de guardar
                </span>
              </>
            ) : isDirty ? (
              <span className="text-amber-600 font-medium">
                Tienes cambios sin guardar
              </span>
            ) : (
              <span>
                Revisa tu presupuesto y guarda cuando estés listo
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            
            <Button
              onClick={onSave}
              disabled={hasErrors}
              className={`flex items-center gap-2 ${
                hasErrors 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <Save className="h-4 w-4" />
              Guardar Presupuesto
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetFormActions;
