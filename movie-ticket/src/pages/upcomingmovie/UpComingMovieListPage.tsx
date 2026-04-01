import { NavLink } from "react-router";
import {
  PaginationDefault,
  Status,
  type IImageType,
  type IPaginationType,
  type IPaginationWithSearchType,
} from "../../config/constants";
import { Input, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import upcomingmovieService from "../../services/upcomingmovie.service";
import { useEffect, useState } from "react";
import { useRef } from "react";

export interface IUpComingMovieData {
  _id: string;
  title: string;
  slug: string;
  status: typeof Status;
  poster?: IImageType;
  genre: string[];
  expectedReleaseDate: string;
  preBookingAvailable: boolean;
  teaserUrl?: string;
}

const UpComingMovieListPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const searchTimeout = useRef<any>(null);
  const [data, setData] = useState<IUpComingMovieData[]>([]);
  const [pagination, setPagination] = useState<IPaginationType>({
    current: PaginationDefault.page,
    pageSize: PaginationDefault.limit,
    total: PaginationDefault.total,
  });

  const getUpcomingMovieList = async ({
    page = PaginationDefault.page,
    limit = PaginationDefault.limit,
    search = "",
  }: IPaginationWithSearchType) => {
    setLoading(true);
    try {
      const response = await upcomingmovieService.getRequest("/upcomingmovie", {
        params: { page, limit, search },
      });
      // console.log("i am here:",response);
      
      const resData = response?.data || [];
      console.log("Fetched movies array:", resData);

      const paginationData = response?.data?.options?.pagination;

      setData(resData);

      if (paginationData) {
        setPagination({
          current: paginationData.current,
          pageSize: paginationData.limit,
          total: paginationData.total,
        });
      }
    } catch (error: any) {
      console.error("Error fetching upcoming movies:", error);
      toast.error("Upcoming Movies cannot be fetched", {
        description:
          error?.response?.message || error?.message || "Server error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUpcomingMovieList({
      page: PaginationDefault.page,
      limit: PaginationDefault.limit,
      search: "",
    });
  }, []);

  const onPaginationChange = async (page: number, pageSize: number) => {
    await getUpcomingMovieList({ page, limit: pageSize, search });
  };

  const onDeleteConfirm = async (movieId: string) => {
    setLoading(true);
    try {
      await upcomingmovieService.deleteRequest(`/upcomingmovie/${movieId}`);

      toast.success("Upcoming Movie Deleted Successfully");

      getUpcomingMovieList({
        page: pagination.current,
        limit: pagination.pageSize,
        search,
      });
    } catch (error: any) {
      toast.error("Upcoming Movie cannot be deleted", {
        description:
          error?.response?.message || error?.message || "Delete failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (val: string) =>
        val === Status.ACTIVE ? (
          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
            Active
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
            Inactive
          </span>
        ),
    },
    {
      key: "poster",
      title: "Poster",
      dataIndex: "poster",
      render: (val: IImageType) => (
        <img
          src={
            val?.optimizedUrl || val?.secureUrl || "https://placehold.co/80x120"
          }
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/80x120";
          }}
          className="w-20 h-28 object-cover rounded"
          alt="poster"
        />
      ),
    },
    //  {
    //   key: "poster",
    //   title: "Poster",
    //   dataIndex: "poster",
    //   render: (val: any) => (
    //     <img
    //       src={val?.optimizedUrl || "https://placehold.com/80x120"}
    //       className="max-w-20 h-auto"
    //     />
    //   ),
    // },
    {
      key: "genre",
      title: "Genre",
      dataIndex: "genre",
      render: (val: string[]) => val?.join(", ") || "-",
    },
    {
      key: "expectedReleaseDate",
      title: "Expected Release Date",
      dataIndex: "expectedReleaseDate",
      render: (val: string) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    {
      key: "teaserUrl",
      title: "Teaser",
      dataIndex: "teaserUrl",
      render: (val: string) =>
        val ? (
          <a
            href={val}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Watch
          </a>
        ) : (
          "-"
        ),
    },
    {
      key: "preBookingAvailable",
      title: "Pre Booking",
      dataIndex: "preBookingAvailable",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      key: "action",
      title: "#",
      dataIndex: "_id",
      render: (val: string) => (
        <div className="flex gap-3">
          <NavLink
            to={"/admin/upcomingmovie/" + val}
            className={
              "flex bg-teal-700! rounded-full w-10 h-10 items-center justify-center transition hover:bg-teal-800! hover:scale-96"
            }
          >
            <EditOutlined className="text-white!" />
          </NavLink>

          <Popconfirm
            title="Are you sure?"
            description="Once deleted, cannot recover."
            onConfirm={() => onDeleteConfirm(val)}
          >
            <button className="flex bg-red-700 rounded-full w-10 h-10 items-center justify-center hover:bg-red-800">
              <DeleteOutlined className="text-white" />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b border-b-gray-400 pb-3">
        <h1 className="text-4xl font-semibold text-teal-900">Upcoming Movie</h1>
        <div className="flex justify-center items-center gap-10">
          <div className="flex w-96">
            <Input.Search
              size="large"
              allowClear
              placeholder="Search movies..."
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);

                if (searchTimeout.current) {
                  clearTimeout(searchTimeout.current);
                }

                searchTimeout.current = setTimeout(() => {
                  getUpcomingMovieList({
                    page: 1,
                    limit: pagination.pageSize,
                    search: value,
                  });
                }, 500);
              }}
            />
          </div>
          <NavLink
            to={"/admin/upcomingmovie/create"}
            className="bg-teal-800! py-2 w-44 flex justify-center text-white! rounded-md hover:bg-teal-900! hover:cursor-pointer transition hover:scale-96"
          >
            <PlusOutlined /> Upcoming Movie
          </NavLink>
        </div>
      </div>
      <div className="flex flex-col">
        <Table
          columns={columns}
          dataSource={data as Readonly<IUpComingMovieData[]>}
          rowKey={(data: IUpComingMovieData) => data._id}
          loading={loading}
          pagination={{ ...pagination, onChange: onPaginationChange }}
        />
      </div>
    </div>
  );
};

export default UpComingMovieListPage;
