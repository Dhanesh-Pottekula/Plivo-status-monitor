import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getServicesAction, 
  createServiceAction, 
  updateServiceAction, 
  deleteServiceAction 
} from '@/_redux/actions/services.actions';
import type { ServiceInterface, ServiceStatusType } from '@/_constants/Interfaces/ServicesInterface';
import type { RootState, AppDispatch } from '@/_redux/store';

interface ServiceFormData {
  name: string;
  description: string;
  currentStatus: ServiceStatusType;
  publiclyVisible: boolean;
}

const initialFormData: ServiceFormData = {
  name: "",
  description: "",
  currentStatus: "operational",
  publiclyVisible: true,
};
export const useServices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { services, loading, message, error, type } = useSelector((state: RootState) => state.getServicesListReducer);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceInterface | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  useEffect(() => {
    getServicesList();
  }, [dispatch]);
  const getServicesList = async () => {
    const result = await dispatch(getServicesAction());
    if (result.success) {
      return result.data;
    }
  };

  const handleCreateService = async () => {
    const result = await createService(formData);
    getServicesList()
    if (result.success) {
      setIsCreateModalOpen(false);
      setFormData(initialFormData);
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService) return;
    
    const result = await updateService(selectedService.id, formData);
    getServicesList()
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedService(null);
      setFormData(initialFormData);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;
    
    const result = await deleteService(selectedService.id);
    getServicesList()
    if (result.success) {
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    }
  };

  const openEditModal = (service: ServiceInterface) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      currentStatus: service.currentStatus,
      publiclyVisible: service.publiclyVisible,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (service: ServiceInterface) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };
 

  const createService = async (serviceData: Partial<ServiceInterface>) => {
    try {
      await dispatch(createServiceAction(serviceData));
      return { success: true };
    } catch (error) {
      console.error('Failed to create service:', error);
      return { success: false, error };
    }
  };

  const updateService = async (id: number, serviceData: Partial<ServiceInterface>) => {
    try {
      await dispatch(updateServiceAction(id, serviceData));
      return { success: true };
    } catch (error) {
      console.error('Failed to update service:', error);
      return { success: false, error };
    }
  };

  const deleteService = async (id: number) => {
    try {
      await dispatch(deleteServiceAction(id));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete service:', error);
      return { success: false, error };
    }
  };


  return {
    services,
    loading,
    message,
    error,
    type,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedService,
    formData,
    setFormData,
    handleCreateService,
    openEditModal,
    openDeleteModal,
    handleUpdateService,
    handleDeleteService,
  };
};