import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Descriptions, Tag, Button, Spin, Typography, Divider, Space } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined, ClockCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import authSvc from '../../services/auth.service';

const { Title, Text } = Typography;

// --- Define Interfaces based on your API response ---
interface IUser {
  _id: string;
  name: string;
  email: string;
}

interface IMovie {
  _id: string;
  title: string;
}

interface ISeat {
  seatNumber: string;
  status: string;
  _id: string;
}

interface IBooking {
  _id: string;
  userId: IUser;
  movieId: IMovie;
  showtimeId: string;
  seats: ISeat[];
  totalAmount: number;
  bookingStatus: 'confirmed' | 'reserved' | 'cancelled';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

const BookingDetail: React.FC = () => {
  const { _id } = useParams<{ _id: string }>(); // Typing the URL param
  console.log("id=",_id);
  
  const navigate = useNavigate();
  
  // State typed with the Interface
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getBookingDetail = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await authSvc.getRequest(`booking/${_id}`);
      console.log("response:",response);
      
      if (response.status === "BOOKING_DETAILS_FETCHED") {
        setBooking(response.data);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (_id) getBookingDetail();
  }, [_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading ticket details..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-10 text-center">
        <Title level={4}>Booking not found</Title>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = { 
        confirmed: 'green', 
        reserved: 'orange', 
        cancelled: 'red' 
    };
    return colors[status] || 'blue';
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Back to Bookings
          </Button>
          <Button type="primary" icon={<PrinterOutlined />}>
            Print Ticket
          </Button>
        </div>

        <Card className="shadow-lg border-0 overflow-hidden rounded-xl">
          <div className="bg-blue-600 p-6 -m-6 mb-6 text-white flex justify-between items-center">
            <div>
              <Text className="text-blue-100 uppercase tracking-widest text-xs block font-semibold">
                Booking Reference
              </Text>
              <Title level={3} className="m-0 `text-white!` font-mono">
                {booking._id}
              </Title>
            </div>
            <Tag 
              color={getStatusColor(booking.bookingStatus)} 
              className="px-4 py-1 text-lg uppercase font-bold border-0"
            >
              {booking.bookingStatus}
            </Tag>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="md:col-span-2">
              <Descriptions title="Movie & Showtime" bordered column={1} size="small">
                <Descriptions.Item label={<Space><VideoCameraOutlined /> Movie</Space>}>
                  <Text strong className="text-lg">{booking.movieId?.title}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Showtime ID">
                  <Text code>{booking.showtimeId}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Seats Assigned">
                  <div className="flex flex-wrap gap-2">
                    {booking.seats?.map((s: ISeat) => (
                      <Tag color="volcano" key={s._id} className="font-bold">
                        Seat {s.seatNumber}
                      </Tag>
                    ))}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Booking Date">
                  {dayjs(booking.createdAt).format('MMMM D, YYYY [at] HH:mm')}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Descriptions title="Customer Information" bordered column={1} size="small">
                <Descriptions.Item label="Name">{booking.userId?.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{booking.userId?.email}</Descriptions.Item>
              </Descriptions>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
              <Title level={4} className="mt-0 mb-4 text-gray-700">Payment Summary</Title>
              
              <div className="flex justify-between mb-2">
                <Text type="secondary">Ticket Price</Text>
                <Text strong>Rs. {booking.totalAmount}</Text>
              </div>
              <div className="flex justify-between mb-2">
                <Text type="secondary">Quantity</Text>
                <Text strong>x {booking.seats?.length}</Text>
              </div>
              
              <Divider className="my-3" />
              
              <div className="flex justify-between items-center mb-6">
                <Title level={4} className="m-0">Total Paid</Title>
                <Title level={3} className="m-0 `text-blue-600!`">Rs. {booking.totalAmount}</Title>
              </div>

              <div className="bg-white p-3 rounded border flex items-start gap-2">
                <ClockCircleOutlined className="text-orange-400 mt-1" />
                <div>
                  <Text type="secondary" className="block text-[10px] leading-none uppercase font-bold">
                    Expires At
                  </Text>
                  <Text className="text-xs">
                    {dayjs(booking.expiresAt).format('YYYY-MM-DD HH:mm')}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingDetail;