
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TaskTableHeader = () => (
  <TableHeader className="bg-black/50">
    <TableRow className="border-gold/20">
      <TableHead className="w-12 text-gold/80"></TableHead>
      <TableHead className="text-gold/80">Task Name</TableHead>
      <TableHead className="text-gold/80 text-right">Price (£)</TableHead>
      <TableHead className="text-gold/80 text-right">Duration (min)</TableHead>
      <TableHead className="text-gold/80 text-center">Included</TableHead>
      <TableHead className="text-gold/80 text-right w-40">Actions</TableHead>
    </TableRow>
  </TableHeader>
);

export default TaskTableHeader;
