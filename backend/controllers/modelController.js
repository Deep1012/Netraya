const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

const giveResult = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const image = req.file.path;
        const formData = new FormData();
        formData.append('file', fs.createReadStream(image));
        
        const response = await fetch('http://127.0.0.1:8000/api/predict', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('FastAPI error:', errorData);
            return res.status(response.status).json(errorData);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in giveResult:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const toggleSimulation = async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/toggle-simulation', {
            method: 'POST',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('FastAPI error:', errorData);
            return res.status(response.status).json(errorData);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in toggleSimulation:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getSimulationStatus = async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/simulation-status', {
            method: 'GET',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('FastAPI error:', errorData);
            return res.status(response.status).json(errorData);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in getSimulationStatus:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { giveResult, toggleSimulation, getSimulationStatus };
