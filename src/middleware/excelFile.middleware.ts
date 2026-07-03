import multer from "multer";

const storage = multer.diskStorage({
    destination: "./uploads/excel/master-items",
    filename: (req, file, cb) => {
        cb(null, "master_items_" + Date.now() + "-" + file.originalname);
    }
});

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

const storageGeneral = multer.diskStorage({
    destination: "./uploads/excel/general",
    filename: (req, file, cb) => {
        cb(null, "general_" + Date.now() + "-" + file.originalname);
    }
});

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