# Giải đáp câu hỏi bổ sung - Buổi 7 React Native

### 1. Cấu trúc điều hướng
Vì sao `BookDetail` được đăng ký ở Stack mà không đặt trong Tab? Nếu đặt vào Tab thì màn hình sẽ khác đi thế nào?
- **Trả lời:** `BookDetail` nằm ở Stack ngoài cùng để khi chuyển sang màn hình chi tiết, nó sẽ che khuất cả thanh Tab Bar và tự động hiển thị nút quay lại (`←`) trên header. Nếu đặt vào Tab, `BookDetail` sẽ chỉ hiển thị như một màn hình con cố định trong tab đó, khiến thanh Tab Bar vẫn bị giữ lại ở đáy và làm mất đi trải nghiệm chuyển trang chi tiết tiêu chuẩn của ứng dụng di động.

### 2. Redux
Trong reducer viết `state.items.push(...)` mà sao state gốc không bị sửa trực tiếp? Thử bỏ `useMemo` trong `useCart`: kết quả hiển thị có đổi không, và có hậu quả gì?
- **Trả lời:** Redux Toolkit sử dụng thư viện **Immer** ở bên dưới, cho phép viết code theo kiểu "đột biến" (mutate) trên một bản nháp (draft state) nhưng thực chất vẫn đảm bảo tính bất biến (immutability) để tạo ra state mới an toàn[cite: 1]. Nếu bỏ `useMemo` trong `useCart`, kết quả hiển thị hoàn toàn không đổi vì các giá trị tổng số lượng và tổng tiền vẫn được tính toán chính xác, tuy nhiên hậu quả là các giá trị này sẽ bị tính toán lại ở **mọi lần render** của component, gây lãng phí tài nguyên và làm giảm hiệu năng khi giỏ hàng có nhiều sản phẩm[cite: 1].

### 3. Promise.all
Nếu `getCategories()` lỗi còn `getBooks()` thành công thì Home hiện gì? Tìm cách để vẫn hiện được danh sách sách (gợi ý: `Promise.allSettled`) và nói rõ cách đó phải đánh đổi gì?
- **Trả lời:** Nếu `getCategories()` lỗi, `Promise.all` sẽ bị từ chối (reject) ngay lập tức cho toàn bộ nhóm, khiến màn hình Home rơi vào trạng thái lỗi và hiển thị `ErrorView` dù dữ liệu sách đã tải thành công[cite: 1]. Để khắc phục, ta có thể thay thế bằng `Promise.allSettled` để lấy kết quả của từng lời gọi, nếu danh mục lỗi thì gán mảng rỗng để vẫn hiển thị được danh sách sách[cite: 1]. Cách đánh đổi này là giao diện sẽ mất đi phần hiển thị danh mục (chip danh mục trống), đòi hỏi lập trình viên phải viết thêm code xử lý hiển thị trạng thái thiếu dữ liệu riêng lẻ cho từng phần[cite: 1].

### 4. Debounce
Vì sao không đặt `setTimeout` thẳng trong `onChangeText`? Hàm dọn dẹp (`return () => clearTimeout`) giúp tránh lỗi gì?
- **Trả lời:** Nếu đặt `setTimeout` trực tiếp bên trong `onChangeText`, mỗi lần người dùng gõ một ký tự sẽ tạo ra một hàm hẹn giờ mới độc lập mà không thể hủy bỏ các bộ đếm thời gian của các ký tự gõ trước đó, khiến việc lọc dữ liệu bị gọi liên tục (chỉ bị trễ chứ không gom nhóm được)[cite: 1]. Hàm dọn dẹp `clearTimeout` trong `useEffect` giúp hủy bỏ timer của lần gõ trước khi người dùng nhập ký tự mới, đồng thời ngăn chặn lỗi cập nhật state trên một component đã bị unmount (gỡ khỏi màn hình)[cite: 1].

### 5. Code bổ sung
Thêm tùy chọn sắp xếp “Giá tăng dần / giảm dần” cho Home.
- **Trả lời:** Chỉ cần thêm một state `sortOrder` (`'asc' | 'desc' | null`), sau đó áp dụng `.sort()` vào mảng trong `useMemo` của `visibleBooks`.

```tsx
// Đoạn code tích hợp trong HomeScreen.tsx:
const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

const visibleBooks = useMemo(() => {
  let result = filterBooks(books, { keyword: debouncedKeyword, categoryId, priceRange });
  if (sortOrder) {
    result = [...result].sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));
  }
  return result;
}, [books, debouncedKeyword, categoryId, priceRange, sortOrder]);