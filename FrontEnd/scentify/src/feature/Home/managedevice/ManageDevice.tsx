import DeviceCard from './DeviceCard';

function ManageDevice() {
  return (
    <div className="content h-full p-4 overflow-y-auto scrollbar-hidden">
      {<DeviceCard></DeviceCard>}
    </div>
  );
}
export default ManageDevice;
