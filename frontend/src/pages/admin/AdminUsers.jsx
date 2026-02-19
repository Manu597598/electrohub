import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Edit, Search } from 'lucide-react'
import UserLogo from "../../assets/user.avif"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [SearchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const getAllUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")

      const res = await axios.get(
        'http://localhost:8000/api/v1/user/allUser',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      console.log("API Response:", res.data)

      if (res.data.success) {
        setUsers(res.data.users)
      }

    } catch (error) {
      console.log("Error fetching users:", error)
    }
  }

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(SearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(SearchTerm.toLowerCase())
  )

  useEffect(() => {
    getAllUsers()
  }, [])

  console.log(users)

  return (
    <div className='pl-[350px] py-20 pr-20 mx-auto px-4'>
      <h1 className='font-bold text-2xl'>User Management</h1>
      <p>View and manage registered users</p>

      <div className='flex relative w-[300px] mt-6'>
        <Search className='absolute left-2 top-1 text-gray-600 w-5' />
        <Input
          value={SearchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
          placeholder="Search Users..."
        />
      </div>

      {/* Users Grid */}
      <div className='grid grid-cols-3 gap-7 mt-7'>

        {/* If no users */}
        {users.length === 0 && (
          <div className="text-gray-500 mt-10">
            No users found
          </div>
        )}

        {/* Users List */}
        {filteredUsers.map((user, index) => {

          console.log("Profile Pic Value:", user.profilePic)

          return (
            <div key={index} className='bg-pink-100 p-5 rounded-lg'>
              <div className='flex items-center gap-3'>

                <img
                  src={user?.profilePic || UserLogo}
                  alt="user"
                  className='rounded-full w-16 h-16 object-cover border border-red-600'
                />

                <div>
                  <p className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user?.email}
                  </p>
                </div>

              </div>

              <div className='flex gap-3 mt-3'>
                <Button
                  onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                  variant='outline'
                >
                  <Edit /> Edit
                </Button>

                <Button>
                  <Edit /> Show Order
                </Button>
              </div>

            </div>
          )
        })}

      </div>
    </div>
  )
}

export default AdminUsers
