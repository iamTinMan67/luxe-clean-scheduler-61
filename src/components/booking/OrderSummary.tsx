
interface OrderSummaryProps {
  vehicleDetails: any[];
  totalPrice: string;
}

const OrderSummary = ({ vehicleDetails, totalPrice }: OrderSummaryProps) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>
      
      {vehicleDetails.length > 0 ? (
        <div className="space-y-4 mb-6">
          {vehicleDetails.map((vehicle: any, index: number) => (
            <div key={index} className="flex justify-between pb-2 border-b border-gray-800">
              <div className="text-gray-300">
                <div className="font-medium text-white">Vehicle {index + 1}</div>
                <div className="text-sm capitalize">{vehicle.type} ({vehicle.size})</div>
                <div className="text-sm">{vehicle.package.toUpperCase()} package</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mb-4">No vehicle details found. Please go back to services.</p>
      )}
      
      <div className="flex justify-between items-center text-xl font-bold">
        <span className="text-white">Total</span>
        <span className="text-gold">£{totalPrice}</span>
      </div>
    </>
  );
};

export default OrderSummary;
