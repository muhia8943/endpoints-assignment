import express from "express";
import bodyParser from "body-parser";
import { mssql, pool } from "./db.config";

const app = express();
app.use(bodyParser.json());

const PORT = 3000;


app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;
    const poolConnection = await pool;
    const result = await poolConnection.request()
      .input("Title", mssql.VarChar, title)
      .input("Content", mssql.Text, content)
      .query("INSERT INTO Notes (Title, Content, CreatedAt) OUTPUT INSERTED.ID VALUES (@Title, @Content, GETDATE())");
    
    res.status(201).json({ id: result.recordset[0].ID, title, content, createdAt: new Date() });
  } catch (err: any) {
    res.status(500).send({ message: err.message });
  }
});


app.get("/notes", async (req, res) => {
  try {
    const poolConnection = await pool;
    const result = await poolConnection.request().query("SELECT * FROM Notes");
    res.json(result.recordset);
  } catch (err: any) {
    res.status(500).send({ message: err.message });
  }
});


app.get("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const poolConnection = await pool;
    const result = await poolConnection.request()
      .input("ID", mssql.Int, id)
      .query("SELECT * FROM Notes WHERE ID = @ID");
    
    if (result.recordset.length === 0) {
      return res.status(404).send({ message: "Note not found" });
    }
    res.json(result.recordset[0]);
  } catch (err: any) {
    res.status(500).send({ message: err.message });
  }
});


app.put("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const poolConnection = await pool;
    const result = await poolConnection.request()
      .input("ID", mssql.Int, id)
      .input("Title", mssql.VarChar, title)
      .input("Content", mssql.Text, content)
      .query("UPDATE Notes SET Title = @Title, Content = @Content WHERE ID = @ID");
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send({ message: "Note not found" });
    }
    res.send({ message: "Note updated successfully" });
  } catch (err: any) {
    res.status(500).send({ message: err.message });
  }
});


app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const poolConnection = await pool;
    const result = await poolConnection.request()
      .input("ID", mssql.Int, id)
      .query("DELETE FROM Notes WHERE ID = @ID");
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send({ message: "Note not found" });
    }
    res.status(204).send();
  } catch (err:any) {
    res.status(500).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
