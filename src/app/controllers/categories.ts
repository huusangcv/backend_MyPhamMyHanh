import ProductModel from '../models/product';
import { CategoryMethods } from '../models/category';
import express from 'express';
import slugify from 'slugify';

// [POST] /categories
export const createCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const imageData = req.file;
    const cloneFormData = formData;

    const slug = slugify(cloneFormData.name, { lower: true, strict: true });

    const existingCategory = await CategoryMethods.getCategoryBySlug(slug);

    if (existingCategory) {
      return res.status(400).json({
        status: false,
        message: 'Danh mục sản phẩm đã tồn tại',
      });
    }

    if (imageData) {
      const imagePath = `/uploads/categories/${imageData?.originalname}`;
      const newCategory = await CategoryMethods.createCategory({
        ...cloneFormData,
        image: imagePath,
      });

      return res.status(200).json({
        status: true,
        message: 'Tạo mới danh mục thành công',
        data: newCategory,
      });
    }

    const newCategory = await CategoryMethods.createCategory(cloneFormData);

    return res.status(200).json({
      status: true,
      message: 'Tạo mới danh mục thành công',
      data: newCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
    });
  }
};

// [PATCH] /category/:id
export const updateCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const cloneFormData = formData;

    if (cloneFormData.name !== undefined) {
      const product = await ProductModel.findOne({ category_id: id });

      if (product) {
        return res.status(403).json({
          status: false,
          message: 'Không thể thay đổi tên do tồn tại sản phẩm thuộc danh mục này',
          product,
        });
      }
    }

    if (cloneFormData.slug !== undefined) {
      const product = await ProductModel.findOne({ category_id: id });

      if (product) {
        return res.status(403).json({
          status: false,
          message: 'Không thể thay đổi slug do có sản phẩm thuộc danh mục này',
          product,
        });
      }
    }

    let category = await CategoryMethods.updateCategoryById(id);

    if (!category) {
      return res.status(403).json({
        status: false,
        message: 'Không tìm thấy sản phẩm tương ứng',
      });
    }

    //Map cloneFormData from client check value is undefined to update that value
    Object.keys(cloneFormData).forEach((key) => {
      if (cloneFormData[key] !== undefined) {
        category[key] = cloneFormData[key];
      }
    });

    await category.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật danh mục thành công',
      data: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
    });
  }
};

// [DELETE] /category/:id
export const deleteCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findOne({ category_id: id });

    if (product) {
      return res.status(403).json({
        status: false,
        message: 'Tồn tại sản phẩm thuộc danh mục này',
      });
    }

    await CategoryMethods.deleteCategoryById(id);

    const categories = await CategoryMethods.getCategories();

    return res.status(200).json({
      status: true,
      message: 'Xoá danh mục thành công',
      data: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
    });
  }
};

// [GET] /categories
export const getAllCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const categories = await CategoryMethods.getCategories();

    if (categories.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh mục sản phẩm',
        data: categories,
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Danh mục sản phẩm trống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: true,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
    });
  }
};

// [GET] /category/:slug
export const getCategoryBySlug = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const category = await CategoryMethods.getCategoryBySlug(slug);

    if (!category) {
      return res.status(403).json({
        status: false,
        message: 'Danh mục không tồn tại',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Chi tiết danh mục',
      data: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    });
  }
};

// [GET] /category/search?q=
export const getCategoryBySearch = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { q } = req.query;

    const categories = await CategoryMethods.searchCategories(q as string);

    if (categories.length > 0) {
      return res.status(200).json({
        status: true,
        message: `Kết quả tìm kiếm cho: ${q}`,
        data: categories,
      });
    }

    return res.status(403).json({
      status: false,
      message: 'Danh mục trống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    });
  }
};

// [POST] /categories/uploads/photo
export const uploadImageCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const imageData = req.file;

    return res.status(200).json({
      status: true,
      message: 'Upload ảnh danh mục thành công',
      data: `/uploads/categories/${imageData?.originalname}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};
