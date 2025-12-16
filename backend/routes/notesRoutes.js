import express from 'express';
import prisma from '../prisma/client.js'; // Adjust path to your prisma client
import { verifyToken } from '../middlewares/authmiddleware.js';

const router = express.Router();
// --- FOLDER ROUTES ---

// 1. Get All Folders for Logged In User
router.get('/folders', verifyToken, async (req, res) => {
    try {
        const folders = await prisma.folder.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(folders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch folders" });
    }
});

// 2. Create New Folder
router.post('/folders', verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Folder name required" });

        const folder = await prisma.folder.create({
            data: {
                name,
                userId: req.user.id
            }
        });
        res.json(folder);
    } catch (error) {
        res.status(500).json({ error: "Failed to create folder" });
    }
});

// --- NOTE ROUTES ---

// 3. Get Notes for a Specific Folder
router.get('/folders/:folderId/notes', verifyToken, async (req, res) => {
    try {
        const { folderId } = req.params;
        const notes = await prisma.note.findMany({
            where: { folderId: folderId },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});

// 4. Create Note INSIDE a Folder
router.post('/notes', verifyToken, async (req, res) => {
    try {
        const { title, content, folderId } = req.body;
        
        if (!folderId) return res.status(400).json({ error: "Folder ID is required" });

        const note = await prisma.note.create({
            data: {
                title: title || "Untitled Note",
                content: content || "",
                folderId: folderId
            }
        });
        res.json(note);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create note" });
    }
});

// 5. [NEW] Get Single Note (URL: GET /api/notes/notes/:id)
router.get('/notes/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const note = await prisma.note.findUnique({
            where: { id: id }
        });
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch note" });
    }
});

// 6. [NEW] Update/Save Note (URL: PUT /api/notes/notes/:id)
router.put('/notes/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const updatedNote = await prisma.note.update({
            where: { id: id },
            data: {
                title: title,
                content: content,
                updatedAt: new Date()
            }
        });
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: "Failed to update note" });
    }
});

// 7. Delete a Folder (URL: DELETE /api/notes/folders/:id)
router.delete('/folders/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Because of "onDelete: Cascade" in Prisma schema, 
        // deleting the folder automatically deletes all notes inside it.
        await prisma.folder.delete({
            where: { id: id }
        });

        res.json({ message: "Folder deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete folder" });
    }
});

// 8. Delete a Note (URL: DELETE /api/notes/notes/:id)
router.delete('/notes/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.note.delete({
            where: { id: id }
        });

        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete note" });
    }
});


//9.Rename a Folder
router.put('/folders/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: "New name is required" });

        const updatedFolder = await prisma.folder.update({
            where: { id: id },
            data: { name: name }
        });

        res.json(updatedFolder);
    } catch (error) {
        res.status(500).json({ error: "Failed to rename folder" });
    }
});

export default router;