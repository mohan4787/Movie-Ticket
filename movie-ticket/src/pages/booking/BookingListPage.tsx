import React, { useEffect, useState, useCallback } from 'react';
import { Table, Tag, Button, Card, Typography, message, Space } from 'antd';
import { EyeOutlined, CalendarOutlined, UserOutlined, IeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import authSvc from '../../services/auth.service';

const { Title, Text } = Typography;

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
  _id: string;
  seatNumber: string;
}

interface IBooking {
  _id: string;
  userId: IUser;
  movieId: IMovie;
  seats: ISeat[];
  totalAmount: number;
  bookingStatus: 'confirmed' | 'reserved' | 'cancelled';
  createdAt: string;
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const navigate = useNavigate();

  const fetchBookings = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await authSvc.getRequest(`booking?page=${page}&limit=${limit}`);

      if (response.status === "BOOKING_LIST_FETCHED") {
       
        const result = response.data?.data || [];
        setBookings(result);
        
        
        setTotal(response.data?.pagination?.total || 0);
      }
    } catch (error) {
      message.error("Failed to fetch bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    fetchBookings(currentPage, pageSize);
  }, [fetchBookings, currentPage, pageSize]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    
  };

  const columns = [
    {
      title: 'Movie Name',
      dataIndex: 'movieId',
      key: 'movieTitle',
      render: (movie: IMovie) => (
        <Text strong className="text-blue-700">{movie?.title || "N/A"}</Text>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'userId',
      key: 'customer',
      render: (user: IUser) => (
        <Space direction="vertical" size={0}>
          <Text className="text-sm font-medium"><UserOutlined /> {user?.name || "Guest"}</Text>
          <Text type="secondary" className="text-[11px]">{user?.email}</Text>
        </Space>
      ),
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats: ISeat[]) => (
        <div className="flex flex-wrap gap-1">
          {seats?.map((s) => (
            <Tag key={s._id} color="cyan" icon={<IeOutlined />}>{s.seatNumber}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <Text strong>Rs. {amount}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'bookingStatus',
      key: 'bookingStatus',
      render: (status: string) => {
        const colors: Record<string, string> = { confirmed: 'green', reserved: 'orange', cancelled: 'red' };
        return <Tag color={colors[status] || 'blue'} className="capitalize">{status}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text type="secondary" className="text-xs">
          <CalendarOutlined /> {dayjs(date).format('MMM DD, HH:mm')}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: IBooking) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EyeOutlined />} 
          onClick={() => navigate(`/admin/booking-detail/${record._id}`)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-md border-0 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <Title level={3}>Booking History</Title>
          <Button onClick={() => fetchBookings(currentPage, pageSize)} loading={loading}>
            Refresh
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="_id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total, 
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default BookingList;