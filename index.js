const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cookieParser());

// Session Middleware
app.use(session({
    secret: 'session_ngoding_bersamaAwikwok',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Secret key for JWT
const ACCESS_TOKEN_SECRET = 'kami_sayang_roblok😘';
const REFRESH_TOKEN_SECRET = 'roblok_sayang_kami😱';

// Middleware for protecting routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
};

function getTokenFromHeader(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
  }
  return null;
}

app.get('/', (req, res) => {
    res.status(200).send('Success connect');
});

app.post('/user', async (req, res) => {
  const token = getTokenFromHeader(req);
    if (token) {
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
            const role = decoded.role
            if (role === 'admin'){
              const { username, name, password, role } = req.body;
              const hashedPassword = await bcrypt.hash(password, 10);
              try {
                  const user = await prisma.user.create({
                      data: { username, password: hashedPassword, name, role},
                  });
                  req.session.user = { id: user.id, username: user.username, name:user.name, role: user.role};
                  res.json(user);
              } catch (error) {
                  res.status(500).json({ error: error.message });
              }
            } else {
              res.json("NOT ALLOWED");
            }
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Authorization token not found' });
    }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { username }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  } else {
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict' 
    });

    res.json({ accessToken, role: user.role });
  }
});


app.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
  return res.json({ message: 'Logged out successfully' });
})

app.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
          console.error("JWT Error:", err);
          return res.sendStatus(403);
      }

      // Check if the token contains userId
      if (!user.id) {
          return res.sendStatus(403);  // Invalid token, missing userId
      }

      // Query the database using userId from the token
      prisma.user.findUnique({
          where: { id: user.id }  // Ensure userId is correctly passed
      }).then((foundUser) => {
          if (!foundUser) {
              return res.sendStatus(404);  // User not found
          }
          const accessToken = jwt.sign({ userId: foundUser.id, role:foundUser.role }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
          res.json({ accessToken });
      }).catch((dbError) => {
          console.error("Database Error:", dbError);
          res.sendStatus(500);
      });
  });
});

app.delete('/user/:id', async (req, res) => {
  const token = getTokenFromHeader(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const role = decoded.role;
      
      if (role === 'admin') {
        const userId = parseInt(req.params.id);

        try {
          const user = await prisma.user.delete({
            where: { id: userId },
          });
          res.json({ message: `User with ID ${userId} has been deleted`, user });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(403).json({ message: "NOT ALLOWED" });
      }
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization token not found' });
  }
});



app.get('/profile', authenticateToken, async (req, res) => {
  try {
      const user = await prisma.user.findUnique({
          where: { id: req.user.userId }
      });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({
          userId: user.id,
          name: user.name,
      });
  } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/user', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        role: 'asc', // atau 'desc' jika ingin urutan sebaliknya
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.post('/menu', authenticateToken, async (req,res) => {
  const { name, price, time, stock, category } = req.body;
  const priceInt = parseInt(price);
  const timeInt = parseInt(time);
  const stockInt = parseInt(stock);

  let img = '';
  if (category === 'food'){
    img = '/src/component/img/food.png'
  } else if (category === 'drink'){
    img = '/src/component/img/drink.png'
  }

  try{
    const menu = await prisma.menu.create({
      data: {
        name,
        price: priceInt,
        time: timeInt,
        stock: stockInt,
        img,
        category}
    })
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.put('/menu/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, price, time, stock, category } = req.body;
  const priceInt = parseInt(price);
  const timeInt = parseInt(time);
  const stockInt = parseInt(stock);

  let img = '';
  if (category === 'food') {
    img = '/src/component/img/food.png';
  } else if (category === 'drink') {
    img = '/src/component/img/drink.png';
  }

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: priceInt,
        time: timeInt,
        stock: stockInt,
        img,
        category,
      },
    });
    res.json(updatedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get Menu
app.get('/menu', async (req, res) => {
    const menus = await prisma.menu.findMany();
    res.json(menus);
});

app.delete('/menu/:id', async (req, res) => {
  const token = getTokenFromHeader(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const role = decoded.role;
      
      if (role === 'admin') {
        const menuId = parseInt(req.params.id);

        try {
          const user = await prisma.menu.delete({
            where: { id: menuId },
          });
          res.json({ message: `Menu with ID ${menuId} has been deleted`, user });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(403).json({ message: "NOT ALLOWED" });
      }
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization token not found' });
  }
});

// Get Tables
app.get('/table', async (req, res) => {
    const tables = await prisma.tables.findMany();
    res.json(tables);
});

app.get('/queue',  async(req, res) => {
    const queue = await prisma.queue.findMany();
    res.json(queue);
});

app.get('/payment', async(req, res) =>{
  try {
    const payments = await prisma.payment.findMany({
      include: {
        items: true,
      },
    });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.post('/order_item', authenticateToken, async (req, res) => {
  const { order_item, payment, waiter, customer, table } = req.body;
  const intTable = parseInt(table);

  try {
    // Iterasi melalui setiap item dalam order_item
    for (let item of order_item) {
      // Cari menu berdasarkan id_menu
      const menu = await prisma.menu.findUnique({ where: { id: item.id } });

      if (!menu) {
        return res.status(404).json({ message: `Menu item with id ${item.id} not found` });
      }

      if (menu.stock < item.pcs) {
        return res.status(400).json({ message: `Not enough stock for ${menu.name}` });
      }

      // Perbarui stok menu
      await prisma.menu.update({
        where: { id: item.id },
        data: { stock: { decrement: item.pcs } },
      });

      // Perbarui status meja
    await prisma.tables.update({
      where: { id: intTable },
      data: { status : true },
    });
    }

    // Buat payment baru
    const createdPayment = await prisma.payment.create({
      data: {
          payment: payment, 
          customer: customer,
          total_cash: null,
          change: null,
          status: false, // Set initial status, bisa diupdate kemudian
          id_table: intTable,
          waiter: waiter,
          status_ord: false,
          items: {
            create: order_item.map((item) => ({
              id_menu: item.id,
              id_table: intTable,
              name: item.name,
              price: item.price,
              pcs: item.pcs,
              waiter: waiter,
              status: false,
              customer: customer,
            })),
          },
          queue: {
            create: {
              id_table: intTable,
              status: false,
              customer: customer,
            },
          },
        },
    });

    res.status(200).json({ message: 'Order successful', payment: createdPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Order failed', error: error.message });
  }
});

app.put('/order_item/:id', authenticateToken, async (req, res) => {
  try{
    const {id} = req.params;

    const [updateOrderItems, updatePayment] = await
    Promise.all([
      prisma.order_item.updateMany({
        where: {
          id_payment: parseInt(id)
        },
        data: {
          status: true
        }
      }),
      prisma.payment.update({
        where: { id: parseInt(id) },
        data: { status_ord: true }
      })
    ]);

    res.status(200).json({ payment: updateOrderItems, table: updatePayment });

  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

// Update Payment with Total Cash
app.put('/payment/:id', authenticateToken, async (req, res) => {
  try{
    const { id } = req.params;
    const { totalCash } = req.body;
    const cash = parseInt(totalCash);

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      select: { payment: true, id_table: true }
    });
    
    const change = cash - payment.payment;
    const table = payment.id_table;

    const [updatedPayment, updatedTable] = await Promise.all([
      prisma.payment.update({
        where: { id: parseInt(id) },
        data: { total_cash: cash, change: change, status: true }
      }),
      prisma.tables.update({
        where: { id: table },
        data: { status: false }
      })
    ]);

    res.status(200).json({ payment: updatedPayment, table: updatedTable });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});