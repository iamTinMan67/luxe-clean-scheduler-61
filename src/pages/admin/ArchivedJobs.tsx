
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useArchivedBookings } from '@/hooks/planner/useArchivedBookings';
import { AdminPageTitle } from '@/components/admin/AdminPageTitle';
import ArchivedBookingsView from '@/components/planner/ArchivedBookingsView';
import { Card, CardContent } from '@/components/ui/card';
import { Booking } from '@/types/booking';

const ArchivedJobs = () => {
  const [loading, setLoading] = useState(true);
  const { archivedBookings } = useArchivedBookings();
  const [finishedBookings, setFinishedBookings] = useState<Booking[]>([]);

  // Load all finished bookings, not just those older than 7 days
  useEffect(() => {
    const loadFinishedBookings = () => {
      try {
        // Get all bookings from localStorage
        const confirmedBookingsData = localStorage.getItem('confirmedBookings');
        const plannerBookingsData = localStorage.getItem('plannerCalendarBookings');
        
        let allBookings: Booking[] = [];
        
        if (confirmedBookingsData) {
          const parsedBookings = JSON.parse(confirmedBookingsData);
          allBookings = [...allBookings, ...parsedBookings];
        }
        
        if (plannerBookingsData) {
          const parsedBookings = JSON.parse(plannerBookingsData);
          // Filter out duplicates
          const existingIds = new Set(allBookings.map(b => b.id));
          const uniqueBookings = parsedBookings.filter((b: Booking) => !existingIds.has(b.id));
          allBookings = [...allBookings, ...uniqueBookings];
        }
        
        // Get archived bookings
        const archivedData = localStorage.getItem('archivedBookings');
        if (archivedData) {
          const parsedArchived = JSON.parse(archivedData);
          // Filter out duplicates
          const existingIds = new Set(allBookings.map(b => b.id));
          const uniqueArchived = parsedArchived.filter((b: Booking) => !existingIds.has(b.id));
          allBookings = [...allBookings, ...uniqueArchived];
        }
        
        // Filter only finished bookings
        const finished = allBookings.filter(booking => booking.status === 'finished');
        setFinishedBookings(finished);
      } catch (error) {
        console.error('Error loading finished bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFinishedBookings();
  }, []);

  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AdminPageTitle
            title="Archived Jobs"
            description="View and manage all completed jobs"
          />
          
          <div className="mt-6">
            {loading ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <p className="text-center text-gray-400">Loading archived jobs...</p>
                </CardContent>
              </Card>
            ) : (
              <ArchivedBookingsView archivedBookings={finishedBookings} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchivedJobs;
