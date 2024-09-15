import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});

