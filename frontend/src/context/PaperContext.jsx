import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Toast from "../components/Toast";
import axios from "axios";
import config from "../config";

const PaperContext = createContext(null);

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export function PaperProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(() =>
    load("generated", { type: null, items: [] }),
  );
  const [paperQuestions, setPaperQuestions] = useState(() =>
    load("paperQuestions", {}),
  );
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("generated", JSON.stringify(generated));
  }, [generated]);

  useEffect(() => {
    localStorage.setItem("paperQuestions", JSON.stringify(paperQuestions));
  }, [paperQuestions]);

  const setGeneratedQuestions = useCallback((items, type) => {
    setGenerated({ type, items });
  }, []);

  const clearGenerated = useCallback(() => {
    setGenerated({ type: null, items: [] });
  }, []);

  const addToPaper = useCallback((type, selected) => {
    setPaperQuestions((prev) => {
      const existing = prev[type] ?? [];
      const fresh = selected.filter((q) => !existing.includes(q));
      return { ...prev, [type]: [...existing, ...fresh] };
    });
  }, []);

  const toggleAddQuestion = useCallback((question, type) => {
    setPaperQuestions((prev) => {
      const existing = prev[type] ?? [];
      const isAdded = existing.includes(question);

      return {
        ...prev,
        [type]: isAdded
          ? existing.filter((q) => q !== question)
          : [...existing, question],
      };
    });
  }, []);

  const removeFromPaper = useCallback((type, question) => {
    setPaperQuestions((prev) => ({
      ...prev,
      [type]: (prev[type] ?? []).filter((q) => q !== question),
    }));
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({
      id: Date.now(),
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const uploadDocument = async (file) => {
    try {
      const sig = await fetch(`${config.API_URL}/upload-signature`).then((r) => r.json());

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sig.apiKey);
      formData.append("timestamp", sig.timestamp);
      formData.append("signature", sig.signature);
      formData.append("folder", sig.folder);
      
      // upload file 
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
        { method: "POST", body: formData },
      );
      const data = await cloudRes.json();
      if (!cloudRes.ok) throw new Error(data.error?.message || "Upload failed");
      
      // save url in database
      const saveRes = await axios.post(`${config.API_URL}/save-document`,{
        name: data.original_filename,
        format: data.format,
        size: data.size,
        publicId: data.public_id,
        url: data.secure_url
      });

      showToast(saveRes.data.message, "success");
    } catch (error) {
      console.log(error);
    }
  };
  
  const value = useMemo(
    () => ({
      history,
      setHistory,
      toast,
      setToast,
      isLoading,
      setIsLoading,
      generated,
      paperQuestions,
      setGeneratedQuestions,
      clearGenerated,
      addToPaper,
      toggleAddQuestion,
      removeFromPaper,
      showToast,
      uploadDocument,
    }),
    [
      isLoading,
      generated,
      paperQuestions,
      setGeneratedQuestions,
      clearGenerated,
      addToPaper,
      toggleAddQuestion,
      removeFromPaper,
      history,
      setHistory,
      toast,
      setToast,
      showToast,
      uploadDocument,
    ],
  );

  return (
    <PaperContext.Provider value={value}>
      {children}

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={3000}
        />
      )}
    </PaperContext.Provider>
  );
}

export function usePaper() {
  const usePaperContext = useContext(PaperContext);
  if (!usePaperContext)
    throw new Error("usePaper must be used inside <PaperProvider>");
  return usePaperContext;
}
