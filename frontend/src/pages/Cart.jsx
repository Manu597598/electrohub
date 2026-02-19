
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import userLogo from "../assets/user.avif"
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { Separator } from '@radix-ui/react-select'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'
import React, { useEffect } from "react";

const Cart = () => {
  const { cart } = useSelector(store => store.product)
  console.log(cart);

  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05
  const total = subtotal + shipping + tax

  const navigate = useNavigate()
const dispatch = useDispatch()
 
const API = "http://localhost:8000/api/v1/cart"
const accessToken = localStorage.getItem("accessToken")

const loadCart = async ()=>{
  try{
    const res = await axios.get(API,{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    })
    if(res.data.success){
      dispatch(setCart(res.data.cart))
    }
  }catch(error){
    console.log(error);
  }
}
const handleUpdateQuantity = async (productId, type)=> {
  try{
    const res = await axios.put(`${API}/update`, {productId, type},{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    })
    if(res.data.success){
      dispatch(setCart(res.data.cart))
    }
  } catch(error){
    console.log(error);
  }
}
const handleRemove = async(productId)=>{
  try{
    const res = await axios.delete(`${API}/remove`,{
      headers:{
        Authorization:`Bearer ${accessToken}`,
        
      },
      data:{productId}
    });
    if(res.data.success){
      console.log(res.data.cart)
      dispatch(setCart(res.data.cart))
      toast.success('Product removed from cart')
    }
  } catch(error){
    console.log(error);
  }
}
useEffect(()=>{
  loadCart()
},[dispatch])
  return (
    <div className='pt-20 bg-gray-50 min-h-screen'>
      {
        cart?.items?.length > 0 ? (
          <div className='max-w-[1200px] w-full mx-auto px-4'>

            <h1 className='text-2xl font-bold text-gray-800 mb-7'>
              Shopping Cart
            </h1>

            {/* MAIN CONTAINER */}
            <div className='flex flex-col lg:flex-row gap-6'>

              {/* LEFT - CART ITEMS */}
              <div className='flex flex-col gap-4 flex-1'>

                {cart?.items?.map((product, index) => {
                  return (
                    <Card key={index} className="p-3">
                      <div className='flex flex-wrap md:flex-nowrap justify-between items-center gap-3'>

                        <div className='flex items-center gap-3 flex-1 min-w-0'>

                          <img
                            src={product?.productId?.productImg?.[0]?.url || userLogo}
                            alt=""
                            className='w-16 h-16 object-cover rounded-md border'
                          />

                          <div className='min-w-0'>
                            <h1 className='font-semibold truncate'>
                              {product?.productId?.productName}
                            </h1>
                            
                            <p className='text-gray-600'>
                              ₹{product?.productId?.productPrice}
                            </p>
                          </div>

                        </div>

                        <div className='flex gap-2 items-center'>
                          <Button  onClick={()=>handleUpdateQuantity(product.productId._id,'decrease')} variant='outline'>-</Button>
                          <span>{product?.quantity}</span>
                          <Button  onClick={()=>handleUpdateQuantity(product.productId._id,'increase')} variant='outline'>+</Button>
                        </div>

                        <p className='font-semibold w-[80px] text-right'>
                          ₹{(product?.productId?.productPrice) * (product?.quantity)}
                        </p>

                        <p  onClick={()=>handleRemove(product?.productId?._id)} className='flex text-red-500 items-center gap-1 cursor-pointer'>
                          <Trash2 className='w-4 h-4' /> Remove
                        </p>

                      </div>
                    </Card>
                  )
                })}

              </div>

              {/* RIGHT - ORDER SUMMARY */}
              <div className='w-full lg:w-[350px]'>

                <Card className='lg:sticky lg:top-24'>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>

                  <CardContent className='space-y-4'>

                    <div className='flex justify-between'>
                      <span>Subtotal ({cart?.items?.length} items)</span>
                      <span>₹{cart?.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>

                    <div className='flex justify-between'>
                      <span>Shipping</span>
                      <span>₹{shipping}</span>
                    </div>

                    <div className='flex justify-between'>
                      <span>Tax (5%)</span>
                      <span>₹{tax}</span>
                    </div>

                    <Separator />

                    <div className='flex justify-between font-bold text-lg'>
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>

                    <div className='space-y-3 pt-4'>

                      <div className='flex space-x-2'>
                        <Input placeholder="Promo Code" />
                        <Button variant='outline'>Apply</Button>
                      </div>

                      <Button onClick={()=>navigate('/address')} className='w-full bg-red-600'>
                        PLACE ORDER
                      </Button>

                      <Button variant='outline' className='w-full'>
                        <Link to="/products">Continue Shopping</Link>
                      </Button>

                    </div>

                    <div className='text-sm text-gray-500 pt-4'>
                      <p>* Free shipping on orders over 299</p>
                      <p>* 30-days return policy</p>
                      <p>* Secure checkout with SSL encryption</p>
                    </div>

                  </CardContent>
                </Card>

              </div>

            </div>

          </div>

        ) : (

          <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>

            <div className='bg-red-100 p-6 rounded-full'>
              <ShoppingCart className='w-16 h-16 text-red-600' />
            </div>

            <h2 className='mt-6 text-2xl font-bold text-gray-800'>
              Your Cart is Empty
            </h2>

            <p className='mt-2 text-gray-500'>
              Looks like you haven't added anything to your cart yet
            </p>

            <Button
              onClick={() => navigate('/products')}
              className='mt-6 bg-red-600 text-white py-3 hover:bg-red-700'
            >
              Start Shopping
            </Button>

          </div>

        )
      }
    </div>
  )
}

export default Cart
