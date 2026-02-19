import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
const dispatch=useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("LOGIN DATA =>", formData);
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("LOGIN RESPONSE =>", res.data);

      if (res.data.success) {
  toast.success(res.data.message);

  dispatch(setUser(res.data.user));

  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  navigate("/");
}

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-100 text-black">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter given details below to login your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2 mt-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                required
              />
              {showPassword ? (
                <EyeOff
                  onClick={() => setShowPassword(false)}
                  className="w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => setShowPassword(true)}
                  className="w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer"
                />
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            onClick={submitHandler}
            type="button" // ✅ CHANGE: previously submit, now button
            className="w-full cursor-pointer bg-red-900 hover:bg-red-800"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
          <p>
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="hover:underline cursor-pointer text-red-600"
            >
              Signup
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
