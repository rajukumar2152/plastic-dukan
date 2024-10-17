import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addProductAsync, resetProductAddStatus, selectProductAddStatus } from '../../products/ProductSlice';
import { useForm } from "react-hook-form";
import { selectBrands } from '../../brands/BrandSlice';
import { selectCategories } from '../../categories/CategoriesSlice';
import { toast } from 'react-toastify';

export const AddProduct = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const brands = useSelector(selectBrands);
    const categories = useSelector(selectCategories);
    const productAddStatus = useSelector(selectProductAddStatus);
    const navigate = useNavigate();

    useEffect(() => {
        if (productAddStatus === 'fullfilled') {
            reset();
            toast.success("New product added");
            navigate("/admin/dashboard");
        } else if (productAddStatus === 'rejected') {
            toast.error("Error adding product, please try again later");
        }
    }, [productAddStatus]);

    useEffect(() => {
        return () => {
            dispatch(resetProductAddStatus());
        };
    }, []);

    const handleAddProduct = (data) => {
        const formData = new FormData();
        
        // Append all product fields
        formData.append('title', data.title);
        formData.append('brand', data.brand);
        formData.append('category', data.category);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('discountPercentage', data.discountPercentage);
        formData.append('stockQuantity', data.stockQuantity);
        
        // Append the single thumbnail file
        formData.append('thumbnail', data.thumbnail[0]);
    
        // Append multiple images (use the same field name for all images)
        let len=data.image.length||0;
        for (let i = 0; i < len; i++) {
            formData.append('image', data.image[i]); // same key for each image
        }
    
        // Make an API call to the backend to add a product
        fetch('http://localhost:8000/products', {
            method: 'POST',
            body: formData, // formData automatically handles boundary and encoding
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            return response.json();
        })
        .then(() => {
            // Reset the form, show a success message, and navigate
            reset();
            toast.success("New product added");
            navigate("/admin/dashboard");
        })
        .catch((error) => {
            toast.error("Error adding product, please try again later");
            console.error('Error:', error);
        });
    };
    

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit(handleAddProduct)}
                className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full space-y-6"
            >
                {/* Title */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                    <input
                        {...register("title", { required: 'Title is required' })}
                        className={`border ${errors.title ? 'border-red-500' : 'border-gray-300'} w-full px-3 py-2 rounded-lg`}
                    />
                    {errors.title && <p className="text-red-500 text-xs italic">{errors.title.message}</p>}
                </div>

                {/* Brand and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Brand</label>
                        <select
                            {...register("brand", { required: 'Brand is required' })}
                            className={`border ${errors.brand ? 'border-red-500' : 'border-gray-300'} w-full px-3 py-2 rounded-lg`}
                        >
                            <option value="">Select a brand</option>
                            {brands.map((brand) => (
                                <option key={brand._id} value={brand._id}>{brand.name}</option>
                            ))}
                        </select>
                        {errors.brand && <p className="text-red-500 text-xs italic">{errors.brand.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <select
                            {...register("category", { required: 'Category is required' })}
                            className={`border ${errors.category ? 'border-red-500' : 'border-gray-300'} w-full px-3 py-2 rounded-lg`}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs italic">{errors.category.message}</p>}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                        {...register("description", { required: 'Description is required' })}
                        rows={4}
                        className={`border ${errors.description ? 'border-red-500' : 'border-gray-300'} w-full px-3 py-2 rounded-lg`}
                    />
                    {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
                </div>

                {/* Price and Discount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                        <input
                            type="number"
                            {...register("price", { required: 'Price is required' })}
                            className={`border ${errors.price ? 'border-red-500' : 'border-gray-300'} w-full px-3 py-2 rounded-lg`}
                        />
                        {errors.price && <p className="text-red-500 text-xs italic">{errors.price.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Discount Percentage</label>
                        <input
                            type="number"
                            {...register("discountPercentage", { required: 'Discount Percentage is required' })}
                            className={`border ${errors.discountPercentage ? 'border-red-500' : 'border-gray-300'} w-full px-3 py-2 rounded-lg`}
                        />
                        {errors.discountPercentage && <p className="text-red-500 text-xs italic">{errors.discountPercentage.message}</p>}
                    </div>
                </div>

                {/* Stock Quantity */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Stock Quantity</label>
                    <input
                        type="number"
                        {...register("stockQuantity", { required: 'Stock Quantity is required' })}
                        className={`border ${errors.stockQuantity ? 'border-red-500' : 'border-gray-300'} w-full px-3 py-2 rounded-lg`}
                    />
                    {errors.stockQuantity && <p className="text-red-500 text-xs italic">{errors.stockQuantity.message}</p>}
                </div>

                {/* Thumbnail Upload */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Thumbnail</label>
                    <input
                        type="file"
                        {...register("thumbnail", { required: 'Thumbnail is required' })}
                        className={`border ${errors.thumbnail ? 'border-red-500' : 'border-gray-300'} w-full px-3 py-2 rounded-lg`}
                        accept="image/*"
                    />
                    {errors.thumbnail && <p className="text-red-500 text-xs italic">{errors.thumbnail.message}</p>}
                </div>

                {/* Product Images Upload */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Product Images</label>
                    <div className="space-y-2">
                        <input
                            type="file"
                            {...register("image0", { required: 'Image 1 is required' })}
                            className="border border-gray-300 w-full px-3 py-2 rounded-lg"
                            accept="image/*"
                        />
                        <input
                            type="file"
                            {...register("image1", { required: 'Image 2 is required' })}
                            className="border border-gray-300 w-full px-3 py-2 rounded-lg"
                            accept="image/*"
                        />
                        <input
                            type="file"
                            {...register("image2", { required: 'Image 3 is required' })}
                            className="border border-gray-300 w-full px-3 py-2 rounded-lg"
                            accept="image/*"
                        />
                        <input
                            type="file"
                            {...register("image3", { required: 'Image 4 is required' })}
                            className="border border-gray-300 w-full px-3 py-2 rounded-lg"
                            accept="image/*"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Add Product</button>
                    <Link to="/admin/dashboard" className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">Cancel</Link>
                </div>
            </form>
        </div>
    );
};
