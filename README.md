# Thiệp cưới Mạnh Quyết & Phạm Hân — Google Sheets RSVP

## Vì sao cần bản này
Bản HTML trước đó chỉ có nhánh WhatsApp/email; chưa có `googleAppsScriptUrl` và chưa POST dữ liệu sang Google Sheets. Bản này đã bổ sung nhánh tích hợp Google Apps Script.

## A. Cấu hình Google Sheets backend
1. Mở bảng tính Google Sheets riêng của bạn. Sao chép ID trong URL `https://docs.google.com/spreadsheets/d/ID/edit`.
2. Mở https://script.google.com và tạo dự án mới.
3. Mở file `Code.gs` trong gói này, thay `DAN_ID_GOOGLE_SHEETS_VAO_DAY` bằng ID bảng tính, rồi dán toàn bộ mã vào trình soạn thảo Apps Script.
4. Chọn hàm `setupSheet` rồi nhấn Run. Chấp thuận quyền truy cập bảng tính bằng tài khoản của bạn. Kiểm tra xuất hiện sheet `RSVP`.
5. Chọn Deploy > New deployment > Web app. Chọn Execute as: Me. Ở Who has access chọn mức cho phép người ngoài không cần đăng nhập (thường hiển thị là Anyone, nếu tài khoản/chính sách cho phép).
6. Deploy và sao chép URL Web app kết thúc bằng `/exec` (không dùng URL `/dev`).
7. Mở `index.html`, tìm `googleAppsScriptUrl: ""`, dán URL `/exec` vào giữa dấu nháy kép, lưu file.
8. Nếu đã triển khai trước đó và sửa mã Apps Script, vào Deploy > Manage deployments > Edit, chọn New version, rồi Deploy lại.

## B. Kiểm tra trước khi gửi thiệp
1. Mở URL `/exec` trong trình duyệt. Phải thấy JSON có `"ok":true` và `"sheet":"RSVP"`. Nếu thấy `ok:false`, kiểm tra ID bảng tính và quyền của chủ sở hữu.
2. Mở thiệp, gửi một RSVP thử với tên dễ nhận biết như `TEST RSVP`, sau đó mở sheet `RSVP` để xem có dòng mới không.
3. Trong Apps Script mở Executions. Nếu không thấy lần chạy mới khi gửi form, kiểm tra xem URL `/exec` đã được điền vào `index.html` đang được hosting thực sự sử dụng chưa. Nếu có lần chạy nhưng lỗi, mở chi tiết lỗi để kiểm tra ID/quyền.

## C. Điểm cần nhớ
- Người gửi không cần tài khoản Google; Apps Script chạy dưới tài khoản triển khai. Điều này chỉ hoạt động khi lựa chọn truy cập ẩn danh được chính sách Google/tổ chức cho phép.
- Không công khai bảng tính. Chỉ URL web app là công khai; bảng tính để quyền riêng tư.
- Trình duyệt dùng `no-cors`, vì vậy trang thiệp không thể đọc kết quả thật từ máy chủ. Luôn kiểm tra bảng tính và mục Executions trong lần thử đầu tiên.
- URL endpoint công khai có thể bị spam. Với website công khai lâu dài, nên bổ sung biện pháp chống lạm dụng (ví dụ CAPTCHA / giới hạn gửi) trước khi sử dụng thực tế.

## D. Các trường được lưu
Thời gian, họ tên khách, phản hồi tham dự, số người, khách nhà trai/nhà gái/hai bên, lời chúc, tên cá nhân hóa trong query `?to=`.

## Nhạc nền offline (không dùng YouTube)
- Chép file nhạc MP3 của bạn vào thư mục `thiep-cuoi-online/assets/` và đặt tên `wedding-song.mp3`.
- Khi khách bấm **Mở thiệp**, trình duyệt sẽ bắt đầu phát nhạc nền, âm lượng 60%, lặp lại khi hết bài.
- Nếu file nhạc có tên khác, hãy sửa thuộc tính `src` của thẻ `<audio id="weddingMusic" ...>` trong `index.html`.
- File MP3 phải được đưa lên cùng website để khách nghe được; không nhúng file MP3 chỉ nằm trên máy tính của bạn. Trình duyệt thường chặn tự phát trước thao tác bấm của khách, vì vậy nhạc bắt đầu ở nút Mở thiệp.

