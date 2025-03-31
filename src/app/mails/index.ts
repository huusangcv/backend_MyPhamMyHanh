const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const mailOptionsRegisGoogle = (user: any) => {
  return {
    from: process.env.Email_User, // Địa chỉ email của bạn
    to: user.email,
    subject: `${user.username}, Xác thực tài khoản liên kết!`, // Subject line
    text: 'Thông báo xác thực tài khoản', // plain text body
    html: `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Xác Thực Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    background-color: #f1f1f1;
                    padding: 10px;
                    text-align: center;
                    font-size: 12px;
                    color: #555;
                }
                .code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #4CAF50;
                    margin: 20px 0;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .button:hover {
                    background-color: #45a049;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                    <h1>Xác Thực Tài Khoản</h1>
                </div>
                <div class="content">
                    <p>Chào bạn,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản với chúng tôi!</p>
                    <p>Vui lòng sử dụng mã xác thực bên dưới để hoàn tất quá trình đăng ký:</p>
                    <div class="code">${user.verifyCode}</div> <!-- Thay đổi mã xác thực này bằng mã thực tế -->
                    <p>Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.</p>
                </div>
                <div class="footer">
                    <p>© 2025 Công Ty Cổ Phần Mỹ phẩm Mỹ Hạnh. Bảo lưu mọi quyền.</p>
                </div>
            </div>
            </body>
            </html>`,
  };
};

const mailOptionsOrder = (order: any) => {
  const htmlProducts = order.products
    .map(
      (item: { id: string; name: string; quantity: number; price: number }) => `
              <tr key=${item.id}>
              </td>${item.name}</td>
              </td>${item.quantity}</td>
              </td>${formatter.format(+(item.price ?? 0))}đ</td>
              </tr>
            `,
    )
    .join('');
  return {
    from: process.env.Email_User, // Địa chỉ email của bạn
    to: order.email,
    subject: `${order.name}, đơn hàng của bạn đã được xác nhận!`, // Subject line
    text: 'Thông báo đặt hàng thành công', // plain text body
    html: `<!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thông báo đặt hàng thành công</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    background-color: #ffffff;
                    padding: 20px;
                    margin: auto;
                    width: 80%;
                    max-width: 600px;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #4CAF50; /* Màu xanh lá cây */
                }
                p, .total {
                    color: #333333;
                }
                .order-details {
                    margin-top: 20px;
                }
                .order-details th, .order-details td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                }
                .order-details th {
                    background-color: #4CAF50; /* Màu xanh lá cây cho header */
                    color: white; /* Chữ trắng cho header */
                }
                .total {
                    font-weight: bold;
                    margin-top: 10px;
                    color: #4CAF50; /* Màu xanh lá cho tổng tiền */
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #777777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Thông báo đặt hàng thành công</h1>
                <p>Chào <strong>${order.name}</strong>,</p>
                <p>Cảm ơn bạn đã đặt hàng tại <strong>Mỹ phẩm Mỹ Hạnh</strong>! Đơn hàng của bạn đã được xác nhận.</p>
        
                <div class="order-details">
                    <h2>Chi tiết đơn hàng</h2>
                    <p>Số đơn hàng: <strong>${order.reference}</strong></p>
                    <table style="width: 100%; border-collapse: collapse;" class="order-details">
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody> 
                        ${htmlProducts}
                        </tbody>
                    </table>
                    <p class="total">Tổng cộng: <strong>${formatter.format(+(order.total ?? 0))} VNĐ</strong></p>
                </div>
        
                <p>Chúng tôi sẽ xử lý đơn hàng của bạn và thông báo khi nó được gửi đi!</p>
                <p>Nếu bạn có bất kỳ câu hỏi nào, hãy không ngần ngại liên hệ với chúng tôi qua email này.</p>
                <p class="footer">Trân trọng,<br>Mỹ phẩm Mỹ Hạnh</p>
            </div>
        </body>
        </html>`,
  };
};

export { mailOptionsOrder, mailOptionsRegisGoogle };
