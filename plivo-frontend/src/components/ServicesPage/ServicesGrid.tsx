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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
      {services.map((service) => (
        <div key={service.id} className="h-full">
          <ServiceCard
            service={service}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

export default ServicesGrid; 