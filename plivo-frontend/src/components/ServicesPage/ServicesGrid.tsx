import ServiceCard from "./ServiceCard";
import EmptyState from "./EmptyState";
import { type ServiceInterface } from "./types";

interface ServicesGridProps {
  services: ServiceInterface[];
  onEdit: (service: ServiceInterface) => void;
  onDelete: (service: ServiceInterface) => void;
  onCreateService: () => void;
}

function ServicesGrid({ services, onEdit, onDelete, onCreateService }: ServicesGridProps) {
  if (!services || services.length === 0) {
    return <EmptyState onCreateService={onCreateService} />;
  }

  return (
    <div className="w-full max-h-[60vh] bg-white p-4 overflow-y-auto shadow-md">
      {/* Card Container with responsive grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
        {services.map((service) => (
          <div key={service.id} className="w-full">
            <ServiceCard
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesGrid; 