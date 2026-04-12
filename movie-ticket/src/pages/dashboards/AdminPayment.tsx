import { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, message, Button, Divider, Space, Progress } from 'antd';
import { 
    DollarCircleOutlined, UserOutlined, FireOutlined, 
    HistoryOutlined, SyncOutlined, BarChartOutlined,
    PieChartOutlined, DownloadOutlined, SafetyCertificateOutlined,
    RocketOutlined
} from '@ant-design/icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import authSvc from '../../services/auth.service';

const { Title, Text } = Typography;

// --- Interfaces ---
interface DashboardStats {
    revenue: number;
    todayCount: number;
    liveReservations: number;
}

interface IBooking {
    _id: string;
    totalAmount: number;
    bookingStatus: 'confirmed' | 'reserved' | 'cancelled';
    createdAt: string;
}

interface MovieStat {
    name: string;
    sales: number;
    color?: string;
}

interface RevenueFlow {
    day: string;
    rev: number;
}

const AdminPayment = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [stats, setStats] = useState<DashboardStats>({
        revenue: 0,
        todayCount: 0,
        liveReservations: 0
    });
    
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [movieStats, setMovieStats] = useState<MovieStat[]>([]);
    const [revenueData, setRevenueData] = useState<RevenueFlow[]>([]);
    const [paymentSource, setPaymentSource] = useState({ cash: 0, digital: 0 }); // New State
    
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);

    const fetchData = useCallback(async (page: number, limit: number) => {
        try {
            setLoading(true);
            
            // All-in-one concurrent data fetch
            const [statsRes, bookingsRes, movieStatsRes, weeklyRes, paymentRes] = await Promise.all([
                authSvc.getRequest('/booking/dashboard/summary'),
                authSvc.getRequest(`/booking?page=${page}&limit=${limit}`),
                authSvc.getRequest('/booking/stats/top-movies'),
                authSvc.getRequest('/booking/stats/weekly-revenue'),
                authSvc.getRequest('/booking/stats/payment-breakdown') // Financial Breakdown
            ]);

            // 1. Summary Cards
            if (statsRes?.data) setStats(statsRes.data);

            // 2. Recent Bookings Table
            if (bookingsRes?.data) {
                setBookings(bookingsRes.data.data || []);
                setTotalItems(bookingsRes.data.pagination?.total || 0);
            }

            // 3. Movie Performance Analytics
            if (movieStatsRes?.data) {
                const colors = ['#1890ff', '#722ed1', '#2f54eb', '#faad14', '#13c2c2'];
                setMovieStats(movieStatsRes.data.map((item: any, i: number) => ({
                    ...item,
                    color: colors[i % colors.length]
                })));
            }

            // 4. Weekly Flow
            if (weeklyRes?.data) setRevenueData(weeklyRes.data);

            // 5. Payment Source Logic
            if (paymentRes?.data) {
                const cashTotal = paymentRes.data.find((p: any) => p._id === 'cash')?.total || 0;
                const digitalTotal = paymentRes.data.find((p: any) => p._id === 'khalti')?.total || 0;
                setPaymentSource({ cash: cashTotal, digital: digitalTotal });
            }

        } catch (err: any) {
            message.error("Failed to sync financial dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [fetchData, currentPage, pageSize]);

    const columns = [
        { 
            title: 'ID', 
            dataIndex: '_id', 
            render: (id: string) => <Text code>{id?.slice(-6).toUpperCase()}</Text> 
        },
        { 
            title: 'Revenue', 
            dataIndex: 'totalAmount', 
            render: (amt: number) => <Text strong>Rs. {amt.toLocaleString('en-IN')}</Text>
        },
        { 
            title: 'Status', 
            dataIndex: 'bookingStatus', 
            render: (status: string) => (
                <Tag color={status === 'confirmed' ? 'green' : 'orange'} className="rounded-full px-3">
                    {status.toUpperCase()}
                </Tag>
            )
        },
        { 
            title: 'Time', 
            dataIndex: 'createdAt', 
            render: (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Title level={2} className="m-0 font-bold">CineBook Command Center</Title>
                    <Text type="secondary">Real-time Financial Monitor • Last sync: {new Date().toLocaleTimeString()}</Text>
                </div>
                <Space>
                    <Button icon={<DownloadOutlined />} className="rounded-lg">Export Report</Button>
                    <Button 
                        type="primary" 
                        icon={<SyncOutlined spin={loading} />} 
                        onClick={() => fetchData(currentPage, pageSize)}
                        className="rounded-lg shadow-md"
                    >
                        Refresh Data
                    </Button>
                </Space>
            </div>
            
            {/* Top Cards */}
            <Row gutter={[20, 20]}>
                <Col xs={24} sm={6}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                        <Statistic 
                            title="Total Sales" 
                            value={stats.revenue} 
                            formatter={(v) => `Rs. ${v.toLocaleString('en-IN')}`}
                            valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                            prefix={<DollarCircleOutlined />} 
                        />
                        <Text type="success" className="text-xs">↑ 12% growth</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                        <Statistic title="Today's Orders" value={stats.todayCount} prefix={<UserOutlined className="text-blue-500" />} />
                        <Progress percent={Math.min(100, (stats.todayCount / 50) * 100)} size="small" status="active" showInfo={false} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                        <Statistic 
                            title="Live Seat Holds" 
                            value={stats.liveReservations} 
                            valueStyle={{ color: '#faad14' }}
                            prefix={<FireOutlined className={stats.liveReservations > 0 ? "animate-bounce" : ""} />} 
                        />
                        <Text type="secondary" className="text-xs">Active sessions: {stats.liveReservations}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card className="rounded-2xl border-0 shadow-sm">
                        <Statistic title="System Health" value="99.9" suffix="%" valueStyle={{ color: '#52c41a' }} prefix={<SafetyCertificateOutlined />} />
                        <Tag color="green">STABLE</Tag>
                    </Card>
                </Col>
            </Row>

            {/* Charts Section */}
            <Row gutter={[20, 20]} className="mt-8">
                <Col xs={24} lg={12}>
                    <Card title={<><BarChartOutlined className="mr-2" /> Weekly Revenue Flow</>} className="rounded-2xl border-0 shadow-sm h-full">
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <AreaChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" />
                                    <YAxis hide />
                                    <Tooltip formatter={(value) => `Rs. ${value}`} />
                                    <Area type="monotone" dataKey="rev" stroke="#1890ff" fill="#e6f7ff" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title={<><RocketOutlined className="mr-2" /> Top Performing Movies</>} className="rounded-2xl border-0 shadow-sm h-full">
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <BarChart data={movieStats} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="sales" radius={[0, 10, 10, 0]} barSize={25}>
                                        {movieStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Table & Operational Panel */}
            <Row gutter={[20, 20]} className="mt-8">
                <Col xs={24} lg={16}>
                    <Card title={<><HistoryOutlined className="mr-2" /> Live Transactions</>} className="rounded-2xl border-0 shadow-sm overflow-hidden" bodyStyle={{ padding: 0 }}>
                        <Table 
                            dataSource={bookings} 
                            columns={columns} 
                            loading={loading}
                            rowKey="_id"
                            pagination={{ 
                                current: currentPage, 
                                pageSize: pageSize, 
                                total: totalItems,
                                size: 'small',
                                onChange: (p) => setCurrentPage(p)
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title={<><PieChartOutlined className="mr-2" /> Financial & Operational Panel</>} className="rounded-2xl border-0 shadow-sm h-full">
                        <div className="flex flex-col gap-3">
                            
                            {/* Revenue Breakdown Section */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2">
                                <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Revenue Sources</Text>
                                <div className="flex justify-between mt-2">
                                    <Space direction="vertical" size={0}>
                                        <Text className="text-xs">💵 Cash</Text>
                                        <Text strong>Rs. {paymentSource.cash.toLocaleString('en-IN')}</Text>
                                    </Space>
                                    <Divider type="vertical" className="h-10" />
                                    <Space direction="vertical" size={0}>
                                        <Text className="text-xs">💳 Digital</Text>
                                        <Text strong className="text-blue-600">Rs. {paymentSource.digital.toLocaleString('en-IN')}</Text>
                                    </Space>
                                </div>
                            </div>

                            {/* Collection by Movie Summary */}
                            <div className="mb-2">
                                <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Collection by Movie</Text>
                                <div className="mt-2 max-h-32 overflow-y-auto pr-1">
                                    {movieStats.map((movie, idx) => (
                                        <div key={idx} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                                            <Text className="text-[13px] truncate w-32">{movie.name}</Text>
                                            <Text className="text-[13px] font-medium">Rs. {movie.sales.toLocaleString('en-IN')}</Text>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Divider className="my-1" />

                            <Button block className="text-left rounded-lg h-10">🎞️ Add Movie Release</Button>
                            <Button block className="text-left rounded-lg h-10">💳 Khalti Refund Center</Button>
                            <Button block className="text-left rounded-lg h-10" danger>🚫 Emergency Shutdown</Button>
                            
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200 mt-2">
                                <Text type="secondary">API Latency</Text>
                                <Text strong className="text-green-500">24ms</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminPayment;