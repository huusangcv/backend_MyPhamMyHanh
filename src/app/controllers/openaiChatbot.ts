import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { ProductMethods } from '../models/product';
// Load environment variables from .env file
dotenv.config();

const ai = new GoogleGenAI({ apiKey: 'AIzaSyB-RhVkQGBRutcbs4g6G4ri32WHyxo5mfU' });

export const createContent = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { content, url } = req.body;

    const products = await ProductMethods.getProducts();

    const productsHtml =
      Array.isArray(products) &&
      products
        .map(
          (
            product,
          ) => `<div style="background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 20px; max-width: 400px; margin: auto;">
        <div style="font-size: 1.3rem; margin-bottom: 4px;">${product.name}</div>
        <div style="font-size: 1rem; color: #d9534f; margin-bottom: 4px;">500,000 VNĐ</div>
        <img src='http://localhost:8080${product.images[0]}' alt=${product.name} style="max-width: 100%; border-radius: 8px;">
        <div style="font-size: 1.3rem; margin-bottom: 20px;">
            Đây là sản phẩm ${product.name} tuyệt vời, phù hợp cho mọi nhu cầu của bạn. 
            Nó có chất lượng cao và tính năng nổi bật.
        </div>
    </div>`,
        )
        .join('');

    const prompt = `
    Bạn là một trợ lí bán hàng chuyên nghiệp, tên của bạn là Nhân Viên Siêng Năng.
    Website này được xây dựng bởi Hữu Sang.
    Đây là danh sách sản phẩm có trong cửa hàng (hiển thị theo dạng HTML):
    ${productsHtml}

    Câu hỏi của khách hàng: "${content}"
    Hãy trả lời một cách tự nhiên và thân thiện, 
    link sản phẩm thường sẽ là http://localhost:5173/product/ + slug của sản phẩm
    link hình ảnh sẽ là http://localhost:8080 + product.images[0]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-thinking-exp', // or gemini-2.0-flash-thinking-exp gemini-2.5-pro-exp-03-25
      contents: prompt,
    });

    if (response.text) {
      return res.status(200).json({
        status: true,
        message: 'Trả lời câu hỏi thành công',
        data: {
          ask: content,
          content: response.text,
        },
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Không tìm thấy câu trả lời',
      data: {
        ask: content,
        content: 'Đợi 1 chút',
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
      error,
    });
  }
};

export const uploadImage = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const imageData = req.file;

    return res.json({
      status: true,
      message: 'Upload ảnh thành công',
      data: `/uploads/chatbot/${imageData?.originalname}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
      error,
    });
  }
};
