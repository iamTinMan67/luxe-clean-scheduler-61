
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Clock, Calendar, CheckCheck, Trash2, Timer, AlignCenter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type ServiceTask = {
  id: string;
  name: string;
  allocatedTime: number; // in minutes
  timeSpent: number; // in minutes
  completed: boolean;
};

type AppointmentTask = {
  id: string;
  appointmentName: string;
  customer: string;
  vehicle: string;
  dateScheduled: string;
  timeSlot: string;
  services: ServiceTask[];
  completed: boolean;
};

const TodoList = () => {
  const [appointments, setAppointments] = useState<AppointmentTask[]>([]);
  const [newAppointmentName, setNewAppointmentName] = useState("");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Try to load appointments from localStorage
    const savedAppointments = localStorage.getItem('appointmentTasks');
    if (savedAppointments) {
      try {
        const parsedAppointments = JSON.parse(savedAppointments);
        setAppointments(parsedAppointments);
      } catch (error) {
        console.error('Error parsing appointments:', error);
        // Add demo data if error occurs
        setAppointments(getDemoAppointments());
      }
    } else {
      // Add demo data if no appointments exist
      setAppointments(getDemoAppointments());
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appointmentTasks', JSON.stringify(appointments));
  }, [appointments]);

  const getDemoAppointments = (): AppointmentTask[] => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return [
      {
        id: "APT-001",
        appointmentName: "Premium Detailing Package",
        customer: "James Wilson",
        vehicle: "BMW X5",
        dateScheduled: today,
        timeSlot: "09:00-12:00",
        services: [
          {
            id: "SVC-001-1",
            name: "Exterior Wash & Decontamination",
            allocatedTime: 45,
            timeSpent: 30,
            completed: false
          },
          {
            id: "SVC-001-2",
            name: "Wheel & Tire Cleaning",
            allocatedTime: 30,
            timeSpent: 25,
            completed: true
          },
          {
            id: "SVC-001-3",
            name: "Paint Correction",
            allocatedTime: 60,
            timeSpent: 20,
            completed: false
          },
          {
            id: "SVC-001-4",
            name: "Ceramic Coating Application",
            allocatedTime: 45,
            timeSpent: 0,
            completed: false
          }
        ],
        completed: false
      },
      {
        id: "APT-002",
        appointmentName: "Interior Deep Clean",
        customer: "Sarah Johnson",
        vehicle: "Tesla Model 3",
        dateScheduled: today,
        timeSlot: "13:00-15:00",
        services: [
          {
            id: "SVC-002-1",
            name: "Vacuum & Floor Mats",
            allocatedTime: 30,
            timeSpent: 30,
            completed: true
          },
          {
            id: "SVC-002-2",
            name: "Dashboard & Console Cleaning",
            allocatedTime: 45,
            timeSpent: 25,
            completed: false
          },
          {
            id: "SVC-002-3",
            name: "Upholstery Shampooing",
            allocatedTime: 45,
            timeSpent: 0,
            completed: false
          }
        ],
        completed: false
      },
      {
        id: "APT-003",
        appointmentName: "Exterior Protection Package",
        customer: "Michael Brown",
        vehicle: "Audi Q7",
        dateScheduled: tomorrowStr,
        timeSlot: "10:00-13:00",
        services: [
          {
            id: "SVC-003-1",
            name: "Exterior Wash",
            allocatedTime: 30,
            timeSpent: 0,
            completed: false
          },
          {
            id: "SVC-003-2",
            name: "Paint Sealant Application",
            allocatedTime: 60,
            timeSpent: 0,
            completed: false
          },
          {
            id: "SVC-003-3",
            name: "Glass Treatment",
            allocatedTime: 30,
            timeSpent: 0,
            completed: false
          },
          {
            id: "SVC-003-4",
            name: "Tire Dressing",
            allocatedTime: 20,
            timeSpent: 0,
            completed: false
          }
        ],
        completed: false
      }
    ];
  };

  const addAppointment = () => {
    if (!newAppointmentName.trim()) return;

    const appointment: AppointmentTask = {
      id: `APT-${Date.now().toString().slice(-6)}`,
      appointmentName: newAppointmentName,
      customer: "New Customer",
      vehicle: "Not Specified",
      dateScheduled: new Date().toISOString().split('T')[0],
      timeSlot: "00:00-00:00",
      services: [],
      completed: false
    };

    setAppointments([appointment, ...appointments]);
    setNewAppointmentName("");
    toast.success("New appointment added");
  };

  const addService = (appointmentId: string) => {
    setAppointments(appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        const newService = {
          id: `SVC-${appointmentId}-${Date.now().toString().slice(-4)}`,
          name: "New Service Task",
          allocatedTime: 30,
          timeSpent: 0,
          completed: false
        };
        return {
          ...appointment,
          services: [...appointment.services, newService]
        };
      }
      return appointment;
    }));
    toast.success("New service task added");
  };

  const toggleServiceCompletion = (appointmentId: string, serviceId: string) => {
    setAppointments(appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        const updatedServices = appointment.services.map(service => {
          if (service.id === serviceId) {
            return { 
              ...service, 
              completed: !service.completed,
              // If marking complete and timeSpent < allocatedTime, set timeSpent to allocatedTime
              timeSpent: !service.completed && service.timeSpent < service.allocatedTime 
                ? service.allocatedTime 
                : service.timeSpent
            };
          }
          return service;
        });

        // Check if all services are completed
        const allCompleted = updatedServices.every(service => service.completed);
        
        return {
          ...appointment,
          services: updatedServices,
          completed: allCompleted
        };
      }
      return appointment;
    }));
  };

  const updateServiceName = (appointmentId: string, serviceId: string, name: string) => {
    setAppointments(appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          services: appointment.services.map(service => {
            if (service.id === serviceId) {
              return { ...service, name };
            }
            return service;
          })
        };
      }
      return appointment;
    }));
  };

  const updateServiceTime = (appointmentId: string, serviceId: string, allocatedTime: number) => {
    setAppointments(appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          services: appointment.services.map(service => {
            if (service.id === serviceId) {
              return { ...service, allocatedTime };
            }
            return service;
          })
        };
      }
      return appointment;
    }));
  };

  const updateTimeSpent = (appointmentId: string, serviceId: string, increment: number) => {
    setAppointments(appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          services: appointment.services.map(service => {
            if (service.id === serviceId) {
              // Don't exceed allocated time
              const newTimeSpent = Math.min(service.timeSpent + increment, service.allocatedTime);
              
              // If time spent equals allocated time, mark as complete
              const completed = newTimeSpent >= service.allocatedTime ? true : service.completed;
              
              return { 
                ...service, 
                timeSpent: newTimeSpent,
                completed
              };
            }
            return service;
          })
        };
      }
      return appointment;
    }));
  };

  const deleteService = (appointmentId: string, serviceId: string) => {
    setAppointments(appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          services: appointment.services.filter(service => service.id !== serviceId)
        };
      }
      return appointment;
    }));
    toast.success("Service task deleted");
  };

  const deleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
    toast.success("Appointment deleted");
  };

  const calculateAppointmentProgress = (services: ServiceTask[]) => {
    if (services.length === 0) return 0;
    
    const totalAllocatedTime = services.reduce((total, service) => total + service.allocatedTime, 0);
    const totalTimeSpent = services.reduce((total, service) => total + service.timeSpent, 0);
    
    return Math.round((totalTimeSpent / totalAllocatedTime) * 100);
  };

  // Format time from minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <AlignCenter size={24} className="mr-2 text-gold" />
          Staff To-Do List
        </h1>
        <p className="text-gold">Manage appointments and track service tasks</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-black/60 border-gold/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Scheduled Appointments</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new appointment..."
                  value={newAppointmentName}
                  onChange={(e) => setNewAppointmentName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAppointment()}
                  className="bg-black/40 border-gold/30 text-white"
                />
                <Button 
                  onClick={addAppointment}
                  className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
                >
                  <Plus size={16} className="mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <CheckCheck size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No appointments scheduled</p>
                  <p className="text-sm">Add a new appointment to get started</p>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <Card 
                    key={appointment.id} 
                    className={`bg-black/40 border ${
                      appointment.completed 
                        ? "border-green-500/30" 
                        : "border-gold/30"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className={`text-white ${appointment.completed ? "line-through text-green-400" : ""}`}>
                            {appointment.appointmentName}
                          </CardTitle>
                          <div className="mt-1 text-white/60 text-sm flex flex-wrap gap-4">
                            <span>{appointment.customer} • {appointment.vehicle}</span>
                            <span className="flex items-center">
                              <Calendar size={14} className="mr-1" /> 
                              {appointment.dateScheduled}
                            </span>
                            <span className="flex items-center">
                              <Clock size={14} className="mr-1" /> 
                              {appointment.timeSlot}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-gold/30 text-white hover:bg-gold/20"
                            onClick={() => addService(appointment.id)}
                          >
                            <Plus size={14} className="mr-1" /> Service
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAppointment(appointment.id)}
                            className="h-8 w-8 text-white/60 hover:text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Progress</span>
                          <span className="text-white/80">
                            {calculateAppointmentProgress(appointment.services)}%
                          </span>
                        </div>
                        <Progress
                          value={calculateAppointmentProgress(appointment.services)}
                          className="h-2 bg-black/40"
                        />
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <Table>
                        <TableHeader className="bg-black/30">
                          <TableRow>
                            <TableHead className="text-white/70 w-10"></TableHead>
                            <TableHead className="text-white/70">Service Task</TableHead>
                            <TableHead className="text-white/70 text-center"><Timer size={14} className="inline mr-1" />Allocated</TableHead>
                            <TableHead className="text-white/70 text-center"><Clock size={14} className="inline mr-1" />Progress</TableHead>
                            <TableHead className="text-white/70 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {appointment.services.map((service) => (
                            <TableRow key={service.id} className="border-b border-gray-800">
                              <TableCell className="py-3">
                                <Checkbox
                                  checked={service.completed}
                                  onCheckedChange={() => toggleServiceCompletion(appointment.id, service.id)}
                                />
                              </TableCell>
                              <TableCell className={service.completed ? "text-green-400 line-through" : "text-white"}>
                                <div className="min-w-[200px]">
                                  <Input
                                    value={service.name}
                                    onChange={(e) => updateServiceName(appointment.id, service.id, e.target.value)}
                                    className="bg-transparent border-transparent hover:border-gold/30 focus:border-gold/30 p-0 h-7"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="5"
                                  max="240"
                                  step="5"
                                  value={service.allocatedTime}
                                  onChange={(e) => updateServiceTime(appointment.id, service.id, parseInt(e.target.value) || 30)}
                                  className="w-20 text-center mx-auto bg-transparent border-transparent hover:border-gold/30 focus:border-gold/30 h-7"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-white/60">{formatTime(service.timeSpent)}</span>
                                    <span className="text-white/60">{formatTime(service.allocatedTime)}</span>
                                  </div>
                                  <Progress
                                    value={(service.timeSpent / service.allocatedTime) * 100}
                                    className="h-2 bg-black/40"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateTimeSpent(appointment.id, service.id, 5)}
                                    className="h-7 px-2 border-gold/30 text-white hover:bg-gold/20"
                                    disabled={service.completed || service.timeSpent >= service.allocatedTime}
                                  >
                                    +5m
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateTimeSpent(appointment.id, service.id, 15)}
                                    className="h-7 px-2 border-gold/30 text-white hover:bg-gold/20"
                                    disabled={service.completed || service.timeSpent >= service.allocatedTime}
                                  >
                                    +15m
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteService(appointment.id, service.id)}
                                    className="h-7 w-7 text-white/60 hover:text-red-400 hover:bg-red-500/20"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          
                          {appointment.services.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-white/60">
                                No service tasks added yet
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default TodoList;
