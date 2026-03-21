import { useAuth } from "../../context/auth.context"

const AdminDashboard = () => {
    const {loggedInUser} = useAuth();

    return(<>
    {loggedInUser?.name}
    </>)
}

export default AdminDashboard