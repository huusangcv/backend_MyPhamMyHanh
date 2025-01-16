import { CertificateMethods } from '../models/certificate';
import express from 'express';

// [POST] /certificates
export const createCertificate = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const imageData = req?.file;
    const cloneFormData = { ...formData };

    const existingCertificate = await CertificateMethods.getCertificateByName(cloneFormData?.name);

    if (existingCertificate) {
      return res.status(403).json({
        status: false,
        message: 'Bằng khen đã tồn tại',
      });
    }

    let certificate;

    // check image form data, if have image add image plus path
    if (imageData) {
      certificate = await CertificateMethods.createCertificate({
        ...cloneFormData,
        image: `/uploads/certificates/${imageData.originalname}`,
      });
      return res.status(200).json({
        status: true,
        message: 'Thêm mới bằng khen thành công',
        certificate,
      });
    }

    certificate = await CertificateMethods.createCertificate(cloneFormData);
    return res.status(200).json({
      status: true,
      message: 'Thêm mới bằng khen thành công',
      certificate,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [UPDATE] /certificate/:id
export const updateCertificate = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const imageData = req.file;
    const cloneFormData = { ...formData };

    let certificate = await CertificateMethods.updateCertificateById(id);

    if (!certificate) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy bằng khen tương ứng',
      });
    }

    if (imageData) {
      certificate.image = `/uploads/certificates/${imageData.originalname}`;
      certificate.save();
      return res.status(200).json({
        status: true,
        message: 'Cập nhật bằng khen thành công',
        certificate,
      });
    }

    Object.keys(cloneFormData).forEach((key) => {
      if (cloneFormData[key] !== undefined) {
        certificate[key] = cloneFormData[key];
      }
    });

    certificate.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật bằng khen thành công',
      certificate,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [DELETE] /certificate/:id
export const deleteCertificate = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    await CertificateMethods.deleteCertificateById(id);
    const certificates = await CertificateMethods.getCertificates();

    return res.status(200).json({
      status: true,
      message: 'Xoá bằng khen thành công',
      certificates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
    });
  }
};

// [GET] /certificates
export const getAllCertificates = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const certificates = await CertificateMethods.getCertificates();

    if (certificates.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách bằng khen',
        certificates,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Danh sách bằng khen trống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
    });
  }
};

// [GET] /certificates/search?q=
export const searchCertificates = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(403).json({
        status: false,
        message: 'Vui lòng cung cấp từ khoá tìm kiếm',
      });
    }

    const certificates = await CertificateMethods.getCertificatesBySearch(q as string);

    return res.status(200).json({
      status: true,
      messgae: `Kết quả tìm kiếm cho: ${q}`,
      certificates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
    });
  }
};

// [GET] /certificate/:id
export const detailCertificate = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const certificate = await CertificateMethods.getCertificateById(id);

    if (!certificate) {
      return res.status(404).json({
        status: false,
        message: 'Bằng khen không tồn tại',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Chi tiết bằng khen',
      certificate,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};
