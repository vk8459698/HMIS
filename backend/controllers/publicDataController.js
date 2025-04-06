// FILE: controllers/publicDataController.js
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { createObjectCsvWriter } from 'csv-writer';
import mongoose from 'mongoose';
import { Consultation, Prescription } from '../models/consultation.js';
import Patient from '../models/patient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Controller for handling consultation data downloads
 */
const DataController = {
 
  downloadZip: async (req, res) => {
    console.log("Download request received with query:", req.query);
    try {
      // Extract filter parameters from request
      const { disease, startTime, endTime } = req.query;
      
      if (!disease || !startTime || !endTime) {
        return res.status(400).json({ 
          message: 'Missing required parameters: disease, startTime, and endTime are required' 
        });
      }

      // Prepare file paths
      const zipFileName = `${disease}-data-${new Date().getTime()}.zip`;
      const tempDir = path.resolve(process.cwd(), 'temp');
      const zipFilePath = path.join(tempDir, zipFileName);
      
      // Ensure temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Create write stream
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 6 } // Balanced compression level
      });

      // Set up event listeners for the archive
      output.on('close', () => {
        console.log(`Archive created: ${archive.pointer()} total bytes`);

        // Set headers for file download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);

        // Send the file
        res.download(zipFilePath, zipFileName, (err) => {
          if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file');
          } else {
            // Clean up: remove the temp file after download
            fs.unlink(zipFilePath, (unlinkErr) => {
              if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
            });
          }
        });
      });

      // Handle warnings and errors
      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn('Archive warning:', err);
        } else {
          console.error('Archive warning:', err);
          throw err;
        }
      });
      
      archive.on('error', (err) => {
        console.error('Archive error:', err);
        throw err;
      });

      // Pipe archive data to the output file
      archive.pipe(output);

      
      
            
            // Delete temporary file
            fs.promises.unlink(vitalsCsvPath).catch(err => 
              console.error(`Error deleting temp vitals file: ${err}`)
            );
          } else {
            // Create empty vitals CSV if no matching vitals found
            const emptyVitalsContent = 'Date,Time,Blood Pressure,Body Temperature,Pulse Rate,Breathing Rate\n';
            archive.append(emptyVitalsContent, { name: `${folderName}/vitals.csv` });
          }
        } else {
          // Create empty vitals CSV if no vitals found
          const emptyVitalsContent = 'Date,Time,Blood Pressure,Body Temperature,Pulse Rate,Breathing Rate\n';
          archive.append(emptyVitalsContent, { name: `${folderName}/vitals.csv` });
        }
        
        
      }
      
      // Finalize the archive
      await archive.finalize();
      
    } catch (error) {
      console.error('Error creating zip file:', error);
      res.status(500).send('Error creating zip file: ' + error.message);
    }
  }
};

export default DataController;
