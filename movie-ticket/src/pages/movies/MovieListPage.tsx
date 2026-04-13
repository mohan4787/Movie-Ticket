import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { NavLink } from "react-router";
import {
  PaginationDefault,
  Status,
  type IImageType,
  type IPaginationType,
  type IPaginationWithSearchType,
} from "../../config/constants";
import { Input, Popconfirm, Table, Button } from "antd";
import { useEffect, useState } from "react";
import movieService from "../../services/movie.service";
import { toast } from "sonner";

export interface IMovieData {
  _id: string;
  title: string;
  status: typeof Status;
  poster?: IImageType;
  genre: string[];
  releaseDate: string;
  rating: number;
}

const MovieListPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<Array<IMovieData>>([]);
  const [pagination, setPagination] = useState<IPaginationType>({
    current: PaginationDefault.page,
    pageSize: PaginationDefault.limit,
    total: PaginationDefault.total,
  });

  // ✅ Fetch movie list
  const getMovieList = async ({
    page = PaginationDefault.page,
    limit = PaginationDefault.limit,
    search = "",
  }: IPaginationWithSearchType) => {
    setLoading(true);
    try {
      const response = await movieService.getRequest("/movie", {
        params: { page, limit, search },
      });

      setData(response.data);

      setPagination({
        current: +response.options.pagination.current,
        pageSize: +response.options.pagination.limit,
        total: +response.options.pagination.total,
      });
    } catch {
      toast.error("Movies cannot be fetched", {
        description: "Movies cannot be fetched at this moment!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovieList({
      page: PaginationDefault.page,
      limit: PaginationDefault.limit,
      search: "",
    });
  }, []);

  const onPaginationChange = async (page: number, pageSize: number) => {
    await getMovieList({ page, limit: pageSize, search });
  };

  const onDeleteConfirm = async (movieId: string) => {
    setLoading(true);
    try {
      await movieService.deleteRequest(`/movie/${movieId}`);

      toast.success("Movie deleted successfully", {
        description: "Movie has been removed from the database",
      });

      
      await getMovieList({
        page: pagination.current,
        limit: pagination.pageSize,
        search,
      });
    } catch (error: any) {
      toast.error("Movie cannot be deleted", {
        description: error?.message || "An error occurred while deleting movie",
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
      key: "poster",
      title: "Poster",
      dataIndex: "poster",
      render: (val: any) => (
        <img
          src={val?.optimizedUrl || "https://placehold.com/80x120"}
          className="max-w-20 h-auto"
        />
      ),
    },
    {
      key: "genre",
      title: "Genre",
      dataIndex: "genre",
      render: (val: string[]) => val.join(", "),
    },
    {
      key: "releaseDate",
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      key: "rating",
      title: "Rating",
      dataIndex: "rating",
    },

    {
      key: "viewShowtime",
      title: "View Showtime",
      dataIndex: "_id",
      render: (movieId: string) => (
        <NavLink to={`/admin/showtime/${movieId}`}>
          <Button type="primary">View Showtime</Button>
        </NavLink>
      ),
    },

    {
      key: "action",
      title: "#",
      dataIndex: "_id",
      render: (val: string) => (
        <div className="flex gap-3">
          <NavLink
            to={"/admin/movie/" + val}
            className="flex bg-teal-700! rounded-full w-10 h-10 items-center justify-center transition hover:bg-teal-800! hover:scale-96"
          >
            <EditOutlined className="text-white!" />
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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between border-b border-b-gray-400 pb-3">
        <h1 className="text-4xl font-semibold text-teal-900">
          Movie Page
        </h1>

        <div className="flex justify-center items-center gap-10">
          <div className="flex w-96">
            <Input.Search
              size="large"
              onChange={(e) => setSearch(e.target.value)}
              onSearch={(value) =>
                getMovieList({
                  page: 1,
                  limit: pagination.pageSize,
                  search: value,
                })
              }
            />
          </div>

          <NavLink
            to={"/admin/movie/create"}
            className="bg-teal-800! py-2 w-40 flex justify-center text-white! rounded-md hover:bg-teal-900! hover:cursor-pointer transition hover:scale-96"
          >
            <PlusOutlined /> Add Movie
          </NavLink>
        </div>
      </div>

     
      <div className="flex flex-col">
        <Table
          columns={columns}
          dataSource={data as Readonly<IMovieData[]>}
          rowKey={(data: IMovieData) => data._id}
          loading={loading}
          pagination={{ ...pagination, onChange: onPaginationChange }}
        />
      </div>
    </div>
  );
};

export default MovieListPage;