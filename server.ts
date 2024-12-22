const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const port = 3000;


dotenv.config();

const app = express();
app.use(express.json()); // ใช้ express.json() แทน body-parser
app.use(express.urlencoded({ extended: true })); // ใช้ express.urlencoded() แทน body-parser

app.get("/check-db-connection", async (req, res) => {
  try {
    await prisma.$connect();
    res.send({ message: "Connected to the database" });
  } catch (error) {
    res.status(500).send({ error: "Cannot connect to database" });
  }
});
// สร้างข้อมูล
app.post('/customer/create', async (req, res) => {
    try {
        const payload = req.body;
        const customer = await prisma.customer.create({
            data: payload
        });
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// ดูข้อมูลทั้งหมด 

app.get('/customer/list', async (req, res) => {
  try {
      const customers = await prisma.customer.findMany(); // แก้ findmany() เป็น findMany()
      res.json(customers); // ส่ง customers กลับไปยัง client
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
});

// รายละเอียดไอดี 
app.get('/customer/detail/:id', async (req, res) => {
  try { 
       const customer = await prisma.customer.findUnique({
        where: {
          id: req.params.id
        }
       });
       res.json(customer);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

//อัพเดต
app.put ('/customer/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const customer = await prisma.customer.update({
      where: {
        id: id
      },
      data: payload
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

// การลบ 
app.delete('/customer/delete/:id', async (req, res)=> {
  try {
    const id = req.params.id;
    await prisma.customer.delete({
      where: {
        id: id
      }
    });
    res.json({message: "customer delete successfully"});
  } catch (error) {
    return res.status(500).json ({error: error.message});
  }
});


app.get('/customer/startsWith', async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customer = await prisma.customer.findMany({
      where: {
        name: {
          startsWith: keyword
        }
      }
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message});
  }
});


app.get('/customer/endsWith', async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customer = await prisma.customer.findMany({
      where: {
        name: {
          endsWith: keyword
        }
      }
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message});
  }
});


app.get('/customer/contains', async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customer = await prisma.customer.findMany({
      where: {
        name: {
          contains: keyword
        }
      }
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message});
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



