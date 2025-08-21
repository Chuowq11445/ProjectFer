import React from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Button,
  Badge,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    try {
      localStorage.clear();
      // sessionStorage.clear();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm py-3"
    >
      <Container>
        <Navbar.Brand
          href="/"
          className="fw-bold d-flex align-items-center gap-2"
        >
          <span style={{ letterSpacing: 1 }}>MyStore</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2 ms-lg-4 my-3 my-lg-0">
            <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <Button
                variant="primary"
                className="position-relative"
                aria-label="Cart"
                type="button"
              >
                <i className="bi bi-cart" style={{ marginTop: -2 }} />
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  3
                </Badge>
              </Button>
            </Form>

            {/* Chỉ hiện dropdown khi ĐÃ đăng nhập */}
            {isLoggedIn && (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-light"
                  id="quick-menu"
                  aria-label="Mở menu nhanh"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-list fs-5" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    <i className="bi bi-person me-2" />
                    Thông tin
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/orders")}>
                    <i className="bi bi-receipt me-2" />
                    Lịch sử mua hàng
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            {!isLoggedIn ? (
              <Button variant="outline-light" href="/login" aria-label="Login">
                <i className="bi bi-box-arrow-in-right me-2" />
                Đăng nhập
              </Button>
            ) : (
              <Button
                variant="outline-light"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <i className="bi bi-box-arrow-right me-2" />
                Đăng xuất
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
