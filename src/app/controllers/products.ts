import slugify from 'slugify';
import { ProductMethods } from '../models/product';
import express from 'express';

export const createProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    // const {name, price, category_id,note, description, image, status, sold, bestseller, discount} = req.body
    const formData = req.body;
    let slug = slugify(formData.name, { lower: true, strict: true });

    const exsitingProduct = await ProductMethods.getProductBySlug(slug);

    if (exsitingProduct) {
      return res.status(403).json({
        status: false,
        message: 'Đã có sản phẩm tên tương tự, hay chọn một tên khác',
      });
    }

    const newProduct = await ProductMethods.createProduct(formData);

    return res.status(200).json({
      status: true,
      message: 'Thêm mới sản phẩm thành công',
      newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    });
  }
};

export const updateProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const newFormData = formData;
    const { id } = req.params;
    const product = await ProductMethods.updateProductById(id);

    if (!product) {
      return res.status(403).json({
        status: false,
        message: 'Sản phẩm không tồn tại, hãy thử lại',
      });
    }

    //Map cloneFormData from client check value is undefined to update that value
    Object.keys(newFormData).forEach((key) => {
      if (newFormData[key] !== undefined) {
        product[key] = newFormData[key];
      }
    });

    await product.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật sản phẩm thành công',
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

export const deleteProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    await ProductMethods.deleteProductById(id);

    const products = await ProductMethods.getProducts();

    return res.status(200).json({
      status: true,
      message: 'Xoá sản phẩm thành công',
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

export const getAllProducts = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const products = await ProductMethods.getProducts();

    if (products.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Lấy danh sách sản phẩm thành công',
        products,
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
        products,
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

export const getDetailProductBySlug = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { slug } = req.params;

    const product = await ProductMethods.getProductBySlug(slug as string);

    if (!product) {
      return res.status(403).json({
        status: false,
        message: 'Sản phẩm không tồn tại hoặc có lỗi xảy ra',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Sản phẩm chi tiết',
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại sau',
    });
  }
};
