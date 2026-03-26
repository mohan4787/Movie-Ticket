import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ticketService from "../../services/ticket.service";
import TicketCard from "../../components/tickets/TicketCard";

const TicketPage = () => {
  const { bookingId } = useParams();
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!bookingId) return;

      try {
        const res: any = await ticketService.generate(bookingId);
        setTickets(res.data.data); 
      } catch (error) {
        console.error("Failed to load tickets", error);
      }
    };

    fetchTickets();
  }, [bookingId]);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Your Tickets</h1>

      <div className="flex gap-4 flex-wrap">
        {tickets.map((t: any) => (
          <TicketCard key={t._id} ticket={t} />
        ))}
      </div>
    </div>
  );
};

export default TicketPage;