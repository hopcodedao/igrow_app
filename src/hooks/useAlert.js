import { toast } from 'react-hot-toast';

const successList = {
  'login-success': 'Đăng nhập thành công!',
  'logout-success': 'Đăng xuất thành công!',
  'account-created': 'Tạo tài khoản thành công!',
  'mail-sent': 'Đã gửi thư!',
  'username-updated': 'Đã cập nhật tên người dùng!',
  'profile-image-updated': 'Đã cập nhật ảnh đại diện!'
};

const errorList = {
  // Lỗi Firebase
  'auth/wrong-password': 'Mật khẩu không đúng!',
  'auth/email-already-exists': 'Email đã tồn tại!',
  'auth/invalid-argument': 'Tham số không hợp lệ!',
  'auth/invalid-display-name': 'Tên hiển thị không hợp lệ!',
  'auth/invalid-password': 'Mật khẩu phải có ít nhất 6 ký tự!',
  'auth/invalid-photo-url': 'Thông tin hình ảnh không hợp lệ!',
  'auth/invalid-uid': 'ID người dùng không hợp lệ!',
  'auth/missing-uid': 'Thiếu ID người dùng!',
  'auth/phone-number-already-exists': 'Số điện thoại đã tồn tại!',
  'auth/email-already-in-use': 'Email đã được sử dụng!',
  'auth/uid-already-exists': 'ID người dùng đã tồn tại!',
  'auth/code-expired': 'Mã xác thực đã hết hạn!',
  'auth/expired-action-code': 'Mã thao tác đã hết hạn.',
  'auth/invalid-verification-code': 'Mã xác thực không hợp lệ!',
  'auth/missing-phone-number': 'Thiếu số điện thoại!',
  'auth/too-many-requests': 'Quá nhiều yêu cầu!',
  'auth/unverified-email': 'Cần xác minh email để thực hiện thao tác này.',
  'auth/user-not-found': 'Không tìm thấy người dùng!',
  'auth/weak-password': 'Mật khẩu phải chứa ít nhất 6 ký tự!',
  'auth/timeout': 'Thao tác đã quá thời gian cho phép.',
  'auth/user-disabled': 'Tài khoản đã bị quản trị viên vô hiệu hóa.',
  'auth/user-mismatch': 'Người dùng không khớp!',

  // Lỗi tùy chỉnh
  'password-no-match': 'Mật khẩu không khớp!',
  'login-needed': 'Vui lòng đăng nhập để truy cập!',
  'already-logged-in': 'Truy cập không hợp lệ!',
  'unknown-error': 'Có lỗi xảy ra!'
};

export default function useAlert(type = '', msg = '') {
  if (type === 'success') {
    const message = successList[msg] || msg;

    if (!message) {
      toast.success('Success!', {
        position: 'bottom-left',
        theme: 'colored'
      });
    }
    // toast.success('Success!');
    else {
      toast.success(message, {
        position: 'bottom-left',
        theme: 'colored'
      });
    }
    // toast.success(message);
  }

  if (type === 'error') {
    const message = errorList[msg] || msg;

    if (!message) {
      toast.error('Error occurred!', {
        position: 'bottom-left',
        theme: 'colored'
      });
    } else {
      toast.error(message, {
        position: 'bottom-left',
        theme: 'colored'
      });
    }
  }

  return null;
}
