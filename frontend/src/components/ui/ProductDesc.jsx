import React from 'react'
import { Button } from './button'
import { Input } from './input'
import axios from 'axios'
import { toast } from 'sonner'
import { setCart } from '@/redux/productSlice'
import { useDispatch, useSelector } from 'react-redux'

const ProductDesc = ({ product }) => {

  const dispatch = useDispatch()

  const { user } = useSelector(store => store.user)

  const accessToken = localStorage.getItem("accessToken")

  const addToCart = async (productId) => {

    if (!user) {
      toast.error("Please login first")
      return
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        toast.success("Product added to cart")
        dispatch(setCart(res.data.cart))
      }

    } catch (error) {
      console.log(error)

      toast.error(
        error?.response?.data?.message || "Failed to add to cart"
      )
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-bold text-4xl text-gray-800'>
        {product.productName}
      </h1>

      <p className='text-gray-800'>
        {product.category} | {product.brand}
      </p>

      <h2 className='text-red-500 font-bold text-2xl'>
        ₹{product.productPrice}
      </h2>

      <p className='line-clamp-12'>
        {product.productDesc}
      </p>

      <div className='flex gap-2 items-center w-[300px]'>
        <p className='text-gray-800 font-semibold'>Quantity :</p>
        <Input type='number' className='w-14' defaultValue={1}/>
      </div>

      <Button
        onClick={() => addToCart(product._id)}
        className='bg-red-600 w-max'
      >
        Add to Cart
      </Button>
    </div>
  )
}

export default ProductDesc
