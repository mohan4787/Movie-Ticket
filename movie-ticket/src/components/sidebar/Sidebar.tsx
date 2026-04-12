import logo from "../../assets/images/logo.png";
import { Menu } from 'antd';
import Sider from "antd/es/layout/Sider";
import type React from "react";
import { useAuth } from "../../context/auth.context";

const Sidebar = ({ collapsed, menu }: Readonly<{ 
    collapsed: boolean, 
    menu: Array<{
        key: string,
        icon: React.ReactNode,
        label: string
    }> 
}>) => {
    const { loggedInUser } = useAuth();

    return (
        <Sider trigger={null} collapsible collapsed={collapsed} width={200}>
            <div className="flex flex-col gap-1 py-2">
               <div className="flex items-center justify-center h-20 px-4 `flex-shrink-0`">
                    <img 
                        src={logo} 
                        alt="CineFix Logo" 
                        className={`transition-all duration-300 object-contain ${
                            collapsed ? 'w-10' : 'w-32'
                        }`}
                    />
                </div>
                <div className="w-full text-center">
                       {!collapsed && (
                    <div className="flex flex-col gap-1 px-2 transition-opacity duration-300">
                        <p className="text-center text-white font-semibold truncate">
                            {loggedInUser?.name}
                        </p>
                        <p className="text-center text-white font-light text-xs truncate">
                            {loggedInUser?.email}
                        </p>
                    </div>
                       )}
                    </div>
            </div>

            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={menu}
            />
        </Sider>
    );
}

export default Sidebar;