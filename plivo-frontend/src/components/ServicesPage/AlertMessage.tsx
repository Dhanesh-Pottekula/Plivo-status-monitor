interface AlertMessageProps {
  message: string;
  type?: "alert-success" | "alert-error" | "alert-info";
}

function AlertMessage({ message, type = "alert-info" }: AlertMessageProps) {
  const getAlertStyles = () => {
    switch (type) {
      case "alert-success":
        return "bg-green-50 text-green-800 border border-green-200";
      case "alert-error":
        return "bg-red-50 text-red-800 border border-red-200";
      default:
        return "bg-blue-50 text-blue-800 border border-blue-200";
    }
  };

  return (
    <div className={`p-4 rounded-md ${getAlertStyles()}`}>
      {message}
    </div>
  );
}

export default AlertMessage; 