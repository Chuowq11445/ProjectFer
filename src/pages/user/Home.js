import React, { useEffect, useState } from "react";

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const getProducts = async () => {
    let res = await fetch("http://localhost:9999/Products")
      .then((r) => r.json())
      .catch((err) => alert("Lỗi gọi danh sách sản phẩm " + err));
    setProducts(res);
  };

  const getCate = async () => {
    let res = await fetch("http://localhost:9999/Categories")
      .then((r) => r.json())
      .catch((err) => alert("Lỗi gọi danh sách danh mục " + err));
    setCats(res);
  };

  useEffect(() => {
    getProducts();
    getCate();
  }, []);

  const toggleCat = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const togglePrice = (value) => {
    setSelectedPrices((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const checkPrice = (price) => {
    if (selectedPrices.length === 0) return true;
    return selectedPrices.some((range) => {
      switch (range) {
        case "<100":
          return price < 100000;
        case "100-500":
          return price >= 100000 && price <= 500000;
        case "500-1000":
          return price > 500000 && price <= 1000000;
        case ">1000":
          return price > 1000000;
        default:
          return true;
      }
    });
  };

  const filtered = (() => {
    let list = products;
    if (selectedCats.length > 0) {
      list = list.filter((p) => selectedCats.includes(String(p.CategoryId)));
    }
    if (q.trim()) {
      const k = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.Title.toLowerCase().includes(k) ||
          (p.Details && p.Details.toLowerCase().includes(k))
      );
    }
    list = list.filter((p) => checkPrice(p.Price));
    return list;
  })();

  return (
    <div
      style={{
        display: "flex",
        padding: 16,
        gap: 16,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Sidebar filter */}
      <aside style={{ width: 240, flexShrink: 0 }}>
        <div style={{ marginBottom: 20 }}>
          <input
            placeholder="Tìm kiếm…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
        </div>
        <div>
          <h4 style={{ marginBottom: 8, fontSize: 15 }}>Danh mục</h4>
          {cats.map((c) => (
            <label
              key={c.CategoryId}
              style={{ display: "block", marginBottom: 6, fontSize: 14 }}
            >
              <input
                type="checkbox"
                checked={selectedCats.includes(String(c.CategoryId))}
                onChange={() => toggleCat(String(c.CategoryId))}
                style={{ marginRight: 6 }}
              />
              {c.CategoryName}
            </label>
          ))}
        </div>
        <div>
          <h4 style={{ marginBottom: 8, fontSize: 15 }}>Khoảng giá</h4>
          {[
            { label: "Dưới 100k", value: "<100" },
            { label: "100k – 500k", value: "100-500" },
            { label: "500k – 1tr", value: "500-1000" },
            { label: "Trên 1tr", value: ">1000" },
          ].map((opt) => (
            <label
              key={opt.value}
              style={{ display: "block", marginBottom: 6, fontSize: 14 }}
            >
              <input
                type="checkbox"
                checked={selectedPrices.includes(opt.value)}
                onChange={() => togglePrice(opt.value)}
                style={{ marginRight: 6 }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </aside>

      {/* Grid products */}
      <main style={{ flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map((p) => (
            <article
              key={p.ProductId}
              style={{
                border: "1px solid #eee",
                borderRadius: 14,
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: 220,
                  background: "#f7f7f7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={Array.isArray(p.Imgs) ? p.Imgs[0] : p.Imgs}
                  alt={p.Title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div
                style={{
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    margin: 0,
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 42,
                  }}
                >
                  {p.Title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#666",
                    fontSize: 13,
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 36,
                  }}
                >
                  {p.Details}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  <strong style={{ fontSize: 16 }}>
                    {VND.format(p.Price)}
                  </strong>
                  <span style={{ fontSize: 12, color: "#999" }}>
                    Còn: {p.Quantity}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginTop: 6,
                  }}
                >
                  {p.Sizes?.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 12,
                        padding: "4px 8px",
                        borderRadius: 999,
                        border: "1px solid #e5e5e5",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <button
                    type="button"
                    onClick={() => alert(`Xem chi tiết: ${p.Title}`)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #111827",
                      background: "#fff",
                      color: "#111827",
                      cursor: "pointer",
                    }}
                  >
                    Chi tiết
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Thêm vào giỏ: ${p.Title}`)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: "#111827",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    🛒
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#777", padding: 40 }}>
            Không có sản phẩm phù hợp.
          </div>
        )}
      </main>
    </div>
  );
}
