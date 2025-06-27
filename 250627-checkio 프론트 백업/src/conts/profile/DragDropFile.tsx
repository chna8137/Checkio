import React, {
    ChangeEvent,
    useCallback,
    useRef,
    useState,
    useEffect
} from "react";
import "./DragDrop.scss";

interface IFileTypes {
    id: number;
    object: File;
}

interface DragDropProps {
    onFilesChange: (files: File[]) => void;
}

const DragDropFile: React.FC<DragDropProps> = ({ onFilesChange }) => {

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [files, setFiles] = useState<IFileTypes[]>([]);

    const dragRef = useRef<HTMLLabelElement | null>(null);
    const fileId = useRef<number>(0);

    const onChangeFiles = useCallback(
        (e: ChangeEvent<HTMLInputElement> | any): void => {
            let selectFiles: File[] = [];

            if (e.type === "drop") {
                selectFiles = e.dataTransfer.files;
            } else {
                selectFiles = e.target.files;
            }

            const newFileObjs = Array.from(selectFiles).map(file => ({
                id: fileId.current++,
                object: file
            }));

            setFiles(prev => [...prev, ...newFileObjs]);
        },
        []
    );

    const handleFilterFile = useCallback(
        (id: number): void => {
            const updatedFiles = files.filter((file: IFileTypes) => file.id !== id);
            setFiles(updatedFiles);
        },
        [files]
    );

    const handleDragIn = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragOut = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer!.files) {
            setIsDragging(true);
        }
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent): void => {
            e.preventDefault();
            e.stopPropagation();
            onChangeFiles(e);
            setIsDragging(false);
        },
        [onChangeFiles]
    );

    const initDragEvents = useCallback((): void => {
        if (dragRef.current !== null) {
            dragRef.current.addEventListener("dragenter", handleDragIn);
            dragRef.current.addEventListener("dragleave", handleDragOut);
            dragRef.current.addEventListener("dragover", handleDragOver);
            dragRef.current.addEventListener("drop", handleDrop);
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

    const resetDragEvents = useCallback((): void => {
        if (dragRef.current !== null) {
            dragRef.current.removeEventListener("dragenter", handleDragIn);
            dragRef.current.removeEventListener("dragleave", handleDragOut);
            dragRef.current.removeEventListener("dragover", handleDragOver);
            dragRef.current.removeEventListener("drop", handleDrop);
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

    useEffect(() => {
        initDragEvents();
        return () => resetDragEvents();
    }, [initDragEvents, resetDragEvents]);

    useEffect(() => {
        // 이전 상태와 비교 후 다를 때만 set
        const newFiles = files.map(file => file.object);
        onFilesChange(newFiles);
    }, [files]);

    return (
        <div className="DragDrop">
            <input
                type="file"
                id="fileUpload"
                style={{ display: "none" }}
                multiple={true}
                accept="image/*, .pdf"
                onChange={onChangeFiles}
            />

            <label
                className={isDragging ? "DragDrop-File-Dragging" : "DragDrop-File"}
                htmlFor="fileUpload"
                ref={dragRef}
            >
                <div>자격증 파일 첨부</div>
            </label>

            <div className="DragDrop-Files">
                {files.map((file: IFileTypes) => {
                    const { id, object } = file;
                    return (
                        <div key={id}>
                            <div>{object.name}</div>
                            <div
                                className="DragDrop-Files-Filter"
                                onClick={() => handleFilterFile(id)}
                            >
                                X
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DragDropFile;
