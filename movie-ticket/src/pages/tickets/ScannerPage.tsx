import ticketService from "../../services/ticket.service";
import { QrReader } from "react-qr-reader";

const ScannerPage = () => {
  const handleScan = async (result: any) => {
    if (!result?.text) return;
    try {
      await ticketService.verify(result.text);
      alert("Entry Allowed");
    } catch {
      alert("Invalid Ticket");
    }
  };
  return (
    <div className="p-6">
      <h1>Scan Ticket</h1>
       <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={(result) => handleScan(result)}
      />
    </div>
  );
};

export default ScannerPage;
