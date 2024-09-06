const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { createObjectCsvWriter } = require('csv-writer');
const bodyParser = require('body-parser');
const csvParser = require('csv-parser');
const dotenv = require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/modificar-csv', (req, res) => {
  const { buscarPor, nuevoValor } = req.body; // Obtenemos el criterio de búsqueda y el nuevo valor desde el cliente
  modificar(buscarPor, nuevoValor, res, 0);
});

function modificar(buscarPor, nuevoValor, res, intento) {
  const csvPath = path.join(__dirname, 'assets/LibroDePases.csv');
  let rows = [];

  // Leer el archivo CSV y convertirlo a JSON
  try {
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Si la primera columna coincide con el valor de búsqueda, lo actualizamos
        if (row['celular'] == buscarPor) { // Cambia 'ColumnaClave' al nombre real de la columna
          row['confirmados'] = nuevoValor; // Cambia 'ColumnaAModificar' al nombre real de la columna que deseas modificar
        }
        rows.push(row);
      })
      .on('end', () => {
        // Crear un nuevo CSV Writer
        const csvWriter = createObjectCsvWriter({
          path: csvPath,
          header: Object.keys(rows[0]).map(key => ({ id: key, title: key }))
        });

        // Escribir los datos modificados de vuelta al archivo CSV
        csvWriter.writeRecords(rows)
          .then(() => {
            res.status(200).json({ message: 'Archivo CSV modificado exitosamente' });
          })
          .catch(error => {
            console.error('Error al leer el CSV itento: '+ intento, error);
            if(intento < 5) {
              intento++;
              setTimeout(()=>{modificar(buscarPor, nuevoValor, res, intento);}, 2000);
              
            } else {
              res.status(500).json({ error: 'No se pudo leer el archivo CSV' });
            }
          });
      })
      .on('error', (error) => {
        console.error('Error al leer el CSV itento: '+ intento, error);
        if(intento < 5) {
          intento++;
          setTimeout(()=>{modificar(buscarPor, nuevoValor, res, intento);}, 2000);
          
        } else {
          res.status(500).json({ error: 'No se pudo leer el archivo CSV' });
        }
      });
    }
    catch(err) {
      console.error('Error al leer el CSV itento: '+ intento, err);
      if(intento < 5) {
        intento++;
        setTimeout(()=>{modificar(buscarPor, nuevoValor, res, intento);}, 2000);
        
      } else {
        res.status(500).json({ error: 'No se pudo leer el archivo CSV' });
      }
    }
}

app.get('/api/consultar-csv', (req, res) => {
  const csvPath = path.join(__dirname, 'assets/LibroDePases.csv');
  const results = [];

  // Leer el archivo CSV y convertirlo a JSON
  fs.createReadStream(csvPath)
    .pipe(csvParser())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      res.status(200).json(results);
    })
    .on('error', (error) => {
      console.error('Error al leer el CSV', error);
      res.status(500).json({ error: 'No se pudo leer el archivo CSV' });
    });
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto "+ PORT);
});