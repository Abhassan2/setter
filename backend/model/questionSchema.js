import mongoose from "mongoose";
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    questions: [
      {
        type: String,
        required: true,
      },
    ],
    topic: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    subject: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    difficultyLevel: {
      type: String,
      required: true,
    },
    // marks: {
    //   type: Number,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  },
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
