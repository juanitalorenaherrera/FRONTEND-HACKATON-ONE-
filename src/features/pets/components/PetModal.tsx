// features/pets/components/PetModal.tsx

import type { CreatePetRequest, Pet } from '../../../types/pets';
import { Edit3, Plus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuthStore } from '../../../store/AuthStore';
import { usePetsActions } from '../hooks/usePetsActions';

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet?: Pet | null;
  type: 'ADD' | 'EDIT' | null;
}

// Opciones predefinidas
const SPECIES_OPTIONS = [
  'Perro',
  'Gato',
  'Ave',
  'Pez',
  'Conejo',
  'Hámster',
  'Otro'
];

const GENDER_OPTIONS = [
  { value: 'macho', label: 'Macho' },
  { value: 'hembra', label: 'Hembra' },
  { value: 'no_especificado', label: 'No especificado' }
];

export function PetModal({ isOpen, onClose, pet, type }: PetModalProps) {
  const { addPet, updatePet: updatePetAction, isLoading } = usePetsActions();
  const user = useAuthStore((state) => state.profile);

  // Estado del formulario
  const [formData, setFormData] = useState<CreatePetRequest>({
    accountId: user?.accountId || 0,
    name: '',
    species: '',
    breed: '',
    age: 0,
    weight: undefined,
    gender: 'no_especificado',
    active: true,
    medicalNotes: '',
    specialCare: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customSpecies, setCustomSpecies] = useState('');

  // Cargar datos del pet cuando es modo edición
  useEffect(() => {
    if (type === 'EDIT' && pet) {
      setFormData({
        accountId: pet.accountId,
        name: pet.name,
        species: pet.species || '',
        breed: pet.breed || '',
        age: pet.age || 0,
        weight: pet.weight,
        gender: pet.gender || 'no_especificado',
        active: pet.active,
        medicalNotes: pet.medicalNotes || '',
        specialCare: pet.specialCare || false
      });
      
      // Si la especie no está en las opciones predefinidas, usar custom
      if (pet.species && !SPECIES_OPTIONS.includes(pet.species)) {
        setCustomSpecies(pet.species);
        setFormData(prev => ({ ...prev, species: 'Otro' }));
      }
    } else if (type === 'ADD') {
      // Resetear formulario para modo agregar
      setFormData({
        accountId: user?.accountId || 0,
        name: '',
        species: '',
        breed: '',
        age: 0,
        weight: undefined,
        gender: 'no_especificado',
        active: true,
        medicalNotes: '',
        specialCare: false
      });
      setCustomSpecies('');
    }
    setErrors({});
  }, [type, pet, user?.accountId]);

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.species) {
      newErrors.species = 'La especie es obligatoria';
    }

    if (formData.species === 'Otro' && !customSpecies.trim()) {
      newErrors.customSpecies = 'Especifica la especie';
    }

    if (formData.age < 0 || formData.age > 50) {
      newErrors.age = 'La edad debe estar entre 0 y 50 años';
    }

    if (formData.weight !== undefined && (formData.weight <= 0 || formData.weight > 200)) {
      newErrors.weight = 'El peso debe estar entre 0 y 200 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleChange = (field: keyof CreatePetRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario modifica
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Preparar datos finales
      const finalData = {
        ...formData,
        species: formData.species === 'Otro' ? customSpecies : formData.species,
        weight: formData.weight || undefined
      };

      if (type === 'ADD') {
        await addPet(finalData);
      } else if (type === 'EDIT' && pet) {
        await updatePetAction(pet.id, finalData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving pet:', error);
    }
  };

  if (!isOpen) return null;

  const isEditMode = type === 'EDIT';
  const title = isEditMode ? 'Editar Mascota' : 'Agregar Nueva Mascota';
  const Icon = isEditMode ? Edit3 : Plus;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Max, Luna, Firulais"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Especie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especie *
            </label>
            <select
              value={formData.species}
              onChange={(e) => handleChange('species', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.species ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar especie</option>
              {SPECIES_OPTIONS.map(species => (
                <option key={species} value={species}>{species}</option>
              ))}
            </select>
            {errors.species && <p className="text-red-500 text-xs mt-1">{errors.species}</p>}
          </div>

          {/* Campo personalizado para "Otro" */}
          {formData.species === 'Otro' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especificar especie *
              </label>
              <input
                type="text"
                value={customSpecies}
                onChange={(e) => setCustomSpecies(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.customSpecies ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Iguana, Serpiente, etc."
              />
              {errors.customSpecies && <p className="text-red-500 text-xs mt-1">{errors.customSpecies}</p>}
            </div>
          )}

          {/* Raza */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raza
            </label>
            <input
              type="text"
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ej: Labrador, Persa, Mestizo"
            />
          </div>

          {/* Edad y Peso */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad (años)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.age ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                min="0"
                max="200"
                step="0.1"
                value={formData.weight || ''}
                onChange={(e) => handleChange('weight', parseFloat(e.target.value) || undefined)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.weight ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Opcional"
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
            </div>
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {GENDER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notas médicas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas médicas
            </label>
            <textarea
              value={formData.medicalNotes}
              onChange={(e) => handleChange('medicalNotes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Alergias, medicamentos, condiciones especiales..."
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.specialCare}
                onChange={(e) => handleChange('specialCare', e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Requiere cuidados especiales</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Mascota activa</span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <Save className="w-4 h-4" />
              {isEditMode ? 'Guardar Cambios' : 'Crear Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}