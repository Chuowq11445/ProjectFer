import React, { useState } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const Forgot_pass = () => {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // B1: Gửi mã OTP
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return alert("Nhập email của bạn.");

    // 1) Tìm user theo email
    let user;
    try {
      const q = new URLSearchParams({ Email: email }).toString();
      const res = await fetch(`http://localhost:9999/Users?${q}`);
      console.log("[GET /Users] status =", res.status);
      const users = await res.json();
      user = Array.isArray(users) ? users[0] : null;
      if (!user) return alert("Email không tồn tại trong hệ thống.");
    } catch (err) {
      console.error("[GET /Users] error:", err);
      return alert(
        "Không gọi được json-server (GET /Users). Kiểm tra port 9999."
      );
    }

    // 2) Tạo & lưu mã
    const passcode = String(Math.floor(100000 + Math.random() * 900000));
    const expires = Date.now() + 10 * 60 * 1000;

    try {
      const resPatch = await fetch(`http://localhost:9999/Users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ResetCode: passcode, ResetExpires: expires }),
      });
      console.log("[PATCH /Users/:id] status =", resPatch.status);
      if (!resPatch.ok) {
        const body = await resPatch.text();
        console.error("[PATCH body]", body);
        return alert("PATCH /Users thất bại. Xem console.");
      }
    } catch (err) {
      console.error("[PATCH /Users/:id] error:", err);
      return alert("Không gọi được json-server (PATCH /Users).");
    }

    // 3) Gửi mail bằng EmailJS
    try {
      const resp = await emailjs.send(
        "service_3sipz6i",
        "template_ec12al9",
        {
          to_email: user.Email,
          to_name: user.Name || "Bạn",
          reset_code: passcode,
        },
        "583XcTQqNi55XC8zv"
      );
      console.log("[EmailJS] ok", resp);
      alert("Đã gửi mã xác minh 6 số vào email. Mã có hiệu lực 10 phút.");
      setStep("reset");
    } catch (err) {
      console.error("[EmailJS] error:", err, "respText:", err?.text);

      alert("Gửi email thất bại. Kiểm tra cấu hình EmailJS và Network.");
    }
  };

  // B2: Xác minh mã & đặt lại mật khẩu
  const handleResetPass = async (e) => {
    e.preventDefault();
    if (!code) return alert("Nhập mã xác minh.");
    if (!newPass || !confirmPass) return alert("Nhập mật khẩu mới.");
    if (newPass.length < 8) return alert("Mật khẩu tối thiểu 8 ký tự.");
    if (newPass !== confirmPass) return alert("Mật khẩu xác nhận không khớp.");

    try {
      const res = await fetch(
        "http://localhost:9999/Users?" + new URLSearchParams({ Email: email })
      );
      const users = await res.json();
      const user = Array.isArray(users) ? users[0] : null;

      if (!user) return alert("Không tìm thấy tài khoản.");

      if (!user.ResetCode || !user.ResetExpires) {
        return alert("Bạn chưa yêu cầu mã xác minh hoặc mã đã được dùng.");
      }
      if (String(user.ResetCode) !== String(code)) {
        return alert("Mã xác minh không đúng.");
      }
      if (Date.now() > Number(user.ResetExpires)) {
        return alert("Mã đã hết hạn. Hãy yêu cầu mã mới.");
      }

      await fetch(`http://localhost:9999/Users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Pass: newPass,
          ResetCode: null,
          ResetExpires: null,
        }),
      });

      alert("Đổi mật khẩu thành công. Hãy đăng nhập lại.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server.");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-3 text-center">Quên mật khẩu</h3>

          {step === "request" ? (
            <Form onSubmit={handleSendCode}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email đã đăng ký"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" className="w-100">
                Gửi mã xác minh
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleResetPass}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control value={email} disabled />
                <div className="form-text">
                  Mã đã gửi tới email này. Kiểm tra hộp thư/spam.
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mã xác minh (6 số)</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  placeholder="Nhập mã 6 chữ số"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu mới</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showNewPass ? "text" : "password"}
                    placeholder="Ít nhất 8 ký tự"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => setShowNewPass((s) => !s)}
                  >
                    <i
                      className={`bi ${
                        showNewPass ? "bi-eye-slash" : "bi-eye"
                      }`}
                    />
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirm ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => setShowConfirm((s) => !s)}
                  >
                    <i
                      className={`bi ${
                        showConfirm ? "bi-eye-slash" : "bi-eye"
                      }`}
                    />
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button type="submit" className="w-100">
                Đặt lại mật khẩu
              </Button>

              <div className="text-center mt-3">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setStep("request")}
                >
                  Gửi lại mã?
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Forgot_pass;
