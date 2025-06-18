
import React from 'react';
import { useManualTaskForm } from '@/hooks/useManualTaskForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, ChevronUp, ChevronDown, User, Phone, Mail, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ManualTaskForm = () => {
  const {
    bookingDate,
    setBookingDate,
    timeSlot,
    setTimeSlot,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTaskUp,
    moveTaskDown,
    subtotal,
    travel,
    setTravel,
    other,
    setOther,
    total,
    handleSubmit,
    isSubmitting,
    customerData
  } = useManualTaskForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information (if pre-populated) */}
      {customerData && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-white">
              <User className="w-4 h-4 mr-2 text-green-400" />
              <span className="font-medium">Name:</span>
              <span className="ml-2">{customerData.customer}</span>
            </div>
            <div className="flex items-center text-white">
              <Phone className="w-4 h-4 mr-2 text-green-400" />
              <span className="font-medium">Phone:</span>
              <span className="ml-2">{customerData.phone}</span>
            </div>
            <div className="flex items-center text-white">
              <Mail className="w-4 h-4 mr-2 text-green-400" />
              <span className="font-medium">Email:</span>
              <span className="ml-2">{customerData.email}</span>
            </div>
            <div className="flex items-center text-white">
              <MapPin className="w-4 h-4 mr-2 text-green-400" />
              <span className="font-medium">Location:</span>
              <span className="ml-2">{customerData.location}</span>
            </div>
            {customerData.jobDetails && (
              <div className="md:col-span-2 text-white">
                <span className="font-medium">Job Details:</span>
                <span className="ml-2">{customerData.jobDetails}</span>
              </div>
            )}
            {customerData.notes && (
              <div className="md:col-span-2 text-white">
                <span className="font-medium">Notes:</span>
                <span className="ml-2">{customerData.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="booking-date" className="text-white">Booking Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !bookingDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bookingDate ? format(bookingDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={bookingDate}
                onSelect={setBookingDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time-slot" className="text-white">Time Slot</Label>
          <Input
            id="time-slot"
            type="time"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>
      </div>

      {/* Task Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-white text-lg">Task Items</Label>
          <Button
            type="button"
            onClick={addTask}
            variant="outline"
            size="sm"
            className="text-gold border-gold hover:bg-gold hover:text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {tasks.map((task, index) => (
          <div key={task.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <Label className="text-white">Job Description</Label>
                <Textarea
                  value={task.description}
                  onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter job description"
                  rows={2}
                  required
                />
              </div>
              
              <div>
                <Label className="text-white">Hours</Label>
                <Input
                  type="number"
                  step="0.25"
                  min="0"
                  value={task.hours}
                  onChange={(e) => updateTask(task.id, 'hours', parseFloat(e.target.value) || 0)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              
              <div>
                <Label className="text-white">Rate (£/hr)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={task.rate}
                  onChange={(e) => updateTask(task.id, 'rate', parseFloat(e.target.value) || 0)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              
              <div>
                <Label className="text-white">Cost (£)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={`£${task.cost.toFixed(2)}`}
                    disabled
                    className="bg-gray-700 border-gray-600 text-gray-300"
                  />
                  <div className="flex flex-col space-y-1">
                    <Button
                      type="button"
                      onClick={() => moveTaskUp(index)}
                      disabled={index === 0}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => moveTaskDown(index)}
                      disabled={index === tasks.length - 1}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-white">Sub Total</Label>
            <Input
              type="text"
              value={`£${subtotal.toFixed(2)}`}
              disabled
              className="bg-gray-700 border-gray-600 text-gray-300"
            />
          </div>
          
          <div>
            <Label className="text-white">Travel (£)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={travel}
              onChange={(e) => setTravel(parseFloat(e.target.value) || 0)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <Label className="text-white">Other (£)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={other}
              onChange={(e) => setOther(parseFloat(e.target.value) || 0)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <Label className="text-white font-bold">Total</Label>
            <Input
              type="text"
              value={`£${total.toFixed(2)}`}
              disabled
              className="bg-gold/20 border-gold text-gold font-bold"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || tasks.length === 0 || !bookingDate || !timeSlot}
          className="bg-gold text-black hover:bg-gold/90 font-bold px-8"
        >
          {isSubmitting ? 'Generating...' : 'Generate Job'}
        </Button>
      </div>
    </form>
  );
};

export default ManualTaskForm;
