
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import { downloadPDF } from "@/utils/pdfUtils";

interface DeclinedJob {
  id: string;
  customer: string;
  vehicle: string;
  date: string | Date;
  time: string;
  images: string[];
  exteriorNotes: string;
  interiorNotes: string;
  declinedAt: string | Date;
  reason: string;
}

const DeclinedJobs = () => {
  const [declinedJobs, setDeclinedJobs] = useState<DeclinedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<DeclinedJob | null>(null);

  useEffect(() => {
    // Load declined jobs from localStorage
    const savedJobs = localStorage.getItem('declinedJobs');
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        setDeclinedJobs(parsedJobs);
        // Select the first job by default if available
        if (parsedJobs.length > 0) {
          setSelectedJob(parsedJobs[0]);
        }
      } catch (error) {
        console.error('Error parsing declined jobs:', error);
      }
    }
  }, []);

  const handleViewReport = (job: DeclinedJob) => {
    setSelectedJob(job);
  };

  const formatDate = (dateString: string | Date) => {
    return dateString instanceof Date
      ? format(dateString, 'dd/MM/yyyy')
      : format(new Date(dateString), 'dd/MM/yyyy');
  };

  const handleGeneratePDF = () => {
    if (!selectedJob) return;
    
    const jobDate = selectedJob.date instanceof Date 
      ? format(selectedJob.date, 'dd/MM/yyyy') 
      : format(new Date(selectedJob.date), 'dd/MM/yyyy');
    
    // Create safe DOM element instead of HTML string
    const reportContainer = document.createElement('div');
    reportContainer.style.cssText = 'font-family: Arial, sans-serif; padding: 20px; max-width: 800px;';
    
    const title = document.createElement('h1');
    title.textContent = 'Declined Job Report';
    reportContainer.appendChild(title);
    
    const details = [
      { label: 'Customer', value: selectedJob.customer },
      { label: 'Vehicle', value: selectedJob.vehicle },
      { label: 'Date', value: jobDate },
      { label: 'Time', value: selectedJob.time },
      { label: 'Declined At', value: formatDate(selectedJob.declinedAt) }
    ];
    
    details.forEach(({ label, value }) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      p.appendChild(strong);
      p.appendChild(document.createTextNode(value));
      reportContainer.appendChild(p);
    });
    
    const reasonsTitle = document.createElement('h2');
    reasonsTitle.textContent = 'Reasons for Declining:';
    reportContainer.appendChild(reasonsTitle);
    
    const exteriorTitle = document.createElement('h3');
    exteriorTitle.textContent = 'Exterior Issues:';
    reportContainer.appendChild(exteriorTitle);
    
    const exteriorP = document.createElement('p');
    exteriorP.textContent = selectedJob.exteriorNotes || 'None specified';
    reportContainer.appendChild(exteriorP);
    
    const interiorTitle = document.createElement('h3');
    interiorTitle.textContent = 'Interior Issues:';
    reportContainer.appendChild(interiorTitle);
    
    const interiorP = document.createElement('p');
    interiorP.textContent = selectedJob.interiorNotes || 'None specified';
    reportContainer.appendChild(interiorP);
    
    downloadPDF(`declined-job-${selectedJob.id}`, reportContainer);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <AdminPageTitle 
        title="Declined Jobs" 
        subtitle="Review jobs that were declined during pre-inspection" 
      />

      {declinedJobs.length === 0 ? (
        <Card className="bg-black/60 border-gold/30 max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-white">No declined jobs found.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="md:col-span-1">
            <Card className="bg-black/60 border-gold/30">
              <CardHeader>
                <CardTitle className="text-white">Declined Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {declinedJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      selectedJob?.id === job.id 
                        ? 'bg-gold/20 border border-gold/30' 
                        : 'bg-black/30 border border-gold/10 hover:bg-black/40'
                    }`}
                    onClick={() => handleViewReport(job)}
                  >
                    <div className="text-white font-medium">{job.customer}</div>
                    <div className="text-gold/70 text-sm">{job.vehicle}</div>
                    <div className="text-gray-400 text-xs mt-1 flex justify-between">
                      <span>{formatDate(job.declinedAt)}</span>
                      <span>{job.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            {selectedJob && (
              <Card className="bg-black/60 border-gold/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Job Report</CardTitle>
                  <Button 
                    onClick={handleGeneratePDF}
                    className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
                  >
                    Download PDF
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-black/30 rounded-md">
                      <div className="text-gold/70">Customer:</div>
                      <div className="text-white">{selectedJob.customer}</div>
                      
                      <div className="text-gold/70">Vehicle:</div>
                      <div className="text-white">{selectedJob.vehicle}</div>
                      
                      <div className="text-gold/70">Date:</div>
                      <div className="text-white">
                        {formatDate(selectedJob.date)}
                      </div>
                      
                      <div className="text-gold/70">Time:</div>
                      <div className="text-white">{selectedJob.time}</div>
                      
                      <div className="text-gold/70">Declined At:</div>
                      <div className="text-white">
                        {formatDate(selectedJob.declinedAt)}
                      </div>
                    </div>
                    
                    <Tabs defaultValue="exterior" className="w-full">
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="exterior">Exterior Issues</TabsTrigger>
                        <TabsTrigger value="interior">Interior Issues</TabsTrigger>
                      </TabsList>
                      <TabsContent value="exterior" className="p-4 bg-black/20 rounded-md min-h-[200px]">
                        <p className="text-white whitespace-pre-line">
                          {selectedJob.exteriorNotes || 'No exterior issues noted.'}
                        </p>
                      </TabsContent>
                      <TabsContent value="interior" className="p-4 bg-black/20 rounded-md min-h-[200px]">
                        <p className="text-white whitespace-pre-line">
                          {selectedJob.interiorNotes || 'No interior issues noted.'}
                        </p>
                      </TabsContent>
                    </Tabs>
                    
                    {selectedJob.images && selectedJob.images.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-white text-lg font-medium mb-3">Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedJob.images.map((image, index) => (
                            <div key={index} className="border border-gold/20 rounded overflow-hidden aspect-square">
                              <img 
                                src={image} 
                                alt={`Vehicle image ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DeclinedJobs;
