import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UploadVideo = ({ closeModal }) => {
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        document.body.classList.add("modal-open");
        
        return () => {
            document.body.classList.remove("modal-open");
            const modalBackdrop = document.querySelector(".modal-backdrop");
            if (modalBackdrop) modalBackdrop.remove();
        };
    }, []);
    
    const handleUpload = async () => {
        if (!video) return alert("Please select a video file.");
        if (!title.trim()) return alert("Please enter a title.");
        
        setUploading(true);
        
        const formData = new FormData();
        formData.append("video", video);
        formData.append("title", title);
        formData.append("description", description);
        
        try {
            console.log("Sending upload request");
            // Add the full base URL to the API endpoint
            const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            
            console.log("Response status:", response.status);
            console.log("Response type:", response.headers.get("content-type"));
            
            if (response.ok) {
                alert("Video uploaded successfully!");
                closeModal();  
                navigate("/"); 
            } else {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    alert(`Upload failed: ${errorData.message || errorData.error || "Unknown error"}`);
                } else {
                    const textError = await response.text();
                    alert(`Upload failed: ${textError || "Unknown error"}`);
                }
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            alert(`Upload error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };
    
    const handleCloseAndNavigate = () => {
        if (typeof closeModal === 'function') {
            closeModal();
        }
        navigate("/");
    };
    
    return (
        <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
            onClick={handleCloseAndNavigate}
        >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content p-3">
                    <div className="modal-header">
                        <h5 className="modal-title">Upload Video</h5>
                        <button type="button" className="btn-close" onClick={handleCloseAndNavigate}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <input
                                type="file"
                                className="form-control"
                                accept="video/*"
                                onChange={(e) => setVideo(e.target.files[0])}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button 
                            className="btn btn-danger" 
                            onClick={handleCloseAndNavigate}
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadVideo;