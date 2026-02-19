import FilterSidebar from '@/components/ui/FilterSidebar'
import ProductCard from '@/components/ui/ProductCard'
import { setProducts } from '@/redux/productSlice'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import axios from 'axios'
import React, { useState ,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const Products = () => {

  // -------- FIXED LINE 1 -----------
  const products = useSelector(store =>
    Array.isArray(store.product.products) ? store.product.products : []
  )
  // --------------------------------

  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 999999])
  const [sortOrder, setSortOrder] = useState('')
  const dispatch = useDispatch()

  const getAllProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:8000/api/v1/product/getallproducts`);
      if (res.data.success) {
        setAllProducts(res.data.products)
        dispatch(setProducts(res.data.products))
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts]

    if (search.trim() !== "") {
      filtered = filtered.filter(p =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== "All") {
      filtered = filtered.filter(p => p.category === category)
    }

    if (brand !== "All") {
      filtered = filtered.filter(p => p.brand === brand)
    }

    filtered = filtered.filter(
      p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    )

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice)
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.productPrice - a.productPrice)
    }

    dispatch(setProducts(filtered))

  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])

  useEffect(() => {
    getAllProducts()
  }, [])

  return (
    <div className="pt-24 pb-10 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex gap-7 px-4">

        <div className="hidden md:block">
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            category={category}
            setCategory={setCategory}
            allProducts={allProducts}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        <div className="flex flex-col flex-1">

          <div className="flex justify-end mb-6">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[200px] bg-white border shadow-sm">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>

              <SelectContent className="z-[9999] bg-white shadow-lg border rounded-md">
                <SelectGroup>
                  <SelectLabel>Sort</SelectLabel>
                  <SelectItem value='lowToHigh'>Low to High</SelectItem>
                  <SelectItem value='highToLow'>High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* -------- FIXED SAFE MAP -------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
              Array.isArray(products) && products.length > 0 ? (
                products.map((product) => {
                  return <ProductCard key={product._id} product={product} loading={loading} />
                })
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  No products found
                </div>
              )
            }
          </div>
          {/* -------------------------------- */}

        </div>
      </div>
    </div>
  )
}

export default Products
