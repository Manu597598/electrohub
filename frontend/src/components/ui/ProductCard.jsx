import React from 'react'
import { Button } from './button'
import { ShoppingCart } from 'lucide-react'
import { Skeleton } from './skeleton'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'

import axios from 'axios'
const ProductCard = ({ product , loading }) => {
  const { productImg, productPrice, productName } = product
const accessToken = localStorage.getItem('accessToken')
const dispatch = useDispatch()
const navigate = useNavigate()
  const addToCart = async(productId)=> {
    try{
      const res= await axios.post(`http://localhost:8000/api/v1/cart/add`,{productId},{
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        toast.success('Product added to cart')
        dispatch(setCart(res.data.cart))
      }
    } catch (error){
      console.error(error)
    }
  }


  return (
    <div className="shadow-md bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">

      <div className="w-full aspect-square overflow-hidden bg-gray-100">
        {
          loading ? <Skeleton className='w-full h-full rounded-lg'/>:<img  onClick={()=>navigate(`/products/${product._id}`)}
          src={productImg[0]?.url} 
          alt="" 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
        />
}
      </div>
{
  loading ? <div className='px-2 space-y-2 my-2'>
    <Skeleton className='w-[200px] h-4'/>
    <Skeleton className='w-[100px] h-4'/>
    <Skeleton className='w-[150px] h-4'/>
    </div>:  <div className="p-3 space-y-2">
        <h1 className="font-semibold h-12 line-clamp-2 text-sm">
          {productName}
        </h1>

        <h2 className="font-bold text-base text-green-700">
          ₹{productPrice}
        </h2>

        <Button  onClick={()=> addToCart(product._id)} className="bg-red-600 w-full flex items-center justify-center gap-2">
          <ShoppingCart size={16}/>
          Add to Cart
        </Button>
      </div>
}
    </div>
  )
}

export default ProductCard
