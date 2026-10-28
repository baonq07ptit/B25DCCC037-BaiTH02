# Ứng dụng xem thời tiết 8 thành phố Việt Nam

- **Môn học:** Lập trình Web (RIPT1306)
- **Bài tập:** Bài tập thực hành 02 (TH01)
- **Giảng viên:** Trương Tuấn Anh
- **Sinh viên thực hiện:** Nguyễn Quốc Bảo
- **Mã sinh viên:** B25DCCC037

---

## 1. Giới thiệu dự án
Ứng dụng xây dựng bằng **React + TypeScript (Vite)** hiển thị thông tin thời tiết hiện tại và dự báo 7 ngày cho 8 thành phố Việt Nam, sử dụng dữ liệu khí tượng trực tiếp từ **Open-Meteo API** (miễn phí, không cần API key).

## 2. Tính năng đã hoàn thành

### Yêu cầu bắt buộc (6/6):
- **YC1:** Danh sách 8 thành phố (Hà Nội, Hải Phòng, Huế, Đà Nẵng, Nha Trang, Đà Lạt, TP. Hồ Chí Minh, Cần Thơ), thành phố đang chọn được làm nổi bật (active).
- **YC2:** Bấm thành phố $\rightarrow$ hiển thị thời tiết hiện tại: biểu tượng, mô tả thời tiết tiếng Việt, nhiệt độ, độ ẩm, tốc độ gió, thời điểm cập nhật.
- **YC3:** Dự báo 7 ngày: thứ, ngày, biểu tượng, mô tả, nhiệt độ cao nhất ($T_{max}$) và thấp nhất ($T_{min}$).
- **YC4:** Hiển thị đầy đủ 3 trạng thái:
  - *Chưa chọn thành phố*: Hướng dẫn người dùng chọn thành phố.
  - *Đang tải*: Hiển thị thông báo đang tải dữ liệu.
  - *Báo lỗi*: Hiển thị thông báo khi lỗi mạng kèm nút **"Thử lại"**.
- **YC5:** Đổi đơn vị nhiệt độ **°C / °F** bằng công thức toán học, **không gọi lại API**.
- **YC6:** Giao diện Responsive: Màn hình từ `768px` trở lên hiển thị 2 cột; màn hình nhỏ hơn tự động xếp dọc.

### Yêu cầu nâng cao (4/4):
- Tìm kiếm thành phố không phân biệt dấu và hoa thường (ví dụ: `da nang`, `hà nội`, `dalat`...).
- Đánh dấu thành phố yêu thích lưu vào `localStorage` (có nút sao ⭐ để ghim lên đầu danh sách).
- Tự động đổi màu nền/giao diện theo trạng thái thời tiết hiện tại (quang đãng, nhiều mây, mưa, dông).
- Viết 100% bằng **TypeScript** với type strict.

---

## 3. Hướng dẫn cài đặt & chạy thử

```bash
# Cài đặt thư viện
npm install

# Chạy máy chủ phát triển
npm run dev

# Kiểm tra kiểu dữ liệu TypeScript
npm run typecheck

# Build dự án
npm run build
```

