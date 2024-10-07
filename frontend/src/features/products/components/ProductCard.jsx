import { FormHelperText, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion';

export const ProductCard = ({ id, title, price, thumbnail, brand, stockQuantity, handleAddRemoveFromWishlist, isWishlistCard, isAdminCard }) => {

    const navigate = useNavigate();
    const wishlistItems = useSelector(selectWishlistItems);
    const loggedInUser = useSelector(selectLoggedInUser);
    const cartItems = useSelector(selectCartItems);
    const dispatch = useDispatch();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down(488));

    const isProductAlreadyInWishlist = wishlistItems.some((item) => item.product._id === id);
    const isProductAlreadyInCart = cartItems.some((item) => item.product._id === id);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        const data = { user: loggedInUser?._id, product: id };
        dispatch(addToCartAsync(data));
    };

    return (
        <Paper
            onClick={() => navigate(`/product-details/${id}`)}
            elevation={3}
            sx={{
                padding: '16px',
                borderRadius: '8px',
                width: isSmallScreen ? 'auto' : '300px',
                cursor: isAdminCard ? 'default' : 'pointer',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                    boxShadow: isAdminCard ? 'none' : '0px 6px 12px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            {/* Image Section */}
            <Stack>
                
                <img
                    src={thumbnail}
                    alt={`${title} photo unavailable`}
                    style={{
                        width: '100%',
                        
                       
                      
                        borderRadius: '8px',
                        marginBottom: '16px',
                    }}
                />
            </Stack>

            {/* Product Info Section */}
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {title}
                    </Typography>
                    {!isAdminCard && (
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <Checkbox
                                onClick={(e) => e.stopPropagation()}
                                checked={isProductAlreadyInWishlist}
                                onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                                icon={<FavoriteBorder />}
                                checkedIcon={<Favorite sx={{ color: 'red' }} />}
                            />
                        </motion.div>
                    )}
                </Stack>
                <Typography variant="body2" color="textSecondary">
                    {brand}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                        {price} Rs
                    </Typography>

                    {!isWishlistCard && !isAdminCard && !isProductAlreadyInCart && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => handleAddToCart(e)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                            }}
                        >
                            Add To Cart
                        </motion.button>
                    )}
                </Stack>

                {/* Stock Alert */}
                {stockQuantity <= 20 && (
                    <FormHelperText sx={{ fontSize: '0.875rem', color: 'red' }}>
                        {stockQuantity === 1 ? 'Only 1 stock left' : 'Only a few left'}
                    </FormHelperText>
                )}
            </Stack>
        </Paper>
    );
};
