import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from "../../assets/user.avif"
import { Label } from '@/components/ui/label'
import { RadioGroup,RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'
const UserInfo = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [updateUser, setUpdateUser] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  //const { user } = useSelector(store => store.user)
  const params = useParams()
  const userId = params.id

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const accessToken = localStorage.getItem("accessToken")

    try {
      const formData = new FormData()

      formData.append("firstName", updateUser?.firstName || "")
      formData.append("lastName", updateUser?.lastName || "")
      formData.append("email", updateUser?.email || "")
      formData.append("phoneNo", updateUser?.phoneNo || "")
      formData.append("address", updateUser?.address || "")
      formData.append("city", updateUser?.city || "")
      formData.append("zipCode", updateUser?.zipCode || "")
      formData.append("role", updateUser?.role || "")

      if (file) {
        formData.append("profilePic", file)
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
      )

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }

    } catch (error) {
      console.log(error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const getUserDeatils = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/get-user/${userId}`
      )

      if (res.data.success) {
        setUpdateUser(res.data.user)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserDeatils()
  }, [])

  return (
    <div className='pt-5 min-h-screen bg-gray-100'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>

          <div className='flex justify-between gap-10'>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className='font-bold mb-7 text-2xl text-gray-800'>
              Update Profile
            </h1>
          </div>

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
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </div>

            {/* RIGHT FORM */}
            <Card className="w-[420px] shadow-lg">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-6">

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        type='text'
                        name="firstName"
                        placeholder="John"
                        value={updateUser?.firstName || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={updateUser?.lastName || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type='text'
                      name="email"
                      value={updateUser?.email || ""}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      type="text"
                      name="phoneNo"
                      value={updateUser?.phoneNo || ""}
                      onChange={handleChange}
                      placeholder="Enter your Contact No"
                    />
                  </div>

                  <div>
                    <Label>Address</Label>
                    <Input
                      type="text"
                      name="address"
                      value={updateUser?.address || ""}
                      onChange={handleChange}
                      placeholder="Enter your Address"
                    />
                  </div>

                  <div>
                    <Label>City</Label>
                    <Input
                      type="text"
                      name="city"
                      value={updateUser?.city || ""}
                      onChange={handleChange}
                      placeholder="Enter your City"
                    />
                  </div>

                  <div>
                    <Label>Zip Code</Label>
                    <Input
                      type="text"
                      name="zipCode"
                      value={updateUser?.zipCode || ""}
                      onChange={handleChange}
                      placeholder="Enter your ZipCode"
                    />
                  </div>

<div className='flex gap-3 items-center'>
  <Label className='block text-sm font-medium'>Role :</Label>
  <RadioGroup  value={updateUser?.role}
  onValueChange={(value)=>setUpdateUser({...updateUser, role:value})}
  className='flex items-center'>
    <div className='flex items-center space-x-2'>
      <RadioGroupItem value="user" id="user"/>
      <Label htmlFor="user">User</Label>
    </div>
     <div className='flex items-center space-x-2'>
      <RadioGroupItem value="admin" id="admin"/>
      <Label htmlFor="admin">Admin</Label>
    </div>
  </RadioGroup>
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
        </div>
      </div>
    </div>
  )
}

export default UserInfo
