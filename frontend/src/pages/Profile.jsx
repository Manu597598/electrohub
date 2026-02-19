import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useParams } from 'react-router-dom'
import userLogo from "@/assets/user.avif"
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios'
import { toast } from 'sonner';
import { setUser } from "@/redux/userSlice"; // Redux slice path apne hisaab se

const Profile = () => {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch()

  const params = useParams()
  const userId = params.userId

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  })

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false);

  // ========================== NEW ADDITION ==========================
  // Load user from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUpdateUser(parsedUser);
      dispatch(setUser(parsedUser));
    }
  }, []);
  // ==================================================================

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();

      formData.append("firstName", updateUser.firstName || "");
      formData.append("lastName", updateUser.lastName || "");
      formData.append("email", updateUser.email || "");
      formData.append("phoneNo", updateUser.phoneNo || "");
      formData.append("address", updateUser.address || "");
      formData.append("city", updateUser.city || "");
      formData.append("zipCode", updateUser.zipCode || "");
      formData.append("role", updateUser.role || "");
      if (file) {
        formData.append("profilePic", file);
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        // ========================== NEW ADDITION ==========================
        const updatedUserData = {
          ...user,
          ...updateUser,
          profilePic: res.data.user?.profilePic || updateUser.profilePic,
        };

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(updatedUserData));

        // Update Redux store
        dispatch(setUser(updatedUserData));
        // ==================================================================

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-28 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-5xl mx-auto">

        {/* TOP TABS */}
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
        </div>

        {/* ================= PROFILE TAB ================= */}
        <TabsContent value="profile">
          <h1 className="text-center font-bold text-2xl mb-8 text-gray-800">
            Update Profile
          </h1>

          <div className="flex gap-12 justify-center items-start">

            {/* LEFT IMAGE */}
            <div className="flex flex-col items-center">
              <img
                src={updateUser?.profilePic || userLogo}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-pink-600"
              />
              <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-pink-700">
                Change Picture
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </Label>
            </div>

            {/* RIGHT FORM */}
            <Card className="w-[420px] shadow-lg">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-6">

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input type='text' name="firstName" placeholder="John" value={updateUser.firstName} onChange={handleChange} />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input type="text" name="lastName" placeholder="Doe" value={updateUser.lastName} onChange={handleChange} />
                    </div>
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type='text'
                      name="email"
                      value={updateUser.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      type="text"
                      name="phoneNo"
                      value={updateUser.phoneNo}
                      onChange={handleChange}
                      placeholder="Enter your Contact No"
                    />
                  </div>

                  <div>
                    <Label>Address</Label>
                    <Input type="text" name="address" value={updateUser.address} onChange={handleChange} placeholder="Enter your Address" />
                  </div>

                  <div>
                    <Label>City</Label>
                    <Input type="text" name="city" value={updateUser.city} onChange={handleChange} placeholder="Enter your City" />
                  </div>

                  <div>
                    <Label>Zip Code</Label>
                    <Input type="text" name="zipCode" value={updateUser.zipCode} onChange={handleChange} placeholder="Enter your ZipCode" />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-600 hover:bg-pink-700"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>

                </CardContent>
              </form>
            </Card>
          </div>
        </TabsContent>

        {/* ================= ORDERS TAB ================= */}
        <TabsContent value="orders">
          <div className="flex justify-center">
            <Card className="w-[360px] shadow-lg">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you&apos;ll be logged out.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label>Current password</Label>
                  <Input type="password" />
                </div>

                <div>
                  <Label>New password</Label>
                  <Input type="password" />
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full">Save password</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default Profile
