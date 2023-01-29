const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apifeature');

//Create new product -- admin
exports.createProduct = catchAsyncErrors(async(req,res,next)=>{
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

// Get all products
exports.getAllProducts = catchAsyncErrors(async(req,res,next)=>{
    const productsCounts = await Product.countDocuments();
    const resultPerPage = 10;
    const apiFeatures = new APIFeatures(Product.find(),req.query)
        .search()
        .filter()
        .pagination(resultPerPage); 

    const products = await apiFeatures.query;
    const filteredProductsCount = await products.length;

    res.status(200).json({
        success: true,
        productsCounts,
        resultPerPage,
        filteredProductsCount,
        products,
    });
});

// update product == admin
exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found',404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

//delete product == admin
exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found',404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted',
    });
});

//Get single product details
exports.getSingleProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found',404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
            
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((item)=>{
        avg += item.rating;
    });

    product.rating = avg / product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,

    });
});

//get all reviews
