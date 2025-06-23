
const TaskTableHeader = () => {
  return (
    <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-400 px-1">
      <div className="col-span-5">Task</div>
      <div className="col-span-2 text-center">Status</div>
      <div className="col-span-2 text-center">Allocated</div>
      <div className="col-span-3 text-center">Actual Time</div>
    </div>
  );
};

export default TaskTableHeader;
