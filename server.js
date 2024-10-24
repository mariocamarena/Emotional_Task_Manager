require('dotenv').config();
const express = require('express');
const app = express();
const DiaryEntry = require('./models/diaryEntry');
const cors = require('cors');

const { LanguageServiceClient } = require('@google-cloud/language')
const client = new LanguageServiceClient();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/',(req,res) => {
    res.send('Hello World!');
    console.log('Google Credentials Path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
});


// Create Diary Entry
app.post('/diary', async (req, res) => {
    try {
      const { entry } = req.body;

      const [result] = await client.analyzeSentiment({
        document: {
          content: entry,
          type: 'PLAIN_TEXT',
        },
      });

      const sentiment = result.documentSentiment;
      const sentimentScore = sentiment.score;
      const sentimentMagnitude = sentiment.magnitude;

      let emotionFeedback = '';
      
      if (sentimentScore > 0.9 && sentimentMagnitude > 1.0) {
        emotionFeedback = 'Very Positive';
      } else if (sentimentScore > 0.25) {
        emotionFeedback = 'Positive';
      } else if (sentimentScore >= -0.25) {
        emotionFeedback = 'Neutral';
      } else if (sentimentScore < -0.9 && sentimentMagnitude > 1.0) {
        emotionFeedback = 'Very Negative';
      } else {
        emotionFeedback = 'Negative';
      }

      const diaryEntry  = await DiaryEntry.create({entry,emotionFeedback});
      res.status(201).send(diaryEntry);
    } 
    catch (error) {
      console.error('Error processing sentiment:', error);
      res.status(500).send('An error occurred while processing sentiment.');
    }
});
  
  // Get All Diary Entrys
  app.get('/diary', async (req, res) => {
    try {
      const entries = await DiaryEntry.findAll();
      res.status(200).json(entries);
    } 
    catch (error) {
      res.status(500).send(error.message);
    }
});
  
  // Update Diary Entry
  app.put('/diary/:id', async (req, res) => {
    try {
      const entry = await DiaryEntry.findByPk(req.params.id);
      if (entry) {
        await entry.update(req.body);
        res.status(200).send(entry);
      } else {
        res.status(404).send('Diary entry not found');
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  
  // Delete Diary Entry
  app.delete('/diary/:id', async (req, res) => {
    try {
      const entry = await DiaryEntry.findByPk(req.params.id);
      if (entry) {
        await entry.destroy();
        res.status(200).send(`Diary entry with id ${req.params.id} deleted`);
      } else {
        res.status(404).send('Diary entry not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});