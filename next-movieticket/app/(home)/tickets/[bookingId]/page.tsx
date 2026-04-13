"use client";
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Spin, Result, Tag, Typography, Divider, Space, message } from 'antd';
import { 
  CheckCircleFilled, 
  DownloadOutlined, 
  HomeOutlined, 
  FileTextOutlined,
  QrcodeOutlined 
} from '@ant-design/icons';
import 'dayjs/locale/en';
import authSvc from '@/services/auth.service';
import dayjs from 'dayjs';
import ticketService from '@/services/ticket.service';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

interface ITicket {
  _id: string;
  seatNumber: string;
  qrCode: string; 
  pdfUrl: string;
  status: string;
  createdAt?: string;
}

const TicketPage = () => {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<ITicket[]>([]);

  const generateTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.postRequest(`ticket/generate`, { bookingId });
      
      if (response.status === "TICKET_GENERATED" || response.data) {
        setTickets(response.data);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to generate tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) generateTickets();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Spin size="large" />
        <Text className="mt-4 text-gray-500 animate-pulse">Generating your cinema tickets...</Text>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Result
        status="warning"
        title="No Tickets Found"
        subTitle="We couldn't generate your tickets. Please check your booking status."
        extra={<Button type="primary" onClick={() => router.push('/')}>Go Home</Button>}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircleFilled className="text-green-500 text-5xl mb-2" />
          <Title level={2} className="m-0">Enjoy the Show!</Title>
          <Text type="secondary">Your payment was successful and your tickets are ready.</Text>
        </div>

        {tickets.map((ticket) => (
          <Card 
            key={ticket._id} 
            className="mb-6 rounded-2xl shadow-xl border-0 overflow-hidden"
            bodyStyle={{ padding: 0 }}
          >
            <div className="flex flex-col sm:flex-row">
              <div className="bg-white p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-dashed border-gray-200">
                <div className="bg-white p-2 border-2 border-slate-100 rounded-xl">
                  <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32" />
                </div>
                <Text className="mt-2 text-[10px] font-mono text-slate-400 uppercase">
                  ID: {ticket._id.slice(-8)}
                </Text>
              </div>

             
              <div className="flex-1 p-6 relative bg-white">
                
                <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 rounded-full"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <Tag color="cyan" className="m-0 font-bold uppercase">Movie Entry</Tag>
                  <Text className="text-xs text-slate-400">{dayjs(ticket.createdAt).format('MMM DD, YYYY')}</Text>
                </div>

                <div className="mb-4">
                  <Text type="secondary" className="text-xs uppercase block">Designated Seat</Text>
                  <Title level={3} className="m-0 text-blue-600">
                    <FileTextOutlined className="mr-2" />
                    {ticket.seatNumber}
                  </Title>
                </div>

                <Divider className="my-4 border-slate-100" />

                <div className="flex gap-2">
                  <Button 
                    type="primary" 
                    block 
                    icon={<DownloadOutlined />} 
                    href={ticket.pdfUrl} 
                    target="_blank"
                    className="bg-blue-600 shadow-none"
                  >
                    Save PDF
                  </Button>
                  <Button 
                    icon={<QrcodeOutlined />} 
                    onClick={() => window.open(ticket.qrCode, '_blank')}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}

        <div className="flex justify-center mt-10 space-x-4">
          <Button icon={<HomeOutlined />} onClick={() => router.push('/')} size="large" shape="round">
            Home
          </Button>
          <Button type="link" onClick={() => router.push('/profile/bookings')} size="large">
            My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;