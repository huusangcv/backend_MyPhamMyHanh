import OpenAI from 'openai';
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for API key
});

export const createContent = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { content, url } = req.body;

    if (url) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: content,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `http://localhost:8080${url}`,
                },
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        status: true,
        message: 'Trả lời câu hỏi thành công',
        data: {
          ask: content,
          content: completion.choices[0].message.content,
        },
      });
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      status: true,
      message: 'Trả lời câu hỏi thành công',
      data: {
        ask: content,
        content: completion.choices[0].message.content,
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
