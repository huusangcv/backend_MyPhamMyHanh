import slugify from 'slugify';
import ProductModel, { ProductMethods } from '../models/product';
import express from 'express';
import ReviewModel, { ReviewMethods } from '../models/review';
import CategoryModel, { CategoryMethods } from '../models/category';

// [POST] /products
export const createProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const imagesData = req.files;
    const cloneFormData = { ...formData };
    let slug = slugify(cloneFormData.name, { lower: true, strict: true });

    const exsitingProduct = await ProductMethods.getProductBySlug(slug);

    if (exsitingProduct) {
      return res.status(403).json({
        status: false,
        message: 'Đã có sản phẩm tên tương tự, hay chọn một tên khác',
      });
    }

    let newProduct;

    // check products have images
    if (imagesData) {
      const imagesPath = Array.isArray(imagesData)
        ? imagesData.map((image: any) => `/uploads/products/${image.originalname}`)
        : [];
      newProduct = await ProductMethods.createProduct({
        ...cloneFormData,
        images: imagesPath,
      });

      return res.status(200).json({
        status: true,
        message: 'Thêm mới sản phẩm thành công',
        data: newProduct,
      });
    }

    newProduct = await ProductMethods.createProduct(cloneFormData);
    return res.status(200).json({
      status: true,
      message: 'Thêm mới sản phẩm thành công',
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    });
  }
};

// [PATCH] /product/:id
export const updateProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const imagesData = req.files;
    const cloneFormData = { ...formData };

    let product = await ProductMethods.updateProductById(id);

    if (cloneFormData.name) {
      const slug = slugify(cloneFormData?.name, { lower: true, strict: true });

      if (product && slug === product.slug) {
        return res.status(403).json({
          status: false,
          message: 'Tên sản phẩm đã tồn tại',
        });
      }
    }

    if (!product) {
      return res.status(403).json({
        status: false,
        message: 'Sản phẩm không tồn tại, hãy thử lại',
      });
    }

    //Map cloneFormData from client check value is undefined to update that value
    Object.keys(cloneFormData).forEach((key) => {
      if (cloneFormData[key] !== undefined) {
        product[key] = cloneFormData[key];
      }
    });

    // check images from data is array after using map to get imagesPath
    if (imagesData && Array.isArray(imagesData) && imagesData.length > 0) {
      const imagesPath = imagesData.map((image: any) => `/uploads/products/${image.originalname}`);
      product.images = imagesPath;
      await product.save();

      return res.status(200).json({
        status: true,
        message: 'Cập nhật sản phẩm thành công',
        data: product,
      });
    }

    await product.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [DELETE] /product/:id
export const deleteProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const existingReviewForProduct = await ReviewModel.findOne({ product_id: id });

    if (existingReviewForProduct) {
      return res.status(403).json({
        status: false,
        message: 'Tồn tại đánh giá thuộc sản phẩm này',
      });
    }

    await ProductMethods.deleteProductById(id);

    const products = await ProductMethods.getProducts();

    return res.status(200).json({
      status: true,
      message: 'Xoá sản phẩm thành công',
      data: products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /products
export const getAllProducts = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const products = await ProductMethods.getProducts();

    if (products.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Lấy danh sách sản phẩm thành công',
        data: products,
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Danh sách sản phẩm trống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};

// [GET] /products
export const getAllProductsByCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = (page - 1) * limit;

    const category = await CategoryModel.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Danh mục không tồn tại',
      });
    }

    const total = await ProductModel.countDocuments({ category_id: category._id });
    const totalPages = Math.ceil(total / limit);

    const products = await ProductModel.find({ category_id: category._id }).skip(skip).limit(limit);
    if (products.length > 0) {
      return res.status(200).json({
        status: true,
        title: category.name,
        message: `Danh sách sản phẩm trang: ${page}`,
        data: {
          products,
          total,
          totalPages,
          currentPage: page,
        },
      });
    }

    return res.status(204).json({
      status: false,
      message: 'Danh sách sản phẩm trống',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};

// [GET] /products/search?q=
export const getProductBySearch = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp từ khóa tìm kiếm.',
      });
    }

    const products = await ProductMethods.searchProducts(q as string);

    if (products.length > 0) {
      return res.status(200).json({
        status: true,
        message: `Sản phẩm tìm kiểm cho: ${q}`,
        data: products,
      });
    }

    return res.status(404).json({
      status: false,
      message: `Không tìm thấy sản phầm cần tìm`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};

// [GET] /products/:slug
export const getOne = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { slug } = req.params;

    const product = await ProductMethods.getProductBySlug(slug as string);

    if (!product) {
      return res.status(403).json({
        status: false,
        message: 'Sản phẩm không tồn tại hoặc có lỗi xảy ra',
      });
    }

    const reviews = await ReviewModel.find({ product_id: product._id });

    if (reviews.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Sản phẩm chi tiết',
        data: {
          product,
          reviews,
        },
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Sản phẩm chi tiết',
      data: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại sau',
    });
  }
};

// [GET] /products/:id
export const getOneById = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const product = await ProductMethods.getProductById(id);

    if (!product) {
      return res.status(403).json({
        status: false,
        message: 'Sản phẩm không tồn tại hoặc có lỗi xảy ra',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Sản phẩm chi tiết',
      data: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại sau',
    });
  }
};

// [GET] /products?page=&limit=
export const getProductsOncePage = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await ProductModel.find().skip(skip).limit(limit);

    const total = await ProductModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    if (products.length > 0) {
      return res.status(200).json({
        status: true,
        message: `Danh sách sản phẩm trang: ${page}`,
        data: {
          products,
          total,
          totalPages,
          currentPage: page,
        },
      });
    }

    return res.status(200).json({
      status: false,
      message: `Không có sản phẩm ở trang này`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};

// [POST] /products/uploads/photo
export const uploadImageForDescription = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const imageData = req.file;

    return res.json({
      status: true,
      message: 'Upload ảnh sản phẩm thành công',
      data: `/uploads/products/${imageData?.originalname}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};
// [POST] /products/uploads/photos
export const uploadImagesProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const imagesData = req.files;

    if (imagesData && Array.isArray(imagesData) && imagesData.length > 0) {
      const imagesPath = imagesData.map((image: any) => `/uploads/products/${image.originalname}`);

      return res.status(200).json({
        status: true,
        message: 'Upload ảnh sản phẩm thành công',
        data: imagesPath,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};
