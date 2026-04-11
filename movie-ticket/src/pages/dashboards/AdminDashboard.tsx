import { useAuth } from "../../context/auth.context"
import AdminPayments from "./AdminPayment";

const AdminDashboard = () => {
    const {loggedInUser} = useAuth();

    return(<>
    {loggedInUser?.name}
    <AdminPayments/>
    </>)
}

export default AdminDashboard