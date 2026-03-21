import logo from "../../assets/images/logo.png"
import {Menu } from 'antd';
import Sider from "antd/es/layout/Sider";
import type React from "react";
import { useAuth } from "../../context/auth.context";


const Sidebar = ({collapsed,menu}: Readonly<{collapsed:boolean, menu: Array<{
    key: string,
    icon: React.ReactNode,
    label: string
}>}>) => {
    const {loggedInUser} = useAuth()
    return(<>
    <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="flex flex-col gap-2">
            <div className="item-center justify-center flex w-50 h-20 ">
            <img src={logo} alt="logo" />
        </div>
         <div className="flex flex-col gap-2">
             <p className=" text-center text-white font-semibold">
              {loggedInUser?.name}
             </p>
             <p className="text-center text-white font-light text-xs">
              {loggedInUser?.email}
             </p>
          </div>
        </div>
       <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['movies']}
      items={menu}
    />
      </Sider>
    </>)
}

export default Sidebar;