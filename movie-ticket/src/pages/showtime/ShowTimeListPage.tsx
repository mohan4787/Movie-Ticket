import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Popconfirm, Table } from "antd";
import { NavLink } from "react-router";
import {
  PaginationDefault,
  Status,
  type IPaginationType,
  type IPaginationWithSearchType,
} from "../../config/constants";
import { useEffect, useState } from "react";
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
  status: typeof Status;
}

const ShowTimeListPage = () => {
  const [data, setData] = useState<IShowTimeDate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<IPaginationType>({
    current: PaginationDefault.page,
    pageSize: PaginationDefault.limit,
    total: PaginationDefault.total,
  });
  const getShowTimeList = async ({
    page = PaginationDefault.page,
    limit = PaginationDefault.limit,
    search = "",
  }: IPaginationWithSearchType) => {
    setLoading(true);
    try {
      const response = await showtimeService.getRequest("/showtime", {
        params: { page, limit, search },
      });
      setData(response.data);
      setPagination({
        current: +response.options.pagination.current,
        pageSize: +response.options.pagination.limit,
        total: +response.options.pagination.total,
      });
    } catch {
      toast.error("ShowTimes cannot be fetched", {
        description: "ShowTimes cannot be fetched at this moment!",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getShowTimeList({
      page: PaginationDefault.page,
      limit: PaginationDefault.limit,
      search: "",
    });
  }, []);

  const onPaginationChange = async (page: number, pageSize: number) => {
    await getShowTimeList({ page, limit: pageSize, search });
  };

  const onDeleteConfirm = async (id: string) => {
    setLoading(true);
    try {
      await showtimeService.deleteRequest(`/showtime/${id}`);
      toast.success("ShowTime deleted successfully", {
        description: "ShowTime has been removed from the database",
      });
      await getShowTimeList({
        page: pagination.current,
        limit: pagination.pageSize,
        search,
      });
    } catch (error: any) {
      toast.error("ShowTime cannot be deleted", {
        description:
          error?.message || "An error occurred while deleting ShowTime",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "movie", title: "Movie", dataIndex: "movie" },
    { key: "screen", title: "Screen", dataIndex: "screen" },
    {
      key: "date",
      title: "Date",
      dataIndex: "date",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    { key: "startTime", title: "Start Time", dataIndex: "startTime" },
    { key: "endTime", title: "End Time", dataIndex: "endTime" },
    { key: "language", title: "Language", dataIndex: "language" },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (val: string) =>
        val === Status.ACTIVE ? (
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
      title: "#",
      dataIndex: "_id",
      render: (val: string) => (
        <div className="flex gap-3">
          <NavLink
            to={"/admin/showtime/" + val}
            className="flex bg-teal-700 rounded-full w-10 h-10 items-center justify-center transition hover:bg-teal-800 hover:scale-96"
          >
            <EditOutlined className="text-white" />
          </NavLink>
          <Popconfirm
            title="Are you sure?"
            description="Once deleted, the content cannot be recovered."
            onConfirm={() => onDeleteConfirm(val)}
            okText="Confirm"
          >
            <button className="flex bg-red-700 rounded-full w-10 h-10 items-center justify-center transition hover:bg-red-800 hover:scale-96">
              <DeleteOutlined className="text-white" />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between border-b border-b-gray-400 pb-3">
          <h1 className="text-4xl font-semibold text-teal-900">
            ShowTime Page
          </h1>
          <div className="flex justify-center items-center gap-10">
            <div className="flex w-96">
              <Input.Search
                size="large"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <NavLink
              to={"/admin/showtime/create"}
              className="bg-teal-800! py-2 w-44 flex justify-center text-white! rounded-md hover:bg-teal-900! hover:cursor-pointer transition hover:scale-96"
            >
              <PlusOutlined /> Add ShowTime
            </NavLink>
          </div>
        </div>
        <div className="flex flex-col">
          <Table
            columns={columns}
            dataSource={data as Readonly<IShowTimeDate[]>}
            rowKey={(data: IShowTimeDate) => data._id}
            loading={loading}
            pagination={{ ...pagination, onChange: onPaginationChange }}
          />
        </div>
      </div>
    </>
  );
};

export default ShowTimeListPage;
