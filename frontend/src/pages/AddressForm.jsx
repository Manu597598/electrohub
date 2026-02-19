import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button'
import { addAddress, deleteAddress, setSelectedAddress } from '@/redux/productSlice'
import { Card, CardContent, CardHeader,CardTitle } from '@/components/ui/card'

const AddressForm = () => {

  const { cart,addresses = [], selectedAddress } =
    useSelector((store) => store.product || {})

  const [formData, setFormData] = useState({
    fullName:"",
    phone:"",
    email:"",
    address:"",
    city:"",
    state:"",
    zip:"",
    country:"",
  })
//const {cart,addresses,selectedAddress} = useSelector((store)=> store.product)
  const [showForm, setShowForm] =
    useState(addresses && addresses.length > 0 ? false : true)

  const dispatch = useDispatch()

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const handlesave = ()=>{
    dispatch(addAddress(formData))
    setShowForm(false)
  }
  const subtotal = cart.totalPrice
  const shipping = subtotal > 50 ? 0 :10;
  const tax = parseFloat((subtotal *0.05).toFixed(2))
  const total = subtotal + shipping +tax
console.log(cart);
  return (
    <div className='max-w-7xl mx-auto grid place-items-center p-10'>
      <div className='grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto'>
        <div className='space-y-4 p-6 bg-white'>

          {showForm ? (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Street, Area, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Kolkata"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="West Bengal"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    placeholder="700001"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button
                onClick={handlesave}
                className='w-full bg-red-600 hover:bg-red-700 text-white'
              >
                Save & Continue
              </Button>
            </>
          ) : (
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold'>Saved Addresses</h2>

              {addresses.map((addr,index)=>(
                <div
                  key={index}
                  onClick={()=>dispatch(setSelectedAddress(index))}
                  className={`border p-4 rounded-md cursor-pointer relative transition-all ${
                    selectedAddress === index
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  <p className='font-medium'>{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.email}</p>
                  <p>
                    {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                  </p>

                  <Button
                    onClick={(e)=>{
                      e.stopPropagation()
                      dispatch(deleteAddress(index))
                    }}
                    className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm'
                  >
                    Delete
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={()=> setShowForm(true)}
              >
                + Add New Address
              </Button>
              <Button disabled={selectedAddress === null}
              className="w-full bg-red-600">Proceed To Checkout</Button>
            </div>
          )}

        </div>
        {/*  Right side order summary*/}
        <div>
          <Card className='w-[400px]'>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between'>
                <span>Subtotal ({cart.items.length}) items</span>
                <span> ₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className='flex justify-between'>
                <span>Shipping</span>
                <span> ₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              
              <div className='flex justify-between'>
                <span>Tax</span>
                <span> ₹{tax}</span>
              </div>
              <div className='flex justify-between font-bold text-lg'>
                <span>Total </span>
                <span> ₹{total}</span>
              </div>
              <div className='text-sm text-muted-foreground pt-4'>
                <p>* Free shipping on orders over 299</p>
                <p>* 30-days return policy</p>
                <p>* secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
