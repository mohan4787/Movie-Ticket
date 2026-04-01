import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Popconfirm, Table } from "antd";
import { NavLink, useParams } from "react-router";
import {
  PaginationDefault,
  type IPaginationType,
  type IPaginationWithSearchType,
} from "../../config/constants";
import { useEffect, useState, useCallback } from "react";
import showtimeService from "../../services/showtime.service";
import { toast } from "sonner";

export interface IShowTimeDate {
  _id: string;
  movie: string;
  screen: string;
  date: string;
  startTime: string;
  endTime: string;
  language: string;
  status: string; // Changed to string for better compatibility
}

const ShowTimeListPage = () => {
  const [data, setData] = useState<IShowTimeDate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<IPaginationType>({
    current: PaginationDefault.page,
    pageSize: PaginationDefault.limit,
    total: 0, // Default to 0
  });
  
  const { id } = useParams<{ id: string }>();

  // Use callback to prevent unnecessary re-renders
  const getShowTimeList = useCallback(async ({
    page = PaginationDefault.page,
    limit = PaginationDefault.limit,
    search = "",
  }: IPaginationWithSearchType) => {
    setLoading(true);
    try {
      // Dynamic endpoint: if an 'id' exists in URL, use specific movie route
      const endpoint = id ? `/showtime/${id}` : "/showtime";
      
      const response = await showtimeService.getRequest(endpoint, {
        params: { page, limit, search },
      });

      console.log("Fetched response:", response);
      
      setData(response.data || []);
      
      // Safety check for pagination metadata to prevent 500 crashes
      if (response.options?.pagination) {
        setPagination({
          current: Number(response.options.pagination.current) || page,
          pageSize: Number(response.options.pagination.limit) || limit,
          total: Number(response.options.pagination.total) || 0,
        });
      }
    } catch (error: any) {
      toast.error("Fetch Error", {
        description: error?.message || "ShowTimes cannot be fetched at this moment!",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Handle Search Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getShowTimeList({
        page: 1, // Reset to page 1 on new search
        limit: pagination.pageSize,
        search: search,
      });
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [search, getShowTimeList]);

  const onPaginationChange = (page: number, pageSize: number) => {
    getShowTimeList({ page, limit: pageSize, search });
  };

  const onDeleteConfirm = async (id: string) => {
    setLoading(true);
    try {
      await showtimeService.deleteRequest(`/showtime/${id}`);
      toast.success("ShowTime deleted successfully");
      // Refetch current view
      getShowTimeList({
        page: pagination.current,
        limit: pagination.pageSize,
        search,
      });
    } catch (error: any) {
      toast.error("Delete Failed", {
        description: error?.message || "An error occurred while deleting",
      });
      setLoading(false);
    }
  };

  const columns = [
    { 
        key: "movie", 
        title: "Movie", 
        dataIndex: "movie",
        render: (movie: any) => typeof movie === 'object' ? movie.title : movie 
    },
    { key: "screen", title: "Screen", dataIndex: "screen" },
    {
      key: "date",
      title: "Date",
      dataIndex: "date",
      render: (val: string) => val ? new Date(val).toLocaleDateString() : "N/A",
    },
    { key: "startTime", title: "Start Time", dataIndex: "startTime" },
    { key: "endTime", title: "End Time", dataIndex: "endTime" },
    { key: "language", title: "Language", dataIndex: "language" },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (val: string) =>
        val === "active" ? (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Active
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Inactive
          </span>
        ),
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "_id",
      render: (val: string) => (
        <div className="flex gap-3">
          <NavLink
            to={"/admin/showtime/" + val}
            className="flex bg-teal-700 rounded-full w-8 h-8 items-center justify-center transition hover:bg-teal-800 hover:scale-95"
          >
            <EditOutlined className="text-white" />
          </NavLink>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDeleteConfirm(val)}
            okText="Yes"
            cancelText="No"
          >
            <button className="flex bg-red-600 rounded-full w-8 h-8 items-center justify-center transition hover:bg-red-700 hover:scale-95">
              <DeleteOutlined className="text-white" />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex justify-between border-b border-gray-300 pb-4 items-center">
        <h1 className="text-3xl font-semibold text-teal-900">
          ShowTime Management
        </h1>
        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Search showtimes..."
            className="w-64"
            size="large"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <NavLink
            to={`/admin/showtime/create/${id || ""}`}
            className="bg-teal-800 text-white px-4 py-2 rounded-md hover:bg-teal-900 transition flex items-center gap-2"
          >
            <PlusOutlined /> Add ShowTime
          </NavLink>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: onPaginationChange,
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default ShowTimeListPage;