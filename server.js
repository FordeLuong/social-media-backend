const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let user = [];

app.post("/api/register", (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).json({ message: "Đăng kí thành công", user });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = user.find(
        (u) => u.username === username && u.password === password
    );
    // Có user 
    if (user) {
        res.json({ message: "Đăng nhập thành công", user });
    // Không có user
    } else {
        res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));