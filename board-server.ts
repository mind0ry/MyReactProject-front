import express from "express";
import cors from "cors";
import mysql, { Connection } from "mysql2/promise";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);
app.use(express.json());

app.listen(3355, () => {
    console.log("Server is running : http://localhost:3355");
});

async function getConnection(): Promise<Connection> {
    return await mysql.createConnection({
        host: "localhost",
        user: "mins",
        password: "asd010404",
        database: "mydb",
        port: 3306,
    });
}

app.get("/board/list_node", async (req, res) => {
    let conn: Connection | null = null;

    const page = Number(req.query.page) || 1;
    const rowSize = 10;
    const start = (page - 1) * rowSize;

    try {
        conn = await getConnection();

        const listSql = `
            SELECT no, subject, name,
                DATE_FORMAT(regdate, '%Y-%m-%d') AS dbday,
                hit
            FROM board
            ORDER BY no DESC
                LIMIT ${start}, ${rowSize}
        `;

        const totalSql = `
            SELECT CEIL(COUNT(*)/10) AS totalpage
            FROM board
        `;

        const [listRows] = await conn.query(listSql);
        const [totalRows] = await conn.query(totalSql);

        const totalpage = (totalRows as any[])[0].totalpage;

        res.json({
            curpage: page,
            totalpage,
            list: listRows,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "no" });
    } finally {
        if (conn) await conn.end();
    }
});

app.post("/board/insert_node", async (req, res) => {
    let conn: Connection | null = null;
    const { name, subject, content, pwd } = req.body;

    try {
        conn = await getConnection();

        const sql = `
            INSERT INTO board (name, subject, content, pwd)
            VALUES (?, ?, ?, ?)
        `;

        await conn.execute(sql, [name, subject, content, pwd]);

        res.json({ msg: "yes" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "no" });
    } finally {
        if (conn) await conn.end();
    }
});

app.get("/board/detail_node", async (req, res) => {
    let conn: Connection | null = null;
    const no = Number(req.query.no) || 1;

    try {
        conn = await getConnection();

        const sql1 = `UPDATE board SET hit = hit + 1 WHERE no = ?`;
        await conn.execute(sql1, [no]);

        const sql2 = `
            SELECT no, subject, content, name, hit,
                DATE_FORMAT(regdate, '%Y-%m-%d') AS dbday
            FROM board
            WHERE no = ?
        `;
        const [rows] = await conn.execute(sql2, [no]);

        res.json((rows as any[])[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "no" });
    } finally {
        if (conn) await conn.end();
    }
});

app.get("/board/update_node", async (req, res) => {
    let conn: Connection | null = null;
    const no = Number(req.query.no);

    try {
        conn = await getConnection();

        const sql = `
            SELECT no, name, subject, content
            FROM board
            WHERE no = ?
        `;
        const [rows] = await conn.execute(sql, [no]);

        res.json((rows as any[])[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "no" });
    } finally {
        if (conn) await conn.end();
    }
});

app.put("/board/update_ok_node", async (req, res) => {
    let conn: Connection | null = null;
    const { no, name, subject, content, pwd } = req.body;

    try {
        conn = await getConnection();

        const checkSql = `
            SELECT COUNT(*) AS res
            FROM board
            WHERE no = ? AND pwd = ?
        `;
        const [checkRows] = await conn.execute(checkSql, [no, pwd]);
        const count = (checkRows as any[])[0].res;

        if (count === 0) {
            res.json({ msg: "no" });
            return;
        }

        const updateSql = `
            UPDATE board
            SET name = ?, subject = ?, content = ?
            WHERE no = ?
        `;
        await conn.execute(updateSql, [name, subject, content, no]);

        res.json({ msg: "yes" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "no" });
    } finally {
        if (conn) await conn.end();
    }
});

app.delete("/board/delete_node/:no/:pwd", async (req, res) => {
    let conn: Connection | null = null;

    const no = Number(req.params.no);
    const pwd = req.params.pwd;

    try {
        conn = await getConnection();

        const checkSql = `
            SELECT COUNT(*) AS res
            FROM board
            WHERE no = ? AND pwd = ?
        `;
        const [checkRows] = await conn.execute(checkSql, [no, pwd]);
        const count = (checkRows as any[])[0].res;

        if (count === 0) {
            res.json({ msg: "no" });
            return;
        }

        const deleteSql = `DELETE FROM board WHERE no = ?`;
        await conn.execute(deleteSql, [no]);

        res.json({ msg: "yes" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "no" });
    } finally {
        if (conn) await conn.end();
    }
});
