import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Card } from "@/components/ui/card";

import { Edit, Search, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useDispatch, useSelector } from 'react-redux'
import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ui/ImageUpload'
import axios from 'axios'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AdminProduct = () => {

  const { products } = useSelector(store => store.product)
  const [editProduct, setEditProduct] = useState(null)
  const [open, setOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const accessToken = localStorage.getItem("accessToken")

  const dispatch = useDispatch()

  let filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (sortOrder === 'lowToHigh') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice)
  }

  if (sortOrder === 'highToLow') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append("productName", editProduct.productName)
    formData.append("productDesc", editProduct.productDesc)
    formData.append("productPrice", editProduct.productPrice)
    formData.append("category", editProduct.category)
    formData.append("brand", editProduct.brand)

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        toast.success("Product updated successfully")

        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p
        )

        dispatch(setProducts(updateProducts))

        setOpen(false)
      }

    } catch (error) {
      console.log(error)
      toast.error("Failed to update product")
    }
  }

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId
      )

      const res = await axios.delete(
        `http://localhost:8000/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setProducts(remainingProducts))
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete product")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="ml-[260px] pt-[100px] px-10">

        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 justify-between items-center">

          <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Product..."
              className="w-[350px]"
            />
            <Search className="absolute right-3 top-2 text-gray-500" />
          </div>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredProducts.map((product, index) => {
            return (
              <Card key={index} className="p-3 shadow-md bg-white rounded-lg">

                <div className="flex flex-col gap-2">

                  <img
                    src={product.productImg[0].url}
                    alt=""
                    className="h-32 w-full object-contain rounded-md bg-gray-50 p-2"
                  />

                  <h1 className="font-semibold text-sm text-gray-700 truncate">
                    {product.productName}
                  </h1>

                  <h1 className="font-bold text-gray-800 text-base">
                    ₹{product.productPrice}
                  </h1>

                  <div className="flex justify-end gap-3 mt-2 border-t pt-2">

                    <Dialog open={open} onOpenChange={setOpen}>

                      <DialogTrigger asChild>
                        <Edit
                          onClick={() => {
                            setEditProduct(product)
                            setOpen(true)
                          }}
                          className="text-green-600 cursor-pointer"
                        />
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[420px] max-h-[80vh] overflow-y-auto bg-white text-black">


                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>
                            Update product details below
                          </DialogDescription>
                        </DialogHeader>

                       <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">


                          <div>
                            <Label>Product Name</Label>
                            <Input
                              value={editProduct?.productName}
                              onChange={handleChange}
                              name="productName"
                            />
                          </div>

                          <div>
                            <Label>Price</Label>
                            <Input
                              type="number"
                              value={editProduct?.productPrice}
                              onChange={handleChange}
                              name="productPrice"
                            />
                          </div>

                          <div>
                            <Label>Description</Label>
                            <Textarea
                              name="productDesc"
                              value={editProduct?.productDesc}
                              onChange={handleChange}
                            />
                          </div>

                          <ImageUpload
                            productData={editProduct}
                            setProductData={setEditProduct}
                          />

                        </div>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>

                          {/* RED SAVE BUTTON */}
                          <Button
                            onClick={handleSave}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Save Changes
                          </Button>

                        </DialogFooter>

                      </DialogContent>

                    </Dialog>

                    {/* DELETE DIALOG WITH WHITE COLOR */}
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Trash2 className="text-red-500 cursor-pointer" />
                      </AlertDialogTrigger>

                      <AlertDialogContent className="bg-white text-black">

                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-black">
                            Are you sure you want to delete?
                          </AlertDialogTitle>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => deleteProductHandler(product._id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>

                        </AlertDialogFooter>

                      </AlertDialogContent>

                    </AlertDialog>

                  </div>

                </div>

              </Card>
            )
          })}

        </div>

      </div>

    </div>
  )
}

export default AdminProduct
