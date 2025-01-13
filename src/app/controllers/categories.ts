import { CategoryMethods } from '../models/category';
import express from 'express';
import slugify from 'slugify';

export const createCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = formData;

    const slug = slugify(cloneFormData.name, { lower: true, strict: true });

    const existingCategory = await CategoryMethods.getCategoryBySlug(slug);

    if (existingCategory) {
      return res.status(403).json({
        status: false,
        message: 'Danh mục sản phẩm đã tồn tại',
      });
    }

    const newCategory = await CategoryMethods.createCategory(cloneFormData);

    return res.status(200).json({
      status: true,
      message: 'Tạo mới danh mục thành công',
      newCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
    });
  }
};

export const updateCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const cloneFormData = formData;

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
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
    });
  }
};

export const deleteCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    await CategoryMethods.deleteCategoryById(id);

    const category = await CategoryMethods.getCategories();

    return res.status(200).json({
      status: true,
      message: 'Xoá danh mục thành công',
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
    });
  }
};

export const getAllCategory = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const category = await CategoryMethods.getCategories();

    if (category.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh mục sản phẩm',
        category,
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
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    });
  }
};
