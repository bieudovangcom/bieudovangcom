# BIỂU ĐỒ VÀNG - GitHub Pages Static

Bộ code này là bản static GitHub Pages được dựng từ HTML trang chủ `bieudovang.com`.

## Cấu trúc

```txt
.
├── index.html
├── README.md
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── assets/
    ├── github-fix.css
    └── github-fix.js
```

## Cách deploy lên GitHub Pages

1. Tạo repo GitHub mới, ví dụ `bieudovang-hub`.
2. Upload toàn bộ file trong thư mục này lên repo.
3. Đảm bảo `index.html` nằm ở thư mục gốc của repo.
4. Vào **Settings → Pages**.
5. Chọn **Deploy from a branch**.
6. Chọn branch `main`, folder `/root`.
7. Bấm **Save**.

## Việc cần sửa sau khi upload

Mở `robots.txt` và `sitemap.xml`, thay `USERNAME` bằng username GitHub thật của bạn.

Ví dụ:

```txt
https://bieudovangcom.github.io/bieudovang-hub/
```

## Ghi chú

- Bản này giữ link ảnh, CSS, JS public từ `https://bieudovang.com/` để giao diện giống website gốc nhất.
- Các script bị Cloudflare Rocket Loader đổi type đã được chuyển lại về JavaScript chuẩn.
- Đã thêm `assets/github-fix.css` và `assets/github-fix.js` để hỗ trợ mobile menu, tab, filter, ticker, biểu đồ fallback và hiển thị ổn định trên GitHub Pages.
- Dữ liệu giá trong bản static là dữ liệu snapshot tại thời điểm xuất HTML. Nếu muốn dữ liệu tự cập nhật thật, cần gọi API/worker riêng.
