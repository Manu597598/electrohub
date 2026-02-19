import { ShoppingCart } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import React, { useEffect } from "react";

//import Cart from '@/components/ui/Cart'

const Navbar = () => {

  const { user } = useSelector(store => store.user);
  const {cart} = useSelector(store=>store.product);
  const accessToken = localStorage.getItem("accessToken");
  const admin = user?.role === "admin" ? true : false
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    dispatch(setUser(JSON.parse(storedUser)));
  }
}, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        dispatch(setUser(null));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="bg-red-50 fixed w-full z-50 border-b border-red-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-2 px-4">

        {/* logo */}
        <div>
          <img
            src="/ELECTRO_HUB.png"
            alt="Electro hub logo"
            className="w-[80px]"
          />
        </div>

        {/* nav */}
        <nav className="flex gap-6 items-center">

          <ul className="flex gap-5 items-center text-base font-semibold">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
 {
 user && 
            
                <Link to={`/profile/${user._id}`}><li>
                  Hello, {user.firstName} </li>
                </Link>
             
 }
{
  admin && <Link to={`/dashboard/sales`}><li>Dashboard</li></Link>
}
            
          </ul>

          <Link to="/cart" className="relative">
            <ShoppingCart size={20}/>
            <span className="bg-red-500 rounded-full absolute text-white -top-2 -right-3 px-1.5 text-xs">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {user ? (
            <Button
              type="button"
              onClick={logoutHandler}
              className="bg-red-600 text-white cursor-pointer px-3 py-1 text-sm"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={()=>navigate('/login')}
              className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer px-3 py-1 text-sm"
            >
              Login
            </Button>
          )}

        </nav>

      </div>
    </header>
  );
};

export default Navbar;
