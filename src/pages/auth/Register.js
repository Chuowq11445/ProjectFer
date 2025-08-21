import React, { useState } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !pass || !confirmPass) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (pass.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (pass !== confirmPass) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    const resUsers = await fetch("http://localhost:9999/Users");
    const users = await resUsers.json();

    const exist = users.find(
      (u) =>
        u.Name === name ||
        (u.Email && u.Email.toLowerCase() === email.toLowerCase())
    );

    if (exist) {
      alert("Tên đăng nhập hoặc email đã tồn tại.");
      return;
    }

    const nextId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser = {
      id: nextId,
      Name: name,
      Email: email,
      Pass: pass,
      FirstName: "",
      LastName: "",
      Phone: "",
      Adress: "",
      Gender: "",
      Role: "User",
    };

    const res = await fetch("http://localhost:9999/Users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    console.log("Response status:", res.status);
    const data = await res.json().catch(() => ({}));
    console.log("Response body:", data);

    if (res.ok) {
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/");
    } else {
      alert("Không thể đăng ký. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-3 text-center">Đăng ký</h3>

          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPass ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
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

            {/* Confirm Password */}
            <Form.Group className="mb-3">
              <Form.Label>Xác minh mật khẩu</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPass((s) => !s)}
                >
                  <i
                    className={`bi ${
                      showConfirmPass ? "bi-eye-slash" : "bi-eye"
                    }`}
                  />
                </Button>
              </InputGroup>
            </Form.Group>

            <Button type="submit" className="w-100">
              Đăng ký
            </Button>

            <div className="text-center mt-3">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
              >
                Đã có tài khoản? Đăng nhập
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
