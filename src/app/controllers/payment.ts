import express from 'express';

import qs from 'qs';
import moment from 'moment-timezone';
import forge from 'node-forge';

function sortObject(obj: any) {
  return Object.entries(obj)
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .reduce((result, item: any) => {
      result = {
        ...result,
        [item[0]]: encodeURIComponent(item[1].toString().replace(/ /g, '+')),
      };

      return result;
    }, {});
}

export const createPaymentUrl = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    // Thiết lập múi giờ
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || '';

    // Lấy cấu hình từ file config
    const tmnCode = 'DDTV8FVG';
    const secretKey = '7EF8BU6YW0JXOTNQIWABKA34I8HU7NRG';
    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = 'http://localhost:5173/cart/payment-result';
    const amount = req.body.amount;
    const orderId = req.body.orderId;

    let locale: string = req.body.language || 'vn'; // Thiết lập ngôn ngữ mặc định
    const currCode = 'VND';

    // Tạo đối tượng tham số
    let vnp_Params: { [key: string]: any } = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100; // Đơn vị VND
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    const sortedVnpParams = sortObject(vnp_Params);

    // Create query string
    const vnpParamsString = qs.stringify(sortedVnpParams, { encode: false });

    // Generate HMAC-SHA512 hash using `forge`
    const hmac = forge.hmac.create();
    hmac.start('sha512', secretKey);
    hmac.update(vnpParamsString);
    const hashValue = hmac.digest().toHex();

    // Construct final payment URL
    const paymentUrl = `${vnpUrl}?${vnpParamsString}&vnp_SecureHash=${hashValue}`;

    return res.status(200).json({
      status: true,
      messag: 'Thành công',
      data: {
        paymentUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại.',
    });
  }
};

export const createPaymentUrlMoMo = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var amount = '50000';
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var paymentCode =
      'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&paymentCode=' +
      paymentCode +
      '&requestId=' +
      requestId;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại.',
    });
  }
};
