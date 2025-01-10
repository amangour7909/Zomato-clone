import { useState } from 'react';
import React from 'react';

const NoteInput = () => {

    const [notes, setNotes] = useState([{ title: '', description: '', date: '' }]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleClickAdd = () => {
        const currentDate = new Date().toLocaleDateString();
        setNotes([...notes, { title, description, date: currentDate }]);
        setTitle("");
        setDescription("");
    };

    const handleDelete = (index) => {
        const newNotes = notes.filter((_, i) => i !== index);
        setNotes(newNotes);
    };

    const handleEdit = (index) => {
        const noteToEdit = notes[index];
        setTitle(noteToEdit.title);
        setDescription(noteToEdit.description);
        handleDelete(index);
    };

    return (
        <div className="input-container">
            <div>
                <label>Title: {title} </label>
                <br />
                <input type="text" value={title} onChange={handleTitleChange} placeholder="title" />
            </div>
            <div>
                <label>Description : {description} </label>
                <br />
                <input type="textarea" value={description} onChange={handleDescriptionChange} placeholder="description" />
            </div>
            <button onClick={handleClickAdd}>add</button>

            <div className='all-notes-container'>
                {notes.map((note, index) => (
                    <div className='note-container' key={index}>
                        <h3>{note.title}</h3>
                        <p>{note.description}</p>
                        <p>{note.date}</p>
                        <button onClick={() => handleDelete(index)}>Delete</button>
                        <button onClick={() => handleEdit(index)}>Edit</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoteInput;
