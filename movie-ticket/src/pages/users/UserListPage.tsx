"use client";

import React, { useEffect, useState } from "react";
import { 
  Table, Tag, Avatar, Button, message, Input, Card, 
  Space, Tooltip, Breadcrumb, Badge, Typography 
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  UserOutlined,
  SearchOutlined
} from "@ant-design/icons";
import authSvc from "../../services/auth.service";

const { Title, Text } = Typography;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authSvc.getRequest("auth/users");
      if (response.status === "SUCCESS") {
        setUsers(response.data);
      }
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns:any = [
    {
      title: 'User',
      key: 'user_detail',
      fixed: 'left',
      width: 250,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Avatar 
            src={record.image?.optimizedUrl} 
            icon={<UserOutlined />}
            size={44} 
            className="border-2 border-indigo-50 shadow-sm"
          />
          <div className="flex flex-col">
            <Text strong className="capitalize text-slate-800 leading-tight">
              {record.name}
            </Text>
            <Text type="secondary" className="text-xs">
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => <Text className="text-slate-600 font-medium">{phone || 'N/A'}</Text>,
    },
    {
      title: 'Access Level',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag 
          color={role === 'admin' ? 'volcano' : 'geekblue'} 
          className="rounded-full px-3 py-0.5 border-none font-semibold uppercase text-[10px]"
        >
          {role}
        </Tag>
      ),
    },
    {
      title: 'Account Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : 'warning'} 
          text={<span className="capitalize font-medium text-slate-600">{status}</span>} 
        />
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <span className="capitalize text-slate-500">{gender}</span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Edit User">
            <Button 
              type="text" 
              shape="circle" 
              icon={<EditOutlined className="text-indigo-600" />} 
              className="hover:bg-indigo-50"
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button 
              type="text" 
              shape="circle" 
              danger 
              icon={<DeleteOutlined />} 
              className="hover:bg-red-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <Breadcrumb className="mb-2">
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>User Management</Breadcrumb.Item>
        </Breadcrumb>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Title level={2} className="m-0 text-slate-900 font-extrabold tracking-tight">
              User Directory
            </Title>
            <Text type="secondary" className="text-base">
              Manage {users.length} active members and system roles.
            </Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchUsers}
              loading={loading}
              className="rounded-lg h-10 px-5 font-semibold"
            >
              Refresh
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              className="rounded-lg h-10 px-5 font-semibold bg-indigo-600 shadow-lg shadow-indigo-100"
            >
              Add New User
            </Button>
          </Space>
        </div>
      </div>

      {/* Main Content Card */}
      <Card 
        className="shadow-xl shadow-slate-200/50 border-0 rounded-2xl overflow-hidden"
        bodyStyle={{ padding: '0' }}
      >
        {/* Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-white">
          <Input 
            placeholder="Quick search members..." 
            prefix={<SearchOutlined className="text-slate-400" />}
            className="max-w-xs h-10 rounded-xl bg-slate-50 border-slate-200 hover:border-indigo-400"
            allowClear
          />
          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="text-slate-900">{users.length}</span> results
          </div>
        </div>

        {/* Table Section */}
        <Table
          dataSource={users}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 8, 
            position: ['bottomRight'],
            showSizeChanger: true,
            className: "pr-5 py-4"
          }}
          className="ant-table-modern"
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default UserList;