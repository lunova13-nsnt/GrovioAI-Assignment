const express     = require('express');
const cors        = require('cors');
const bodyParser  = require('body-parser');
const notesRouter = require('./routes/notes');
const authRouter  = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.use('/auth',  authRouter);
app.use('/notes', notesRouter);

app.get('/', (req, res) => res.send('Markdown Notes API is running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));