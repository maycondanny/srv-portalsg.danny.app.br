import express from 'express';
import produtosModule from './modules/produtos/produtos.module';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/produtos', produtosModule);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
