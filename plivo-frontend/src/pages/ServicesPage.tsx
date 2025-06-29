import FullScreenLoader from "@/components/ui/full-screen-loader";
import { useServices } from "@/hooks/useServices";
import MainLayout from "./MainLayout";
import {
  CreateServiceModal,
  EditServiceModal,
  DeleteServiceModal,
  ServicesGrid,
} from "@/components/ServicesPage";
import TimelineComponent from "@/components/TimelineComponent";

function ServicesPage() {
  const {
    services,
    loading,
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
      <div className="container mx-auto p-6 bg-white space-y-6">
        {/* Services Grid */}

        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-700">{}Services</h3>
        <CreateServiceModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateService}
        />
      </div>
        <ServicesGrid
          services={services || []}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onCreateService={() => setIsCreateModalOpen(true)}
        />
        <TimelineComponent title="Organization Timeline" />
      </div>


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
    </MainLayout>
  );
}

export default ServicesPage;
