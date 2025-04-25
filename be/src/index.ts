import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import piecesRoutes from './routes/pieces-routes';
import { pieceRegistry } from './services/piece-registry';

// Import the Airtable piece
import { airtable } from './pieces/airtable/src';
import { googleSheets } from './pieces/google-sheets/src';
import { openai } from './pieces/openai/src';
import { sendgrid } from './pieces/sendgrid/src';
import { slack } from './pieces/slack/src';

// Register the Airtable piece
pieceRegistry.registerPiece('airtable', airtable);
pieceRegistry.registerPiece('googleSheets', googleSheets);
pieceRegistry.registerPiece('openai', openai);
pieceRegistry.registerPiece('sendgrid', sendgrid);
pieceRegistry.registerPiece('slack', slack);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/pieces', piecesRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});


app.get('/oauth2callback', ({req, res}:any) => {
  const authorizationCode = req.query.code;
  if (!authorizationCode) {
    return res.status(400).send('Authorization code not found');
  }

  // Use the authorizationCode to request access token from Google
  // (Make a POST request to Google's token endpoint here)

  res.send('Authorization code received. You can now exchange it for an access token.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});