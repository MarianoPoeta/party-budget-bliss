import { useState } from 'react';
import { useStore } from '../store';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';

const Profile = () => {
  const currentUser = useStore(s => s.currentUser);
  const setCurrentUser = useStore(s => s.setCurrentUser);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({ ...currentUser, name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="max-w-lg mx-auto py-12">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="h-16 w-16 mb-2">
          <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
        </Avatar>
        <span className="text-lg font-semibold text-slate-900">{currentUser.name}</span>
        <span className="text-xs text-slate-500">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</span>
      </div>
      <form onSubmit={handleSave} className="space-y-6 bg-white rounded-xl shadow p-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg font-medium">Guardar</Button>
        {saved && <div className="text-green-600 text-sm text-center mt-2">¡Perfil actualizado!</div>}
      </form>
    </div>
  );
};

export default Profile; 