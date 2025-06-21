import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePackageManager } from "@/hooks/usePackageManager";
import PackageTaskList from "@/components/package-management/PackageTaskList";
import TaskFormDialog from "@/components/package-management/TaskFormDialog";
import PackageSelector from "@/components/package-management/PackageSelector";
import PackageDistribution from "@/components/dashboard/PackageDistribution";

const ManagePackages = () => {
  const {
    packages,
    selectedPackage,
    setSelectedPackage,
    tasks,
    loading,
    open,
    setOpen,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleToggleTaskCompletion,
    searchTerm,
    setSearchTerm,
    filteredPackages
  } = usePackageManager();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <Link 
          to="/admin/management" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Management</span>
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Packages</h1>
        <p className="text-gold">Configure service packages and tasks</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>Package Tasks</span>
              <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="package-tasks" className="w-full">
              <TabsList>
                <TabsTrigger value="package-tasks">Tasks</TabsTrigger>
                <TabsTrigger value="package-selector">Selector</TabsTrigger>
              </TabsList>
              <TabsContent value="package-tasks">
                <PackageTaskList
                  tasks={tasks}
                  loading={loading}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onToggleTaskCompletion={handleToggleTaskCompletion}
                />
              </TabsContent>
              <TabsContent value="package-selector">
                <PackageSelector
                  packages={packages}
                  selectedPackage={selectedPackage}
                  onSelectPackage={setSelectedPackage}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filteredPackages={filteredPackages}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle className="text-white">Package Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PackageDistribution />
          </CardContent>
        </Card>
      </div>

      <TaskFormDialog
        open={open}
        setOpen={setOpen}
        onCreateTask={handleCreateTask}
        selectedPackage={selectedPackage}
      />
    </motion.div>
  );
};

export default ManagePackages;
