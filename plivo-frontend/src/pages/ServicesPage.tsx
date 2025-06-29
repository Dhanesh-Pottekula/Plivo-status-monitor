import FullScreenLoader from "@/components/ui/full-screen-loader";
import { useServices } from "@/hooks/useServices";
import MainLayout from "./MainLayout";
import {
  CreateServiceModal,
  EditServiceModal,
  DeleteServiceModal,
  ServicesGrid,
  AlertMessage,
} from "@/components/ServicesPage";

function ServicesPage() {
  const {
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
  } = useServices();

  if (loading && !services?.length) {
    return <FullScreenLoader />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <CreateServiceModal
            isOpen={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateService}
          />
        </div>

 

        {/* Services Grid */}
        <ServicesGrid
          services={services || []}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onCreateService={() => setIsCreateModalOpen(true)}
        />

        {/* Edit Modal */}
        <EditServiceModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdateService}
        />

        {/* Delete Confirmation Modal */}
        <DeleteServiceModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          selectedService={selectedService}
          onConfirm={handleDeleteService}
        />
      </div>
    </MainLayout>
  );
}

export default ServicesPage;
