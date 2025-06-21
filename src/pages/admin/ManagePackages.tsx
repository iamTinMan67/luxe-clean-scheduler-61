
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { packageOptions } from "@/data/packageOptions";
import { ServiceTask } from "@/lib/types";
import PackageSelector from "@/components/package-management/PackageSelector";
import PackageTaskList from "@/components/package-management/PackageTaskList";
import TaskOperations from "@/components/package-management/TaskOperations";
import PackageDistribution from "@/components/dashboard/PackageDistribution";
import { usePackageManager } from "@/hooks/usePackageManager";
import { DashboardData } from "@/components/dashboard/DashboardData";

const ManagePackages = () => {
  const {
    packages,
    selectedPackageType,
    selectedPackage,
    handleSelectPackage,
    handleSaveTask,
    handleDeleteTask,
    handleMoveTask,
    handleMoveToPackage,
    handleUpdateTaskDuration
  } = usePackageManager(packageOptions);

  const { packageData } = DashboardData();

  const handleAddTask = () => {
    document.getElementById("add-task-button")?.click();
  };
  
  const handleEditTask = (task: ServiceTask) => {
    document.getElementById("edit-task-button")?.click();
  };

  return (
    <div className="container py-20 px-4 mx-auto max-w-7xl text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Packages</h1>
        <p className="text-gold/70 mt-2">
          Update service packages, manage tasks, and set durations
        </p>
      </div>

      {/* Service Package Distribution */}
      <div className="mb-8">
        <PackageDistribution data={packageData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {/* Package Selector */}
        <div className="md:col-span-1">
          <PackageSelector 
            packages={packages}
            selectedPackage={selectedPackageType}
            onSelectPackage={handleSelectPackage}
          />
        </div>
        
        {/* Package Details */}
        <div className="md:col-span-3 space-y-6">
          {selectedPackage ? (
            <>
              <Card className="bg-black/60 border-gold/30">
                <CardHeader>
                  <CardTitle className="text-white">{selectedPackage.name}</CardTitle>
                  <CardDescription className="text-gold/70">
                    Base Price: £{selectedPackage.basePrice} - {selectedPackage.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PackageTaskList 
                    packageOption={selectedPackage}
                    allPackages={packages}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onMoveTask={handleMoveTask}
                    onUpdateTaskDuration={handleUpdateTaskDuration}
                    onMoveToPackage={handleMoveToPackage}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-black/60 border-gold/30">
              <CardContent className="p-12 text-center">
                <p className="text-white text-lg">
                  Select a package from the left to manage its tasks
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Task Operations Dialog Handlers */}
      <TaskOperations 
        selectedPackage={selectedPackage}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default ManagePackages;
