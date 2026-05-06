import express from 'express';
import cors from 'cors';
import ingestRoute from './routes/ingest';
import salariesRoute from './routes/salaries';
import companyRoute from './routes/company';
import compareRoute from './routes/compare';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Compensation API running' });
});

app.use('/', ingestRoute);
app.use('/', salariesRoute);
app.use('/', companyRoute);
app.use('/', compareRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
