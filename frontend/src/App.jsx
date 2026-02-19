import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify"; // static "Check your email" page
import VerifyEmail from "./pages/VerifyEmail"; // token verification
import Profile from "./pages/Profile";
import Footer from "./components/ui/Footer";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import AdminSales from "./pages/admin/AdminSales";
import AddProduct from "./pages/admin/AddProduct";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import SingleProduct from "./pages/SingleProduct";
import AddressForm from "./pages/AddressForm";
const router = createBrowserRouter([
  { path: "/", element: <><Navbar /><Home /><Footer/></> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/verify", element: <Verify /> },       
  { path: "/verify/:token" ,element:<VerifyEmail /> },
  { path: "/profile/:userId" ,element: <ProtectedRoute><Navbar/> <Profile/> </ProtectedRoute>},
  { path:"/home" ,element:<Home />},
{ path:"/products",element: <><Navbar/> <Products/> </>},
{ path:"/products/:id",element:<><Navbar/><SingleProduct/></>},
{ path:"/cart",element:<ProtectedRoute> <><Navbar/> <Cart/> </></ProtectedRoute>},
{ path:"/address",element:<ProtectedRoute><AddressForm/></ProtectedRoute>},
{ path:'/dashboard',element:  <ProtectedRoute adminOnly={true}><Navbar/><Dashboard/> </ProtectedRoute>, children:[
  {
    path:"sales",
    element:<AdminSales/>
  },
  {
    path:"add-product",
    element: <AddProduct/>
  },
  {
    path:"products",
    element: <AdminProduct/>
  },
  {
    path:"orders",
    element:<AdminOrders/>
  },
  {
    path:"users/orders/:userId",
    element: <ShowUserOrders/>
  },
  {
    path:"users",
    element:<AdminUsers/>
  },
  {
    path:"users/:id",
    element:<UserInfo/>
  },
]
}
  //{ path: "/verify/:token", element: <VerifyEmail /> }, // dynamic token route
]);

const App = () => <RouterProvider router={router} />;

export default App;
