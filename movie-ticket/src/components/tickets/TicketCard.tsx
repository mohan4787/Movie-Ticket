interface Ticket {
  _id: string;
  seatNumber: string;
  qrCode: string;
  status: string;
  pdfUrl?: string;
}

const TicketCard = ({ticket}: {ticket:Ticket}) => {
    return(
        <>
        <div className="p-4 border rounded-xl w-64 shadow">
           <h2 className="text-center font-bold">Ticket</h2> 
           <p>Seat: {ticket.seatNumber}</p>
      <p>Status: {ticket.status}</p>
      <img src={ticket.qrCode} className="w-32 mx-auto my-3" />
      {ticket.pdfUrl && (
        <a href={ticket.pdfUrl}
        download
        target="_blank"
         className="block text-center bg-blue-500 text-white py-2 rounded"
        >
            Download PDF
        </a>
      )}
        </div>
        </>
    )
}

export default TicketCard;