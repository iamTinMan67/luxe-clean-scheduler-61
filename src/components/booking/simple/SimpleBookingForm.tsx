
import React from 'react';
import { useSimpleBookingForm } from '@/hooks/useSimpleBookingForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const SimpleBookingForm = () => {
  const {
    yourName,
    setYourName,
    postcode,
    setPostcode,
    phone,
    setPhone,
    email,
    setEmail,
    notes,
    setNotes,
    jobDetails,
    setJobDetails,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    handleSubmit,
  } = useSimpleBookingForm();

  // Get client type from localStorage if available
  const savedClientType = localStorage.getItem('selectedClientType') || 'private';

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted - calling handleSubmit");
    handleSubmit(e);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={onFormSubmit} className="space-y-6" id="simple-booking-form">
        {/* Client Type Display */}
        <div className="p-4 rounded-md bg-gold/10 border border-gold/30">
          <h3 className="font-medium text-gold mb-2">Service Type</h3>
          <p className="text-white">Other Services ({savedClientType === 'private' ? 'Private' : 'Commercial'})</p>
          <p className="text-sm text-gray-400 mt-1">Perfect for boats, caravans, mobile homes, and specialized cleaning services</p>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Contact Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yourName" className="text-white">Full Name *</Label>
              <Input
                id="yourName"
                type="text"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postcode" className="text-white">Postcode *</Label>
              <Input
                id="postcode"
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your postcode"
                required
              />
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Service Requirements</h3>
          
          <div className="space-y-2">
            <Label htmlFor="jobDetails" className="text-white">Service Description *</Label>
            <Textarea
              id="jobDetails"
              value={jobDetails}
              onChange={(e) => setJobDetails(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Please describe what you need cleaned (e.g., boat hull and deck, caravan interior/exterior, mobile home, etc.)"
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Any additional information, special requirements, or access instructions"
              rows={3}
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Preferred Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Preferred Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="selectedTime" className="text-white">Preferred Time</Label>
              <Input
                id="selectedTime"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-gold text-black hover:bg-gold/90 font-bold py-3 text-lg transition-all hover:shadow-lg hover:shadow-gold/20"
          >
            Request Service Quote
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SimpleBookingForm;
