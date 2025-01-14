import slugify from 'slugify';
import { GenreMethods } from '../models/genre';
import express from 'express';

// [POST] /genres
export const createGenre = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = { ...formData };

    let slug = slugify(cloneFormData.name, { lower: true, strict: true });

    const genre = await GenreMethods.getGenreBySlug(slug);

    if (genre) {
      return res.status(403).json({
        status: false,
        message: 'Danh mục đã tồn tại',
      });
    }

    const newGenre = await GenreMethods.createGenre(cloneFormData);
    return res.status(200).json({
      status: true,
      message: 'Tạo mới thể loại bài viết thành công',
      newGenre,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
      error,
    });
  }
};

// [PATCH] /genre/:id
export const updateGenre = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const cloneFormData = { ...formData };

    const slug = slugify(cloneFormData.name, { lower: true, strict: true });

    let genre = await GenreMethods.updateGenreById(id);

    if (genre && slug === genre.slug) {
      return res.status(403).json({
        status: false,
        message: 'Tên thể loại đã tồn tại',
      });
    }

    if (!genre) {
      return res.status(403).json({
        staus: false,
        message: 'Không tìm thấy thể loại bài viết',
      });
    }

    if (cloneFormData._id) {
      delete cloneFormData._id;
      return res.status(403).json({
        status: false,
        message: 'Không cập nhật được trường Id',
      });
    }

    // This object to check value from form is not undefined
    Object.keys(cloneFormData).forEach((key) => {
      if (genre && cloneFormData[key] !== undefined) {
        genre[key] = cloneFormData[key];
      }
    });

    await genre.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật thể loại bài viết thành công',
      genre,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại',
      error,
    });
  }
};

// [DELETE] /genre/:id
export const deleteGenre = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const genre = await GenreMethods.getGenreById(id);

    if (!genre) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại thể loại tương ứng',
      });
    }

    await GenreMethods.deleteGenreById(id);

    const genres = await GenreMethods.getGenres();

    return res.status(200).json({
      status: true,
      message: 'Xoá thể loại bài viết thành công',
      genres,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
      error,
    });
  }
};

// [GET] /genres
export const getAllGenres = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const genres = await GenreMethods.getGenres();

    if (genres.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách thể loại bài viết',
        genres,
      });
    }

    return res.status(403).json({
      status: false,
      message: 'Danh sách thể loai bài viết trống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
      error,
    });
  }
};

// [GET] /genres/search?q=
export const getGenresBySearch = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(403).json({
        status: false,
        message: 'Vui lòng cung cấp từ khoá tìm kiếm',
      });
    }

    const genres = await GenreMethods.searchGenresByName(q as string);

    if (genres.length > 0) {
      return res.status(200).json({
        status: true,
        message: `Thể loại theo: ${q}`,
        genres,
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
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
      error,
    });
  }
};

// [GET] /genre/:slug
export const getDetailGenre = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const genre = await GenreMethods.getGenreBySlug(slug);

    if (!genre) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại thể loại bài viết tương ứng',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Chi tiết thể loại bài viết',
      genre,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
      error,
    });
  }
};
