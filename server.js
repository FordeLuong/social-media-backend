const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

app.use(cors());
app.use(express.json());

let users = [];

app.post("/api/register", async (req, res) => {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
        return res.status(400).json({ message: "Thiếu thông tin!" });
    }

    const exists = users.find(u => u.username === username || u.email === email);
    if (exists) {
        return res.status(409).json({ message: "Username hoặc Email đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ fullName, username, email, password: hashedPassword });

    console.log(users);

    res.status(201).json({ message: "Đăng ký thành công", user: { fullName, username, email } });
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    res.json({ message: "Đăng nhập thành công", user: { fullName: user.fullName, username: user.username, email: user.email } });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
