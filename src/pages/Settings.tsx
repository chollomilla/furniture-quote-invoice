import { useState, useEffect } from 'react';
import { StorageService } from '../services';
import { BusinessSettings } from '../types';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';

interface SettingsProps {
  onSaved: () => void;
}

function Settings({ onSaved }: SettingsProps) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const data = StorageService.getBusinessSettings();
    if (data) {
      setSettings(data);
      setFormData({
        businessName: data.businessName,
        phone: data.phone,
        address: data.address,
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings && formData.businessName && formData.phone) {
      StorageService.saveBusinessSettings({
        ...settings,
        ...formData,
      });
      onSaved();
    }
  };

  const isValid = formData.businessName.trim() && formData.phone.trim();

  return (
    <div className="max-w-4xl mx-auto">
      <Header title="Mipango" subtitle="Mpango wa Biashara" />

      <div className="p-4">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jina la Biashara *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Furniture Workshop"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Namba ya Simu *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="+255 XXX XXX XXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anwani
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="P.O. Box 123, Dar es Salaam"
              />
            </div>

            <Button type="submit" size="lg" fullWidth disabled={!isValid}>
              Hifadhi Mipango
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
