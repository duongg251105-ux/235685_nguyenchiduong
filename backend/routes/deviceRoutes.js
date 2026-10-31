const express = require("express");
const router = express.Router();
const Device = require("../models/Device");

// Get all devices
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};

        if (search) {
            filter = {
                $or: [
                    { deviceId: { $regex: search, $options: "i" } },
                    { name: { $regex: search, $options: "i" } },
                    { deviceType: { $regex: search, $options: "i" } },
                    { room: { $regex: search, $options: "i" } }
                ]
            };
        }

        const devices = await Device.find(filter).sort({ createdAt: -1 });
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get device by ID
router.get("/:id", async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        res.json(device);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Create device
router.post("/", async (req, res) => {
    try {
        const device = await Device.create(req.body);
        res.status(201).json(device);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update device
router.put("/:id", async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        res.json(device);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete device
router.delete("/:id", async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        res.json({ message: "Device deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;