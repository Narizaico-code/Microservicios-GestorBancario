'use strict';

import { Schema, model } from 'mongoose';

const chatMessageSchema = new Schema(
    {
        role: {
            type: String,
            required: true,
            enum: ['user', 'model']
        },
        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        _id: false // Subdocumentos no necesitan su propio ID
    }
);

const chatSchema = new Schema(
    {
        userId: {
            type: String,
            required: [true, 'El ID del usuario es requerido'],
            index: true
        },
        title: {
            type: String,
            default: 'Nueva conversación'
        },
        messages: [chatMessageSchema]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Chat', chatSchema);