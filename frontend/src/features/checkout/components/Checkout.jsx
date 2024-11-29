import { Stack, TextField, Typography, Button, Menu, MenuItem, Select, Grid, FormControl, Radio, Paper, IconButton, Box, useTheme, useMediaQuery } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SHIPPING, TAXES } from '../../../constants'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom';


export const Checkout = () => {
    const location = useLocation();
    const { price, id ,title} = location.state || {};

    const status = ''
    const addresses = useSelector(selectAddresses)
    const [selectedAddress, setSelectedAddress] = useState(addresses[0])
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash')
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const addressStatus = useSelector(selectAddressStatus)
    const navigate = useNavigate()
    const cartItems = useSelector(selectCartItems)
    const orderStatus = useSelector(selectOrderStatus)
    const currentOrder = useSelector(selectCurrentOrder)
    const orderTotal = cartItems.reduce((acc, item) => (item.product.price * item.quantity) + acc, 0)
    const theme = useTheme()
    const is900 = useMediaQuery(theme.breakpoints.down(900))
    const is480 = useMediaQuery(theme.breakpoints.down(480))
    const [quantity, setQuantity] = useState(1); // Default value set to 1

    // Step 2: Handle changes in the TextField
    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    // console.log("id",state.id,state.price);
    useEffect(() => {
        if (addressStatus === 'fulfilled') {
            reset()
        }
        else if (addressStatus === 'rejected') {
            alert('Error adding your address')
        }
    }, [addressStatus])

    useEffect(() => {
        if (currentOrder && currentOrder?._id) {
            dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            navigate(`/order-success/${currentOrder?._id}`)
        }
    }, [currentOrder])

    const handleAddAddress = (data) => {
        const address = { ...data, user: loggedInUser._id }
        dispatch(addAddressAsync(address))
    }

    const handleCreateOrder = () => {
        // Create the order payload
        const order = {
            user: loggedInUser?._id,
            product_id:id,
            product: title,
            no_of_product_purchased:quantity,
            address: selectedAddress,
            paymentMode: selectedPaymentMethod,
            total_before_tax:price*quantity,
            total_after_tax: price*quantity + SHIPPING + TAXES,
        };

        console.log(order);

        // Send the payload to the backend
        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert('Order placed successfully!');
                    dispatch(resetCartByUserIdAsync(loggedInUser?._id)); // Reset the cart
                    navigate(`/order-success/${data.orderId}`); // Navigate to order success page
                } else {
                    alert('Failed to place order. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error placing order:', error);
                alert('An error occurred while placing the order.');
            });
    };


    return (
        <Stack flexDirection={'row'} p={2} rowGap={10} justifyContent={'center'} flexWrap={'wrap'} mb={'5rem'} mt={2} columnGap={4} alignItems={'flex-start'}>

            {/* left box */}
            <Stack rowGap={4}>

                {/* heading */}
                <Stack flexDirection={'row'} columnGap={is480 ? 0.3 : 1} alignItems={'center'}>
                    <motion.div whileHover={{ x: -5 }}>
                        <IconButton component={Link} to={"/"}><ArrowBackIcon fontSize={is480 ? "medium" : 'large'} /></IconButton>
                    </motion.div>
                    <Typography variant='h4'>Shipping Information</Typography>
                </Stack>

                {/* address form */}
                <Stack component={'form'} noValidate rowGap={2} onSubmit={handleSubmit(handleAddAddress)}>
                    <Stack>
                        <Typography gutterBottom>city</Typography>
                        <TextField {...register("country", { required: true })} />
                    </Stack>
                    <Stack>
                        <Typography gutterBottom>sector</Typography>
                        <TextField {...register("street", { required: true })} />
                    </Stack>
                    <Stack>
                        <Typography gutterBottom>House:Number</Typography>
                        <TextField {...register("type", { required: true })} />
                    </Stack>




                    <Stack>
                        <Typography gutterBottom>Phone Number</Typography>
                        <TextField type='number' {...register("phoneNumber", { required: true })} />
                    </Stack>

                    <Stack flexDirection={'row'}>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>City</Typography>
                            <TextField  {...register("city", { required: true })} />
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>State</Typography>
                            <TextField  {...register("state", { required: true })} />
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>Postal Code</Typography>
                            <TextField type='number' {...register("postalCode", { required: true })} />
                        </Stack>
                    </Stack>

                    <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={1}>
                        <LoadingButton loading={status === 'pending'} type='submit' variant='contained'>add</LoadingButton>
                        <Button color='error' variant='outlined' onClick={() => reset()}>Reset</Button>
                    </Stack>
                    <Stack width={'100%'}>
                        <Typography gutterBottom>Quantities</Typography>
                        {/* Step 3: Bind value and onChange handler */}
                        <TextField
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            inputProps={{ min: 1 }} // Optional: To restrict input to minimum 1
                        />
                    </Stack>
                </Stack>



                {/* payment methods */}
                <Stack rowGap={3}>

                    <Stack>
                        <Typography variant='h6'>Payment Methods</Typography>
                        <Typography variant='body2' color={'text.secondary'}>Please select a payment method</Typography>
                    </Stack>

                    <Stack rowGap={2}>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value={selectedPaymentMethod} name='paymentMethod' checked={selectedPaymentMethod === 'COD'} onChange={() => setSelectedPaymentMethod('COD')} />
                            <Typography>Cash</Typography>
                        </Stack>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value={selectedPaymentMethod} name='paymentMethod' checked={selectedPaymentMethod === 'CARD'} onChange={() => setSelectedPaymentMethod('CARD')} />
                            <Typography>Card</Typography>
                        </Stack>

                    </Stack>


                </Stack>

                <div className='bg-gray-700 text-white text-3xl rounded-md px-4 py-2 font-extrabold hover:bg-red-500 '>
                    price of one {title} is {price}Rs
                </div>

                <div className='bg-gray-700 text-white text-3xl rounded-md px-4 py-2 font-extrabold hover:bg-red-500 '>
                    You have to pay: <apan px-3>{price*quantity}Rs</apan>  
                </div>

                <button onClick={handleCreateOrder} className='bg-black text-white text-3xl rounded-md px-4 py-2 font-extrabold hover:bg-red-500 '>
                    ORDER
                </button>
                {/* <LoadingButton className='font-extrabold' fullWidth loading={orderStatus === 'pending'} variant='contained' onClick={handleCreateOrder} size='large'>order</LoadingButton> */}
            </Stack>

            {/* right box */}
            {/* <Stack  width={is900?'100%':'auto'} alignItems={is900?'flex-start':''}> */}
            {/* <Typography variant='h4'>Order summary</Typography> */}
            {/* <Cart checkout={true}/> */}



            {/* </Stack> */}

        </Stack>
    )
}
