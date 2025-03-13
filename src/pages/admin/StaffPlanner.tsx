
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

const StaffPlanner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("daily");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Staff Planner</h1>
        <p className="text-gold">Manage your team's schedule and assignments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle className="text-white">Staff Members</CardTitle>
            <CardDescription className="text-gold/70">
              Select staff for scheduling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["John Smith", "Sarah Johnson", "Michael Brown", "Emma Wilson", "David Lee"].map((staff) => (
                <div key={staff} className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded">
                  <input type="checkbox" id={staff} className="rounded text-gold" />
                  <label htmlFor={staff} className="text-white cursor-pointer">{staff}</label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-black/60 border-gold/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Schedule View</CardTitle>
                <CardDescription className="text-gold/70">
                  Plan and organize team assignments
                </CardDescription>
              </div>
              <Tabs defaultValue="daily" value={view} onValueChange={setView}>
                <TabsList className="bg-black/60">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="bg-black/30 border border-gold/30 rounded-md"
                />
              </div>
              
              <div className="flex-1">
                <TabsContent value="daily" className="mt-0">
                  <h3 className="text-xl text-white font-medium mb-4">
                    {date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="space-y-2">
                    {["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"].map((time) => (
                      <div key={time} className="border border-gold/20 rounded-md p-3 bg-black/40">
                        <p className="text-gold font-medium">{time}</p>
                        <p className="text-white/80">No assignments</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="weekly" className="mt-0">
                  <h3 className="text-xl text-white font-medium mb-4">Week View</h3>
                  <p className="text-white/70">Weekly schedule view coming soon</p>
                </TabsContent>
                
                <TabsContent value="monthly" className="mt-0">
                  <h3 className="text-xl text-white font-medium mb-4">Month View</h3>
                  <p className="text-white/70">Monthly schedule view coming soon</p>
                </TabsContent>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default StaffPlanner;
