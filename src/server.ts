import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/user';
import productRoutes from './handlers/product';
import orderRoutes from './handlers/order';
import cors from 'cors';

const app: express.Application = express();
const port = 3333;

//Add Cors to allow cross-origin requests
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello❤️❤️😂😂');
});

// Routes
userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(port, function () {
  console.log(`starting app on port: ${port}`);
});

export default app;
