import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    format: {
      type: String,
      default: 'PDF',
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Document = mongoose.model("Document", documentSchema);

export default Document;