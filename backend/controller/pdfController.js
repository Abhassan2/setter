import Document from "../model/documentSchema.js";
import cloudinary from "../config/cloudinary.js";

export const fetchSig = async (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const params = { timestamp, folder: "files" };
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET,
    );
    res.json({
      timestamp,
      signature,
      folder: "files",
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.log(error);
  }
};

export const saveDocument = async (req, res) => {
  try {
    const { url, format, size, publicId, name } = req.body;

    if (!url || !publicId) {
      return res
        .status(400)
        .json({ success: false, message: "url and publicId are required" });
    }

    const newDocument = await Document.create({
      publicId,
      name,
      url,
      format,
      size,
    });
    await newDocument.save();

    res.json({ success: true, message: "Document downloaded successfully" });
  } catch (error) {
    console.error("saveDocument error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save document" });
  }
};

export const fetchDocument = async (req, res) => {
  try {
    const files = await Document.find({}).sort({ createdAt: -1 });
    return res.json({success: true, files});
  } catch (error) {
    console.error("fetchDocument error:", error);
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
};


// Fetch a single document
export const fetchSingleDocument = async (req, res) => {
  try {
    const file = await Document.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      file,
    });
  } catch (error) {
    console.error("fetchSingleDocument error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
};