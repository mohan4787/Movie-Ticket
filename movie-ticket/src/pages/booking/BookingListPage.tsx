import { Table } from "antd";
import { useEffect, useState } from "react";
import bookingService from "../../services/booking.service";

const BookingListPage = () => {

  const [data, setData] = useState<any[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getRequest("booking");
      setData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "_id",
    },
    {
      title: "Movie",
      dataIndex: "movieId",
    },
    {
      title: "Showtime",
      dataIndex: "showtimeId",
    },
    {
      title: "Seats",
      render: (row: any) =>
        row.seats?.map((s: any) => s.seatNumber).join(", "),
    },
    {
      title: "User",
      dataIndex: "createdBy",
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
    },
  ];

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={data}
    />
  );
};

export default BookingListPage;