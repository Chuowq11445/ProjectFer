import React, { useState } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const u = username.trim();
    const p = password;
    if (!u || !p) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const qs = new URLSearchParams({ Name: u, Pass: p }).toString();

      const res = await fetch(`http://localhost:9999/Users?${qs}`)
        .then((r) => r.json())
        .catch((err) => alert("Lỗi lấy user"));

      const data = Array.isArray(res) ? res : [];

      if (data.length > 0) {
        const user = data[0];
        localStorage.setItem(
          "authUser",
          JSON.stringify({
            id: user.id,
            name: user.Name,
            email: user.Email,
            role: user.Role,
          })
        );
        localStorage.setItem("authToken", `${user.id}.${Date.now()}`);
        if (user.Role === "Admin") {
          navigate("/admin");
        } else if (user.Role === "Staff") {
          navigate("/staff");
        } else {
          navigate("/");
        }
      } else {
        alert("Sai tài khoản hoặc mật khẩu.");
      }
    } catch (e2) {
      alert("Không thể kết nối server. Kiểm tra json-server ở cổng 9999.");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-3 text-center">Đăng nhập</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login-username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="login-password">
              <Form.Label>Mật khẩu</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => setShowPass((s) => !s)}
                >
                  <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`} />
                </Button>
              </InputGroup>
            </Form.Group>

            <Button type="submit" className="w-100">
              Đăng nhập
            </Button>

            <div className="d-flex justify-content-between mt-3">
              <Button
                type="button"
                variant="link"
                className="p-0"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </Button>
              <Button
                type="button"
                variant="link"
                className="p-0"
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
