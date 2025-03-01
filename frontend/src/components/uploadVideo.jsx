import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UploadVideo = ({ closeModal }) => {
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        // Make sure body has modal-open class for proper styling
        document.body.classList.add("modal-open");
        
        return () => {
            // Clean up on unmount
            document.body.classList.remove("modal-open");
            const modalBackdrop = document.querySelector(".modal-backdrop");
            if (modalBackdrop) modalBackdrop.remove();
        };
    }, []);
    
    const handleUpload = async () => {
        if (!video) return alert("Please select a video file.");
        
        const formData = new FormData();
        formData.append("video", video);
        formData.append("title", title);
        formData.append("description", description);
        
        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            
            if (response.ok) {
                closeModal();  
                navigate("/"); 
            } else {
                alert("Upload failed!");
            }
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };
    
    const handleCloseAndNavigate = () => {
        if (typeof closeModal === 'function') {
            closeModal();
        }
        navigate("/"); // Navigate immediately without timeout
    };
    
    return (
        <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
            onClick={handleCloseAndNavigate} // Clicking outside closes & navigates
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
                        <button className="btn btn-danger" onClick={handleCloseAndNavigate}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadVideo;