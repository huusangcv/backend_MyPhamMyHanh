import express, { response } from 'express';
import dotenv from 'dotenv';
import { createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';
import { ProductMethods } from '../models/product';
// Load environment variables from .env file
dotenv.config();

const ai = new GoogleGenAI({ apiKey: 'AIzaSyB-RhVkQGBRutcbs4g6G4ri32WHyxo5mfU' });

export const createContent = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { content, url } = req.body;

    const products = await ProductMethods.getProducts();

    const productsHtml = Array.isArray(products)
      ? `
      <div class="products-container">
        ${products
          .map(
            (product) => `
          <div class="product-card">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price.toLocaleString()} VNĐ</div>
            <img src='https://backend.regis.id.vn${product.images[0]}' alt='${product.name}' class="product-image">
            <div class="product-description">
              Đây là sản phẩm ${product.name} tuyệt vời, phù hợp cho mọi nhu cầu của bạn.
            </div>
          </div>`,
          )
          .join('')}
      </div>
    `
      : '';

    const trainingQuestions = [
      'Bạn có thể cho tôi biết thêm về sản phẩm này không?',
      'Sản phẩm này có các tùy chọn màu sắc nào?',
      'Tôi có thể nhận được thông tin về kích thước của sản phẩm không?',
      'Sản phẩm này có chương trình khuyến mãi không?',
      'Có chương trình bảo hành cho sản phẩm này không?',
      'Tôi làm thế nào để đặt hàng?',
      'Có cần phải tạo tài khoản để mua hàng không?',
      'Tôi có thể thay đổi hoặc hủy đơn hàng đã đặt không?',
      'Thời gian giao hàng là bao lâu sau khi đặt hàng?',
      'Các phương thức thanh toán nào được chấp nhận?',
      'Tôi có thể thanh toán khi nhận hàng không?',
      'Có phí giao hàng không và cách tính phí như thế nào?',
      'Tôi có thể nhận hóa đơn điện tử không?',
      'Khoảng thời gian giao hàng dự kiến là bao lâu?',
      'Tôi có thể theo dõi đơn hàng của mình không?',
      'Nếu đơn hàng bị trễ thì tôi có thể làm gì?',
      'Có thể giao hàng đến địa chỉ nào?',
      'Chính sách hoàn trả của bạn là gì?',
      'Tôi có thể đổi sản phẩm trong bao lâu sau khi mua?',
      'Làm thế nào để gửi sản phẩm trả lại?',
      'Tiền hoàn lại sẽ được trả trong bao lâu?',
      'Làm thế nào tôi có thể liên hệ với bộ phận hỗ trợ khách hàng?',
      'Giờ làm việc của bộ phận hỗ trợ khách hàng là gì?',
      'Tôi có thể gửi phản hồi hoặc khiếu nại qua đâu?',
      'Bạn có cung cấp hỗ trợ sau khi mua hàng không?',
      'Hiện tại có chương trình khuyến mãi nào không?',
      'Tôi có thể nhận được mã giảm giá bằng cách nào?',
      'Các sản phẩm nào đang trong chương trình giảm giá?',
      'Làm sao để đăng ký nhận thông tin khuyến mãi qua email?',
      'Bạn có thể giới thiệu các sản phẩm tương tự cho tôi không?',
      'Tại sao tôi không thể tìm thấy sản phẩm tôi đang tìm kiếm?',
      'Có một số câu hỏi thường gặp (FAQ) nào mà tôi nên xem qua không?',
    ];

    const trainingPrompt = `
      Bạn là một trợ lí bán hàng chuyên nghiệp tại cửa hàng Mỹ phẩm Mỹ Hạnh.
      Dưới đây là danh sách các câu hỏi thường gặp từ khách hàng:
      ${trainingQuestions.map((q, index) => `${index + 1}. ${q}`).join('\n')}
      Hãy sử dụng thông tin này để trả lời các câu hỏi của khách hàng một cách chính xác, tự nhiên và thân thiện.
    `;

    const prompt = `
        ${trainingPrompt}
        Dưới đây là danh sách sản phẩm có sẵn (dạng HTML):
        ${productsHtml}
        Câu hỏi: "${content}"
        Hãy xưng hô là "Em" và trả lời câu hỏi của khách hàng một cách tự nhiên, thân thiện và chính xác.
        Tránh sử dụng từ ngữ khó hiểu và tối ưu phản hồi ở định dạng HTML.
        Hãy không sử dụng các thẻ HTML không cần thiết như <script>, <style>, <link>, <iframe>.
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
          content: response.text
            .replace(/```html/g, '')
            .replace(/```/, '')
            .trim(),
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
