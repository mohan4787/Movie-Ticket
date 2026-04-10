import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { NavLink } from "react-router";
import { Input, Popconfirm, Table, Button } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import userService from "../../services/user.service";

export interface IUserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  gender?: string;
  image?: {
    optimizedUrl?: string;
  };
}

const UserListPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<IUserData[]>([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch users
  const getUserList = async () => {
    setLoading(true);
    try {
      const response = await userService.getRequest("/user");
      setData(response.data);
    } catch {
      toast.error("Users cannot be fetched");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  // ✅ Delete user
  const onDeleteConfirm = async (id: string) => {
    try {
      await userService.deleteRequest(`/user/${id}`);

      toast.success("User deleted successfully");

      getUserList(); // refresh
    } catch (error: any) {
      toast.error(error?.message || "Delete failed");
    }
  };

  // ✅ Filter (Search)
  const filteredData = data.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Table columns
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (val: any) => (
        <img
          src={val?.optimizedUrl || "https://placehold.co/60"}
          className="w-12 h-12 rounded-full object-cover"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (val: string) =>
        val === "active" ? (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
            Active
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
            Inactive
          </span>
        ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },

    // ✅ Action column
    {
      title: "Action",
      dataIndex: "_id",
      render: (id: string) => (
        <div className="flex gap-3">
          <NavLink
            to={`/admin/user/${id}`}
            className="bg-teal-700 text-white p-2 rounded-full"
          >
            <EditOutlined />
          </NavLink>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDeleteConfirm(id)}
          >
            <Button className="bg-red-700 text-white p-2 rounded-full">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between border-b pb-3">
        <h1 className="text-3xl font-semibold">User Page</h1>

        <div className="flex gap-5">
          <Input.Search
            placeholder="Search user..."
            onChange={(e) => setSearch(e.target.value)}
          />

          <NavLink
            to="/admin/users/create"
            className="bg-teal-700 text-white px-4 py-2 rounded"
          >
            <PlusOutlined /> Add User
          </NavLink>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  );
};

export default UserListPage;