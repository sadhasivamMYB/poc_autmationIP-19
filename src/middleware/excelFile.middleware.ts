import multer from "multer";

const storage = multer.memoryStorage();

export const uploadExcelMasterItems = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.mimetype === "application/vnd.ms-excel") {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"));
        }
    }
});

const storageGeneral = multer.memoryStorage();

export const uploadExcelGeneral = multer({
    storage: storageGeneral,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.mimetype === "application/vnd.ms-excel") {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"));
        }
    }
});